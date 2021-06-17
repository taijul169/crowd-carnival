const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const request = require('request')

require('../db/conn');
const User = require('../model/userSchema');
const PresentAdd = require('../model/presentAddSchema');
const PermanantAdd = require('../model/permanantAddSchema');
const Verify = require('../model/verify');



router.get('/',(req, res)=>{
    res.send("this is home page");
})

router.get('/about',authenticate, (req,res)=>{
    res.send(req.rootUser)
});
//logout page
router.get('/logout', (req,res)=>{
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send("User Logged Out")
});
// get user data for hompage and contact page
router.get('/getdata',authenticate, (req,res)=>{
    res.send(req.rootUser)
})

// signup-route=====================
router.post('/register',(req, res)=>{
   const {name, email, phone, work, password, cpassword } = req.body;
   if(!name || !email || !phone || !work || !password || !cpassword){
       res.status(422).json({error:'all the filed must be filled with data.!!'})
   }
   User.findOne({email:email}).then((userExist)=>{
       if(userExist){
           return res.status(422).json({error:'Email already exist'});
       }
       const user = new User({name,email,phone,work,password, cpassword});
       user.save().then(()=>{
           res.status(201).json({message:'User Registered successfully'})
       }).catch(()=>{
           res.status(500).json({error:'Registration Failed!!'});
       })
   })
})


// signin-route=====================
router.post('/signin', async(req, res)=>{

    try {
        let token;
        const {email,  password } = req.body;
        if( !email || !password){
            res.status(422).json({error:'all the filed must be filled with data.!!'});
        }
        const existEmail = await User.findOne({email:email});
        if(existEmail){
            const passMatch = await bcrypt.compare(password, existEmail.password);
             token = await existEmail.generateAuthtoken();
             res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+259000000),
                httpOnly:true
            });
            console.log('cookie created successfully.');

            if(passMatch){
                res.status(200).json({Message:'Your are Logged in'});
                
                
            
            }
            else{
                res.status(400).json({error:'Wrong password!!'})
            }
        }
        else{
            res.status(400).json({error:"Email Dosen't exist"});
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
   
 });
// sending data to server in contct page
// get user data for hompage and contact page
router.post('/contact',authenticate, async(req,res)=>{
    try {
        const {name, email,phone,message} = req.body;
        if(!name || !email || !phone || !message){
            return res.json({error:"pLz fillup the field!!"});
        }
        const userContact = await User.findOne({_id:req.userID});
        if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message)
            await userContact.save();
            res.status(201).json({message:"Message sent successfully."})
        }
    } catch (error) {
        console.log(error);
    }
})


//========================================================= CROWD FUNDING START==================================================================

// ========================================================
// signup route
// ========================================================
router.post('/signup', async(req,res)=>{
        
        try {
            const { 
                refereeId,
                firstName,
                lastName,
                userId,
                dateOfBirth,
                password,
                perPhoneOne,
                presentAddHouseNo,
                presentAddHouseName,
                presentLaneNumber,
                presentAddRoadNo,
                presentAddPoliceStn,
                presentAddVillage,
                presentAddUpozella,
                presentAddPostCode,
                presentAddDistrict ,
                permanantAddHouseNo,
                permanantAddHouseName,
                permanantLaneNumber,
                permanantAddRoadNo,
                permanantAddPoliceStn,
                permanantAddVillage,
                permanantAddUpozella,
                permanantAddPostCode,
                permanantAddDistrict

            } = req.body;
            const userExist = await  User.findOne({refereeId:refereeId})
            if(userExist){
                const refereeId = userExist.refereeId;
                const user = new User({firstName,lastName,userId,perPhoneOne,dateOfBirth,password});
                const presentadd = new PresentAdd({perPhoneOne,presentAddHouseNo,presentAddHouseName,presentLaneNumber,presentAddRoadNo,presentAddPoliceStn,presentAddVillage,presentAddUpozella,presentAddPostCode,presentAddDistrict});
                const verify = new Verify({refereeId})
                const permanantadd = new PermanantAdd({perPhoneOne,permanantAddHouseNo,permanantAddHouseName,permanantLaneNumber,permanantAddRoadNo,permanantAddPoliceStn,permanantAddVillage,permanantAddUpozella,permanantAddPostCode,permanantAddDistrict});
                const  token = await user.generateAuthtoken();
                res.cookie("jwtoken",token,{
                    expires:new Date(Date.now()+259000000),
                    httpOnly:true
                });
                user.save(); 
                presentadd.save();
                permanantadd.save();
                verify.save();
                res.status(201).json({message:'User Registered successfully'})
                res.redirect(`verify?refId=${refereeId}`);
            }
            else{
                console.log("refereeId Not Found!!!")
            }
            
        } catch (error) {
            console.log(error)
            
        }
       
            //  presentAddHouseNo,
            //  presentAddHouseName,
            //  presentLaneNumber,
            //  presentAddRoadNo,
            //  presentAddPoliceStn,
            //  presentAddVillage,
            //  presentAddUpozella,
            //  presentAddPostCode,
            //  presentAddDistrict,
            //  permanantAddHouseNo,
            //  permanantAddHouseName,
            //  permanantLaneNumber,
            //  permanantAddRoadNo,
            //  permanantAddPoliceStn,
            //  permanantAddVillage,
            //  permanantAddUpozella,
            //  permanantAddPostCode,
            //  permanantAddDistrict,
             
           
           
       
            // User.findOne({refNum:refNum}).then((userExist)=>{
            //     if(userExist){
            //         return res.status(422).json({error:'Email already exist'});
            //     }
            //     if(refNum){
            //         const user = new User({refNum,firstName,lastName,dateOfBirth,password});   
            //         user.save().then(()=>{
            //             res.status(201).json({message:'User Registered successfully'})
            //             res.redirect(`verify?mob=88${refNum}`);
                        
            //         }).catch(()=>{
            //             res.status(500).json({error:'Registration Failed!!'});
            //         })
            //         token = await user.generateAuthtoken();
            //         res.cookie("jwtoken",token,{
            //             expires:new Date(Date.now()+259000000),
            //             httpOnly:true
            //         });

            //     }
            //     else{
            //         res.json({Message:"field must not be empty"})
            //     }
                
            // });
        
        
     
});

