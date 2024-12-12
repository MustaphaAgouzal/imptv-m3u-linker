const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware

const app = express();
const upload = multer({ dest: 'uploads/' });

// Enable CORS for GitHub Pages
app.use(cors({ origin: 'https://mustaphaagouzal.github.io' }));
app.use(bodyParser.json());
app.use(express.static('uploads'));

const macToFileMap = {};

// Endpoint to upload M3U file and associate with MAC address
app.post('/upload', upload.single('m3uFile'), (req, res) => {
    const { macAddress } = req.body;
    if (!macAddress) return res.status(400).json({ error: 'MAC address is required' });

    const filePath = path.join(__dirname, req.file.path);
    macToFileMap[macAddress] = filePath;

    res.json({ message: 'File uploaded successfully', macAddress, filePath });
});

// Endpoint to retrieve M3U file by MAC address
app.get('/playlist/:macAddress', (req, res) => {
    const { macAddress } = req.params;
    const filePath = macToFileMap[macAddress];
    if (!filePath) return res.status(404).json({ error: 'No playlist found for this MAC address' });

    res.sendFile(filePath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
