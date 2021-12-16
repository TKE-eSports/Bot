export const splitChunk = (array: any, chunk?: any) => {
    const inputArray = array;
    var perChunk = chunk || 15;
    var result = inputArray.reduce((resultArray: any, item: any, index: any) => {
        const chunkIndex = Math.floor(index / perChunk)
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []
        }
        resultArray[chunkIndex].push(item)
        return resultArray
    }, [])
    return result;
}

export const separate = (x: number) => {
    const o = Math.round(x);
    return o.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const entranceEmoji = (club: any) => {
    const type = club.type.toString().toLowerCase();
    if (type === "open") return "<:Open:792418812397748264> **Open**";
    if (type === "closed") return "<:Closed:809420167230128188> **Closed**";
    if (type === "inviteonly") return "<:Invite_Only:792419406038433872> **Invite-Only**";
    else return `NOT_FOUND`
}

const roleEmojis: any = {
    "member": "<:Member:792430014326898740>",
    "senior": "<:Seniors:789425351768014888>",
    "vicePresident": "<:VicePresidents:789425469375119360>",
    "president": "<:President:789425708929253396>"
};

export const list = (club: any, role: string) => {
    const total = club.members.filter((x: any) => x.role == role).length;
    let r = [role];
    if (role === "vicePresident") r = ["president", role]
    const list = club.members.filter((x: any) => r.includes(x.role)).sort((a: any, b: any) => b.trophies - a.trophies).map((m: any) => `${roleEmojis[m.role] || "<:Not_Found:792392216663556116>"}\`${m.trophies}\` [${m.name}](https://brawlify.com/stats/profile/${m.tag.replace("#", "")})`).slice(0, 5)
    return [total, list.join("\n") || "None"]
}

export const getRoleEmoji = (role : string) => {
    return roleEmojis[role] || "<:Not_Found:792392216663556116>";
}