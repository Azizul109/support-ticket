import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import TicketList from "./components/Tickets/TicketList";
import TicketForm from "./components/Tickets/TicketForm";
import TicketDetail from "./components/Tickets/TicketDetail";
import Layout from "./components/Layout/Layout";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function ReactApp() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tickets"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <TicketList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tickets/create"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <TicketForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tickets/:id"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <TicketDetail />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default ReactApp;
