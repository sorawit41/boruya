// src/components/PrintButton.jsx
import React, { useState } from 'react';

const PrintButton = ({ orderId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handlePrint = async () => {
        if (!orderId) { alert("Order ID not found"); return; }
        setIsLoading(true);
        setMessage('Sending print command...');

        try {
            const serverUrl = 'http://localhost:3001/print-receipt';
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderId }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Server error');
            setMessage('Print command sent successfully!');
        } catch (error) {
            console.error("Failed to connect to print server:", error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 4000);
        }
    };

    return (
        <div>
            <button onClick={handlePrint} disabled={isLoading} style={{ padding: '10px 20px', fontSize: '16px' }}>
                {isLoading ? 'Printing...' : 'Print Receipt'}
            </button>
            {message && <span style={{ marginLeft: '15px', color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</span>}
        </div>
    );
};
export default PrintButton;