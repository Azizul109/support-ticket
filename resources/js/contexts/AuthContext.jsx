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
                // Ensure user object has isAdmin property
                const userData = {
                    ...response.data,
                    isAdmin: response.data.role === 'admin',
                    isCustomer: response.data.role === 'customer'
                };
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            }
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await axios.post('/api/login', credentials);
        const { access_token, user: userData } = response.data;
        
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Add isAdmin property to user object
        const userWithMethods = {
            ...userData,
            isAdmin: userData.role === 'admin',
            isCustomer: userData.role === 'customer'
        };
        
        setUser(userWithMethods);
        return response.data;
    };

    const register = async (userData) => {
        const response = await axios.post('/api/register', userData);
        const { access_token, user: userDataFromResponse } = response.data;
        
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Add isAdmin property to user object
        const userWithMethods = {
            ...userDataFromResponse,
            isAdmin: userDataFromResponse.role === 'admin',
            isCustomer: userDataFromResponse.role === 'customer'
        };
        
        setUser(userWithMethods);
        return response.data;
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};