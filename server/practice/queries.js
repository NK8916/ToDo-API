const Users=require('../models/Users');
const mongoose=require('../db/mongoose');

var id='5c520ee00371751eb417fae3';

Users.find({
    _id:id
}).then((user)=>{
    console.log(user);
})



// Users.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log("Id not found");
//     }

//     console.log("ToDo By ID",todo)
// }).catch((e)=>console.log(e));