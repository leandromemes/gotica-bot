/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn }) => {
    try {
        await m.reply('*🔍 Soberano, estou vasculhando minhas conexões para achar o ID do seu canal...*');

        // Método 1: Tenta ler o ID através das mensagens que o bot já recebeu (cache)
        let newsletters = Object.values(conn.chats).filter(chat => chat.id && chat.id.endsWith('@newsletter'));

        if (newsletters.length > 0) {
            let txt = `*✅ SOBERANO, ENCONTREI NO CACHE!*\n\n`;
            newsletters.forEach(n => {
                txt += `*📢 Canal:* ${n.name || 'Nome Oculto'}\n*🆔 ID:* \`${n.id}\`\n\n`;
            });
            return m.reply(txt);
        }

        // Método 2: Tenta capturar pelo log de atividades (Se ele é ADM, o ID passa por aqui)
        let metadata = await conn.groupFetchAllParticipating().catch(() => ({}));
        let ids = Object.keys(metadata).filter(id => id.endsWith('@newsletter'));

        if (ids.length > 0) {
            let txt = `*✅ SOBERANO, ENCONTREI NOS GRUPOS/CANAIS!*\n\n`;
            ids.forEach(id => {
                txt += `*🆔 ID:* \`${id}\`\n`;
            });
            return m.reply(txt);
        }

        // Se nada funcionar, vamos usar o comando de ajuda do Soberano
        await m.reply('*❌ O sistema de listas do WhatsApp bloqueou o acesso direto.* \n\n*💡 ÚLTIMA TENTATIVA:* No seu canal, envie uma mensagem marcando o bot ou mande o link do canal no PV do bot. Se não der, me mande o link do seu canal aqui que eu tento identificar o padrão para você!');

    } catch (e) {
        console.error(e);
        m.reply('*❌ Erro técnico:* ' + e.message);
    }
}

handler.help = ['listacanais'];
handler.tags = ['ferramentas'];
handler.command = ['listacanais', 'getid'];
handler.owner = true;

export default handler;