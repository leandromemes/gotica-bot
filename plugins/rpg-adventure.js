/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, usedPrefix }) => {
    let chat = global.db.data.chats[m.chat]
    if (!chat.modoreal) return m.reply('*O Modo Real precisa estar ativado para se aventurar.* 🍷')

    // Inicializa economia e saúde do grupo se não existirem
    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = { coin: 0, bank: 0, lastAdventure: 0, health: 100 }
    
    let userGroup = chat.users[m.sender]
    
    // Garante que a saúde nunca seja undefined antes de checar
    if (userGroup.health === undefined) userGroup.health = 100
    
    let img = 'https://files.catbox.moe/bh1fwr.jpg'

    // Sistema de Vida (Saúde) - Se tiver menos de 50 não viaja
    if (userGroup.health < 50) {
        return m.reply(`💔 *Você está muito ferido para se aventurar!* \nSua saúde: *${userGroup.health}%*. Descanse um pouco ou use *.curar* antes de sair novamente.`)
    }

    // Cooldown de 25 minutos
    let cooldown = 1500000
    if (new Date - (userGroup.lastAdventure || 0) < cooldown) {
        let timeLeft = (userGroup.lastAdventure + cooldown) - new Date()
        return m.reply(`⏳ *Sossega!* Você acabou de voltar de uma viagem. Espere *${msToTime(timeLeft)}* para sair de novo.`)
    }

    let reinos = [
        'Reino de Eldoria 🏰', 'Reino de Drakonia 🐉', 'Reino de Arkenland 🏔️', 
        'Reino de Valoria ⚔️', 'Reino de Mystara 🔮', 'Reino de Ferelith 🌲'
    ]
    
    let reino = reinos[Math.floor(Math.random() * reinos.length)]
    let coin = Math.floor(Math.random() * 300) + 50 
    let exp = Math.floor(Math.random() * 100) + 20 

    // Salva os ganhos
    userGroup.coin = (userGroup.coin || 0) + coin
    userGroup.exp = (userGroup.exp || 0) + exp
    userGroup.health -= 40 // Custa saúde se aventurar
    userGroup.lastAdventure = new Date * 1

    let formatar = (v) => v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

    let info = `
╭─〔 🛫 *AVENTURA INICIADA* 〕
│
│ 🏰 *Destino:* ${reino}
│ 🏞️ *Status:* Concluída com Sucesso!
│
│ 💸 *Dinheiro Achado:* ${formatar(coin)}
│ ✨ *XP Ganho:* ${exp}
│ ❤️ *Saúde Restante:* ${userGroup.health}%
╰─────────────────────
│ 💰 *Saldo Local:* ${formatar(userGroup.coin)}
╰─────────────────────
> Continue explorando para ficar rico!`.trim()

    await conn.sendFile(m.chat, img, 'aventura.jpg', info, m)
}

handler.help = ['aventura']
handler.tags = ['rpg']
handler.command = ['adventure', 'aventura', 'viajar']
handler.group = true

export default handler

function msToTime(duration) {
    let minutes = Math.floor((duration / (1000 * 60)) % 60)
    let seconds = Math.floor((duration / 1000) % 60)
    return `${minutes}m e ${seconds}s`
}