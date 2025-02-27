const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4500; // Port number when not available

const authRouter = require('./routes/authRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');  
const { notFound, errorHandler } = require('./middlewares/errorHandler');
dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user',authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});

