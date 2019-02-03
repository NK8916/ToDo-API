const expect =require('expect');
const request=require('supertest');
const {app}=require('./../server');
const {ToDo}=require('./../models/ToDo');
const {ObjectID}=require('mongodb');


const todos=[{
    _id:new ObjectID,
    text:'First Test'
},{ 
    _id:new ObjectID,
    text:'Second Test'
}];

beforeEach((done)=>{
    ToDo.remove({}).then(()=>{
        return ToDo.insertMany(todos);
    }).then(()=>done()).catch((e)=>done(e));
});



describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        var text='Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err)
            {
                return done(err);
            }

            ToDo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        })
    })
})

it('should not create todo with invalid body data',(done)=>{
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>{
        if(err){
            return done(err);
        }
        ToDo.find().then((todos)=>{
            expect(todos.length).toBe(2);
            done();
        }).catch((e)=>done(e));
    })
})


describe('GET /todos',()=>{
    it('should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    })
});


describe('GET /todos/:id',()=>{
    it('Should return todo doc',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should return 404 if todo not found',(done)=>{
        var hex=new ObjectID().toHexString();

        request(app)
        .get(`/todos/${hex}`)
        .expect(404)
        .end(done);
    });

    it('Should return 404 for non-object ids',(done)=>{
        request(app)
        .get('/todos/123abc')
        .expect(404)
        .end(done);
    })
})