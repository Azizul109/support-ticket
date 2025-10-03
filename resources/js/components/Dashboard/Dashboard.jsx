import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalTickets: 0,
        openTickets: 0,
        resolvedTickets: 0,
    });

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
                resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Welcome back, {user?.name}! Here's your support overview.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalTickets}</dd>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                        <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.openTickets}</dd>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Resolved Tickets</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.resolvedTickets}</dd>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
                        <Link
                            to="/tickets/create"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create New Ticket
                        </Link>
                        <Link
                            to="/tickets"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View All Tickets
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity (for future enhancement) */}
            <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Recent Activity
                    </h3>
                    <div className="mt-4 text-gray-500">
                        <p>Recent ticket updates and activities will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;