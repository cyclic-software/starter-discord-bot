require('dotenv').config()
const TOKEN = process.env.TOKEN;
const APP_ID = process.env.APPLICATION_ID;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const GUILD_ID = process.env.GUILD_ID;

const { REST, Routes, Client, GatewayIntentBits, SlashCommandBuilder, CommandInteractionOptionResolver } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { testCall, RequestHandler, commands } = require("./myTools");

const express = require('express');
const bodyParser = require('body-parser');


const app = express();

// starting the bot
client.login(TOKEN);

// initializing the bot
client.on("ready", async () => {
    await init();
    // await testCall();
    console.log(`[${client.user.tag}] Firing With V Cylinders!`);
});


app.get('/', async (req,res) =>{
  return res.send('up and running ')
})



const env_Values = `
Token: ${TOKEN}
APP ID: ${APP_ID}
Public Key: ${PUBLIC_KEY}
Guild ID: ${GUILD_ID}
`;


/*
challenges:
    grabing user prompt for bot
*/


// initiallizing commands and registering them
async function init()
{
    // establish api connection with discord
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    // assign commands to bot
    try 
    {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(APP_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    }
    catch (err)
    {
        console.error(err);
    }
}



app.listen(8999, () => {
    console.log(env_Values);
    /*
        responds to all defined commands
        you can see what response each command maps to in RequestHandler class in myTools.js  
    */
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        /*
        discord requires bots to reply within 3 seconds or defer the response
        there are cases where we are going to need more than 15 seconds so we will reply and then edit the reply when the api call has responded
        */

        // generic response to satisefy discords 3s response rule
        await interaction.reply("gimmie a sec");

        const failedRequest = 500;
        const handler = new RequestHandler(interaction);
        const command = interaction.commandName;
        const botResponse = await handler.respond(command);

        console.log(`Response: ${botResponse}`);

        // sucessful response 
        await interaction.editReply(botResponse);
                
    });
})