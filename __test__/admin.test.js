const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../models');
const { queryInterface } = sequelize;
const { hashPassword } = require('../helpers/passwordHandler');
const { generateToken } = require('../helpers/tokenHandler');
const { expect } = require('@jest/globals');

let id1;
let username1;
let password1 = 'administrator';
let email1;
let role1;
let access_token1;

let id2;
let username2;
let password2 = `11223344`;
let email2;
let role2;
let access_token2;



beforeAll(async done => {
    const user = [
        {
            username: 'administrator',
            email: 'admin@showcarpedia.com',
            role: 'superAdmin',
            password: hashPassword('administrator'),
            delete: false,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            username: 'jeremiah',
            email: 'jere@mail.com',
            role: 'admin',
            password: hashPassword('11223344'),
            delete: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    try {
        const data = await queryInterface.bulkInsert('Users', user, { returning: true });
        
        id1 = data[0].id
        username1 = data[0].username;
        email1 = data[0].email;
        password1 = data[0].password;
        role1 = data[0].role;
        access_token1 = await generateToken({
            id: id1,
            email: email1,
            role: role1
        });

        id2 = data[1].id
        username2 = data[1].username;
        email2 = data[1].email;
        password2 = data[1].password;
        role2 = data[1].role;
        access_token2 = await generateToken({
            id: id2,
            email: email2,
            role: role2
        });

        done();
    } catch (error) {
        done(error)      
    }
    // console.log(access_token, `this is the token`);
});

afterAll(async done => {
    try {
        await queryInterface.bulkDelete('Users', null, { truncate: true, cascade: true });
        done();
    } catch (error) {
        done(error);
    }
});

// GET admin list
describe('GET /v1/admin', () => {
    test('TEST CASE 1: [SUCCESS] Get Admin List -- Super Admin', done => {
        request(app)
            .get('/v1/admin')
            .set('Cookie', [`access_token=${access_token1}`])
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(201);
                done();
            });
    });

    test('TEST CASE 2: [SUCCESS] Get Admin List -- Wrong Authorization', done => {
        request(app)
            .get('/v1/admin')
            .set('Cookie', [`access_token=${access_token2}`])
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(201);
                done();
            });
    });

    test('TEST CASE 3: [FAIL] Get Admin List -- No Login', done => {
        request(app)
            .get('/v1/admin')
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(404);
                expect(body).toHaveProperty('message', 'Please Login!');
                done();
            });
    });
});

// POST Create Admin Account
describe('POST /v1/admin/register', () => {
    test('TEST CASE 1: [SUCCESS] Register Admin', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', [`access_token=${access_token1}`])
            .send({
                username: 'alexgoz',
                email: 'alex@mail.com',
                password: '11223344',
            })
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(201);
                done();
            });
    });

    test('TEST CASE 2: [FAIL] Register Admin -- No Data Sended', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', [`access_token=${access_token1}`])
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(500);
                done()
            });
    });

    test('TEST CASE 3: [FAIL] Register Admin -- Existed Username', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', [`access_token=${access_token1}`])
            .send({
                username: 'jeremiah',
                email: 'jeremiah@mail.com',
                password: `11223344`
            })
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(409);
                expect(body).toHaveProperty('message', 'Username is already exists');
                done();
            });
    });

    test('TEST CASE 4: [FAIL] Register Admin -- Existed Email', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', [`access_token=${access_token1}`])
            .send({
                username: 'jereh',
                email: 'jere@mail.com',
                password: '11223344'
            })
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(409);
                expect(body).toHaveProperty('message', 'Email is already taken');
                done();
            });
    });

    test('TEST CASE 5: [FAIL] Register Admin -- Wrong Validation -- Username less than 5 characters', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', `access_token=${access_token1}`)
            .send({
                username: 'alex',
                email: 'a@mail.com',
                password: '11223344'
            })
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(500);
                expect(body).toHaveProperty('message', 'body.username must be at least 5 characters');
                done();
            });
    });

    test('TEST CASE 6: [FAIL] Register Admin -- Wrong Validation -- Empty Username', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', `access_token=${access_token1}`)
            .send({
                email: 'a@mail.com',
                password: '11223344'
            })
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(500);
                expect(body).toHaveProperty('message', 'body.username is a required field');
                done();
            });
    });

    test('TEST CASE 7: [FAIL] Register Admin -- Wrong Validation -- Empty Email', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', `access_token=${access_token1}`)
            .send({
                username: 'alexgoz',
                password: '11223344'
            })
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(500);
                expect(body).toHaveProperty('message', 'body.email is a required field');
                done();
            });
    });

    test('TEST CASE 8: [FAIL] Register Admin -- Wrong Validation -- Empty Password', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', `access_token=${access_token1}`)
            .send({
                username: 'alexgoz',
                email: 'a@mail.com',
            })
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(500);
                expect(body).toHaveProperty('message', 'body.password is a required field');
                done();
            });
    });

    test('TEST CASE 9: [FAIL] Register Admin -- Wrong Validation -- Password is less than 5 characters', done => {
        request(app)
            .post('/v1/admin/register')
            .set('Cookie', `access_token=${access_token1}`)
            .send({
                username: 'alexgoz',
                email: 'a@mail.com',
                password: '1122'
            })
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(500);
                expect(body).toHaveProperty('message', 'body.password must be at least 5 characters');
                done();
            });
    });

    test('TEST CASE 10: [FAIL] Register Admin -- Wrong Authorization', done => {
        request(app)
            .post('/v1/api/register')
            .set('Cookie', `access_token=${access_token2}`)
            .send({
                username: 'alexgoz',
                email: 'a@mail.com',
                password: '11223344'
            })
            .end((error, res) => {
                if (error) done(error);
                const { status, body } = res;
                expect(status).toBe(404);
                done();
            })
    })
})


