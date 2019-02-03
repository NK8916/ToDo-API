const {MongoClient,ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Users',{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log("Unbale to connect to mongodb server");
    }

    console.log("Connect to mongodb server");
    const db=client.db('Users');

    db.collection('Users').findOneAndUpdate({
        _id:new ObjectID("5c50ae0882a760f5145c26fd")
    },{
        $set:{name:'Honey1'},
        $inc:{Age:1}
    },{
        returnOriginal:false
    }).then((result)=>{
        console.log(result);
    })

   

    client.close();
})