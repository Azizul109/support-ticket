<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $tickets = Ticket::with(['user', 'assignedAdmin'])
                ->latest()
                ->get();
        } else {
            $tickets = Ticket::with(['user', 'assignedAdmin'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
        }

        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:technical,billing,general,feature_request',
            'priority' => 'required|in:low,medium,high',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments');
        }

        $ticket = Ticket::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority,
            'attachment' => $attachmentPath,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($ticket->load('user'), 201);
    }

    public function show(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($ticket->load(['user', 'assignedAdmin', 'comments.user']));
    }

    public function update(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'subject' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|in:technical,billing,general,feature_request',
            'priority' => 'sometimes|required|in:low,medium,high',
            'status' => 'sometimes|required|in:open,in_progress,resolved,closed',
            'assigned_admin_id' => 'sometimes|nullable|exists:users,id',
        ]);

        $ticket->update($request->all());

        return response()->json($ticket->load(['user', 'assignedAdmin']));
    }

    public function destroy(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($ticket->attachment) {
            Storage::delete($ticket->attachment);
        }

        $ticket->delete();

        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}