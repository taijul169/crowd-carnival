const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const presentAddSchema = new mongoose.Schema({
        perPhoneOne:{
           type:String
       },
        presentAddHouseNo:{
            type:String
        },
        presentAddHouseName:{
            type:String
        },
        presentLaneNumber:{
            type:String
        },
        presentAddRoadNo:{
            type:String
        },
        presentAddPoliceStn:{
            type:String
        },
        presentAddVillage:{
            type:String
        },
        presentAddUpozella:{
            type:String
        },
        presentAddPostCode:{
            type:String
        },
        presentAddDistrict:{
            type:String
        },
})


const PresentAdd = mongoose.model('PRESENTADD',presentAddSchema);
module.exports = PresentAdd;