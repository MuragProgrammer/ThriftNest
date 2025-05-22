const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'src/assets/addedProducts'));
    },
    filename: function (req, file, cb) {
        // Sanitize the filename to remove unsafe characters
        const sanitized = file.originalname.replace(/[^a-z0-9.\-_]/gi, '_');
        cb(null, sanitized);
    }
});


const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ filename: req.file.filename });
});
app.delete('/api/products/:filename', (req, res) => {
    const filename = req.params.filename;

    // Only delete images from 'addedProducts'
    const imagePath = path.join(__dirname, 'src/assets/addedProducts', filename);
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Failed to delete image.' });
            }
            return res.json({ message: 'Image deleted successfully.' });
        });
    } else {
        // Do nothing if not in addedProducts
        return res.json({ message: 'Image not in addedProducts, no deletion performed.' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
