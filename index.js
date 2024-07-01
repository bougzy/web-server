const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to extract real IP
app.set('trust proxy', true);

app.use(cors());

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Visitor';
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Log the client IP for debugging
    console.log(`Client IP: ${clientIp}`);

    // For local testing, use a fallback IP address
    if (clientIp.includes('127.0.0.1') || clientIp.includes('::1')) {
        clientIp = '8.8.8.8'; // Google Public DNS IP for testing
    }

    try {
        // Get location data
        const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        const { city } = locationResponse.data;

        console.log(`Location data: ${JSON.stringify(locationResponse.data)}`);

        // Assume a static temperature for simplicity
        const temperature = 11;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}.`
        });
    } catch (error) {
        console.error('Error retrieving location data:', error);
        res.status(500).json({ error: 'Unable to retrieve data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
