import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const response = await axios.get(`/api/tickets/${id}`);
            setTicket(response.data);
        } catch (error) {
            console.error('Error fetching ticket:', error);
            navigate('/tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await axios.post(`/api/tickets/${id}/comments`, { content: comment });
            setComment('');
            fetchTicket(); // Refresh to get new comments
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        try {
            await axios.post(`/api/tickets/${id}/chat`, { message: chatMessage });
            setChatMessage('');
            // In a real app, we'd use WebSockets to update messages in real-time
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const updateTicketStatus = async (newStatus) => {
        try {
            await axios.patch(`/api/tickets/${id}`, { status: newStatus });
            fetchTicket();
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading ticket...</div>;
    }

    if (!ticket) {
        return <div>Ticket not found</div>;
    }

    const getStatusColor = (status) => {
        const colors = {
            open: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="max-w-6xl mx-auto py-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{ticket.subject}</h1>
                    <p className="text-gray-600 mt-2">Ticket #{ticket.id}</p>
                </div>
                <div className="flex space-x-3">
                    {user.isAdmin() && (
                        <select
                            value={ticket.status}
                            onChange={(e) => updateTicketStatus(e.target.value)}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'details'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'comments'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Comments
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'chat'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Live Chat
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
                            <dl className="grid grid-cols-1 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{ticket.description}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                                    <dd className="mt-1 text-sm text-gray-900 capitalize">{ticket.category}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Priority</dt>
                                    <dd className="mt-1 text-sm text-gray-900 capitalize">{ticket.priority}</dd>
                                </div>
                                {ticket.attachment && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Attachment</dt>
                                        <dd className="mt-1">
                                            <a
                                                href={`/storage/${ticket.attachment}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-500"
                                            >
                                                Download Attachment
                                            </a>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">People</h3>
                            <dl className="grid grid-cols-1 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Created By</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{ticket.user?.name}</dd>
                                </div>
                                {ticket.assigned_admin_id && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Assigned Admin</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{ticket.assignedAdmin?.name}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(ticket.created_at).toLocaleString()}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {new Date(ticket.updated_at).toLocaleString()}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'comments' && (
                <div className="bg-white shadow rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Comments</h3>
                    </div>
                    <div className="p-6">
                        {ticket.comments?.map((comment) => (
                            <div key={comment.id} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex justify-between items-start">
                                    <div className="font-medium text-gray-900">{comment.user?.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700">{comment.content}</p>
                            </div>
                        ))}
                        {ticket.comments?.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No comments yet.</p>
                        )}
                    </div>
                    <div className="p-6 border-t border-gray-200">
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows="3"
                                className="w-full border border-gray-300 rounded-md p-3"
                            />
                            <div className="mt-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!comment.trim()}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                                >
                                    Add Comment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'chat' && (
                <div className="bg-white shadow rounded-lg">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Live Chat</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Real-time chat for quick communication
                        </p>
                    </div>
                    <div className="p-6 h-96 overflow-y-auto">
                        {/* Chat messages would go here */}
                        <p className="text-gray-500 text-center py-8">
                            Chat feature will be implemented with WebSockets
                        </p>
                    </div>
                    <div className="p-6 border-t border-gray-200">
                        <form onSubmit={handleChatSubmit}>
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border border-gray-300 rounded-md p-3"
                                />
                                <button
                                    type="submit"
                                    disabled={!chatMessage.trim()}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetail;