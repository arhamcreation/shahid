const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

// API endpoint to handle download request
app.get('/download', async (req, res) => {
    const videoId = req.query.videoId;

    if (!videoId) {
        return res.status(400).json({ error: 'No video ID provided' });
    }

    try {
        const url = `https://youtube-mp36.p.mnuu.nu/dl?id=${videoId}`; // Example download API

        // Making a request to the external YouTube MP3 download service
        const response = await axios.get(url);

        // If the external service works, return the download link
        if (response.data && response.data.link) {
            res.json({ downloadLink: response.data.link });
        } else {
            res.status(500).json({ error: 'Error fetching download link' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from external service' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
