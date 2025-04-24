// backend/routes/access.js Add a timer countdown showing time left before expiry.

const express = require('express')
const FileUpload = require('../models/FileUpload')
const path = require('path')
const fs = require('fs')

const router = express.Router()

// GET file info using hash (for preview/download page)
router.get('/:hash', async (req, res) => {
    try {
        const fileEntry = await FileUpload.findOne({ hash: req.params.hash })

        if (!fileEntry) {
            return res.status(410).json({ message: "File expired and removed" })
        }

        const now = new Date()
        const createdAt = new Date(fileEntry.createdAt)
        const diffMinutes = (now - createdAt) / (1000 * 60)

        if (diffMinutes > 10) {
            return res.status(410).json({ message: "Link has expired" })
        }

        res.status(200).json(fileEntry)

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
})

// ✅ POST to verify password and return file details
router.post('/', async (req, res) => {
    try {
        const { hash, password } = req.body

        const fileEntry = await FileUpload.findOne({ hash })

        if (!fileEntry) {
            return res.status(410).json({ message: "File expired and removed" })
        }

        const now = new Date()
        const createdAt = new Date(fileEntry.createdAt)
        const diffMinutes = (now - createdAt) / (1000 * 60)

        if (diffMinutes > 10) {
            return res.status(410).json({ message: "Link has expired" })
        }

        if (fileEntry.password && fileEntry.password !== password) {
            return res.status(401).json({ message: "Incorrect password" })
        }

        res.status(200).json(fileEntry)

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
    }
})

module.exports = router
