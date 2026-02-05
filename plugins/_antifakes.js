/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = m => m
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return !1
    
    let chat = global.db.data.chats[m.chat]
    
    // O Bot só age se for Admin e o Antifake estiver ON
    if (isBotAdmin && chat.antifake) {
        
        // Lista de prefixos (DDIs) proibidos no reino
        const fakes = ['6', '90', '212', '92', '93', '94', '7', '49', '2', '91', '48']
        
        // Verifica se o remetente começa com algum desses prefixos
        const isFake = fakes.some(prefix => m.sender.startsWith(prefix))

        if (isFake) {
            // Bloqueia o usuário no banco de dados do Bot
            global.db.data.users[m.sender].block = true
            
            // Log de autoridade no terminal
            console.log(`[ANTIFFAKE] 💀 Removendo intruso: ${m.sender}`)
            
            // Remove o intruso do grupo
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            
            // Opcional: Reagir com um emoji de caveira
            return m.react('💀')
        }
    }
}

export default handler