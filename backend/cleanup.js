
const cron = require('node-cron')
const path = require('path')
const fs = require('fs')
const FileUpload = require('./models/FileUpload')

// Run every minute
cron.schedule('* * * * *', async () => {
    const now = new Date()

    try {
        const expiredFiles = await FileUpload.find({
            createdAt: { $lt: new Date(now.getTime() - 10 * 60 * 1000) } // older than 10 mins
        })

        for (const file of expiredFiles) {
            for (const f of file.files) {
                const filePath = path.join(__dirname, 'uploads', f.url.split('/').pop())

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath) // delete from filesystem
                    console.log(`[Deleted] ${filePath}`)
                }
            }

            await FileUpload.deleteOne({ _id: file._id }) // delete from DB
            console.log(`[Deleted from DB] ${file._id}`)
        }
    } catch (err) {
        console.error('[Cleanup Error]', err)
    }
})
