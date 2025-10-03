<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TicketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Tickets
    Route::apiResource('tickets', TicketController::class);

    // Comments
    Route::post('/tickets/{ticket}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Chat Routes
    Route::get('/tickets/{ticket}/chat', [ChatController::class, 'getMessages']);
    Route::post('/tickets/{ticket}/chat', [ChatController::class, 'sendMessage']);
    Route::post('/tickets/{ticket}/chat/mark-read', [ChatController::class, 'markAsRead']);
    Route::get('/tickets/{ticket}/chat/check-new', [ChatController::class, 'checkNewMessages']);
    Route::get('/chat/unread-count', [ChatController::class, 'getUnreadCount']);
});