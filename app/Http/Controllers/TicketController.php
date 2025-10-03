<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        return Ticket::where('user_id', $request->user()->id)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        return Ticket::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority,
            'user_id' => $request->user()->id,
        ]);
    }

    public function show(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== $request->user()->id) {
            abort(403);
        }

        return $ticket;
    }
}