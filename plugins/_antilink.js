/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

// Regex global para capturar QUALQUER link/site
let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;
let globalLinkRegex = /\bhttps?:\/\/\S+|(?:\w+\.)+\w+\b(?:\/\S*)?/gi;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
    if (!m.isGroup) return 
    if (isAdmin || isOwner || m.fromMe || isROwner) return

    let chat = global.db.data.chats[m.chat];
    let delet = m.key.participant;
    let bang = m.key.id;
    const user = `@${m.sender.split`@`[0]}`;
    const groupAdmins = participants.filter(p => p.admin);
    
    // Verifica se há qualquer tipo de link na mensagem
    const isAnyLink = m.text.match(globalLinkRegex);

    if (chat.antiLink && isAnyLink && !isAdmin) {
        // Se for link de grupo do próprio bot, ele ignora
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
            if (m.text.includes(linkThisGroup)) return !0;
        }

        // Mensagem de deboche
        const deboche = [
            `*「 🔗 ACHOU QUE IA DIVULGAR? 」*\n\n《✧》${user} Coitado... achou que esse link ia passar batido? kkkk Tchau, "divulgador"! 💀`,
            `*「 🔗 OPS, ERROU DE LUGAR 」*\n\n《✧》${user} Esse tipo de lixo não entra aqui. Aproveita a viagem pra fora do grupo! 🦇`,
            `*「 🔗 SENTINELA ATIVA 」*\n\n《✧》${user} Tentando postar link, fofura? Que pena, minha paciência é zero. RUA! 🦴`
        ];
        const msgDeboche = deboche[Math.floor(Math.random() * deboche.length)];

        await conn.sendMessage(m.chat, { 
            text: msgDeboche, 
            mentions: [m.sender] 
        }, { quoted: m });

        if (!isBotAdmin) return conn.sendMessage(m.chat, { 
            text: `✦ O Anti-Link pegou esse engraçadinho, mas não posso chutar ele porque não sou Admin. Admins, façam as honras!`, 
            mentions: [...groupAdmins.map(v => v.id)] 
        }, { quoted: m });

        if (isBotAdmin) {
            // Apaga a mensagem ousada
            await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
            
            // Banimento imediato
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            if (responseb[0].status === "404") return;
        }
    }
    return !0;
}