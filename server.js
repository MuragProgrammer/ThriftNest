const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'src/assets/addedProducts'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename with extension
    }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ filename: req.file.filename });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
