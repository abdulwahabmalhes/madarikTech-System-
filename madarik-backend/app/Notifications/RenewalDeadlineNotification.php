<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Renewal;

class RenewalDeadlineNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $renewal;

    /**
     * Create a new notification instance.
     */
    public function __construct(Renewal $renewal)
    {
        $this->renewal = $renewal;
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
                    ->subject('تنبيه باقتراب تجديد: ' . $this->renewal->name)
                    ->greeting('مرحباً ' . $notifiable->name . '،')
                    ->line('هذا تنبيه باقتراب موعد تجديد الخدمة: ' . $this->renewal->name)
                    ->line('نوع التجديد: ' . $this->renewal->type)
                    ->line('تاريخ الانتهاء: ' . $this->renewal->expiry_date)
                    ->action('عرض التجديدات', url('/renewals'))
                    ->line('يرجى اتخاذ الإجراء اللازم للتجديد قبل انتهاء الموعد.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'اقتراب موعد تجديد',
            'message' => 'اقترب موعد تجديد: ' . $this->renewal->name,
            'type' => 'renewal',
            'model_id' => $this->renewal->id,
            'icon' => 'RefreshCw'
        ];
    }
}
