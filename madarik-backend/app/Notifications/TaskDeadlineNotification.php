<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Task;

class TaskDeadlineNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $task;

    /**
     * Create a new notification instance.
     */
    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('تذكير بمهمة مستحقة اليوم: ' . $this->task->title)
                    ->greeting('مرحباً ' . $notifiable->name . '،')
                    ->line('لديك مهمة مستحقة التنفيذ اليوم: ' . $this->task->title)
                    ->action('عرض المهمة', url('/tasks'))
                    ->line('يرجى إنهاء المهمة في الوقت المحدد لتجنب التأخير.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'مهمة مستحقة اليوم',
            'message' => 'لديك مهمة مستحقة التنفيذ: ' . $this->task->title,
            'type' => 'task',
            'model_id' => $this->task->id,
            'icon' => 'CheckSquare'
        ];
    }
}
