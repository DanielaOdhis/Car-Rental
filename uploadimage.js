const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/', limits: { files: 10 } });

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "font-src 'self' http://localhost:3001");
    next();
  });

  app.get('/', function(req, res) {
    res.send('Hello, this is the root URL');
  });

app.post('/cars', upload.array('image', 10), function(req, res) {
  const files = req.files;

  if (!files) {
    res.status(400).json({ error: 'No files were uploaded' });
    return;
  }

  const savedImages = [];

  // Iterate over the uploaded files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = file.path;
    const originalName = file.originalname;
    const destinationPath = `uploads/${originalName}`;

    // Check if the file is coming from the 'cars' folder
    if (filePath.startsWith('uploads/cars/')) {
      // Move the file to the final destination
      fs.renameSync(filePath, destinationPath);
      savedImages.push(destinationPath);
    } else {
      // Delete the file if it doesn't belong to the 'cars' folder
      fs.unlinkSync(filePath);
    }
  }

  res.status(200).json({ images: savedImages });
});

app.listen(3001, function() {
  console.log('Server is listening on port 3001');
});
