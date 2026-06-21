<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Lead;

class LeadFollowUpNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $lead;

    /**
     * Create a new notification instance.
     */
    public function __construct(Lead $lead)
    {
        $this->lead = $lead;
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
                    ->subject('تذكير بمتابعة عميل محتمل: ' . $this->lead->name)
                    ->greeting('مرحباً ' . $notifiable->name . '،')
                    ->line('هذا تذكير بمتابعة العميل المحتمل: ' . $this->lead->name)
                    ->line('الشركة: ' . ($this->lead->company_name ?? 'غير محدد'))
                    ->action('عرض التفاصيل', url('/crm/' . $this->lead->id))
                    ->line('شكراً لاستخدامك نظام مدارك!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'تذكير بمتابعة عميل',
            'message' => 'حان وقت متابعة العميل: ' . $this->lead->name,
            'type' => 'lead',
            'model_id' => $this->lead->id,
            'icon' => 'Users'
        ];
    }
}