// GET Edit Admin Form
describe('GET /v1/admin/edit/:id', () => { 
    test('TEST CASE 1: [SUCCESS] Get Edit Admin Form', done => { 
        request(app)
            .get(`/v1/admin/edit/${id2}`)
            .set('Cookie', `access_token=${access_token1}`)
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(201);
                done();
            });
    });

    test('TEST CASE 2: [FAIL] Get Edit Admin Form -- Wrong Authorization', done => {
        request(app)
            .get(`/v1/admin/edit/${id2}`)
            .set('Cookie', `access_token=${access_token2}`)
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(401);
                expect(body).toHaveProperty('message', 'You are not supposed to be here, homie');
                done();
            });
    });
        
    test('TEST CASE 3: [FAIL] Get Edit Admin Form -- No Authentication', done => {
        request(app)
            .get(`/v1/admin/edit/${id2}`)
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(404);
                expect(body).toHaveProperty('message', 'Please Login!');
                done();
            });
    });
 });


 const update = {
    username: 'godjirah',
    email: 'godjirah@mail.com',
    password: '1122334455'
 }

// PUT Edit Admin Form
describe('PUT /v1/admin/edit/:id', () => {
    test(`TEST CASE 1: [SUCCESS] Update Admin`, done => {
        request(app)
            .put(`/v1/admin/edit/${id2}`)
            .set('Cookie', `access_token=${access_token1}`)
            .send(update)
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(201);
                expect(body).toHaveProperty('message', 'Updating Success');
                done();
            });
    });

    test('TEST CASE 2: [FAIL] Update Admin -- Wrong Validation', done => {
        request(app)
            .put(`/v1/admin/edit/${id2}`)
            .set('Cookie', `access_token=${access_token2}`)
            .send(update)
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(401);
                expect(body).toHaveProperty('message', 'You are not supposed to be here, homie');
                done();
            });
    });

    test('TEST CASE 3: [FAIL] Update Admin -- No Data Sended', done => {
        request(app)
            .put(`/v1/admin/edit/${id2}`)
            .set('Cookie', `access_token=${access_token1}`)
            .end((error, res) => {
                if (error) done(error);
                const { status, body } = res;
                console.log(status, body);
                expect(status).toBe(500);
                done();
            });
   });
});


// DELETE Admin
describe('DELETE /v1/admin/delete/:id', () => {
    test('TEST CASE 1: [SUCCESS] Delete Admin', done => { 
        request(app)
            .delete(`/v1/admin/delete/${id2}`)
            .set('Cookie', `access_token=${access_token1}`)
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(201);
                expect(body).toHaveProperty('message', 'User Deleted');
                done();
            });
     });

    test('TEST CASE 2: [FAIL] Delete Admin -- Wrong Authorization', done => {
        request(app)
            .delete(`/v1/admin/delete/${id2}`)
            .set('Cookie', `access_token=${access_token2}`)
            .end((error, res) => {
                if (error) return done(error);
                const { status, body } = res;
                expect(status).toBe(409);
                expect(body).toHaveProperty('message', 'You are not supposed to be here, homie');
                done();
            });
    });
});
