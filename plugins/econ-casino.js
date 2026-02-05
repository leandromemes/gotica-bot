/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let cooldowns = {}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
    if (!chat.modoreal) return m.reply('*O Modo Real precisa estar ativado para apostar no casino.* 🍷')

    // Inicializa o usuário no grupo
    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = { coin: 0, bank: 0 }
    
    let userGroup = chat.users[m.sender]
    let botname = 'Gótica Bot'
    let username = m.pushName || 'Visitante'

    // Sistema de Cooldown (15 segundos)
    let tiempoEspera = 15
    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let restan = Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000)
        return m.reply(`🎰 *Calma lá!* Você já apostou recentemente. Espere *${restan} segundos* para tentar a sorte de novo.`)
    }

    if (args.length < 1) return m.reply(`💰 *Quanto deseja apostar?*\n\nExemplo:\n> *${usedPrefix + command} 100*`)

    let count = args[0]
    count = /all/i.test(count) ? userGroup.coin : parseInt(count)
    count = Math.max(1, count)

    if (isNaN(count)) return m.reply('*Por favor, insira um número válido para apostar.* ❌')

    if (userGroup.coin < count) {
        return m.reply(`❌ *Saldo insuficiente!* Você não tem *${formatar(count)}* para apostar.`)
    }

    cooldowns[m.sender] = Date.now()
    
    // Lógica do Jogo
    let Aku = Math.floor(Math.random() * 101) // Número do Bot
    let Kamu = Math.floor(Math.random() * 95) // Número do Usuário (Bot tem vantagem leve)

    userGroup.coin -= count

    let resultado = `🎰 *CASINO - GÓTICA BOT* 🎰\n\n`
    resultado += `➠ *${botname}* tirou: *${Aku}*\n`
    resultado += `➠ *${username}* tirou: *${Kamu}*\n\n`

    if (Aku > Kamu) {
        resultado += `> 💀 *PERDEU!* Você perdeu *${formatar(count)}*. Mais sorte na próxima vez.`
    } else if (Aku < Kamu) {
        let premio = count * 2
        userGroup.coin += premio
        resultado += `> 🎉 *GANHOU!* Parabéns! Você faturou *${formatar(premio)}*!`
    } else {
        userGroup.coin += count
        resultado += `> 🤝 *EMPATE!* Seus *${formatar(count)}* foram devolvidos.`
    }

    await m.react('🎲')
    conn.reply(m.chat, resultado.trim(), m)
}

handler.help = ['apostar <quantia>']
handler.tags = ['economia']
handler.command = ['apostar', 'casino']
handler.group = true

export default handler

function formatar(v) {
    return v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}