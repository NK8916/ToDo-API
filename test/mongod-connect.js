const MongoClient=require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/Users',{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log("Unbale to connect to mongodb server");
    }

    console.log("Connect to mongodb server");
    const db=client.db('Users');

    // db.collection('ToDoApp').insertOne({
    //     text:'Some Data',
    //     completed: false
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable To Insert Data',err);
    //     }

    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    // db.collection('Users').insertOne({
    //     name:'Nitin',
    //     Age:'23',
    //     Location:'New Delhi'
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to insert data',err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    db.collection('Users').find({name:'Nitin'}).count().then((count)=>{

        console.log(`ToDo count:${count}`);
    },(err)=>{
        console.log("Unable to find");
    })

    db.collection('Users').find({name:'Nitin'}).toArray().then((db)=>{

        console.log(db);
    },(err)=>{
        console.log("Unable to find");
    })

    client.close();
})