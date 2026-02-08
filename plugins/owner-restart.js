/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        // Reação de desligamento/reinicio
        await m.react('🔄')
        
        await m.reply('*[ SISTEMA ]* ⚠️\n\nO Soberano solicitou o reinício imediato. A Gótica Bot estará de volta em instantes... 🦇')
        
        // Pequeno delay para garantir que a mensagem de cima seja enviada antes do processo morrer
        setTimeout(() => {
            process.exit(0)
        }, 2000) 
        
    } catch (error) {
        console.log(error)
        m.reply(`*Erro ao reiniciar:* ${error}`)
    }
}

handler.help = ['restart']
handler.tags = ['owner']
handler.command = ['restart', 'reiniciar', 'resetbot'] 
handler.rowner = true // Só o Soberano pode dar essa ordem

export default handler