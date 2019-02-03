const {User}=require('./../server/models/User');
const {mongoose}=require('./../server/db/mongoose');
const {ToDo}=require('./../server/models/ToDo');

var id='5c549e8dc13ad686c4f05052';

ToDo.find({
    _id: id
  }).then((todos) => {
    console.log('Todos', todos);
  });

// User.find({
//     _id:id
// }).then((users)=>{
//     console.log(users);
// })



ToDo.findById(id).then((todo)=>{
    if(!todo){
        return console.log("Id not found");
    }

    console.log("ToDo By ID",todo)
}).catch((e)=>console.log(e));