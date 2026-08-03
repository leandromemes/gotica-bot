/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, usedPrefix, command, args }) => {
    // Definindo a ação baseado no comando ou no argumento
    // Se digitar .abrir ou .fechar direto, ou .grupo abrir
    let isClose = /fechar|close/i.test(command) || (args[0] && /fechar|close/i.test(args[0]))
    let setting = isClose ? 'announcement' : 'not_announcement'

    try {
        // Atualiza a configuração do grupo
        await conn.groupSettingUpdate(m.chat, setting)
        
        // Mensagem de sucesso no estilo do seu bot
        let status = isClose ? 'FECHADO 🔒' : 'ABERTO 🔓'
        await conn.sendMessage(m.chat, { 
            text: `*✅ GRUPO ${status}!*\n\nConfigurações do grupo atualizadas com sucesso.` 
        }, { quoted: m })
        
        await m.react(isClose ? '🔒' : '🔓')

    } catch (e) {
        // Caso ocorra erro (ex: bot não ser ADM)
        await m.reply(`*🦇 Erro:* Não foi possível alterar o status do grupo: ${e.message}`)
    }
}

handler.help = ['grupo']
handler.tags = ['admin']
// Registrando nomes simples que o seu handler reconhece
handler.command = ['grupo', 'abrir', 'fechar', 'gp', 'open', 'close'] 
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.register = false 

export default handler