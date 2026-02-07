import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../pages/supabaseClient'; // << ตรวจสอบว่า path ถูกต้อง
import { FiPlus, FiEdit, FiTrash2, FiEye, FiLoader, FiAlertCircle, FiX, FiPaperclip } from 'react-icons/fi';

// --- Reusable Components ---

const AdminModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto max-h-[90vh] flex flex-col transform scale-95 animate-scale-in">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <FiX size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input name={name} id={name} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" {...props} />
    </div>
);

const FormTextarea = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea name={name} id={name} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" {...props} />
    </div>
);

// --- Form Components with File Upload ---

const BannerForm = ({ item, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({ image_url: '', alt_text: '', link_url: '', sort_order: 0, ...item });
    const [newImageFile, setNewImageFile] = useState(null);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleFileChange = e => {
        if (e.target.files && e.target.files[0]) {
            setNewImageFile(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData, newImageFile); }} className="space-y-4">
            {formData.image_url && !newImageFile && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Image</label>
                    <img src={formData.image_url} alt="Current banner" className="h-24 w-auto object-cover rounded-md border" />
                </div>
            )}
            <FormInput 
                label={item?.id ? "Upload New Image (Optional)" : "Upload Image"}
                name="image_upload" 
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!item?.id}
            />
            <FormInput label="Alt Text" name="alt_text" value={formData.alt_text} onChange={handleChange} required />
            <FormInput label="Link URL (ถ้ามี)" name="link_url" value={formData.link_url || ''} onChange={handleChange} />
            <FormInput label="Sort Order" name="sort_order" type="number" value={formData.sort_order || 0} onChange={handleChange} />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300" disabled={isSubmitting}>ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-slate-400" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'บันทึก'}
                </button>
            </div>
        </form>
    );
};

const AnnouncementForm = ({ item, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({ message: '', link: '', is_active: true, ...item });
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
            <FormInput label="Message" name="message" value={formData.message} onChange={handleChange} required />
            <FormInput label="Link (ถ้ามี)" name="link" value={formData.link || ''} onChange={handleChange} />
            <div className="flex items-center">
                <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500" />
                <label htmlFor="is_active" className="ml-2 block text-sm text-slate-900">Active</label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300" disabled={isSubmitting}>ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-slate-400" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'บันทึก'}
                </button>
            </div>
        </form>
    );
};

const EventForm = ({ item, onSave, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({ title: '', description: '', short_description: '', image_url: '', event_date: '', ...item });
    const [newImageFile, setNewImageFile] = useState(null);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = e => {
        if (e.target.files && e.target.files[0]) {
            setNewImageFile(e.target.files[0]);
        }
    };
    
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData, newImageFile); }} className="space-y-4">
            <FormInput label="Title" name="title" value={formData.title} onChange={handleChange} required />
            {formData.image_url && !newImageFile && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Image</label>
                    <img src={formData.image_url} alt="Current event" className="h-24 w-auto object-cover rounded-md border" />
                </div>
            )}
            <FormInput 
                label={item?.id ? "Upload New Image (Optional)" : "Upload Image"}
                name="image_upload" 
                type="file"
                accept="image/*"
                onChange={handleFileChange} 
                required={!item?.id}
            />
            <FormInput label="Event Date" name="event_date" type="date" value={formData.event_date ? formData.event_date.split('T')[0] : ''} onChange={handleChange} required />
            <FormTextarea label="Short Description (สำหรับแสดงใน Card)" name="short_description" rows="3" value={formData.short_description || ''} onChange={handleChange} />
            <FormTextarea label="Full Description (รายละเอียดเต็ม)" name="description" rows="6" value={formData.description} onChange={handleChange} required />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded-md hover:bg-slate-300" disabled={isSubmitting}>ยกเลิก</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-slate-400" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'บันทึก'}
                </button>
            </div>
        </form>
    );
};

