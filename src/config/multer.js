const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const time = new Date().getTime();
        cb(null, `${time}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;