/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Apenas VOCÊ (Soberano) pode gerar códigos
    if (m.sender !== '556391330669@s.whatsapp.net') return

    let [nome, valor] = text.split('|')
    if (!nome || !valor) return m.reply(`*Exemplo:* ${usedPrefix + command} PIX100 | 100`)

    if (!global.db.data.codes) global.db.data.codes = {}
    
    let codigoFormatado = nome.trim().toUpperCase()
    let valorRecompensa = parseInt(valor.trim())

    if (isNaN(valorRecompensa)) return m.reply('*O valor deve ser um número, Soberano!* ❌')

    // Cria o código com a propriedade 'singleUse'
    global.db.data.codes[codigoFormatado] = {
        coin: valorRecompensa,
        claimedBy: [],
        singleUse: true // Define que é uso único
    }

    let formatar = (v) => v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

    m.reply(`✅ *CÓDIGO EXCLUSIVO GERADO*\n\n🎫 *Código:* ${codigoFormatado}\n💰 *Valor:* ${formatar(valorRecompensa)}\n⚠️ *Aviso:* Apenas a primeira pessoa que usar poderá resgatar!`)
}

handler.command = ['gerarcodigo', 'setcode']
handler.rowner = true 

export default handler