// --- Main Admin Dashboard Component ---

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('banners');
    const [data, setData] = useState({ banners: [], announcements: [], events: [], applications: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);

    const tableConfig = useMemo(() => ({
        banners: { title: 'Banners', table: 'hero_banners', form: BannerForm, columns: ['image_url', 'alt_text', 'link_url'] },
        announcements: { title: 'Announcements', table: 'announcements', form: AnnouncementForm, columns: ['message', 'is_active', 'link'] },
        events: { title: 'Events', table: 'events', form: EventForm, columns: ['title', 'event_date', 'short_description'] },
        applications: { title: 'Job Applications', table: 'job_applications', columns: ['full_name', 'position_applied', 'phone_number', 'created_at'] }
    }), []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [bannersRes, announcementsRes, eventsRes, applicationsRes] = await Promise.all([
                supabase.from('hero_banners').select('*').order('sort_order'),
                supabase.from('announcements').select('*').order('created_at', { ascending: false }),
                supabase.from('events').select('*').order('event_date', { ascending: false }),
                supabase.from('job_applications').select('*').order('created_at', { ascending: false })
            ]);

            const checkError = (res, name) => { if (res.error) throw new Error(`${name}: ${res.error.message}`); };
            checkError(bannersRes, 'Banners');
            checkError(announcementsRes, 'Announcements');
            checkError(eventsRes, 'Events');
            checkError(applicationsRes, 'Applications');

            setData({
                banners: bannersRes.data,
                announcements: announcementsRes.data,
                events: eventsRes.data,
                applications: applicationsRes.data
            });
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("ไม่สามารถโหลดข้อมูลได้: " + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingItem(null);
        setIsModalOpen(false);
    };
    
    const handleViewApplication = (item) => {
        setViewingItem(item);
    };

    const handleSave = async (formData, newImageFile = null) => {
        const { table } = tableConfig[activeTab];
        setIsSubmitting(true);
        
        try {
            let imageUrl = formData.image_url; 

            if (newImageFile) {
                const fileExt = newImageFile.name.split('.').pop();
                const newFileName = `${Date.now()}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(newFileName, newImageFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(uploadData.path);
                
                imageUrl = urlData.publicUrl;
            }

            const { id, ...dataToSave } = formData;
            if (activeTab === 'banners' || activeTab === 'events') {
              dataToSave.image_url = imageUrl;
            }
            
            let dbError;
            if (id) {
                ({ error: dbError } = await supabase.from(table).update(dataToSave).match({ id }));
            } else {
                ({ error: dbError } = await supabase.from(table).insert([dataToSave]).select());
            }

            if (dbError) throw dbError;
            
            handleCloseModal();
            fetchData();
        } catch (err) {
            console.error("Save error:", err);
            alert("เกิดข้อผิดพลาดในการบันทึก: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const { title, table } = tableConfig[activeTab];
        if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${title.slice(0, -1)} นี้?`)) {
            try {
                const { error } = await supabase.from(table).delete().match({ id });
                if (error) throw error;
                fetchData();
            } catch (err) {
                console.error("Delete error:", err);
                alert("เกิดข้อผิดพลาดในการลบ: " + err.message);
            }
        }
    };

    const ActiveForm = tableConfig[activeTab]?.form;

    const renderCell = (item, column) => {
        const value = item[column];
        switch(column) {
            case 'image_url':
                return <img src={value} alt={item.alt_text || item.title} className="h-12 w-24 object-cover rounded-md bg-slate-100" />;
            case 'is_active':
                return value ? 
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Active</span> : 
                    <span className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-200 rounded-full">Inactive</span>;
            case 'event_date':
            case 'created_at':
                return new Date(value).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
            default:
                return <span className="line-clamp-2">{String(value || '-')}</span>;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>

                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto">
                        {Object.keys(tableConfig).map(tabKey => (
                            <button
                                key={tabKey}
                                onClick={() => setActiveTab(tabKey)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tabKey
                                        ? 'border-sky-500 text-sky-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                {tableConfig[tabKey].title}
                            </button>
                        ))}
                    </nav>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64"><FiLoader className="animate-spin text-4xl text-sky-500" /></div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-red-50 p-4 rounded-lg">
                        <FiAlertCircle className="text-4xl text-red-500 mb-3" />
                        <p className="text-red-700 font-semibold">{error}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h2 className="text-xl font-bold text-slate-800">{tableConfig[activeTab].title} Management</h2>
                            {activeTab !== 'applications' && (
                                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                                    <FiPlus /><span>Add New</span>
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                    <tr>
                                        {tableConfig[activeTab].columns.map(col => <th key={col} className="px-6 py-3">{col.replace(/_/g, ' ')}</th>)}
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data[activeTab].map(item => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                            {tableConfig[activeTab].columns.map(col => <td key={col} className="px-6 py-4">{renderCell(item, col)}</td>)}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-4">
                                                    {activeTab === 'applications' ? (
                                                        <button onClick={() => handleViewApplication(item)} className="text-sky-600 hover:text-sky-800"><FiEye size={18} /></button>
                                                    ) : (
                                                        <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800"><FiEdit size={18} /></button>
                                                    )}
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><FiTrash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data[activeTab].length === 0 && <p className="text-center text-slate-500 py-10">No data found.</p>}
                        </div>
                    </div>
                )}
            </div>

            <AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? `Edit ${tableConfig[activeTab]?.title.slice(0, -1)}` : `Add New ${tableConfig[activeTab]?.title.slice(0, -1)}`}>
                {ActiveForm && <ActiveForm item={editingItem} onSave={handleSave} onCancel={handleCloseModal} isSubmitting={isSubmitting} />}
            </AdminModal>

            <AdminModal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title="Job Application Details">
                {viewingItem && (
                    <div className="space-y-4 text-sm">
                        {Object.entries(viewingItem).map(([key, value]) => {
                            if (!value || ['id', 'created_at'].includes(key)) return null;
                            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            
                            if (key === 'resume_urls' && Array.isArray(value)) {
                                return (<div key={key}><p><strong>{formattedKey}:</strong></p><ul className="list-disc list-inside mt-1 space-y-1">{value.map((url, i) => (<li key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1.5"><FiPaperclip size={14}/> <span>View File {i+1}</span></a></li>))}</ul></div>);
                            }
                            if (key === 'heard_from_sources' && Array.isArray(value)) {
                                return <p key={key}><strong>{formattedKey}:</strong> {value.join(', ')}</p>;
                            }
                            if (typeof value !== 'object') {
                                return <p key={key}><strong>{formattedKey}:</strong> {String(value)}</p>;
                            }
                            return null;
                        })}
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default AdminDashboard;