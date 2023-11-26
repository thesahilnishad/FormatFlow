
const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post('/convert', upload.array('images'), (req, res) => {
  const images = req.files.map(file => `uploads/${file.filename}`).join('|');
  const outputVideo = `output/video_${Date.now()}.mp4`;

  ffmpeg()
    .input(`concat:${images}`)
    .inputFormat('image2')
    .output(outputVideo)
    .on('end', () => {
      // Delete uploaded images
      req.files.forEach(file => fs.unlinkSync(file.path));
      res.json({ success: true, video: outputVideo });
    })
    .on('error', err => {
      res.status(500).json({ success: false, error: err.message });
    })
    .run();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
