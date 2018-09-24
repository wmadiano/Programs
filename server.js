const http = require('http');
const app = require('./app');
const port = process.env.port || 80;
const server = http.createServer(app);
server.listen(port);