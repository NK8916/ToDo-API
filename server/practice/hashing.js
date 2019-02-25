const {SHA256}=require("crypto-js");
const jwt=require("jsonwebtoken");

var data={
    id:10
}


var token=jwt.sign(data,'123abc');

var decoded=jwt.verify(token,'123abc');
console.log(decoded);


// var token={
//     data,
//     hash:SHA256(JSON.stringify(data)+'somesecret')
// }

