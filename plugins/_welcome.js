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

// Informações do seu Canal Oficial
const canalOficial = 'https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u'

// Suas imagens oficiais do Catbox
const iconos = [
    'https://files.catbox.moe/pbu54p.jpg',
    'https://files.catbox.moe/q2loia.jpg',
    'https://files.catbox.moe/bzzd78.jpg',
    'https://files.catbox.moe/9jcnzq.jpg',
    'https://files.catbox.moe/sypl75.jpg'
]
const getRandomIcono = () => iconos[Math.floor(Math.random() * iconos.length)]

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return true
    
    const chat = global.db.data.chats[m.chat]
    if (!chat || !chat.welcome) return true

    const userId = m.messageStubParameters[0]
    const pp = await conn.profilePictureUrl(userId, 'image').catch(() => getRandomIcono())
    const username = `@${userId.split('@')[0]}`
    const groupName = groupMetadata.subject

    let isWelcome = m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD
    let isBye = m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE

    if (isWelcome || isBye) {
        let text = ''
        
        if (isWelcome) {
            // Texto de Boas-vindas personalizado conforme o pedido do Soberano
            text = chat.welcomeText ? 
                chat.welcomeText.replace(/@user/g, username).replace(/@subject/g, groupName) :
                `✨ Seja bem-vindo(a), ${username}.\n\nApresente-se com:\n\n📝 *Nome:*\n📸 *Foto:*\n🎂 *Idade:*\n\nSiga as regras para não ser banido! 💋`
        } else {
            // Texto de despedida (pode ser customizado também)
            text = chat.byeText ? 
                chat.byeText.replace(/@user/g, username).replace(/@subject/g, groupName) :
                `O usuário ${username} saiu do grupo. Até a próxima! 🍂`
        }

        // Prepara a mídia (Imagem de perfil ou aleatória do Soberano)
        let media = await prepareWAMessageMedia({ image: { url: pp } }, { upload: conn.waUploadToServer })

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
                mentionedJid: [userId], 
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363384351639893@newsletter',
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
}

export default { before }