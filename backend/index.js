// const express = require('express')
// const cors = require('cors')
// const path = require('path')
// require('dotenv').config()
// require('./database/database')
// require('./cleanup') 

// const app = express()
// app.use(cors())
// app.use(express.json())

// // for file downloads
// app.use('/f', express.static(path.join(__dirname, 'uploads')))

// const uploadRouter = require('./routes/upload')
// const accessRouter = require('./routes/access')

// app.use('/upload', uploadRouter)
// app.use('/access', accessRouter)

// app.listen(1234, () => {
//     console.log("[*] Server is up and running ...")
// })
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Database and cleanup
require('./database/database');
require('./cleanup');

const app = express();

// 1. Enhanced CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Essential Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Auto-create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 4. Static File Serving (keep this before routes)
app.use('/f', express.static(uploadsDir));

// 5. Route Configuration
const uploadRouter = require('./routes/upload');
const accessRouter = require('./routes/access');

app.use('/upload', uploadRouter);
app.use('/access', accessRouter);

// 6. Production Port Configuration
const PORT = process.env.PORT || 1234;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[*] Server running on port ${PORT}`);
});

// 7. Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
