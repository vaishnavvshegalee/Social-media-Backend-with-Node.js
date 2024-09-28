const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require('./routes/user-route');
const blogRouter = require('./routes/blog-route');
const dotenv = require('dotenv').config();
dotenv;
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api',router);
app.use('/api/blog',blogRouter);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(port,(err)=>{
        if(err) console.log(err);
        console.log(`server is listening on port ${port}`);
    });
    console.log('Database is connceted');
}).catch((err)=>{
    console.log(err); 
})




