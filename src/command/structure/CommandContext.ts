import {CommandInteraction, CommandInteractionOptionResolver, Guild, GuildMember} from "discord.js";

export default class CommandContext {
    public member?: GuildMember;
    public guild?: Guild;
    public options?: CommandInteractionOptionResolver;

    constructor (interaction: CommandInteraction) {
        if (!interaction.member || !interaction.guild) return;
        this.member = interaction.member;
        this.guild = interaction.guild;
        this.options = interaction.options;
    }
}