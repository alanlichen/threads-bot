import {ApplicationCommandData} from "discord.js";


export interface Command {
    commandData: ApplicationCommandData;
    exec(ctx: CommandContext): void;
}