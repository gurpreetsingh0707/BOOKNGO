import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import api from '../services/api';

const AdminServices = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('movies');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;
        const lowerSearch = searchTerm.toLowerCase();
        return items.filter(item => {
            const name = getItemName(item)?.toLowerCase();
            const route = getItemRoute(item)?.toLowerCase();
            return name?.includes(lowerSearch) || route?.includes(lowerSearch);
        });
    }, [items, searchTerm, activeTab]);

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
            await api.delete(`/admin/${endpoint}/${id}`);
            alert('✅ Item deleted');
            fetchItems();
        } catch (error) {
            alert(`❌ ${error.response?.data?.message}`);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/${activeTab}`, formData);
            alert('✅ Item added successfully');
            setIsAdding(false);
            setFormData({});
            fetchItems();
        } catch (error) {
            alert(`❌ ${error.response?.data?.message || 'Failed to add item'}`);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = activeTab;
            await api.patch(`/admin/${endpoint}/${editingItem._id}`, formData);
            alert('✅ Item updated successfully');
            setEditingItem(null);
            setFormData({});
            fetchItems();
        } catch (error) {
            alert(`❌ ${error.response?.data?.message || 'Failed to update item'}`);
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({ ...item });
    };

    const renderFormFields = () => {
        switch (activeTab) {
            case 'movies':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1 font-bold uppercase tracking-tight">Title</label>
                            <input name="title" value={formData.title || ''} required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-1 font-bold uppercase tracking-tight">Category</label>
                                <select name="category" value={formData.category || 'movie'} required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all">
                                    <option value="movie">Movie</option>
                                    <option value="live_show">Live Show</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-1 font-bold uppercase tracking-tight">Language</label>
                                <input name="language" value={formData.language || ''} required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-sm mb-1 font-bold uppercase tracking-tight">Price (₹)</label>
                                <input name="price" type="number" value={formData.price || ''} required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-1 font-bold uppercase tracking-tight">Available Seats</label>
                                <input name="availableSeats" type="number" value={formData.availableSeats || ''} required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1 font-bold uppercase tracking-tight">Image URL</label>
                            <input name="image" value={formData.image || ''} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                    </div>
                );
            case 'trains':
                return (
                    <div className="space-y-4">
                        <input name="trainName" value={formData.trainName || ''} placeholder="Train Name" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="trainNumber" value={formData.trainNumber || ''} placeholder="Train Number" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="source" value={formData.source || ''} placeholder="Source" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="destination" value={formData.destination || ''} placeholder="Destination" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="pricePerSeat" type="number" value={formData.pricePerSeat || ''} placeholder="Price" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                    </div>
                );
            case 'buses':
                return (
                    <div className="space-y-4">
                        <input name="name" value={formData.name || ''} placeholder="Bus Name" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="from" value={formData.from || ''} placeholder="From" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="to" value={formData.to || ''} placeholder="To" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="price" type="number" value={formData.price || ''} placeholder="Price" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                    </div>
                );
            case 'hotels':
                return (
                    <div className="space-y-4">
                        <input name="name" value={formData.name || ''} placeholder="Hotel Name" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="city" value={formData.city || ''} placeholder="City" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="pricePerNight" type="number" value={formData.pricePerNight || ''} placeholder="Price" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                    </div>
                );
            case 'flights':
                return (
                    <div className="space-y-4">
                        <input name="flightName" value={formData.flightName || ''} placeholder="Flight Name" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="airline" value={formData.airline || ''} placeholder="Airline" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="source" value={formData.source || ''} placeholder="Source" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="destination" value={formData.destination || ''} placeholder="Destination" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                        <input name="price" type="number" value={formData.price || ''} placeholder="Price" required onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 text-white rounded-xl" />
                    </div>
                );
            default:
                return null;
        }
    };

    const getItemName = (item) => {
        switch (activeTab) {
            case 'movies': return item.title;
            case 'trains': return item.trainName;
            case 'flights': return item.flightName;
            case 'buses': return item.name;
            case 'hotels': return item.name;
            default: return 'Unknown';
        }
    };

    const getItemRoute = (item) => {
        switch (activeTab) {
            case 'movies': return `${item.title} (${item.language})`;
            case 'trains': return `${item.source} → ${item.destination}`;
            case 'flights': return `${item.source} → ${item.destination} (${item.airline})`;
            case 'buses': return `${item.from} → ${item.to}`;
            case 'hotels': return `${item.city}`;
            default: return '';
        }
    };

    const getItemPrice = (item) => {
        switch (activeTab) {
            case 'movies': return item.price;
            case 'trains': return item.pricePerSeat;
            case 'flights': return item.price;
            case 'buses': return item.price;
            case 'hotels': return item.pricePerNight;
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-all border border-slate-600 shadow-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-black text-white tracking-tight">Manage Services</h1>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex gap-4 overflow-x-auto no-scrollbar">
                {['movies', 'trains', 'buses', 'hotels', 'flights'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setEditingItem(null); }}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    >
                        {tab === 'movies' ? '🎭 Shows' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
                <button
                    onClick={() => { setIsAdding(true); setFormData(activeTab === 'movies' ? { category: 'movie', availableSeats: 100 } : {}); }}
                    className="ml-auto px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-900/30 flex items-center gap-2"
                >
                    <span className="text-xl">+</span> Add New
                </button>
            </div>

            {/* Modal for Adding/Editing */}
            {(isAdding || editingItem) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
                    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={() => { setIsAdding(false); setEditingItem(null); setFormData({}); }}
                            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-full transition-all"
                        >
                            ✕
                        </button>
                        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                            {isAdding ? '✨ Create New' : '✏️ Update'} {activeTab === 'movies' ? 'Show' : activeTab.slice(0, -1)}
                        </h2>
                        
                        <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit} className="space-y-6">
                            {renderFormFields()}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setIsAdding(false); setEditingItem(null); setFormData({}); }}
                                    className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-black transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-900/40"
                                >
                                    {isAdding ? 'Create Now' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin inline-block w-12 h-12 border-[6px] border-blue-500/20 border-t-blue-500 rounded-full mb-6"></div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Synchronizing Database...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-slate-800/50 rounded-3xl p-20 text-center border border-dashed border-slate-700">
                        <p className="text-slate-400 text-xl font-medium">No results found for "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div key={item._id} className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 hover:border-blue-500/40 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-600/10 transition-all"></div>
                                
                                <div className="mb-8 relative z-10">
                                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight">{getItemName(item)}</h3>
                                    <p className="text-slate-400 text-sm mt-2 font-medium">{getItemRoute(item)}</p>
                                    {activeTab === 'movies' && (
                                        <span className={`text-[10px] px-3 py-1.5 rounded-lg mt-4 inline-block font-black tracking-[0.1em] uppercase ${
                                            item.category === 'live_show' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                            {item.category === 'live_show' ? '🎭 Live Show' : '🎬 Movie'}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-5 mb-10 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 uppercase tracking-widest font-black text-[10px]">Pricing</span>
                                        <span className="text-green-400 font-black text-xl">₹{getItemPrice(item)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 uppercase tracking-widest font-black text-[10px]">Inventory</span>
                                        <span className="text-white font-bold">
                                            {activeTab === 'hotels' ? item.availableRooms : item.availableSeats} Units
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 uppercase tracking-widest font-black text-[10px]">Occupancy</span>
                                        <span className="text-yellow-500 font-bold">
                                            {activeTab === 'hotels' ? item.bookedRooms : item.bookedSeats} booked
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-white/5 relative z-10">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="flex-1 px-4 py-3.5 bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-2xl font-black transition-all border border-blue-500/20"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex-1 px-4 py-3.5 bg-red-500/5 hover:bg-red-600 text-red-400 hover:text-white rounded-2xl font-black transition-all border border-red-500/10"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminServices;