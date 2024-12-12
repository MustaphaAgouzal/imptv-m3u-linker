const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(express.static('uploads'));

// In-memory database for MAC and playlist association
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
