<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Ticket;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getMessages(Ticket $ticket)
    {
        $messages = ChatMessage::with('user')
            ->where('ticket_id', $ticket->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request, Ticket $ticket)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $chatMessage = ChatMessage::create([
            'message' => $request->message,
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
        ]);

        // For now, we'll use polling. Later we can integrate Pusher for real-time.
        return response()->json($chatMessage->load('user'), 201);
    }

    public function markAsRead(Ticket $ticket)
    {
        ChatMessage::where('ticket_id', $ticket->id)
            ->where('user_id', '!=', auth()->id())
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Messages marked as read']);
    }
}