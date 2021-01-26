const express = require ('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const fileUpload = require('express-fileupload');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(fileUpload());

const dbURI = 'mongodb://localhost:27017/UserDB';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true , useFindAndModify : false} , () => console.log('connected to db'))


app.get('/api' , (req,res) => {
    res.json({
        message : 'Hello , use other routes'
    })
})

app.listen(3000 , () => {
    console.log('listening at 3000');
})

app.use('/api', authRoutes);
app.use('/api', blogRoutes);
