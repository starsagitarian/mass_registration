require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true
}))

app.use('/user', require('./router/routes'));
app.use('/api', require('./router/upload'));

const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err)
        throw err;
    console.log("Connected To MongoDB - DBname: registration_app");
});


const PORT = process.env.PORT || 2600;

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})
