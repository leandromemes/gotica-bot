/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return;
    let chat = global.db.data.chats[m.chat];
    
    if (m.fromMe) return true;
    if (!chat?.antiBot) return;

    // DETECÇÃO TOTAL: Se m.isBot for verdadeiro OU o ID for longo (padrão de bot)
    if (m.isBot || m.key.id.length > 21 || m.key.id.startsWith('BAE5')) {
        if (isBotAdmin) {
            // Sem cards complexos, apenas a justiça rápida
            await conn.reply(m.chat, `「🦇」 *LIMPEZA DE SUCATA*\n\nBot intruso detectado e removido. Aqui só existe uma rainha. 🖤`, m);
            
            await conn.sendMessage(m.chat, { delete: m.key });
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        }
    }
}