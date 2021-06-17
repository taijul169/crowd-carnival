const dotenv =  require('dotenv');
const express = require('express');
var cookieParser = require('cookie-parser'); 
const app = express();
const User = require('./model/userSchema')
dotenv.config({path:'./config.env'});
const request = require('request');
require('./db/conn');

app.use(express.json());
app.use(cookieParser())
// we link the router  file to make our route easy
app.use(require('./router/auth'))
const PORT = process.env.PORT

// request.post({
//    "headers":{
//         "content-type":"application/json"
//    },
//    "url":"http://api.icombd.com/api/v3/sendsms/plain",
//    "body": JSON.stringify({
//     "user": 'tariqkhan',
//     "password": '100200300',
//      "sender": '03590001944',
//     "text": 'A text message sent using Messaging Service',
//     "to": '8801772488816' 
//    })
// },
//  (error, response,body)=>{
//     if(error){
//        return console.dir(error);
//     }
//     console.dir(JSON.parse(body))
//  }
// )




app.listen(5000,()=>{
   console.log(`app is running at port no:${PORT}`);
})