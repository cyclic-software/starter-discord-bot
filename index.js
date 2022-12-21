// https://discord.com/developers/docs/resources
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID
const TOKEN = process.env.TOKEN
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID

const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');

const app = express();
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
var commands = [];
var commandsArr = [];

const cmdPath = path.join(__dirname, "commands");
const cmdFile = fs.readdirSync(cmdPath)
	.filter(file => file.endsWith(".js"));
for (const file of cmdFile) {
	const filePath = path.join(cmdPath, file);
	const cmd = require(filePath);
	commands.push(cmd);
	commandsArr.push({
		name: cmd.name,
		description: cmd.description,
		options: cmd.options
	});
}

// Interaction
app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
	const interaction = req.body;

	if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		var x = false;
		commands.forEach(e => {
			if (interaction.data.name == e.name) {
				cmd = e;
				x = true;
			} else if (!x) {
				cmd = null;
			}
		});
		if (!x) {
			return res.send({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: `Sorry ${interaction.member.user.username}, I don't know what '${interaction.data.name}' is.`,
				},
			})
		}
		try {
			await cmd.execute(interaction, res);
			return;
		} catch (e) {
			console.error(e);
		}
	}
});

// Register new commands, remove old ones too
app.get('/register_commands', async (req, res) => {
	try {
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


// app.get('/', async (req, res) => {
// 	return res.send(
// 		'Follow documentation\n' +
// 		'https://fine-pear-jaguar-boot.cyclic.app/register_commands\n' +
// 		'http://127.0.0.1/register_commands')
// })

// app.get('/server_data', async (req, res) => {
// 	return (await discord_api.get(
// 		`/guilds/${GUILD_ID}`
// 	) + await discord_api.get(
// 		`/guilds/${GUILD_ID}/channels`
// 	) + await discord_api.get(
// 		`/guilds/${GUILD_ID}/members`
// 	)
// 	)
// })

// 'Start' the Bot
app.listen(8999, () => {
	console.log("Bot Started");
})
