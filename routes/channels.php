<?php

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('ticket.{ticketId}', function ($user, $ticketId) {
    $ticket = Ticket::find($ticketId);
    
    if (!$ticket) {
        return false;
    }
    
    // Allow ticket owner, assigned admin, or any admin
    return $user->id === $ticket->user_id || 
           $user->id === $ticket->assigned_admin_id || 
           $user->role === 'admin';
});