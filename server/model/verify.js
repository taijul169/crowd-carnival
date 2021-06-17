const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createIndexes } = require('./userSchema');

const verifySchema = new mongoose.Schema({
    verificationCode :{
        type:String,
        expires: '2m',
        default:function(){
            const RANDOM_NUM = Math.round((Math.random()*1000000));
            const verificationCode = `${RANDOM_NUM}`
            return verificationCode;
        }
    },
    refereeId:{
        type:String
    },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
    
  
})
// verifySchema.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )

const Verify = mongoose.model('VERIFY',verifySchema);
module.exports = Verify;