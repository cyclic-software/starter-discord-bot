const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
module.exports = {
	name: "fun_ping",
	description: "Just Testing",
	options: [],
	async execute(interaction) {
		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `Yo ${interaction.member.user.username}!`,
			},
		}
	}
}