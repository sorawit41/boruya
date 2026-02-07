// backend-print-server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const network = require('escpos-network');
const QRCode = require('qrcode');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function printReceipt(receiptData) {
    const device = new network.Network(process.env.PRINTER_IP);
    const printer = new network.Printer(device);

    const qrImage = await QRCode.toBuffer(receiptData.paymentQR, {
        errorCorrectionLevel: 'M', type: 'png', width: 200
    });

    return new Promise((resolve, reject) => {
        device.open(function(error) {
            if (error) {
                console.error("Printer connection error:", error);
                return reject(new Error("Cannot connect to printer"));
            }
            
            printer
                .font('a').align('ct').style('bu').size(2, 2).text(receiptData.shopName)
                .size(1, 1).style('normal').text(`Order ID: ${receiptData.orderNumber}`)
                .text('--------------------------------').align('lt');
            
            receiptData.items.forEach(item => {
                printer.tableCustom([
                    { text: item.name, align: "LEFT", width: 0.5 },
                    { text: item.qty.toString(), align: "CENTER", width: 0.2 },
                    { text: (item.price * item.qty).toFixed(2), align: "RIGHT", width: 0.3 }
                ]);
            });

            printer.text('--------------------------------');
            const total = receiptData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
            printer.align('rt').size(1, 2).text(`Total: ${total.toFixed(2)} THB`).size(1, 1);

            printer.align('ct').text('\nScan to Pay').image(qrImage, 's8')
                .then(() => {
                    printer.feed(3).cut().close();
                    console.log(`Receipt for Order ID ${receiptData.orderNumber} printed.`);
                    resolve();
                }).catch(err => {
                    console.error("Image printing error:", err);
                    reject(new Error("Failed to print image"));
                });
        });
    });
}

app.post('/print-receipt', async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "Missing orderId" });

    try {
        console.log(`Received print request for Order ID: ${orderId}`);
        const { data: order, error } = await supabase
            .from('orders').select(`*, order_items(*, products(*))`).eq('id', orderId).single();

        if (error) throw error;
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        const formattedReceiptData = {
            shopName: "Boruya Sushi",
            orderNumber: order.id,
            items: order.order_items.map(item => ({
                name: item.products.name,
                qty: item.quantity,
                price: item.products.price,
            })),
            paymentQR: "000201010212306100123456789012345802TH540550.005303764"
        };
        
        await printReceipt(formattedReceiptData);
        res.json({ success: true, message: "Print command sent successfully." });
    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Print Server is running on http://localhost:${PORT}`);
});