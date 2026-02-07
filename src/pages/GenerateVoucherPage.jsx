// src/pages/GenerateVoucherPage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // --- ❗ ตรวจสอบ PATH ให้ถูกต้อง ---
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { FaTicketAlt, FaSpinner, FaQrcode, FaDownload, FaSync, FaTrash, FaTags, FaPlusCircle, FaCalendarAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// ฟังก์ชันช่วยตั้งค่าวันหมดอายุเริ่มต้นเป็น 30 วันข้างหน้า
const getDefaultExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

function GenerateVoucherPage() {
    // --- State สำหรับการสร้าง Voucher ---
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- State สำหรับ Prefix, Categories, และวันหมดอายุ ---
    const [prefix, setPrefix] = useState('VCHR');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [expiresAt, setExpiresAt] = useState(getDefaultExpiryDate());

    // --- State สำหรับแสดงรายการ Voucher ---
    const [existingVouchers, setExistingVouchers] = useState([]);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(true);
    const [usedVouchers, setUsedVouchers] = useState([]);
    const [isLoadingUsedVouchers, setIsLoadingUsedVouchers] = useState(true);

    const fetchAllData = () => {
        fetchCategories();
        fetchVouchers();
        fetchUsedVouchers();
    };

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase.from('categories').select('id, name').order('name');
            if (error) throw error;
            setCategories(data || []);
            if (data && data.length > 0 && !selectedCategory) {
                setSelectedCategory(data[0].id);
            }
        } catch (err) {
            setError('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
        }
    };

    const fetchVouchers = async () => {
        setIsLoadingVouchers(true);
        try {
            const { data, error } = await supabase
                .from('vouchers')
                .select('code, description, created_at, expires_at, categories ( name )')
                .eq('status', 'valid')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExistingVouchers(data || []);
        } catch (err) {
            setError('ไม่สามารถดึงข้อมูล Voucher ที่มีอยู่ได้');
        } finally {
            setIsLoadingVouchers(false);
        }
    };
    
    const fetchUsedVouchers = async () => {
        setIsLoadingUsedVouchers(true);
        try {
            const { data, error } = await supabase
                .from('vouchers')
                .select('code, description, created_at, expires_at, categories ( name )')
                .eq('status', 'used')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setUsedVouchers(data || []);
        } catch (err) {
            setError('ไม่สามารถดึงข้อมูล Voucher ที่ใช้ไปแล้วได้');
        } finally {
            setIsLoadingUsedVouchers(false);
        }
    };
    
    useEffect(() => {
        fetchAllData();
    }, []);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const { data: newCat, error } = await supabase
                .from('categories')
                .insert({ name: newCategoryName.trim() })
                .select()
                .single();

            if (error) throw error;

            setCategories([...categories, newCat]);
            setSelectedCategory(newCat.id);
            setNewCategoryName('');
        } catch (err) {
            console.error('Error creating category:', err);
            setError('หมวดหมู่นี้อาจมีอยู่แล้ว หรือเกิดข้อผิดพลาด');
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) {
            setError('กรุณาเลือกหมวดหมู่ที่ต้องการลบ');
            return;
        }

        const categoryToDelete = categories.find(cat => cat.id === selectedCategory);
        if (!categoryToDelete) return;

        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${categoryToDelete.name}"?\n(Voucher ที่อยู่ในหมวดหมู่นี้จะไม่ถูกลบ แต่จะไม่มีหมวดหมู่)`)) {
            return;
        }

        try {
            const { error: deleteError } = await supabase
                .from('categories')
                .delete()
                .eq('id', selectedCategory);

            if (deleteError) throw deleteError;

            const updatedCategories = categories.filter(cat => cat.id !== selectedCategory);
            setCategories(updatedCategories);

            if (updatedCategories.length > 0) {
                setSelectedCategory(updatedCategories[0].id);
            } else {
                setSelectedCategory('');
            }
            
            fetchVouchers();

        } catch (err) {
            console.error('Error deleting category:', err);
            setError(`ไม่สามารถลบหมวดหมู่ได้: ${err.message}`);
        }
    };

    const handleGenerateAndDownload = async () => {
        if (!description.trim() || !prefix.trim() || !selectedCategory || !expiresAt) {
            setError('กรุณากรอกข้อมูลให้ครบ: Prefix, รายละเอียด, หมวดหมู่, และวันหมดอายุ');
            return;
        }
        if (quantity < 1 || quantity > 500) { // Increased max limit slightly
            setError('จำนวนต้องอยู่ระหว่าง 1 ถึง 500');
            return;
        }

        setIsGenerating(true);
        setError('');
        setSuccessMessage('');

        try {
            const { data: lastVoucher, error: queryError } = await supabase
                .from('vouchers')
                .select('code')
                .like('code', `${prefix.trim()}-%`)
                .order('code', { ascending: false })
                .limit(1);

            if (queryError) throw queryError;

            let lastSerialNumber = 0;
            if (lastVoucher.length > 0) {
                const lastCode = lastVoucher[0].code;
                const match = lastCode.match(/-(\d+)-/);
                if (match && match[1]) {
                    lastSerialNumber = parseInt(match[1], 10);
                }
            }

            const vouchersToInsert = Array.from({ length: quantity }, (_, i) => {
                const newSerialNumber = lastSerialNumber + i + 1;
                const paddedNumber = String(newSerialNumber).padStart(3, '0');
                const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
                
                return {
                    code: `${prefix.trim()}-${paddedNumber}-${randomSuffix}`,
                    description: description,
                    status: 'valid',
                    category_id: selectedCategory,
                    expires_at: expiresAt,
                };
            });

            const { data: insertedVouchers, error: insertError } = await supabase
                .from('vouchers')
                .insert(vouchersToInsert)
                .select();

            if (insertError) throw insertError;

            const zip = new JSZip();
            for (const voucher of insertedVouchers) {
                const qrDataURL = await QRCode.toDataURL(voucher.code, { width: 300 });
                zip.file(`${voucher.code}.png`, qrDataURL.split(',')[1], { base64: true });
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `vouchers-${prefix.trim()}-${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setSuccessMessage(`สร้างและดาวน์โหลด ${insertedVouchers.length} Vouchers สำเร็จ!`);
            setDescription('');
            fetchAllData(); // รีเฟรชข้อมูลทั้งหมด

        } catch (err) {
            console.error('Error:', err);
            setError(`เกิดข้อผิดพลาดในการสร้าง Voucher: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteVoucher = async (voucherCode) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ Voucher: ${voucherCode}?`)) {
            return;
        }
        try {
            const { error: deleteError } = await supabase
                .from('vouchers')
                .delete()
                .eq('code', voucherCode);
            if (deleteError) throw deleteError;
            // Re-fetch data to update counts and list
            fetchAllData(); 
        } catch (err) {
            console.error('Error deleting voucher:', err);
            setError(`ไม่สามารถลบ Voucher: ${voucherCode} ได้`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6">
            <div className="w-full max-w-4xl mx-auto py-12">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl">Voucher Management</h1>
                    <p className="mt-3 text-lg text-gray-600">สร้างและจัดการ QR Code สำหรับ Voucher</p>
                </header>
                
                {/* --- NEW: Summary Card --- */}
                <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">ภาพรวม</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <FaCheckCircle className="text-3xl text-green-500 mx-auto mb-2"/>
                            <p className="text-sm text-gray-600">จำนวนที่ใช้ได้</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {isLoadingVouchers ? <FaSpinner className="animate-spin inline-block"/> : existingVouchers.length}
                            </p>
                        </div>
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <FaExclamationCircle className="text-3xl text-red-500 mx-auto mb-2"/>
                            <p className="text-sm text-gray-600">จำนวนที่ใช้ไปแล้ว</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {isLoadingUsedVouchers ? <FaSpinner className="animate-spin inline-block"/> : usedVouchers.length}
                            </p>
                        </div>
                    </div>
                </section>


                <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2"><FaQrcode/> สร้าง Voucher ใหม่</h2>
                    <div className="space-y-5">
                        
                         <div>
                             <label htmlFor="category" className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                             <div className="flex items-center gap-2 mt-1">
                                 <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="block w-full input-style">
                                     <option value="" disabled={categories.length > 0}>-- เลือกหมวดหมู่ --</option>
                                     {categories.map(cat => (
                                         <option key={cat.id} value={cat.id}>{cat.name}</option>
                                     ))}
                                 </select>
                                 <button 
                                    onClick={handleDeleteCategory} 
                                    disabled={!selectedCategory} 
                                    title="ลบหมวดหมู่ที่เลือก"
                                    className="btn-secondary p-2 text-red-600 hover:bg-red-100 disabled:text-gray-400 disabled:hover:bg-gray-100"
                                >
                                     <FaTrash/>
                                 </button>
                             </div>
                             <div className="flex items-center gap-2 mt-2">
                                 <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="หรือสร้างหมวดหมู่ใหม่" className="block w-full input-style text-sm"/>
                                 <button onClick={handleCreateCategory} className="btn-secondary p-2"><FaPlusCircle/></button>
                             </div>
                         </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                               <label htmlFor="prefix" className="block text-sm font-medium text-gray-700">ตัวอักษรนำหน้า (Prefix)</label>
                               <input type="text" id="prefix" value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} placeholder="เช่น SALE" className="mt-1 block w-full input-style"/>
                           </div>

                           <div>
                               <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">วันหมดอายุ</label>
                               <input type="date" id="expiresAt" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="mt-1 block w-full input-style"/>
                           </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">รายละเอียด / สิทธิ์ประโยชน์</label>
                            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="เช่น ส่วนลด 15% สำหรับเครื่องดื่ม" className="mt-1 block w-full input-style"/>
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">จำนวนที่ต้องการสร้าง (สูงสุด 500)</label>
                            <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" max="500" className="mt-1 block w-full input-style"/>
                        </div>
                        
                        {error && <p className="text-sm text-red-600 p-3 bg-red-50 rounded-md flex items-center gap-2"><FaExclamationCircle/> {error}</p>}
                        {successMessage && <p className="text-sm text-green-600 p-3 bg-green-50 rounded-md flex items-center gap-2"><FaCheckCircle/> {successMessage}</p>}

                        <button onClick={handleGenerateAndDownload} disabled={isGenerating} className="w-full btn-primary">
                            {isGenerating ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                            <span>{isGenerating ? 'กำลังสร้าง...' : `สร้างและดาวน์โหลด ${quantity} Code`}</span>
                        </button>
                    </div>
                </main>

                <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Voucher ที่ใช้งานได้ ({isLoadingVouchers ? '...' : existingVouchers.length})
                        </h2>
                        <button onClick={fetchVouchers} disabled={isLoadingVouchers} className="text-gray-500 hover:text-blue-600 disabled:text-gray-300">
                            <FaSync className={isLoadingVouchers ? 'animate-spin' : ''}/>
                        </button>
                    </div>
                    {isLoadingVouchers ? (
                        <div className="text-center py-4"><FaSpinner className="animate-spin text-gray-400 text-2xl mx-auto"/></div>
                    ) : existingVouchers.length > 0 ? (
                        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {existingVouchers.map(v => {
                                const isExpired = v.expires_at && new Date(v.expires_at) < new Date();
                                return (
                                <li key={v.code} className={`bg-gray-50 p-3 rounded-lg flex justify-between items-center gap-4 ${isExpired ? 'opacity-50' : ''}`}>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{v.description}</p>
                                        <p className="text-sm font-mono text-gray-500 truncate">{v.code}</p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                                      {v.categories ? (
                                        <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-full whitespace-nowrap">
                                          {v.categories.name}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-gray-400 italic px-2 py-1 whitespace-nowrap">
                                          ไม่มีหมวดหมู่
                                        </span>
                                      )}
                                      {v.expires_at && (
                                        <p className={`text-xs whitespace-nowrap flex items-center gap-1 ${isExpired ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                            <FaCalendarAlt/>
                                            {new Date(v.expires_at).toLocaleDateString('th-TH')}
                                        </p>
                                      )}
                                      <button onClick={() => handleDeleteVoucher(v.code)} title="Delete Voucher" className="text-gray-400 hover:text-red-600 transition-colors">
                                          <FaTrash />
                                      </button>
                                    </div>
                                </li>
                            )})}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">ไม่พบ Voucher ที่ใช้งานได้ในระบบ</p>
                    )}
                </section>

                <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-4">
                         <h2 className="text-2xl font-semibold text-gray-900">
                             Voucher ที่ใช้ไปแล้ว ({isLoadingUsedVouchers ? '...' : usedVouchers.length})
                         </h2>
                        <button onClick={fetchUsedVouchers} disabled={isLoadingUsedVouchers} className="text-gray-500 hover:text-blue-600 disabled:text-gray-300">
                            <FaSync className={isLoadingUsedVouchers ? 'animate-spin' : ''}/>
                        </button>
                    </div>
                    {isLoadingUsedVouchers ? (
                        <div className="text-center py-4"><FaSpinner className="animate-spin text-gray-400 text-2xl mx-auto"/></div>
                    ) : usedVouchers.length > 0 ? (
                        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {usedVouchers.map(v => (
                                <li key={v.code} className="bg-gray-100 p-3 rounded-lg flex justify-between items-center gap-4 opacity-70">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-600 truncate line-through">{v.description}</p>
                                        <p className="text-sm font-mono text-gray-500 truncate">{v.code}</p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                                      {v.categories ? (
                                        <span className="text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-1 rounded-full whitespace-nowrap">
                                          {v.categories.name}
                                        </span>
                                      ) : (
                                        <span className="text-xs text-gray-400 italic px-2 py-1 whitespace-nowrap">
                                          ไม่มีหมวดหมู่
                                        </span>
                                      )}
                                      {v.expires_at && (
                                        <p className="text-xs whitespace-nowrap flex items-center gap-1 text-gray-500">
                                            <FaCalendarAlt/>
                                            {new Date(v.expires_at).toLocaleDateString('th-TH')}
                                        </p>
                                      )}
                                      {/* ไม่มีปุ่มลบในส่วนนี้ */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">ยังไม่มี Voucher ที่ถูกใช้งาน</p>
                    )}
                </section>

            </div>
            
            <style jsx global>{`
                .input-style {
                    display: block;
                    width: 100%;
                    padding: 0.65rem 0.75rem;
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                    color: #1f2937;
                    background-color: #f9fafb;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .input-style:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
                }
                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    background-color: #2563eb;
                    color: white;
                    font-weight: 600;
                    border-radius: 0.5rem;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .btn-primary:hover {
                    background-color: #1d4ed8;
                }
                .btn-primary:disabled {
                    background-color: #9ca3af;
                    cursor: not-allowed;
                }
                .btn-secondary {
                     display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f3f4f6;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                 .btn-secondary:hover {
                    background-color: #e5e7eb;
                }
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f1f1f1;
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #d1d5db;
                  border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #a5a9b0;
                }
            `}</style>
        </div>
    );
}

export default GenerateVoucherPage;