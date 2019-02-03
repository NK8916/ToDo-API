var express=require('express');
var bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');
var {mongoose}=require('./db/mongoose');
var {ToDo}=require('./models/ToDo');
var {Users}=require('./models/User');

var app=express();
app.use(bodyParser.json());

var port=process.env.PORT||3000;

app.post('/todos',(req,res)=>{
    var todo=new ToDo({
        text:req.body.text
    });
    console.log(req.body);

    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});


app.get('/todos',(req,res)=>{
    ToDo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    });
})

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }

    ToDo.findById(id).then((todo)=>{
        if(todo)
        {
           return res.send({todo});
        }

        res.status(404).send()
    },(e)=>{
        res.status(400).send();
    })
})

app.listen(port,()=>{
    console.log("Listening");
})

module.exports={app};