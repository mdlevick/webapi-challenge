const express = require('express');
const helmet = require('helmet') 
const logger = require('./api/logger.js');

const projectRouter = require('./data/helpers/projectRouter.js');

const server = express();

server.use(helmet());
server.use(express.json()); 



server.get('/', logger('logger for server.js'), (req, res) => {
  res.send(`<h2>Target acquired!</h2>`)
});


server.use('/api/projects', projectRouter);



module.exports = server;