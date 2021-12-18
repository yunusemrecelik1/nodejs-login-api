const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import routes 
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
dotenv.config();

//Connect to db 
mongoose.connect(process.env.DB_CONNECT,

()=> console.log('baglandi'))

//Middleware 
app.use(express.json());


//route middlewares
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.listen(3000, ()=> console.log("running"));