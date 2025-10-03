<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function getMessages(Ticket $ticket)
    {
        // Check if user has access to this ticket
        $this->authorizeAccess($ticket);

        $messages = ChatMessage::with('user')
            ->where('ticket_id', $ticket->id)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages as read
        $this->markMessagesAsRead($ticket);

        return response()->json($messages);
    }

    public function sendMessage(Request $request, Ticket $ticket)
    {
        // Check if user has access to this ticket
        $this->authorizeAccess($ticket);

        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            $chatMessage = ChatMessage::create([
                'message' => $request->message,
                'ticket_id' => $ticket->id,
                'user_id' => $request->user()->id,
                'is_read' => false,
            ]);

            DB::commit();

            return response()->json($chatMessage->load('user'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to send message: ' . $e->getMessage()], 500);
        }
    }

    public function checkNewMessages(Ticket $ticket, Request $request)
    {
        // Check if user has access to this ticket
        $this->authorizeAccess($ticket);

        $lastMessageId = $request->query('last_message_id', 0);

        $messages = ChatMessage::with('user')
            ->where('ticket_id', $ticket->id)
            ->where('id', '>', $lastMessageId)
            ->orderBy('created_at', 'asc')
            ->get();

        if ($messages->isNotEmpty()) {
            $this->markMessagesAsRead($ticket);
        }

        return response()->json([
            'messages' => $messages,
            'last_message_id' => $messages->isNotEmpty() ? $messages->last()->id : $lastMessageId
        ]);
    }

    public function markAsRead(Ticket $ticket)
    {
        // Check if user has access to this ticket
        $this->authorizeAccess($ticket);

        $this->markMessagesAsRead($ticket);
        return response()->json(['message' => 'Messages marked as read']);
    }

    public function getUnreadCount(Request $request)
    {
        $count = ChatMessage::whereHas('ticket', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id)
                ->orWhere('assigned_admin_id', $request->user()->id);
        })
            ->where('user_id', '!=', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    private function markMessagesAsRead(Ticket $ticket)
    {
        ChatMessage::where('ticket_id', $ticket->id)
            ->where('user_id', '!=', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    private function authorizeAccess(Ticket $ticket)
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return true; // Admins can access all tickets
        }

        if ($ticket->user_id === $user->id) {
            return true; // Ticket owner can access
        }

        if ($ticket->assigned_admin_id === $user->id) {
            return true; // Assigned admin can access
        }

        abort(403, 'You do not have access to this ticket.');
    }
}