require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Sign query
function signQuery(query, secret) {
    return crypto.createHmac('sha256', secret).update(query).digest('hex');
}

// Buy BTC
app.post('/buy', async (req, res) => {
    const { apiKey, apiSecret, quantity } = req.body;
    const timestamp = Date.now();
    const query = `symbol=BTCUSDT&side=BUY&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = signQuery(query, apiSecret);

    try {
        const result = await axios.post(`https://api.binance.com/api/v3/order?${query}&signature=${signature}`, null, {
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        res.json(result.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

// Sell BTC
app.post('/sell', async (req, res) => {
    const { apiKey, apiSecret, quantity } = req.body;
    const timestamp = Date.now();
    const query = `symbol=BTCUSDT&side=SELL&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
    const signature = signQuery(query, apiSecret);

    try {
        const result = await axios.post(`https://api.binance.com/api/v3/order?${query}&signature=${signature}`, null, {
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        res.json(result.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

// Deposit Address
app.get('/deposit', async (req, res) => {
    const { apiKey, apiSecret } = req.query;
    const timestamp = Date.now();
    const query = `coin=BTC&timestamp=${timestamp}`;
    const signature = signQuery(query, apiSecret);

    try {
        const result = await axios.get(`https://api.binance.com/sapi/v1/capital/deposit/address?${query}&signature=${signature}`, {
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        res.json(result.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

// Withdraw BTC
app.post('/withdraw', async (req, res) => {
    const { apiKey, apiSecret, amount, address } = req.body;
    const timestamp = Date.now();
    const query = `coin=BTC&address=${address}&amount=${amount}&network=BTC&timestamp=${timestamp}`;
    const signature = signQuery(query, apiSecret);

    try {
        const result = await axios.post(`https://api.binance.com/sapi/v1/capital/withdraw/apply?${query}&signature=${signature}`, null, {
            headers: { 'X-MBX-APIKEY': apiKey }
        });
        res.json(result.data);
    } catch (err) {
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

app.listen(3000, () => {
    console.log("Binance trading backend running on port 3000");
});