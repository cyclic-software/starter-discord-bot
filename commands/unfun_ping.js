module.exports = {
	name: "no_test",
	description: "Not Testing",
	options: [],
	execute(interaction) {
		return {
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `Yo ${interaction.member.user.username}!`,
			},
		}
	}
}