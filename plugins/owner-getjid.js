/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║    ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @project CYBERSOBERANO 💋⭐✨💫🌙🖤
 */

let handler = async (m, { conn }) => {
    // 🔍 ANALISANDO A ESTRUTURA (Para o terminal do VS Code)
    console.log('--- SCAN DE JID INICIADO ---')
    console.log('ContextInfo:', JSON.stringify(m.quoted?.contextInfo, null, 2))
    
    let res = ''
    let context = m.quoted ? m.quoted.contextInfo : m.contextInfo

    // 🕵️ TENTATIVA 1: Newsletter Direta
    let newsletterJid = context?.forwardedNewsletterMessageInfo?.newsletterJid
    let newsletterName = context?.forwardedNewsletterMessageInfo?.newsletterName

    // 🕵️ TENTATIVA 2: Menção de Newsletter no Quoted
    if (!newsletterJid && m.quoted) {
        newsletterJid = m.quoted.forwardedNewsletterMessageInfo?.newsletterJid
    }

    if (newsletterJid) {
        res = `📢 *CANAL IDENTIFICADO:*\n\n`
        res += `*🏷️ Nome:* ${newsletterName || 'Canal Privado'}\n`
        res += `*🆔 JID:* ${newsletterJid}\n\n`
        res += `> _Copiado com sucesso para o Soberano._ 💋`
        return m.reply(res)
    }

    // 🕵️ TENTATIVA 3: Se for menção a um grupo ou pessoa
    let mencionado = context?.participant || context?.remoteJid
    
    if (mencionado && mencionado !== m.chat) {
        res = `🆔 *JID DA ORIGEM (ENCAMINHADO):*\n\n*${mencionado}*`
    } else {
        res = `🆔 *JID DO CHAT ATUAL:*\n\n*${m.chat}*`
    }

    m.reply(res.trim())
}

handler.help = ['jid']
handler.tags = ['owner']
handler.command = /^(jid|getjid|id)$/i
handler.owner = true

export default handler