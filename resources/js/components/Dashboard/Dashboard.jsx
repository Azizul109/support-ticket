import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <div style={{ background: 'white', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
                <h2>Welcome, {user?.name}!</h2>
                <p>Email: {user?.email}</p>
                <p>Role: <strong>{user?.role}</strong></p>
                <button 
                    onClick={logout}
                    style={{ 
                        padding: '10px 20px', 
                        background: '#dc3545', 
                        color: 'white', 
                        border: 'none',
                        marginTop: '15px'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;