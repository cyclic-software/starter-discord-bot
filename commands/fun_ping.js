module.exports = {
	name: "fun_ping",
	description: "Just Testing",
	options: [],
	execute: execute(interaction) {
		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `Yo ${interaction.member.user.username}!`,
			},
		}
	}
}