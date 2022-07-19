const mongoose=require('mongoose');
const express=require('express');

const Msg=require('./models/messages');
const User=require('./models/usermodel');

const bodyParser=require('body-parser')
jsonwebtoken=require('jsonwebtoken')

const app=express()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




const io=require('socket.io')(4000)

const url= 'mongodb://localhost/squbesoftsol'

mongoose.connect(url,{useNewUrlParser:true});

const con=mongoose.connection

con.on('open',()=>{
    console.log('Connected...');
})

io.on('connection', (socket) => {
    Msg.find().then(result => {
        socket.emit('output-messages', result)
    })
    console.log('a user connected');
    socket.emit('message', 'Hello world');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chatmessage', msg => {
        const message = new Msg({ msg });
        message.save().then(() => {
            io.emit('message', msg)
        })


    })
});

app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
  });