// Variables
const fs = require("node:fs");
const path = require("node:path");

const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, Collection } = require('discord.js');
const { REST } = require("@discordjs/rest");
const { TOKEN } = process.env.TOKEN;
const { PREFIX, ADMIN_PREFIX, BOT_ID, OWNER } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: "10" }).setToken(TOKEN);

client.commands = new Collection();
var commands = [];
var commandsBuild = [];

// Get Command Modules
const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath)
	.filter(file => file.endsWith(".js"));

for (const file of commandsFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
	commands.push({
		name: command.data.name,
		desc: command.data.description
	});
}

// Remove Old Commands
// rest.put(
// 	Routes.applicationGuildCommands(BOT_ID, guildId),
// 	{ body: [] }
// ).then(() => console.log("Commands Removed."))
// 	.catch(console.error);

rest.put(
	Routes.applicationCommands(BOT_ID),
	{ body: [] }
).then(() => console.log("Commands Registered."))
	.catch(console.error);

// Add new Commands
for (const cmd of commands) {
	commandsBuild.push(
		new SlashCommandBuilder()
			.setName(cmd.name)
			.setDescription(cmd.desc)
	)
}
commandsBuild = commandsBuild.map(commandsBuild => commandsBuild.toJSON());
rest.put(
	Routes.applicationCommands(BOT_ID),
	{ body: commandsBuild }
)

// After Start
client.once("ready", () => {
	console.log("Ready!");
})

// Command Handler
client.on("interactionCreate", async interacion => {
	if (!interacion.isChatInputCommand()) return;

	const command = client.commands.get(interacion.commandName);
	if (!command) return;

	try {
		await command.execute(interacion);
	} catch (error) {
		console.error(error);
		await interacion.reply({content: "There was an Error while executing" + command.name, ephemeral: true});
	}
	}
)

// Start the Bot
client.login(TOKEN);