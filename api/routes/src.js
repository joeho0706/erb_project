var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
var fs = require('fs').promises; // Use promises for async operations
const path = require('path');
var crypto = require('node:crypto');
// // Serve static files from the 'public' folder
// router.use(express.static('public'));

router.get('/svg/avatar_add', async (req, res, next) => {
  // connect mongodb
  await client.connect();
  const database = client.db('mdb');
  const col = database.collection('avatars');

  try {
    const filePaths = await fileArray('../public/svg/avatar', '.svg');
    let avatars = [];

    const index = await col.countDocuments();
    if (index == 0) {
      for (let i in filePaths) {
        const svgContent = await fs.readFile(filePaths[i], 'utf8');
        if (svgContent == null) return res.status(500).send('Server error');
        const avatar_data = {
          index: i,
          avatar: filePaths[i],
          category: 'avatar',
          md5_hash: crypto.createHash('md5').update(svgContent).digest('hex'),
        };
        avatars.push(avatar_data);
      }
      await col.insertMany(avatars);
    }

    const last_index = await col
      .aggregate([{ $group: { lastIndex: { $max: '$index' } } }])
      .toArray();
    // console.log('🚀 ~ router.get ~ last_index:', last_index);
    res.send('svg_add finish2');
  } catch (err) {
    res.status(500).send('Server error');
  } finally {
    await client.close();
  }
});

// Endpoint to get all SVG file paths in the avatar folder
router.get('/svg/avatar', async (req, res, next) => {
  try {
    const filePaths = await fileArray('../public/svg/avatar', '.svg');
    const array = { results: filePaths };
    res.json(array); // Send the array of file paths as JSON
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Endpoint to get all SVG file paths in the avatar folder
router.get('/svg/avatar/:id', async (req, res, next) => {
  try {
    const filePaths = await fileArray('../public/svg/avatar', '.svg');
    //add code here
  } catch (err) {
    res.status(500).send('Server error');
  }
});

//test
router.get('/test', async (req, res, next) => {
  // Function to read the SVG file
  fs.readFile(svgFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the SVG file:', err);
      return;
    }
    console.log('SVG File Content:');
    console.log(data); // Outputs the SVG content
  });
});

// Function to get all file paths in the specified subdirectory
const fileArray = async (folder_path, file_extension) => {
  const folderPath = path.join(__dirname, folder_path);

  let results = [];

  try {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.stat(filePath);

      // Check if the file is a regular file
      if (stat.isFile() && path.extname(file) === file_extension) {
        results.push(path.relative(__dirname, filePath)); // Use relative path
      }
    }
  } catch (err) {
    console.error('Error reading avatar folder:', err);
    throw err; // Propagate error to the caller
  }

  return results;
};

const cryptoData = (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  // Generate the hash digest
  return hash.digest('hex');
};

module.exports = router;
