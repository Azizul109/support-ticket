import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const ChatWindow = ({ ticketId, isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [lastMessageId, setLastMessageId] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState('polling');
    const messagesEndRef = useRef(null);
    const pollIntervalRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && ticketId) {
            loadMessages();
            startPolling();
        }

        return () => {
            stopPolling();
        };
    }, [isOpen, ticketId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/tickets/${ticketId}/chat`);
            setMessages(response.data);
            if (response.data.length > 0) {
                const maxId = Math.max(...response.data.map(m => m.id));
                setLastMessageId(maxId);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            alert('Failed to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startPolling = () => {
        stopPolling(); // Clear any existing interval
        pollIntervalRef.current = setInterval(checkNewMessages, 2000); // Poll every 2 seconds
        setConnectionStatus('polling');
    };

    const stopPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    const checkNewMessages = async () => {
        try {
            const response = await axios.get(`/api/tickets/${ticketId}/chat/check-new`, {
                params: { last_message_id: lastMessageId }
            });
            
            if (response.data.messages.length > 0) {
                // Only add messages that are NOT already in the current messages
                setMessages(prev => {
                    const existingIds = new Set(prev.map(m => m.id));
                    const newMessages = response.data.messages.filter(m => !existingIds.has(m.id));
                    return [...prev, ...newMessages];
                });
                setLastMessageId(response.data.last_message_id);
            }
        } catch (error) {
            console.error('Error checking new messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await axios.post(`/api/tickets/${ticketId}/chat`, {
                message: newMessage.trim()
            });
            
            setNewMessage('');
            // Don't add the message to the UI here - let polling handle it
            // This prevents duplicates when the same user sees their own message twice
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const markMessagesAsRead = async () => {
        try {
            await axios.post(`/api/tickets/${ticketId}/chat/mark-read`);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        return status === 'polling' ? 'text-green-600' : 'text-gray-500';
    };

    // Function to handle manual refresh
    const handleRefresh = () => {
        loadMessages();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[500px] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Live Chat - Ticket #{ticketId}
                            </h3>
                            <p className={`text-xs ${getStatusColor(connectionStatus)}`}>
                                ● {connectionStatus === 'polling' ? 'Real-time (Polling every 2s)' : 'Connected'}
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                            title="Refresh messages"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                <p className="text-gray-600">Loading messages...</p>
                            </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-lg font-medium text-gray-400">No messages yet</p>
                            <p className="text-sm text-gray-400">Start the conversation by sending a message!</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        message.user_id === user.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className={`text-sm font-medium ${
                                            message.user_id === user.id ? 'text-blue-100' : 'text-gray-700'
                                        }`}>
                                            {message.user?.name}
                                        </span>
                                        <span className={`text-xs ${
                                            message.user_id === user.id ? 'text-blue-200' : 'text-gray-500'
                                        }`}>
                                            {formatTime(message.created_at)}
                                        </span>
                                        {!message.is_read && message.user_id !== user.id && (
                                            <span className="text-xs text-blue-400" title="Unread">●</span>
                                        )}
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4 bg-white">
                    <form onSubmit={sendMessage} className="flex space-x-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {sending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;