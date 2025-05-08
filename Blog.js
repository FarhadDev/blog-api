const express = require('express');
const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();

class BlogPost {
    constructor({ title, content, author }) {
        this.title = title;
        this.content = content;
        this.author = author;
    }
}

//in-memory storage for storing the blog
const blogPostContainer = [];
let nextId = 1;


const blogPostSchema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(10).required(),
    author: Joi.string().required()

})

//post route for creating new blog post
router.post('/posts', (req, res) => {
    const { error } = blogPostSchema.validate(req.body);

    //checking for validation error
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }

    //input sanitization for HTML content
    const sanitizedData = {
        title: sanitizeHtml(req.body.title, { allowedTags: [], allowedAttributes: {} }),
        content: sanitizeHtml(req.body.content, { allowedTags: [], allowedAttributes: {} }),
        author: sanitizeHtml(req.body.author, { allowedTags: [], allowedAttributes: {} })
    };

    const newBlogPost = new BlogPost(sanitizedData);
    newBlogPost.createdAt = new Date();
    newBlogPost.id = nextId++;

    //formatting response data
    const responsePost = {
        id: newBlogPost.id,
        title: newBlogPost.title,
        content: newBlogPost.content,
        author: newBlogPost.author,
        createdAt: newBlogPost.createdAt
    };

    //saving blog post in in-memory storage
    blogPostContainer.push(responsePost);

    res.status(201).json({ message: 'Blog Post Create Successfully', blogPost: responsePost });
})

//get route for individual blog by the blog id
router.get('/posts/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const blogPost = blogPostContainer.find(post => post.id === blogId);

    if (!blogPost) {
        return res.status(404).json({ error: `Blog post with ${blogId} not found` })
    }

    res.status(200).json(blogPost);
})

module.exports = router;