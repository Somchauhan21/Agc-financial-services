const crypto = require('crypto')
const express = require('express')
const multer = require('multer')
const path = require('path')

const FileUpload = require('../models/FileUpload')

const router = express.Router()

function generateUniqueString(length) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
}

const storage = multer.diskStorage({
    destination: (_, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads')
        cb(null, uploadPath)
    },
    filename: (_, file, cb) => {
        const uniqueFilename = Date.now() + '_' + file.originalname
        cb(null, uniqueFilename)
    }
})
const upload = multer({storage: storage})

router.post('/', upload.array('files'), (req, res) => {
    console.log('📂 Upload Directory:', path.join(__dirname, '../uploads')); // Debug log
    console.log('🔄 Files received:', req.files.map(f => f.originalname));
    const files = req.files
    if(files === undefined || files.length === 0) {
        return res.status(400).json({message: 'No files uploaded'})
    }

    const fileDetails = []
    files.forEach((file) => {
        const name = file.originalname
        const url = `https://agc-financial-services-backend.onrender.com/f/${file.filename}`
        fileDetails.push({
            name: name,
            url: url
        })
    })
    const password = req.body.password
    const hash = generateUniqueString(20)

    const fileUpload = new FileUpload({
        hash: hash,
        password: password,
        files: fileDetails
    })
    fileUpload.save()
        .then(saved => {
            return res.status(200).json({hash: hash})
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({message: err})
        })        
    })

module.exports = router
