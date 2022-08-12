const mongoose = require("mongoose")

const conectionStr = "mongodb://localhost:27017/Weddingguests"


async function startDataBase() {
    try {
        mongoose.connect(conectionStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    catch (err) {
        console.error('>>> DataBase Not Working:' + err.message);
    };

    const db = mongoose.connection;

    db.on('error', err => {
        console.error('>>> Database error:' + err.message);
    });
    db.on('open', () => {
        console.log('>>> Database conected');
    });
}

module.exports = startDataBase;