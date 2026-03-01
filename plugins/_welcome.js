/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { WAMessageStubType } from '@whiskeysockets/baileys'
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import { readFileSync } from 'fs'

const canalOficial = 'https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u'
const fotoNeutra = './media/neutra.jpg'
const newsletterJid = '120363405588045392@newsletter'

// 🛡️ Armazena IDs processados para evitar duplicatas
let welcomeCache = new Set()

export async function before(m, { conn, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return true
    
    const chat = global.db.data.chats[m.chat]
    if (!chat || !chat.welcome) return true

    // Lista de tipos de entrada
    const entradaTipos = [WAMessageStubType.GROUP_PARTICIPANT_ADD, 27, 28, 31]
    
    if (entradaTipos.includes(m.messageStubType)) {
        const userId = m.messageStubParameters[0]
        const userJid = userId.includes('@') ? userId : userId + '@s.whatsapp.net'
        
        // 🛡️ CHAVE ÚNICA: Evita disparar 2x para a mesma pessoa no mesmo grupo
        let cacheId = `${m.chat}-${userJid}`
        if (welcomeCache.has(cacheId)) return true
        welcomeCache.add(cacheId)
        setTimeout(() => welcomeCache.delete(cacheId), 10000) // Limpa após 10 seg

        let pp
        try {
            pp = await conn.profilePictureUrl(userJid, 'image')
        } catch (e) {
            pp = fotoNeutra
        }

        const username = `@${userId.split('@')[0]}`
        const groupName = groupMetadata.subject

        const text = chat.welcomeText ? 
            chat.welcomeText.replace(/@user/g, username).replace(/@subject/g, groupName) :
            `✨ Seja bem-vindo(a), ${username}.\n\nApresente-se com:\n\n📝 *Nome:*\n📸 *Foto:*\n🎂 *Idade:*\n\nSiga as regras para não ser banido! 💋`

        let media = await prepareWAMessageMedia({ image: pp.startsWith('http') ? { url: pp } : readFileSync(pp) }, { upload: conn.waUploadToServer })

        const interactiveMessage = {
            header: {
                hasMediaAttachment: true,
                imageMessage: media.imageMessage
            },
            body: { text: text },
            footer: { text: "✦ Gótica Bot ✦" },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Canal da Gótica 💋",
                            url: canalOficial
                        })
                    }
                ]
            },
            contextInfo: {
                mentionedJid: [userJid], 
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: newsletterJid,
                    newsletterName: 'Gótica Bot 💋',
                    serverMessageId: -1
                }
            }
        }

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: { message: { interactiveMessage } }
        }, { userJid: conn.user.id, quoted: null })

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }
    return true
}

export default { before }