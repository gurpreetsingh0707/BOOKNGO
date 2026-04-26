import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminServices = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('movies');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [newFormData, setNewFormData] = useState({});

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/${activeTab}`);
            setItems(response.data[activeTab] || response.data.movies || []);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;

        try {
            const endpoint = activeTab;
            const idField = activeTab === 'movies' ? 'movieId' : activeTab === 'trains' ? 'trainId' : activeTab === 'buses' ? 'busId' : activeTab === 'flights' ? 'flightId' : 'hotelId';

            await api.delete(`/admin/${endpoint}/${id}`);
            alert('✅ Item deleted');
            fetchItems();
        } catch (error) {
            alert(`❌ ${error.response?.data?.message}`);
        }
    };

    const handleInputChange = (e) => {
        setNewFormData({
            ...newFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/${activeTab}`, newFormData);
            alert('✅ Item added successfully');
            setIsAdding(false);
            setNewFormData({});
            fetchItems();
        } catch (error) {
            alert(`❌ ${error.response?.data?.message || 'Failed to add item'}`);
        }
    };

    const renderAddForm = () => {
        switch (activeTab) {
            case 'movies':
                return (
                    <>
                        <input name="title" placeholder="Title" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="language" placeholder="Language (e.g. Hindi, English)" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="price" type="number" placeholder="Price (₹)" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="image" placeholder="Image URL (optional)" onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                    </>
                );
            case 'trains':
                return (
                    <>
                        <input name="trainName" placeholder="Train Name" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="trainNumber" placeholder="Train Number" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="source" placeholder="Source Station" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="destination" placeholder="Destination Station" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="pricePerSeat" type="number" placeholder="Price Per Seat (₹)" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <select name="seatClass" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500">
                            <option value="">Select Class...</option>
                            <option value="general">General</option>
                            <option value="sleeper">Sleeper</option>
                            <option value="ac3">AC 3-Tier</option>
                            <option value="ac2">AC 2-Tier</option>
                            <option value="ac1">AC 1-Tier</option>
                        </select>
                    </>
                );
            case 'buses':
                return (
                    <>
                        <input name="name" placeholder="Bus Name" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="busNumber" placeholder="Bus Number" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="from" placeholder="From City" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="to" placeholder="To City" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="price" type="number" placeholder="Price (₹)" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <select name="busType" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500">
                            <option value="">Select Type...</option>
                            <option value="standard">Standard</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="sleeper">Sleeper</option>
                            <option value="premium">Premium</option>
                        </select>
                    </>
                );
            case 'hotels':
                return (
                    <>
                        <input name="name" placeholder="Hotel Name" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="city" placeholder="City" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="pricePerNight" type="number" placeholder="Price Per Night (₹)" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <select name="roomType" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500">
                            <option value="">Select Room Type...</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="suite">Suite</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="luxury">Luxury</option>
                        </select>
                        <select name="category" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500">
                            <option value="">Select Category...</option>
                            <option value="3-star">3-Star</option>
                            <option value="4-star">4-Star</option>
                            <option value="5-star">5-Star</option>
                            <option value="luxury">Luxury</option>
                            <option value="budget">Budget</option>
                        </select>
                    </>
                );
            case 'flights':
                return (
                    <>
                        <input name="flightName" placeholder="Flight Name" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="flightNumber" placeholder="Flight Number" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="airline" placeholder="Airline" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="source" placeholder="Source City/Code" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="destination" placeholder="Destination City/Code" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <input name="price" type="number" placeholder="Price (₹)" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500" />
                        <select name="classType" required onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded mb-3 focus:outline-none focus:border-blue-500">
                            <option value="">Select Class...</option>
                            <option value="economy">Economy</option>
                            <option value="premium_economy">Premium Economy</option>
                            <option value="business">Business</option>
                            <option value="first">First Class</option>
                        </select>
                    </>
                );
            default:
                return null;
        }
    };

    const getItemName = (item) => {
        switch (activeTab) {
            case 'movies':
                return item.title;
            case 'trains':
                return item.trainName;
            case 'flights':
                return item.flightName;
            case 'buses':
                return item.name;
            case 'hotels':
                return item.name;
            default:
                return 'Unknown';
        }
    };

    const getItemRoute = (item) => {
        switch (activeTab) {
            case 'movies':
                return `${item.title} (${item.language})`;
            case 'trains':
                return `${item.source} → ${item.destination}`;
            case 'flights':
                return `${item.source} → ${item.destination} (${item.airline})`;
            case 'buses':
                return `${item.from} → ${item.to}`;
            case 'hotels':
                return `${item.city}`;
            default:
                return '';
        }
    };

    const getItemPrice = (item) => {
        switch (activeTab) {
            case 'movies':
                return item.price;
            case 'trains':
                return item.pricePerSeat;
            case 'flights':
                return item.price;
            case 'buses':
                return item.price;
            case 'hotels':
                return item.pricePerNight;
            default:
                return 0;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">🎫 Manage Services</h1>
                <button
                    onClick={() => navigate('/admin')}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold"
                >
                    ← Back
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex gap-4 overflow-x-auto">
                {['movies', 'trains', 'buses', 'hotels', 'flights'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setEditingId(null);
                        }}
                        className={`px-4 py-2 rounded font-semibold transition-colors ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        {tab === 'movies' && '🎬'}
                        {tab === 'trains' && '🚂'}
                        {tab === 'buses' && '🚌'}
                        {tab === 'hotels' && '🏨'}
                        {tab === 'flights' && '✈️'}
                        {' '}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setNewFormData({});
                    }}
                    className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
                >
                    + Add New
                </button>
            </div>

            {/* Modal for Adding New Item */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6 capitalize">Add New {activeTab.slice(0, -1)}</h2>
                        
                        <form onSubmit={handleAddSubmit}>
                            {renderAddForm()}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <p className="text-white">⏳ Loading...</p>
                ) : items.length === 0 ? (
                    <p className="text-slate-300">No items found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map((item) => (
                            <div key={item._id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white">{getItemName(item)}</h3>
                                    <p className="text-slate-400 text-sm">{getItemRoute(item)}</p>
                                </div>

                                <div className="space-y-2 mb-4 pb-4 border-b border-slate-700">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Price:</span>
                                        <span className="text-green-400 font-semibold">₹{getItemPrice(item)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Available:</span>
                                        <span className="text-white">
                                            {activeTab === 'hotels' ? item.availableRooms : item.availableSeats}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Booked:</span>
                                        <span className="text-yellow-400">
                                            {activeTab === 'hotels' ? item.bookedRooms : item.bookedSeats}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Rating:</span>
                                        <span className="text-yellow-400">⭐ {item.rating}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingId(item._id)}
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>

                                {editingId === item._id && (
                                    <div className="mt-4 pt-4 border-t border-slate-700">
                                        <p className="text-white mb-2">Editing feature coming soon...</p>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm"
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminServices;