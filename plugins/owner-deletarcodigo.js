/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Apenas você (Soberano) pode deletar
    if (m.sender !== '556391330669@s.whatsapp.net') return

    if (!text) return m.reply(`*Qual código você deseja matar?*\nExemplo: *${usedPrefix + command} PIX100*`)

    let code = text.trim().toUpperCase()
    let codesDB = global.db.data.codes || {}

    if (!codesDB[code]) {
        return m.reply(`*O código ${code} não existe ou já foi deletado.* 🤷‍♂️`)
    }

    // Mata o código removendo-o do banco de dados
    delete global.db.data.codes[code]

    m.reply(`✅ *Código "${code}" foi exterminado com sucesso!* Ninguém mais pode resgatá-lo. 💀`)
}

handler.help = ['deletarcodigo']
handler.tags = ['owner']
handler.command = ['deletarcodigo', 'delcode', 'matarcodigo']
handler.rowner = true

export default handler