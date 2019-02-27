var express=require('express');
var bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');
const bcrypt=require('bcryptjs');
var {mongoose}=require('./db/mongoose');
var {ToDo}=require('./models/ToDo');
var {User}=require('./models/User');
var _=require('lodash');
var {authenticate}=require('./middleware/authenticate');


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

app.delete('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }

    ToDo.findByIdAndRemove(id).then((todo)=>{
        if(todo){
            return res.send(todo);
        }

        res.status(404).send();
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.patch('/todos/:id',(req,res)=>{
    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id))
    {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt=new Date().getTime(); 
    }
    else{
        body.completed=false;
        body.completedAt=null;
    }

    ToDo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e)=>{
        res.status(404).send();
    })
})

app.post('/users',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    var user= new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
      }).then((token)=>{
          res.header('x-auth',token).send(user);
      }).catch((e) => {
        res.status(400).send(e);
      })
})

app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
})

// app.post('/users/login',(req,res)=>{
//     var body=_.pick(req.body,['email','password']);
//     console.log(body);
//     User.find({email:body.email}).then((user)=>{
//         console.log(user[0].password);
//         bcrypt.compare(body.password,user[0].password,(err,resStatus)=>{
//             if(!resStatus){
//                return res.status(401).send();
//             }

//             res.send({body});
//         })
//     }).catch((e)=>{
//         res.status(401).send(e);
//     })
// })


app.post('/users/login',(req,res)=>{
    var body=_.pick(req.body,['email','password']);

    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    });
})

app.listen(port,()=>{
    console.log("Listening");
})

module.exports={app};