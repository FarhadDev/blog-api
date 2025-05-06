const express = require('express');
const app = express();
app.use(express.json());

const blogRoute = require('./Blog');
app.use(blogRoute);

app.listen(3000, () => { console.log('Server is running...') })