import type { Message } from "discord.js";
import TR from "tag-replacer";

const config = function (message: Message) {
    return {
        "guild": (args: any[]) => {
            if (args[0] === "name") return message.guild?.name;
            if (args[0] === "id") return message.guild?.id;
            if (args[0] === "ownerId") return message.guild?.ownerId;
            if (args[0] === "channels") return message.guild?.channels.cache.size;
            if (args[0] === "roles") return message.guild?.roles.cache.size;
            if (args[0] === "members") return message.guild?.memberCount;
            if (args[0] === "emojis") return message.guild?.emojis.cache.size;
            if (args[0] === "icon") return message.guild?.iconURL;
            return "null";

        },
        "message": (args: any[]) => {
            if (args[0] === "id") return message.id;
            if (args[0] === "author") return message.author.id;
            if (args[0] === "content") return message.content;
            if (args[0] === "channel") return message.channel.id;
            return "null";
        }
    }
}

export const tagScriptParser = (message: Message, content: string) => {
    const tagReplacer = new TR(config(message));
    const output = tagReplacer.replace(content);
    if (output === ",") return "null";
    else return output;
}