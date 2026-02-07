import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useParams, Link } from 'react-router-dom';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';

const OrderPage = () => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { orderId } = useParams();

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            setError("ไม่พบหมายเลขออเดอร์ใน URL");
            return;
        }

        const fetchOrder = async (id) => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('orders')
                .select(`*, order_items(*, products(name))`) // ดึงแค่ชื่อ product มาก็พอ
                .eq('id', id)
                .maybeSingle(); 

            if (error) {
                setError(error.message);
                console.error("Supabase error:", error);
            } else if (!data) { 
                setError(`ไม่พบข้อมูลออเดอร์หมายเลข #${id}`);
            } else {
                setOrderData(data);
            }
            setLoading(false);
        };

        fetchOrder(orderId);
    }, [orderId]);

    if (loading) return <p style={styles.message}>กำลังโหลดข้อมูลออเดอร์...</p>;
    if (error) return <p style={{...styles.message, color: 'red'}}>เกิดข้อผิดพลาด: {error}</p>;
    if (!orderData) return null; // ไม่ต้องแสดงอะไรเลยถ้ายังไม่มีข้อมูล

    return (
        <>
            {/* เพิ่ม CSS พิเศษสำหรับตอนพิมพ์ */}
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #receipt-section, #receipt-section * {
                            visibility: visible;
                        }
                        #receipt-section {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
        
            <div style={styles.pageContainer}>
                <div className="no-print" style={styles.actionBar}>
                    <Link to="/pos" style={styles.backButton}>
                        <FaArrowLeft style={{ marginRight: '8px' }} /> กลับไปหน้า POS
                    </Link>
                    <button onClick={() => window.print()} style={styles.printButton}>
                        <FaPrint style={{ marginRight: '8px' }} /> พิมพ์ใบเสร็จ
                    </button>
                </div>
                
                <div id="receipt-section" style={styles.receiptContainer}>
                    <div style={styles.receiptHeader}>
                        <h1 style={{ margin: 0, fontSize: '1.8em' }}>ใบสรุปรายการ</h1>
                        <p style={{ margin: '5px 0' }}>สำหรับออเดอร์หมายเลข: #{orderData.id}</p>
                        <p style={{ margin: 0, color: '#666' }}>
                            วันที่: {new Date(orderData.created_at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                    </div>

                    <div style={styles.itemsTable}>
                        <div style={styles.tableHeader}>
                            <span style={{...styles.tableCell, flex: 3, textAlign: 'left'}}>รายการ</span>
                            <span style={{...styles.tableCell, flex: 1, textAlign: 'center'}}>จำนวน</span>
                            <span style={{...styles.tableCell, flex: 2, textAlign: 'right'}}>ราคาต่อหน่วย</span>
                            <span style={{...styles.tableCell, flex: 2, textAlign: 'right'}}>ราคารวม</span>
                        </div>
                        {orderData.order_items.map(item => (
                            <div key={item.id} style={styles.tableRow}>
                                <span style={{...styles.tableCell, flex: 3, textAlign: 'left'}}>{item.products?.name || `Product #${item.product_id}`}</span>
                                <span style={{...styles.tableCell, flex: 1, textAlign: 'center'}}>{item.quantity}</span>
                                <span style={{...styles.tableCell, flex: 2, textAlign: 'right'}}>{item.unit_price.toFixed(2)}</span>
                                <span style={{...styles.tableCell, flex: 2, textAlign: 'right', fontWeight: 'bold'}}>{(item.unit_price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div style={styles.receiptFooter}>
                        <div style={styles.totalRow}>
                            <span>ยอดรวม</span>
                            <span>{orderData.total_amount.toFixed(2)} บาท</span>
                        </div>
                        <div style={{...styles.totalRow, fontSize: '1.5em', fontWeight: 'bold'}}>
                            <span>ยอดชำระทั้งสิ้น</span>
                            <span>{orderData.total_amount.toFixed(2)} บาท</span>
                        </div>
                    </div>
                     <div style={styles.statusFooter}>
                        สถานะ: <span style={{ color: orderData.status === 'completed' ? '#28a745' : '#ffc107' }}>{orderData.status.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    pageContainer: { fontFamily: 'sans-serif', background: '#f4f4f9', minHeight: '100vh', padding: '20px' },
    actionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', maxWidth: '800px', margin: '0 auto 20px auto' },
    backButton: { display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#555', padding: '8px 15px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px' },
    printButton: { display: 'flex', alignItems: 'center', padding: '10px 20px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' },
    receiptContainer: { maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
    receiptHeader: { textAlign: 'center', padding: '30px', borderBottom: '2px dashed #ccc' },
    itemsTable: { padding: '20px' },
    tableHeader: { display: 'flex', fontWeight: 'bold', color: '#888', paddingBottom: '10px', borderBottom: '1px solid #eee' },
    tableRow: { display: 'flex', padding: '10px 0', borderBottom: '1px dotted #ccc' },
    tableCell: { padding: '0 5px' },
    receiptFooter: { padding: '20px', background: '#f9f9f9', borderTop: '2px dashed #ccc' },
    totalRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '1.1em' },
    statusFooter: { padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2em', background: '#eee' },
    message: { textAlign: 'center', marginTop: '50px', fontSize: '1.2em' },
};

export default OrderPage;