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
import fs from 'fs'

const canalOficial = 'https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u'

// Trava para evitar envio duplo 💋
let welcomeCache = new Map()

const getLocalIcon = () => {
    const images = ['./media/menu1.jpg', './media/menu2.jpg', './media/menu3.jpg']
    const path = images[Math.floor(Math.random() * images.length)]
    return fs.existsSync(path) ? fs.readFileSync(path) : (fs.existsSync(images[0]) ? fs.readFileSync(images[0]) : null)
}

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return true
    
    const chat = global.db.data.chats[m.chat]
    if (!chat || !chat.welcome) return true

    const userId = m.messageStubParameters[0]
    if (!userId) return true
    
    const userJid = userId.includes('@') ? userId : userId + '@s.whatsapp.net'
    
    // Identificador único para a trava (Grupo + Usuário + Tipo de evento) ⭐
    const cacheKey = `${m.chat}-${userJid}-${m.messageStubType}`
    if (welcomeCache.has(cacheKey)) return true
    
    // Adiciona ao cache e remove após 5 segundos
    welcomeCache.set(cacheKey, true)
    setTimeout(() => welcomeCache.delete(cacheKey), 5000)

    const username = `@${userId.split('@')[0]}`
    const groupName = groupMetadata.subject

    let isWelcome = [
        WAMessageStubType.GROUP_PARTICIPANT_ADD,
        WAMessageStubType.GROUP_PARTICIPANT_INVITE,
        WAMessageStubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN
    ].includes(m.messageStubType)

    let isBye = [
        WAMessageStubType.GROUP_PARTICIPANT_REMOVE,
        WAMessageStubType.GROUP_PARTICIPANT_LEAVE
    ].includes(m.messageStubType)

    if (isWelcome || isBye) {
        let text = ''
        if (isWelcome) {
            text = chat.welcomeText ? 
                chat.welcomeText.replace(/@user/g, username).replace(/@subject/g, groupName) :
                `✨ Seja bem-vindo(a), ${username}.\n\nApresente-se com:\n\n📝 *Nome:*\n📸 *Foto:*\n🎂 *Idade:*\n\nSiga as regras para não ser banido! 💋`
        } else {
            text = chat.byeText ? 
                chat.byeText.replace(/@user/g, username).replace(/@subject/g, groupName) :
                `O usuário ${username} saiu do grupo. Até a próxima! 🍂`
        }

        let mediaBuffer = getLocalIcon()
        let media;
        try {
            const ppUrl = await conn.profilePictureUrl(userJid, 'image').catch(() => null)
            if (ppUrl) {
                media = await prepareWAMessageMedia({ image: { url: ppUrl } }, { upload: conn.waUploadToServer })
            } else {
                media = await prepareWAMessageMedia({ image: mediaBuffer }, { upload: conn.waUploadToServer })
            }
        } catch (e) {
            media = await prepareWAMessageMedia({ image: mediaBuffer }, { upload: conn.waUploadToServer })
        }

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
                            display_text: "𝖢𝖺𝗇𝖺𝗅 𝖽𝖺 𝖦𝗈́𝗍𝗂𝖼𝖺 💋",
                            url: canalOficial
                        })
                    }
                ]
            },
            contextInfo: {
                mentionedJid: [userJid], 
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363405588045392@newsletter',
                    newsletterName: '✦ Gótica Bot | Canal Oficial ✦',
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