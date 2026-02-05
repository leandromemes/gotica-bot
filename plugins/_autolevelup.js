/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

export async function before(m, { conn }) {
    // Verifica se o banco de dados e o chat existem para evitar erros de undefined
    if (!global.db?.data?.chats) return !0
    let chat = global.db.data.chats[m.chat]
    
    if (!chat || !chat.modoreal || !chat.autolevelup) return !0
    if (!chat.users || !chat.users[m.sender]) return !0

    let userGroup = chat.users[m.sender]
    // Garante que o total seja um número
    let total = (Number(userGroup.coin) || 0) + (Number(userGroup.bank) || 0)
    
    // Níveis de Patente (Valores mantidos conforme sua solicitação)
    const patentes = [
        { nome: "Pobre 💸", min: 0 },
        { nome: "Rico 💰", min: 100000 },
        { nome: "Milionário 💎", min: 10000000 },
        { nome: "Bilionário 👑", min: 1000000000 },
        { nome: "Magnata Supremo 🍷", min: 10000000000 }
    ]

    // Descobre a patente atual baseada no valor (Adicionada trava de segurança)
    let novaPatenteObj = [...patentes].reverse().find(p => total >= p.min) || patentes[0]
    let patenteNome = novaPatenteObj.nome

    // Se a patente local não existir, define silenciosamente
    if (!userGroup.role) {
        userGroup.role = patenteNome
        return !0
    }

    // Se a patente mudou
    if (userGroup.role !== patenteNome) {
        let antes = userGroup.role
        let indexAntes = patentes.findIndex(p => p.nome === antes)
        let indexNova = patentes.findIndex(p => p.nome === patenteNome)
        
        // Se por algum motivo o index não for encontrado, evita o erro
        if (indexNova === -1) return !0

        userGroup.role = patenteNome
        let jid = m.sender

        // CASO 1: SUBIU DE PATENTE (Upgrade)
        if (indexNova > indexAntes && indexAntes !== -1) {
            let txtUp = `✨ *BOAS NOTÍCIAS* @${jid.split`@`[0]}!\n\nSua fortuna neste grupo cresceu e você subiu de nível!\n\n🏆 *Antiga:* ${antes}\n💎 *Nova:* ${patenteNome}\n\n> Continue trabalhando para virar um Magnata!`.trim()
            return conn.reply(m.chat, txtUp, m, { mentions: [jid] })
        } 
        
        // CASO 2: CAIU DE PATENTE (Downgrade)
        else if (indexNova < indexAntes && indexAntes !== -1) {
            let txtDown = `📉 *MAU INVESTIMENTO* @${jid.split`@`[0]}...\n\nVocê perdeu muito dinheiro e sua patente caiu!\n\n❌ *Antiga:* ${antes}\n📉 *Nova:* ${patenteNome}\n\n> Parece que a sorte não está do seu lado, cuidado para não zerar!`.trim()
            return conn.reply(m.chat, txtDown, m, { mentions: [jid] })
        }
    }
    return !0
}