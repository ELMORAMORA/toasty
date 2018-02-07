const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', '..', 'data', 'servers.json');

module.exports = class RolesRemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roles-remove',
			group: 'config',
			memberName: 'roles-remove',
			description: 'Removes a role to the server roles list avaliable to the `roleme` command.',
      details: 'Anybody with the Administrator permission can add or remove roles that can be gained with the `roleme` command.',
			examples: ['roles-remove CSGO'],
			guildOnly: true,
			args: [
				{
					key: 'role',
					prompt: 'What role would you like to remove from the roleme list?\n',
					type: 'role'
				}
			],
      throttling: {
        usages: 1,
        duration: 10
      }
		});
	}

  run(msg, args) {
		if (!msg.member.permissions.has('ADMINISTRATOR') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Administrator** permission!');
		const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const { role } = args;
		if (!data[msg.guild.id]) data[msg.guild.id] = { roles: [] };
    if (!data[msg.guild.id].roles.includes(role.name)) return msg.reply(`:no_entry_sign: The role, **${role.name}** is not in the server roles list.`);
    let index = data[msg.guild.id].roles.indexOf(role.name);
    data[msg.guild.id].roles.splice(index, 1);
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    msg.reply(`:white_check_mark: Successfully removed **${role.name}** from the server roles list.`);
  }
};
