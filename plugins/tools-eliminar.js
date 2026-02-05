/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const TARGET_JID_DONO = '240041947357401@lid'
const DONO_PHONE = '556391330669'

let handler = async (m, { conn, participants, args, usedPrefix, command }) => {
    // PROTEÇÃO SOBERANA: Somente o Leandro (Dono) pode usar
    const eDono = (m.sender.includes(DONO_PHONE) || m.sender === TARGET_JID_DONO)
    if (!eDono) return m.reply('*❌ ACESSO NEGADO:* Este comando é restrito ao meu Soberano Leandro. Administradores não têm permissão.')

    let user = null
    let deleteAll = false

    if (args[0]) {
        if (args[0].toLowerCase() === 'all' || args[0].toLowerCase() === 'tudo') {
            deleteAll = true
        } else {
            user = args[0].replace(/[@+]/g, '') + '@s.whatsapp.net'
        }
    } else if (m.quoted) {
        user = m.quoted.sender
    } else if (m.mentionedJid?.length) {
        user = m.mentionedJid[0]
    }

    // Pega as mensagens do chat, garantindo que não venha undefined
    const messagesObj = conn.chats[m.chat]?.messages
    if (!messagesObj) return m.reply('*❌ ERRO:* Não foi possível acessar o histórico de mensagens deste chat.')

    const allMessages = Object.values(messagesObj)
        .filter(v => v.key?.id && !v.message?.protocolMessage) 
        .sort((a, b) => b.messageTimestamp.low - a.messageTimestamp.low)
        .slice(0, 100)

    if (deleteAll) {
        await m.react('🧹')
        await m.reply(`*🛡️ Iniciando limpeza total...* Vou apagar até ${allMessages.length} mensagens.\n_Aguarde, processando devagar para evitar bloqueios do WhatsApp._`)
        
        for (let msg of allMessages) {
            try {
                await conn.sendMessage(m.chat, { delete: msg.key })
                await new Promise(resolve => setTimeout(resolve, 800)) // Delay de segurança contra rate-limit
            } catch (e) {
                if (e.data === 429) break // Para se o WhatsApp reclamar de novo
                console.error('Erro ao eliminar:', e)
            }
        }
        return m.reply('*✅ Limpeza Concluída!* O chat está limpo.')
    }

    if (!user && !deleteAll) {
        return m.reply(`*👤 Soberano, mencione alguém ou use "all" para limpar tudo.*\n\n*Exemplo:*\n*${usedPrefix + command} all*`)
    }

    const userMessages = allMessages.filter(v => v.key?.participant === user || v.participant === user)
    if (!userMessages.length) return m.reply('*😿 Não encontrei mensagens recentes desse usuário.*')

    await m.react('🗑️')
    for (let msg of userMessages) {
        try {
            await conn.sendMessage(m.chat, { delete: msg.key })
            await new Promise(resolve => setTimeout(resolve, 800))
        } catch (e) {
            console.error('Erro ao eliminar:', e)
        }
    }

    await m.reply(`*✅ Pronto!* Foram apagadas ${userMessages.length} mensagens de @${user.split('@')[0]}.`, null, {
        mentions: [user]
    })
}

handler.help = ['apagarmsg']
handler.tags = ['owner']
handler.command = ['borrarmsg', 'del', 'apagarmsg', 'limpar']
handler.group = true
handler.owner = true // Definido como dono nas configurações do bot
handler.botAdmin = true
handler.register = false // Sem trava de registro como solicitado

export default handler