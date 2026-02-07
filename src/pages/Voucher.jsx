// src/pages/ScanVoucherPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from './supabaseClient'; 
import { FaQrcode, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaSpinner, FaUserShield, FaTags, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';

function ScanVoucherPage() {
    // --- State สำหรับจัดการ UI ---
    const [showScanner, setShowScanner] = useState(false);
    const [scannedCode, setScannedCode] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [voucherData, setVoucherData] = useState(null);
    const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // --- ฟังก์ชันสำหรับตรวจสอบ Voucher ---
    const validateVoucher = async (voucherCode) => {
        setIsValidating(true);
        setError('');
        setMessage('');
        setVoucherData(null);

        try {
            const { data, error } = await supabase
                .from('vouchers')
                .select('*, categories ( name )')
                .eq('code', voucherCode)
                .single();
            
            if (error) throw new Error('ไม่พบ Voucher นี้ในระบบ');

            if (data.expires_at && new Date(data.expires_at) < new Date()) {
                throw new Error('Voucher นี้หมดอายุแล้ว');
            }
            
            if (data.status === 'used') throw new Error('Voucher นี้ถูกใช้งานไปแล้ว');
            
            setVoucherData(data);
            setIsAwaitingConfirmation(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsValidating(false);
        }
    };
    
    // ฟังก์ชัน handleScanSuccess
    const handleScanSuccess = useCallback(async (decodedText) => {
        if (isValidating || isAwaitingConfirmation) return;
        
        const scannerInstance = new Html5QrcodeScanner('qr-scanner-container', {}, false);
        scannerInstance.clear();
        setShowScanner(false);
        setScannedCode(decodedText);
        await validateVoucher(decodedText);
    }, [isValidating, isAwaitingConfirmation]);

    // ฟังก์ชันยืนยันการใช้งาน
    const handleConfirmUsage = async () => {
        if (!scannedCode) return;
        
        setIsConfirming(true);
        setError('');

        try {
            const { error: updateError } = await supabase
                .from('vouchers')
                .update({ status: 'used' })
                .eq('code', scannedCode);

            if (updateError) throw updateError;
            
            // --- MODIFIED: แสดงรหัสเต็ม ---
            setMessage(`Voucher [${scannedCode}] ถูกใช้งานเรียบร้อยแล้ว`);
            setVoucherData(null);
            setIsAwaitingConfirmation(false);

        } catch (err) {
            console.error('Confirmation Error:', err);
            setError('เกิดข้อผิดพลาดในการยืนยัน Voucher');
        } finally {
            setIsConfirming(false);
        }
    };

    // Effect สำหรับจัดการ Scanner
    useEffect(() => {
        if (!showScanner) return;
        
        const scannerInstance = new Html5QrcodeScanner(
            'qr-scanner-container', 
            { fps: 10, qrbox: { width: 250, height: 250 } }, 
            false
        );
        scannerInstance.render(handleScanSuccess, () => {});

        return () => {
            if (scannerInstance && scannerInstance.getState() !== 1) {
                scannerInstance.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        };
    }, [showScanner, handleScanSuccess]);
    
    // ฟังก์ชัน Reset
    const resetScanner = () => {
        setScannedCode(null);
        setMessage('');
        setError('');
        setShowScanner(false);
        setIsValidating(false);
        setVoucherData(null);
        setIsAwaitingConfirmation(false);
        setIsConfirming(false);
    };

    return (
        // --- MODIFIED: เปลี่ยนพื้นหลังหลักเป็นสีขาว ---
        <div className="min-h-screen bg-white text-red-700 flex items-center justify-center font-sans p-4">
            <div className="w-full max-w-md mx-auto py-12">
                <header className="text-center mb-8">
                    {/* --- MODIFIED: เปลี่ยนสีตัวหนังสือ --- */}
                    <h1 className="text-4xl font-bold tracking-tight text-red-800 sm:text-5xl">Voucher Scanner</h1>
                    <p className="mt-3 text-lg text-red-500">สแกน QR Code เพื่อตรวจสอบและใช้สิทธิ์</p>
                </header>

                {/* --- MODIFIED: เปลี่ยนพื้นหลัง Card --- */}
                <main className="bg-red-50 rounded-2xl shadow-lg border border-red-200 p-6 sm:p-8 transition-all duration-300">
                    
                    {isValidating ? (
                        <div className="flex flex-col items-center justify-center text-center">
                            <FaSpinner className="text-red-500 text-6xl animate-spin mb-4" />
                            <h2 className="text-2xl font-semibold text-red-800">กำลังตรวจสอบข้อมูล...</h2>
                        </div>
                    ) : isAwaitingConfirmation ? (
                        <div className="text-center">
                            {/* --- MODIFIED: เปลี่ยนสีไอคอนและตัวหนังสือ --- */}
                            <FaUserShield className="text-red-500 text-6xl mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold mb-2 text-red-800">ยืนยันการใช้สิทธิ์</h2>
                            <p className="text-red-600 mb-6">Voucher นี้สามารถใช้งานได้</p>
                            
                            {/* --- MODIFIED: เปลี่ยนสี Card ด้านใน --- */}
                            <div className="bg-red-100 p-4 rounded-lg mb-6 text-left space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-red-500 block mb-1">สิทธิ์ประโยชน์</label>
                                    <p className="font-semibold text-red-900 break-words text-lg">{voucherData?.description}</p>
                                </div>
                                {/* --- NEW: แสดงรหัส Voucher แบบเต็ม --- */}
                                <div>
                                    <label className="text-sm font-medium text-red-500 block">รหัส Voucher</label>
                                    <p className="font-mono text-red-900 flex items-center gap-2 break-all"><FaTicketAlt/> {voucherData?.code}</p>
                                </div>
                                {voucherData?.categories?.name && (
                                     <div>
                                        <label className="text-sm font-medium text-red-500 block">หมวดหมู่</label>
                                        <p className="font-semibold text-red-900 flex items-center gap-2"><FaTags/> {voucherData.categories.name}</p>
                                    </div>
                                )}
                                {voucherData?.expires_at && (
                                     <div>
                                        <label className="text-sm font-medium text-red-500 block">ใช้ได้ถึงวันที่</label>
                                        <p className="font-semibold text-red-900 flex items-center gap-2">
                                            <FaCalendarAlt/> 
                                            {new Date(voucherData.expires_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleConfirmUsage}
                                disabled={isConfirming}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:bg-gray-400"
                            >
                                {isConfirming ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                <span>{isConfirming ? 'กำลังยืนยัน...' : 'พนักงานยืนยันการใช้สิทธิ์'}</span>
                            </button>
                        </div>
                    ) : scannedCode ? (
                         <div className="text-center">
                            {message && <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />}
                            {error && <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />}
                           
                            <h2 className="text-2xl font-semibold mb-2 text-red-800">
                                {message ? 'สำเร็จ!' : 'เกิดข้อผิดพลาด!'}
                            </h2>
                            <p className="text-lg mb-6 break-words">
                                {message && <span className="text-green-700">{message}</span>}
                                {error && <span className="text-red-700">{error}</span>}
                            </p>
                            {/* --- MODIFIED: เปลี่ยนสีปุ่ม --- */}
                            <button onClick={resetScanner} className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3">
                                <FaArrowLeft />
                                <span>สแกนอีกครั้ง</span>
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                             {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg flex items-center gap-3 mb-6">
                                    <FaExclamationTriangle />
                                    <span>{error}</span>
                                </div>
                            )}
                            {!showScanner && (
                                // --- MODIFIED: เปลี่ยนสีปุ่ม ---
                                <button
                                    onClick={() => { setShowScanner(true); setError(''); }}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg flex items-center justify-center gap-3 text-lg"
                                >
                                    <FaQrcode />
                                    <span>เปิดกล้องเพื่อสแกน</span>
                                </button>
                            )}
                            <div id="qr-scanner-container" className={`mt-6 rounded-lg overflow-hidden ${!showScanner && 'hidden'}`}></div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default ScanVoucherPage;