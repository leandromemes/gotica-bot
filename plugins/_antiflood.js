/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗     ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣     ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩     ╚═╝ ╚═╝  ╩ 
 * @author ༄ Đev Šoberano ×͜×
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */
import fs from 'fs'
import path from 'path'
import { setGp } from '../handler.js'

let handler = async (m, { conn, command, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('❌ Este comando só pode ser usado em grupos!')
    if (!isAdmin && !isOwner) return m.reply('❌ Apenas administradores podem usar este comando!')

    // Garantir existência do diretório de grupos
    const dirGrupos = path.join(process.cwd(), 'src', 'database', 'grupos')
    if (!fs.existsSync(dirGrupos)) {
        fs.mkdirSync(dirGrupos, { recursive: true })
    }

    const cleanFrom = m.chat.split('@')[0] + '@g.us'
    const caminho = path.join(dirGrupos, `${cleanFrom}.json`)

    let jsonGp = []
    if (fs.existsSync(caminho)) {
        try {
            const content = fs.readFileSync(caminho, 'utf-8')
            jsonGp = content ? JSON.parse(content) : []
        } catch (e) { 
            jsonGp = [] 
        }
    }

    if (!Array.isArray(jsonGp)) jsonGp = []
    if (!jsonGp[0] || typeof jsonGp[0] !== 'object') jsonGp[0] = {}

    // Garantir integridade no database do bot
    if (!global.db.data.chats[m.chat]) {
        global.db.data.chats[m.chat] = {}
    }
    let chat = global.db.data.chats[m.chat]

    const cmd = command.toLowerCase()

    // ── LÓGICA DO ANTI-LINK GP ──────────────────────────────────────────
    if (cmd === 'antilinkgp') {
        let isAntilinkgp = jsonGp[0].antilinkgp === true || chat.antilinkgp === true

        if (isAntilinkgp) {
            jsonGp[0].antilinkgp = false
            chat.antilinkgp = false
            setGp(m.chat, jsonGp)
            return m.reply('*ᴏ ʀᴇᴄᴜʀsᴏ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴏ ɢʀᴜᴘᴏ 🙅‍♂️*')
        } else {
            jsonGp[0].antilinkgp = true
            chat.antilinkgp = true
            setGp(m.chat, jsonGp)
            return m.reply('*ᴏ ʀᴇᴄᴜʀsᴏ ᴀɴᴛɪʟɪɴᴋ ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴏ ɢʀᴜᴘᴏ 🙇‍♂️*')
        }
    }

    // ── LÓGICA DO ANTI-FLOOD ─────────────────────────────────────────────
    if (cmd === 'antiflod') {
        let isAntiflood = jsonGp[0].antiflood === true || chat.antiflood === true

        if (isAntiflood) {
            jsonGp[0].antiflood = false
            chat.antiflood = false
            setGp(m.chat, jsonGp)
            return m.reply('*ᴏ ʀᴇᴄᴜʀsᴏ ᴀɴᴛɪ-ғʟᴏᴏᴅ ғᴏɪ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴏ ɢʀᴜᴘᴏ 🙅‍♂️*')
        } else {
            jsonGp[0].antiflood = true
            chat.antiflood = true
            setGp(m.chat, jsonGp)
            return m.reply('*ᴏ ʀᴇᴄᴜʀsᴏ ᴀɴᴛɪ-ғʟᴏᴏᴅ ғᴏɪ ᴀᴛɪᴠᴀᴅᴏ ᴄᴏᴍ sᴜᴄᴇssᴏ ɴᴏ ɢʀᴜᴘᴏ 🙇‍♂️*')
        }
    }
}

handler.help = ['antilinkgp', 'antiflod']
handler.tags = ['group']
handler.command = /^(antilinkgp|antiflod)$/i
handler.group = true
handler.admin = true

export default handler