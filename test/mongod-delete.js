const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Users',{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log("Unbale to connect to mongodb server");
    }

    console.log("Connect to mongodb server");
    const db=client.db('Users');

    // var objId=new ObjectId("5c4d85670dff3c26bc592086");

    // db.collection('Users').deleteMany({name:'Nitin'}).then((result)=>{
    //     console.log(result)
    // })

    db.collection('Users').findOneAndDelete({_id:new ObjectID("5c4d85670dff3c26bc592087")}).then((result)=>{
        console.log(result);
    })

    client.close();
})