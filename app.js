const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS for all requests
app.use(cors());

// API to fetch download links
app.get('/download', async (req, res) => {
    const videoId = req.query.videoId;
    if (!videoId) {
        return res.status(400).json({ error: 'videoId is required' });
    }

    try {
        // External API call to get video download links
        const apiUrl = `https://youtube-mp36.p.mnuu.nu/dl?id=${videoId}`;
        const response = await axios.get(apiUrl);
        res.json(response.data); // Send the API response to the frontend
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from external API' });
    }
});

// Listen to incoming requests on port 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
