const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
module.exports = {
	name: "unfun_ping",
	description: "This is not a fun Ping. Lol",
	options: [],
	async execute(interaction, res) {
		return res.send({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `Yo ${interaction.member.user.username}! You'r MOM.^^`,
			},
		})
	}
}