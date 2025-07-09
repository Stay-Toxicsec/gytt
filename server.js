require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_API_SECRET;

function signQuery(query) {
    return crypto.createHmac('sha256', API_SECRET).update(query).digest('hex');
}

app.post('/order', async (req, res) => {
    const { side, quantity } = req.body;

    const baseURL = 'https://api.binance.com';
    const endpoint = '/api/v3/order';
    const timestamp = Date.now();

    const query = `symbol=BTCUSDT&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = signQuery(query);

    const url = `${baseURL}${endpoint}?${query}&signature=${signature}`;

    try {
        const result = await axios.post(url, null, {
            headers: {
                'X-MBX-APIKEY': API_KEY
            }
        });
        res.json(result.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));