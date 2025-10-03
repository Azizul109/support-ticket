import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTickets: 0,
        openTickets: 0,
        resolvedTickets: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/tickets');
            const tickets = response.data;
            
            setStats({
                totalTickets: tickets.length,
                openTickets: tickets.filter(t => t.status === 'open').length,
                resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-lg text-gray-600">
                    Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>! 
                    {user?.isAdmin ? ' Here is the support system overview.' : ' Here are your support tickets.'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">🎫</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <dt className="text-sm font-medium text-blue-100">Total Tickets</dt>
                            <dd className="text-3xl font-bold">{stats.totalTickets}</dd>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <dt className="text-sm font-medium text-yellow-100">Open Tickets</dt>
                            <dd className="text-3xl font-bold">{stats.openTickets}</dd>
                        </div>
                    </div>
                </div>

                <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <dt className="text-sm font-medium text-green-100">Resolved Tickets</dt>
                            <dd className="text-3xl font-bold">{stats.resolvedTickets}</dd>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/tickets/create"
                        className="btn-primary flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Ticket
                    </Link>
                    <Link
                        to="/tickets"
                        className="btn-secondary flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View All Tickets
                    </Link>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="card mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500">Your recent ticket activities will appear here.</p>
                    <p className="text-sm text-gray-400 mt-2">Create your first ticket to get started!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;