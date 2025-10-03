import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketForm = () => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: 'general',
        priority: 'medium',
        attachment: null,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'attachment') {
            setFormData(prev => ({ ...prev, attachment: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                submitData.append(key, formData[key]);
            }
        });

        try {
            await axios.post('/api/tickets', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/tickets');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Ticket</h1>
            
            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-md p-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Subject */}
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Subject *
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject[0]}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>}
                    </div>

                    {/* Category and Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="technical">Technical</option>
                                <option value="billing">Billing</option>
                                <option value="general">General</option>
                                <option value="feature_request">Feature Request</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Attachment */}
                    <div>
                        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                            Attachment
                        </label>
                        <input
                            type="file"
                            id="attachment"
                            name="attachment"
                            onChange={handleChange}
                            className="mt-1 block w-full"
                        />
                        <p className="mt-1 text-sm text-gray-500">Maximum file size: 10MB</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/tickets')}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketForm;