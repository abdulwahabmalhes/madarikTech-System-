<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get user notifications
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // We will just use the notifications table.
        // Assuming we are using Laravel's DatabaseNotification
        $notifications = $user->notifications()->paginate(50);
        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Mark a specific notification as read
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->find($id);
        
        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read.']);
        }

        return response()->json(['message' => 'Notification not found.'], 404);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read.']);
    }
}
