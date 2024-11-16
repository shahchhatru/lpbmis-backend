const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mustbe = require('mustbe');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./src/models/index')
const mustBeConfig = require('./helpers/mustbeConfig');
mustbe.configure(mustBeConfig)

const app = express();

const server = require('http').createServer(app);
global.io = require('socket.io')(server);

const corsConfig = {
    credentials: true,
    origin: true
};

app.use(cors(corsConfig));
app.options('*', cors());

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser()); 
app.use(require('./helpers/authMiddleware'));
const PORT = process.env.PORT ||8085;

const {route} = require('./helpers/routes');
route(app);

server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});

