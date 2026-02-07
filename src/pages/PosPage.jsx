import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash, FaUtensils, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PosPage = () => {
    // --- State Management ---
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isBouncing, setIsBouncing] = useState(false);
    const navigate = useNavigate();

    // --- Data Fetching ---
    useEffect(() => {
        const allCategories = ['All', 'Nigiri', 'Maki', 'Sashimi', 'Donburi', 'Gunkan', 'Appetizers', 'Drinks'];
        setCategories(allCategories);
        const fetchData = async () => {
            setIsLoading(true);
            const { data, error } = await supabase.from('products').select('*').eq('is_available', true);
            if (error) {
                setError(error.message);
            } else {
                setProducts(data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    // --- Filtering Logic ---
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All') return products;
        return products.filter(p => p.category === selectedCategory);
    }, [selectedCategory, products]);

    // --- Cart Logic ---
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 300);
    };

    const updateQuantity = (productId, amount) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity + amount } : item
            );
            return updatedCart.filter(item => item.quantity > 0);
        });
    };
    
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

    // --- Workflow: Send to Kitchen ---
    const handleSendToKitchen = async () => {
        if (cart.length === 0) { alert("กรุณาเลือกสินค้า"); return; }
        setIsLoading(true);
        setError(null);
        try {
            const { data: newOrder, error: orderError } = await supabase
                .from('orders').insert({ status: 'pending', total_amount: total }).select('id').single();
            if (orderError) throw orderError;
            const newOrderId = newOrder.id;
            const itemsToInsert = cart.map(item => ({
                order_id: newOrderId,
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price
            }));
            const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
            if (itemsError) throw itemsError;
            alert(`ส่งออเดอร์ #${newOrderId} เข้าครัวสำเร็จ!`);
            setCart([]);
            setIsCartOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Cart Grouping Logic ---
    const groupedCart = useMemo(() => {
        return cart.reduce((acc, item) => {
            const category = item.category || 'อื่นๆ';
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {});
    }, [cart]);

    // --- Animation Variants ---
    const gridVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };
    const cartPanelVariants = {
        hidden: { x: '100%' },
        visible: { x: 0, transition: { type: 'tween', duration: 0.4, ease: 'easeOut' } },
        exit: { x: '100%', transition: { type: 'tween', duration: 0.3, ease: 'easeIn' } }
    };

    return (
        <div style={styles.container}>
            <div style={styles.menuPanel}>
                <div style={styles.categoryContainer}>
                    {categories.map(category => (
                        <button key={category} onClick={() => setSelectedCategory(category)} style={selectedCategory === category ? styles.activeCategoryButton : styles.categoryButton}>
                            {category}
                        </button>
                    ))}
                </div>
                <hr style={styles.hr}/>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCategory}
                        variants={gridVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0 }}
                        style={styles.productGrid}
                    >
                        {isLoading ? <p>Loading...</p> : filteredProducts.length === 0 ? (
                            <p style={styles.emptyCategoryMessage}>ไม่มีรายการในหมวดหมู่นี้</p>
                        ) : (
                            filteredProducts.map(product => {
                                const itemInCart = cart.find(item => item.id === product.id);
                                return (
                                    <motion.div key={product.id} variants={itemVariants} style={styles.productCard} whileHover={{ y: -5 }}>
                                        <div style={{cursor: 'pointer', flexGrow: 1}} onClick={() => addToCart(product)}>
                                            <img src={product.image_url || 'https://via.placeholder.com/150'} alt={product.name} style={styles.productImage}/>
                                            <div style={styles.productInfo}>
                                                <h4 style={{ margin: 0 }}>{product.name}</h4>
                                                <p style={{ margin: '4px 0', color: '#666' }}>{product.price.toFixed(2)} บาท</p>
                                            </div>
                                        </div>
                                        
                                        {/* [ปรับปรุง] เพิ่มปุ่ม +/- บนการ์ดสินค้า */}
                                        {itemInCart ? (
                                            <div style={styles.cardQuantityControls}>
                                                <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1); }} style={styles.cardControlButton}>
                                                    <FaMinus size="0.8em"/>
                                                </button>
                                                <span style={styles.cardQuantityText}>{itemInCart.quantity}</span>
                                                <button onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, 1); }} style={styles.cardControlButton}>
                                                    <FaPlus size="0.8em"/>
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={styles.cardAddButtonContainer} onClick={() => addToCart(product)}>
                                                <FaPlus size="0.8em" />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div style={styles.cartPanel} variants={cartPanelVariants} initial="hidden" animate="visible" exit="exit">
                        <div style={styles.cartHeader}>
                            <h2 style={styles.header}><FaUtensils style={{ marginRight: '10px' }}/> สรุปรายการออเดอร์</h2>
                            <button onClick={() => setIsCartOpen(false)} style={styles.closeButton}><FaTimes size="1.5em"/></button>
                        </div>
                        <div style={styles.cartItemsContainer}>
                            {cart.length === 0 ? <p style={styles.emptyCartText}>ยังไม่มีสินค้าในตะกร้า</p> : Object.keys(groupedCart).map(category => (
                                <div key={category} style={styles.categoryGroup}>
                                    <h4 style={styles.cartCategoryHeader}>{category}</h4>
                                    {groupedCart[category].map(item => (
                                        <div key={item.id} style={styles.cartItem}>
                                            <div style={{ flex: 1 }}>
                                                <p style={styles.itemName}>{item.name}</p>
                                                <p style={styles.itemPriceDetail}>{item.quantity} x {item.price.toFixed(2)}</p>
                                            </div>
                                            <div style={styles.quantityControls}>
                                                <button onClick={() => updateQuantity(item.id, -1)} style={styles.iconButton}><FaMinus size="0.8em"/></button>
                                                <span style={styles.quantityText}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} style={styles.iconButton}><FaPlus size="0.8em"/></button>
                                            </div>
                                            <p style={styles.itemTotalPrice}>{(item.price * item.quantity).toFixed(2)}</p>
                                            <button onClick={() => removeFromCart(item.id)} style={styles.removeIconButton}><FaTrash /></button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div style={styles.cartSummary}>
                            <div style={styles.totalRow}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>ยอดรวม</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{total.toFixed(2)} บาท</span>
                            </div>
                            <button onClick={handleSendToKitchen} disabled={isLoading || cart.length === 0} style={styles.saveButton(isLoading || cart.length === 0)}>
                                {isLoading ? 'กำลังส่ง...' : 'ส่งเข้าครัว'}
                            </button>
                            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.button onClick={() => setIsCartOpen(true)} style={styles.cartFab} animate={{ scale: isBouncing ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
                {totalItemsInCart > 0 && <div style={styles.fabBadge}>{totalItemsInCart}</div>}
                <FaShoppingCart size="1.5em" />
            </motion.button>
        </div>
    );
};

// --- Styles ---
const styles = {
    container: { position: 'relative', height: '100vh', fontFamily: 'sans-serif', background: '#ffffff', overflow: 'hidden' },
    menuPanel: { width: '100%', height: '100%', padding: '20px 40px', overflowY: 'auto' },
    cartPanel: { position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '500px', height: '100vh', background: 'white', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', zIndex: 1000 },
    cartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 },
    header: { margin: 0, padding: 0, borderBottom: 'none', display: 'flex', alignItems: 'center', fontSize: '1.2em' },
    closeButton: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5em', color: '#aaa', padding: '10px' },
    cartItemsContainer: { flex: 1, overflowY: 'auto', padding: '20px 30px' },
    cartSummary: { borderTop: '1px solid #f0f0f0', padding: '20px 30px', background: '#f9f9f9', flexShrink: 0 },
    cartFab: { position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', background: '#0d6efd', color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 999 },
    fabBadge: { position: 'absolute', top: '-5px', right: '-5px', background: '#dc3545', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', border: '2px solid white' },
    categoryContainer: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' },
    categoryButton: { padding: '10px 20px', borderRadius: '25px', border: '1px solid #e0e0e0', background: 'white', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s ease-in-out' },
    activeCategoryButton: { padding: '10px 20px', borderRadius: '25px', border: '1px solid #0d6efd', background: '#0d6efd', color: 'white', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(0, 123, 255, 0.2)' },
    hr: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '0 0 25px 0' },
    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' },
    productCard: { border: '1px solid #f0f0f0', borderRadius: '12px', background: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out' },
    productImage: { width: '100%', height: '140px', objectFit: 'cover' },
    productInfo: { padding: '15px', flexGrow: 1 },
    badge: { position: 'absolute', top: '10px', right: '10px', background: '#dc3545', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: '2px solid white' },
    emptyCategoryMessage: { gridColumn: '1 / -1', textAlign: 'center', color: '#aaa', marginTop: '50px', width: '100%' },
    emptyCartText: { textAlign: 'center', color: '#aaa', marginTop: '20px' },
    categoryGroup: { marginBottom: '20px' },
    cartCategoryHeader: { margin: '0 0 10px 0', paddingBottom: '5px', borderBottom: '1px solid #f0f0f0', fontSize: '1em', color: '#0d6efd', fontWeight: 'bold' },
    cartItem: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' },
    itemName: { margin: 0, fontWeight: 'bold', color: '#333' },
    itemPriceDetail: { margin: '4px 0', color: '#888', fontSize: '0.9em' },
    quantityControls: { display: 'flex', alignItems: 'center', background: '#f0f0f0', borderRadius: '8px' },
    quantityText: { margin: '0 10px', minWidth: '20px', textAlign: 'center', fontWeight: 'bold' },
    itemTotalPrice: { minWidth: '70px', textAlign: 'right', fontWeight: 'bold', color: '#333' },
    iconButton: { width: '32px', height: '32px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' },
    removeIconButton: { border: 'none', background: 'transparent', color: '#dc3545', fontSize: '1.1em', cursor: 'pointer', padding: '5px', borderRadius: '5px' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    saveButton: (disabled) => ({
        width: '100%', padding: '15px', fontSize: '1.1em', fontWeight: 'bold', background: disabled ? '#ccc' : '#28a745', 
        color: 'white', border: 'none', borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s'
    }),
    cardQuantityControls: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d6efd', color: 'white', padding: '8px 0' },
    cardQuantityText: { margin: '0 15px', fontSize: '1.1em', fontWeight: 'bold' },
    cardControlButton: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '0 10px', fontSize: '1em' },
    cardAddButtonContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', color: '#333', padding: '8px 0', cursor: 'pointer', borderTop: '1px solid #f0f0f0' }
};

export default PosPage; 