const mongoose=require("mongoose");

mongoose.Promise=global.Promise;
mongoose.connect(process.env.MONGODBURL||'mongodb://localhost:27017/ToDoApp',{ useNewUrlParser: true });


module.exports={mongoose};