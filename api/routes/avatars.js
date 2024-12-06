var express = require('express');
var router = express.Router();
// const { ObjectId } = require('mongodb');
const Avatar = require('../models/avatar');
const path = require('path');
const fs = require('fs');
const upload = require('../config/avatarsMulter');

router.get('/', async (req, res) => {
  const avatars = await Avatar.find();
  res.render('avatars/index', { avatars });
});

router.post('/upload', upload.array('svgs'), async (req, res) => {
  try {
    const files = req.files;
    for (let file of files) {
      const { originalname, filename } = file;
      const relativePath = `/${filename}`;
      const newAvatar = new Avatar({
        name: originalname,
        svg: relativePath,
      });
      await newAvatar.save();
    }
    res.status(200).send('All SVG files have been uploaded and saved.');
  } catch (err) {
    res.status(500).send('Failed to upload and save SVG files.');
  }
});

router.delete('/', async (req, res) => {
  try {
    await Avatar.deleteMany({});
    res.status(200).send('All avatars have been deleted');
  } catch (err) {
    res.status(500).send('Failed to delete avatars');
  }
});
router.get('/:id', async (req, res) => {
  try {
    const avatar = await Avatar.findById(req.params.id);
    res.render('avatars/avatar', { avatar });
  } catch (err) {
    res.status(404).send('Avatar not found');
  }
});

module.exports = router;
