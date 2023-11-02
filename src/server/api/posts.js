const express = require('express');
const postsRouter = express.Router();

const prisma = require('../../../client');

const { requireUser } = require('./utils');

//get all posts
postsRouter.get('/', async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany();
        res.send({posts});
    } catch(e) {
        console.error(e);
    } next();
});

//get one post
  postsRouter.get('/:id', async (req,res,next) =>{
    try{
        const postById = await prisma.post.findUnique({
            where:{
                id: Number(req.params.id)
            }
        });
        res.send({post: postById})
    }catch({ name, message }){
        next({ name, message });
    }
  })


postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content = "" } = req.body;

  const postData = {};

  try {
    postData.authorId = req.user.id;
    postData.title = title;
    postData.content = content;

    const post = await prisma.post.create({
        data: {
            authorId: req.user.id,
            title,
            content
        }
    });

    if (post) {
      res.send(post);
    } else {
      next({
        name: 'PostCreationError',
        message: 'There was an error creating your post. Please try again.'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/users
postsRouter.delete('/:id', requireUser, async (req, res, next) => {
    const post = await prisma.post.delete({
        where: {
            id: Number(req.params.id)
        }
    })
    res.send({post})
})

module.exports = postsRouter;