// ========================================================
// verify route
// ========================================================
router.get ('/verify/', async(req, res)=>{

    const refereeId =  req.query.refId;
    try {
     const ReferenceData  = await User.findOne({refereeId:refereeId})
     const VeriData  = await Verify.findOne({refereeId:refereeId})
     const SECURITY_CODE = VeriData.verificationCode;
     console.log(ReferenceData)
     const mob =  ReferenceData.perPhoneOne;
     const RANDOM_NUM = Math.round((Math.random()*1000000));
   //From api documentation-----------------------
    var options = { method: 'POST',
    url: 'http://api.icombd.com/api/v3/sendsms/plain',
    headers: 
    { 'content-type': 'application/x-www-form-urlencoded' },
    form: 
    { user: 'tariqkhan',
    password: '100200300', sender: '03590001944',
    text: `Crowd Funding Verification code:${SECURITY_CODE}`,
    to: '88'+mob } };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    })
    res.cookie('Key', RANDOM_NUM,{
        expires:new Date(Date.now()+259000000),
        httpOnly:true
    })
    console.log('cookie has been set to your browser')
    req.refereeId =  refereeId;
    res.send();
    res.redirect(`verifyphone?refId=${req.refereeId}`);
    } catch (error) {
        console.log(error);
    }
    
    // res.json({message:"code has been sent to your number"}) 
});

// ========================================================
// verifyphone route
// ========================================================
router.post ('/verifyphone/', async(req, res)=>{
  
    const refereeId = req.query.refId;
    try {
       const  verifyData = await Verify.findOne({refereeId});
       const veryCodeDB = verifyData.verificationCode;
       const {veriCode} = req.body;
       if(veryCodeDB === veriCode){
            res.status(200).json({error:'code  matched!!'});
            res.redirect(`/dashboard`);
       }
    } catch (error) {
        console.log(error);
        
    }

   
//    const KEY =  req.cookies.Key;
//    console.log(KEY);
//    try {
//     const {veriCode} = req.body;
//     if(veriCode === KEY){
//         res.status(200).json({error:'code  matched!!'});
//         res.redirect(`/dashboard`);
//     }
//     else{
//         res.status(500).json({error:'code did not match!!'});
//         res.redirect(`/verifyphone`);
//         console.log("code dosent match!!")
//     }
    
// } catch (error) {
//     console.log(error);
    
// } 
});
// ========================================================
// updateinfo
// ========================================================
router.post('/updateinfo',authenticate, async(req,res)=>{
    try {
        const {
            presentAddHouseNo,
            presentAddHouseName,
            presentLaneNumber,
            presentAddRoadNo,
            presentAddPoliceStn,
            presentAddVillage,
            presentAddUpozella,
            presentAddPostCode,
            presentAddDistrict,
            // permanantAddHouseNo,
            // permanantAddHouseName,
            // permanantLaneNumber,
            // permanantAddRoadNo,
            // permanantAddPoliceStn,
            // permanantAddVillage,
            // permanantAddUpozella,
            // permanantAddPostCode,
            // permanantAddDistrict,
        } = req.body;
        const specificUser = await User.findOne({_id:req.userID});
        if(specificUser){
                const userMessage = await specificUser.addMessage(
                presentAddHouseNo,
                presentAddHouseName,
                presentLaneNumber,
                presentAddRoadNo,
                presentAddPoliceStn,
                presentAddVillage,
                presentAddUpozella,
                presentAddPostCode,
                presentAddDistrict
                )
            await specificUser.save();
            res.status(201).json({message:"Information Updated Successfully"})
        }
    } catch (error) {
        console.log(error);
    }
})
router.get('/updateinfo',authenticate, async(req,res)=>{
    res.send(req.rootUser)
})
// dashboard route
router.get('/dashboard',authenticate, async(req,res)=>{
    // res.write(req.presentaddress)
    res.status(201).send(req.allData)
})


// ========================================================
// User Verification By Admin
// =======================================================

router.get('/request-list', authenticate, async(req, res)=>{
    try {
        const Users =  await User.find();
        req.Users =  Users;
        if(Users){
            res.status(200).send(req.Users);
            res.redirect(`/verify-user?key=${Users._id}`);
        }
        else{
            res.status(404).json({message:'Data not found!!'})
        }
    } catch (error) {
        console.log(error)
        

    }

})


router.post('/verify-user/', authenticate, async(req, res)=>{
    try {
   
        const key =  req.query.key;
        const myquery={_id:key}
        var newValues = { $set:{
            verify:true
            
            }
        }
        const updateResult =  await User.findByIdAndUpdate(myquery,newValues,{
            useFindAndModify:false
        });
        if(updateResult){
            res.send({message:"updated"})
        }
    console.log(updateResult)
    } catch (error) {
        console.log(error)
        
    }

})
//=================== CROWD FUNDING END================================



module.exports =  router;