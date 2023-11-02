const express = require('express');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');

const SALT_COUNT = 10;


// GET /api/users
usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await prisma.user.findMany();
        users.forEach(user => delete user.password);
        res.send({users});
    } catch(e) {
        console.error(e);
    }
})

// GET /api/users/:id
usersRouter.get('/:id', async (req, res, next) => {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: Number(req.params.id),
            },
        })
        delete user.password;
        res.send({user});
    } catch(e) {
        console.error(e);
    }
})


// POST /api/users create new user
usersRouter.post('/register', async (req, res, next) => {
    const {username, name, password, location} = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            name,
            location,
        }
    });

    if (!user) {
      next({
        name: 'UserCreationError',
        message: 'There was a problem registering. Please try again.',
      });
    } else {
      delete user.password;
      
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: '1w' }
      );

      res.send({
        user, 
        message: "Account created!",
        token,
      });
    }

});


//login users
usersRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentials",
            message: "You supply username and password to login"
        })
    } else  {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            }
        });
        if(!user) {
            next({
            name: 'UserNotFound',
            message: 'User with that username does not exist',
            });
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    next({
                        name: 'InvalidCredentials',
                        message: 'Password entered is not correct',
                    });
                } else {
                    delete user.password;
                    const token = jwt.sign({id: user.id}, JWT_SECRET);
                    res.send({user, token});
                }
            });
        }
    }
});



// DELETE /api/users
usersRouter.delete('/:id', async (req, res, next) => {
    const user = await prisma.user.delete({
        where: {
            id: Number(req.params.id)
        }
    })
    delete user.password;
    res.send({user})
})


module.exports = usersRouter;