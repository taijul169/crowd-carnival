const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const permanantAddSchema = new mongoose.Schema({
        perPhoneOne:{
           type:String
       },
        permanantAddHouseNo:{
            type:String
        },
        permanantAddHouseName:{
            type:String
        },
        permanantLaneNumber:{
            type:String
        },
        permanantAddRoadNo:{
            type:String
        },
        permanantAddPoliceStn:{
            type:String
        },
        permanantAddVillage:{
            type:String
        },
        permanantAddUpozella:{
            type:String
        },
        permanantAddPostCode:{
            type:String
        },
        permanantAddDistrict:{
            type:String
        },
})


const PermanantAdd = mongoose.model('PERMANANTADD',permanantAddSchema);
module.exports = PermanantAdd;