const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const PresentAdd = require('../model/presentAddSchema');


const Authenticate = async(req,res, next)=>{
  try {
      const token = req.cookies.jwtoken;
      const verifyToken = jwt.verify(token, process.env.SICRET_KEY);
      const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token});
      const perPhoneOne = rootUser.perPhoneOne;
      const presentaddress = await PresentAdd.findOne({perPhoneOne});
      if(!rootUser){throw new Error("User not found!!")}
      req.token = token;
      req.rootUser = rootUser;
      req.userID = rootUser._id;
      req.presentaddress = presentaddress;
      req.allData = [rootUser,presentaddress]
      next(); 
  } catch (error) {
      res.status(401).send('Unauthorized:No token Provided!')
     console.log(error); 
  }
}
module.exports = Authenticate;
