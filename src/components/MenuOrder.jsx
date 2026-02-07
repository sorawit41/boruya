// src/components/MenuOrder.jsx
import React from 'react';

const MenuOrder = ({ order }) => {
    if (!order || !order.order_items) return <p>No items in this order.</p>;
    const total = order.order_items.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);

    return (
        <div>
            <h3>Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {order.order_items.map(item => (
                        <tr key={item.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.products.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>{(item.products.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2 style={{ textAlign: 'right' }}>Total: {total.toFixed(2)} THB</h2>
        </div>
    );
};

export default MenuOrder;