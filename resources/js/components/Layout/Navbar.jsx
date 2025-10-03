import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user } = useAuth();
    
    return (
        <nav style={{ 
            background: '#343a40', 
            color: 'white', 
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
                Support Ticketing System
            </Link>
            
            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Welcome, {user.name}</span>
                    <span style={{ 
                        background: user.role === 'admin' ? '#6f42c1' : '#28a745',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                    }}>
                        {user.role}
                    </span>
                </div>
            )}
        </nav>
    );
};

export default Navbar;