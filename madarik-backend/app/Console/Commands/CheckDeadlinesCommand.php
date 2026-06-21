<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Lead;
use App\Models\Project;
use App\Models\Task;
use App\Models\Renewal;
use App\Notifications\LeadFollowUpNotification;
use App\Notifications\ProjectDeadlineNotification;
use App\Notifications\TaskDeadlineNotification;
use App\Notifications\RenewalDeadlineNotification;
use Carbon\Carbon;

class CheckDeadlinesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-deadlines';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for upcoming deadlines and send notifications to users.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting deadline checks...');

        // 1. Projects expiring in 7 days
        $upcomingProjects = Project::whereIn('status', ['not_started', 'in_progress', 'on_hold'])
            ->whereDate('expected_end_date', '<=', Carbon::now()->addDays(7)->toDateString())
            ->whereDate('expected_end_date', '>=', Carbon::now()->toDateString())
            ->get();

        foreach ($upcomingProjects as $project) {
            $users = User::where('tenant_id', $project->tenant_id)->get();
            foreach ($users as $user) {
                // To avoid spamming, we could check if a notification was already sent, but for simplicity we send it.
                $user->notify(new ProjectDeadlineNotification($project));
            }
            $this->info("Notified for Project: {$project->name}");
        }

        // 2. Tasks due today or tomorrow
        $upcomingTasks = Task::where('status', '!=', 'completed')
            ->whereDate('due_date', '<=', Carbon::now()->addDays(1)->toDateString())
            ->whereDate('due_date', '>=', Carbon::now()->toDateString())
            ->get();

        foreach ($upcomingTasks as $task) {
            $users = User::where('tenant_id', $task->tenant_id)->get();
            foreach ($users as $user) {
                $user->notify(new TaskDeadlineNotification($task));
            }
            $this->info("Notified for Task: {$task->title}");
        }

        // 3. Renewals expiring in 30 days
        $upcomingRenewals = Renewal::where('status', 'active')
            ->whereDate('expiry_date', '<=', Carbon::now()->addDays(30)->toDateString())
            ->whereDate('expiry_date', '>=', Carbon::now()->toDateString())
            ->get();

        foreach ($upcomingRenewals as $renewal) {
            $users = User::where('tenant_id', $renewal->tenant_id)->get();
            foreach ($users as $user) {
                $user->notify(new RenewalDeadlineNotification($renewal));
            }
            $this->info("Notified for Renewal: {$renewal->name}");
        }

        // 4. Leads follow up (new leads older than 2 days)
        $staleLeads = Lead::where('stage', 'new')
            ->whereDate('created_at', '<=', Carbon::now()->subDays(2)->toDateString())
            ->get();

        foreach ($staleLeads as $lead) {
            $users = User::where('tenant_id', $lead->tenant_id)->get();
            foreach ($users as $user) {
                $user->notify(new LeadFollowUpNotification($lead));
            }
            $this->info("Notified for Lead: {$lead->name}");
        }

        $this->info('Deadline checks completed successfully!');
    }
}
