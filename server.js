const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./api/logger.js');

const projectRouter = require('./data/helpers/projectRouter.js');
const actionRouter = require('./data/helpers/actionRouter.js');

const server = express();

server.use(helmet());
server.use(express.json()); 
server.use(cors());



server.get('/', logger('logger for server.js'), (req, res) => {
  res.send(`<h2>Target acquired!</h2>`)
});


server.use('/api/projects', logger('logger for projects'), projectRouter);

server.use('/api/actions', logger('logger for actions'), actionRouter);



module.exports = server;