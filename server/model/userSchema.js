const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    refereeId :{
        type:String,
        default:function(){
            const RANDOM_NUM = Math.round((Math.random()*1000000));
            const refereeId = `cf786786${RANDOM_NUM}`
            return refereeId;
        }
    },
    userId:{
        type:String
    },
    firstName :{
        type:String,
    },
    lastName :{
        type:String,
    },
    dateOfBirth:{
        type:Date,
        default:Date.now
    },
    perPhoneOne:{
        type:String
    },
    verify:{
        type:Boolean,
        default:false
    },

    password :{
        type:String,
    },
    tokens:[
        {
            token:{
                type:String,
            }
        }
    ]
})

// Hashing password-----------------------
userSchema.pre('save', async function(next){
    console.log('i am inside pre midleware....');
  if(this.isModified('password')){
      this.password = await bcrypt.hash(this.password, 12);
    //   this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});


// generate jsonwebtoken
userSchema.methods.generateAuthtoken = async function (){
    try {
        const token = jwt.sign({_id:this._id}, process.env.SICRET_KEY);
         this.tokens =  this.tokens.concat({token:token});
        await this.save();
        return token;
        
    } catch (error) {
        console.log(error)
    }
}

// store the message
userSchema.methods.addMessage = async function (presentAddHouseNo,presentAddHouseName,presentLaneNumber,presentAddRoadNo,presentAddPoliceStn,presentAddPostCode,presentAddDistrict){

    try {
        this.presentAddress = this.presentAddress.concat({
            presentAddHouseNo,
            presentAddHouseName,
            presentLaneNumber,
            presentAddRoadNo,
            presentAddRoadNo,
            presentAddPoliceStn,
            presentAddPostCode,
            presentAddDistrict
        });
        await this.save();
        return presentAddress;
    } catch (error) {
        console.log(error)
    } 
}
const User = mongoose.model('USER',userSchema);
module.exports = User;