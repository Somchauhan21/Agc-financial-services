
const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        const db_string = process.env.MONGO_URI;

        mongoose.connect(db_string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('[*] Connection to MongoDB Atlas successful');
        })
        .catch(err => {
            console.error('[!] Error connecting to MongoDB Atlas:', err);
        });
    }
}

module.exports = new Database();

