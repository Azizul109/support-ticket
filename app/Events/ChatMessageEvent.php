<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chatMessage;

    public function __construct(ChatMessage $chatMessage)
    {
        $this->chatMessage = $chatMessage->load('user');
    }

    public function broadcastOn()
    {
        return new PrivateChannel('ticket.' . $this->chatMessage->ticket_id);
    }

    public function broadcastAs()
    {
        return 'chat.message';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->chatMessage->id,
            'message' => $this->chatMessage->message,
            'user' => [
                'id' => $this->chatMessage->user->id,
                'name' => $this->chatMessage->user->name,
                'role' => $this->chatMessage->user->role,
            ],
            'ticket_id' => $this->chatMessage->ticket_id,
            'is_read' => $this->chatMessage->is_read,
            'created_at' => $this->chatMessage->created_at->toDateTimeString(),
            'updated_at' => $this->chatMessage->updated_at->toDateTimeString(),
        ];
    }
}