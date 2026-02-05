/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join } from 'path'

let cooldowns = {}
const TARGET_JID_DONO = '240041947357401@lid'
const DONO_PHONE = '556391330669'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const eDono = (m.sender.includes(DONO_PHONE) || m.sender === TARGET_JID_DONO)

    // REGRA SOBERANA: Leandro sem cooldown
    if (!eDono) {
        const tempoEspera = 15 * 1000 
        if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tempoEspera) return
        cooldowns[m.sender] = Date.now()
    }

    let text = args.join(' ')
    if (!text && m.quoted && m.quoted.text) text = m.quoted.text
    if (!text) return m.reply(`*🎙️ Por favor, escreva o texto que deseja transformar em áudio.*\n\n*Exemplo:* ${usedPrefix + command} Olá Soberano Leandro!`)

    await m.react('🗣️')

    try {
        const res = gtts('pt') // Define o idioma para Português
        const filePath = join(process.cwd(), 'tmp', `${Date.now()}.wav`)
        
        res.save(filePath, text, async () => {
            await conn.sendFile(m.chat, filePath, 'tts.opus', null, m, true)
            unlinkSync(filePath) // Deleta o arquivo temporário
        })
        
        await m.react('✅')
    } catch (e) {
        console.error(e)
        m.reply('*❌ Erro ao converter texto em áudio.*')
    }
}

handler.help = ['audio <texto>']
handler.tags = ['tools']
handler.command = ['audio', 'tts', 'dizer']
handler.register = false 

export default handler