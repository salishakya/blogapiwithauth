const express = require ('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const app = express();

app.use(express.json());
app.use('/public' , express.static('public'));

const dbURI = process.env.mongodbURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true , useFindAndModify : false} , () => console.log('connected to db'))

app.get('/' , (req,res) => {
    res.json({
        message : 'Hello'
    })
})

app.get('/api' , (req,res) => {
    res.json({
        message : 'Hello , use other routes'
    })
})

app.listen( process.env.PORT || 3000 , () => {
    console.log('listening at 3000');
})

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
