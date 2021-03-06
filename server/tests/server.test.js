const expect = require('expect');
const request = require('supertest');
const { app } = require('./../server');
const { ToDo } = require('./../models/ToDo');
const { ObjectID } = require('mongodb');
const _=require('lodash');

var todos = [{
    _id: new ObjectID,
    text: 'First Test'
}, {
    _id: new ObjectID,
    text: 'Second Test'
}];

beforeEach((done) => {
    ToDo.remove({}).then(() => {
        return ToDo.insertMany(todos);
    }).then(() => done()).catch((e) => done(e));
});



describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                ToDo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    })
})

it('should not create todo with invalid body data', (done) => {
    request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            ToDo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        })
})


describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});


describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        var hex = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hex}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done);
    })
})


describe('DELETE /todos/:id', () => {
    it('Should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                ToDo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });

    });

    it('should return 404 if todo not found', (done) => {
        var hex = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hex}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done);
    })

});

describe('PATCH todos/:id',()=>{
    it('should update the todo',(done)=>{
        var hexId=todos[0]._id.toHexString();
        var text='New Text';

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed:true,
            text:text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('Number');
        })
        .end(done)
    })

    it('should clear completedAt when todo is not completed',(done)=>{
        var hexId=todos[1]._id.toHexString();
        var text='This should be the new text';

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed:false,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done)
    })
})