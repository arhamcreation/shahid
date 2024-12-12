const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));

// Ensure the 'downloads' folder exists
if (!fs.existsSync('downloads')) {
    fs.mkdirSync('downloads');
}

// Video download and convert endpoint
app.get('/download', async (req, res) => {
    const videoId = req.query.videoId;

    if (!videoId) {
        return res.status(400).send('Error: videoId query parameter is required.');
    }

    const videoURL = `https://www.youtube.com/watch?v=${videoId}`;

    try {
        if (!ytdl.validateURL(videoURL)) {
            return res.status(400).send('Invalid YouTube URL.');
        }

        const info = await ytdl.getInfo(videoURL);
        const videoTitle = info.videoDetails.title;
        const outputPath = path.join(__dirname, 'downloads', `${videoTitle}.mp4`);

        res.header('Content-Disposition', `attachment; filename="${videoTitle}.mp4"`);

        ytdl(videoURL, { format: 'mp4' })
            .pipe(ffmpeg()
                .input('pipe:0')
                .audioCodec('aac')
                .videoCodec('libx264')
                .format('mp4')
                .pipe(res, { end: true })
            );

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Error processing video.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
