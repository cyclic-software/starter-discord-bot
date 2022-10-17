
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID
const TOKEN = process.env.TOKEN
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID


const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');


const app = express();
// app.use(bodyParser.json());

const discord_api = axios.create({
	baseURL: 'https://discord.com/api/',
	timeout: 3000,
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
		"Access-Control-Allow-Headers": "Authorization",
		"Authorization": `Bot ${TOKEN}`
	}
});

const fs = require("node:fs");
const path = require("node:path");
const { Console } = require('node:console')
var commands = [];
var commandsArr = [];

const cmdPath = path.join(__dirname, "commands");
const cmdFile = fs.readdirSync(cmdPath)
	.filter(file => file.endsWith(".js"));
for (const file of cmdFile) {
	const filePath = path.join(cmdPath,file);
	const cmd = require(filePath);
	commands.push(cmd);
	commandsArr.push({
		name: cmd.name,
		description: cmd.description,
		options: cmd.options
	});
}
console.info(commands);
console.info("\n" + commandsArr);

app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
	const interaction = req.body;

	if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		const cmd = commands.get(interaction.data.name);
		if (!cmd) return;
		var resp;
		try {
			resp = commands.execute(interaction);
			return res.send(resp);
		} catch (e) {
			console.error(error);
		}
		// console.log(interaction.data.name)
		// if (interaction.data.name == 'yo') {
		// 	return res.send({
		// 		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		// 		data: {
		// 			content: `Yo ${interaction.member.user.username}!`,
		// 		},
		// 	});
		// }

		// if (interaction.data.name == 'dm') {
		// 	// https://discord.com/developers/docs/resources/user#create-dm
		// 	let c = (await discord_api.post(`/users/@me/channels`, {
		// 		recipient_id: interaction.member.user.id
		// 	})).data
		// 	try {
		// 		// https://discord.com/developers/docs/resources/channel#create-message
		// 		let res = await discord_api.post(`/channels/${c.id}/messages`, {
		// 			content: 'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
		// 		})
		// 		console.log(res.data)
		// 	} catch (e) {
		// 		console.log(e)
		// 	}

		// 	return res.send({
		// 		// https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
		// 		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		// 		data: {
		// 			content: '👍'
		// 		}
		// 	});
		// }
	}

});



app.get('/register_commands', async (req, res) => {
	let slash_commands = []
	try {
		// api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
		let discord_response = await discord_api.put(
			`/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
			commandsArr
		)
		console.log(discord_response.data)
		return res.send('commands have been registered')
	} catch (e) {
		console.error(e.code)
		console.error(e.response?.data)
		return res.send(`${e.code} error from discord`)
	}
})


app.get('/', async (req, res) => {
	return res.send('Follow documentation ')
})

app.get('/server_data', async (req, res) => {
	return await discord_api.get()
})


app.listen(8999, () => {

})

