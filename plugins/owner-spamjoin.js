/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Divide o texto por "|"
    const args = text.split('|').map(v => v.trim());

    if (args.length < 3) {
        return m.reply(`*Opa, Soberano!* ✋\n\nUse o formato: *Link | Mensagem | Quantidade*\n\nExemplo:\n*${usedPrefix + command}* ${global.gp} | Olá a todos! | 5`);
    }

    const [groupLink, message, countStr] = args;
    const count = parseInt(countStr, 10);

    if (!groupLink.includes('chat.whatsapp.com')) {
        return m.reply(`*Erro:* Forneça um link de convite válido.`);
    }
    
    if (isNaN(count) || count <= 0) {
        return m.reply(`*Erro:* A quantidade de mensagens deve ser um número maior que 0.`);
    }

    // Limite de segurança para não banir o número rápido demais
    if (count > 50) return m.reply(`*Calma, Soberano!* ✋\nO limite máximo para evitar banimento imediato é de 50 mensagens.`);

    try {
        await m.react('🚀')
        
        // Extrai o código do link e entra no grupo
        const code = groupLink.split('chat.whatsapp.com/')[1];
        const groupId = await conn.groupAcceptInvite(code);

        await m.reply(`✅ *Entrei no grupo!* Iniciando a rajada de *${count}* mensagens...`);

        for (let i = 0; i < count; i++) {
            await conn.sendMessage(groupId, { text: message });
            await delay(1500); // Delay de 1.5s para não travar o socket
        }

        await m.reply(`✨ *Missão cumprida!* Saindo do grupo...`);
        
        // Sai do grupo após o spam
        await conn.groupLeave(groupId);

    } catch (error) {
        console.error(error);
        m.reply(`❌ *Erro na operação:* ${error.message}`);
    }
};

handler.help = ['spam2'];
handler.tags = ['owner'];
handler.command = ['spam2', 'spamjoin', 'ataque'];
handler.rowner = true; // Exclusivo para o Soberano

export default handler;