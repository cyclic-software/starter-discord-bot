
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()

const express = require('express');


const app = express();
// app.use(bodyParser.json());




app.get('/', async (req,res) =>{
  return res.send('Follow documentation ')
})



const Discord = require("discord-user-bots");
const client = new Discord.Client(process.env.token);

client.on.ready = function () {
    console.log("Client online!");
    console.log("hereeee")
};

client.on.message_create = function (message) {
    console.log(message["author"]["username"] + ": " + message["content"]);
    answer = message["content"] + "-- ok"
    client.send(message["channel_id"], { content: answer, reply: message["id"] })
};

app.listen(8999, () => {

})
