import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const response = await axios.get('/api/user');
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await axios.post('/api/login', credentials);
        const { access_token, user } = response.data;
        
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(user);
        
        return response.data;
    };

    const register = async (userData) => {
        const response = await axios.post('/api/register', userData);
        const { access_token, user } = response.data;
        
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        setUser(user);
        
        return response.data;
    };

    const logout = async () => {
        await axios.post('/api/logout');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};