/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
    // Apenas você (Soberano) tem permissão para abastecer a pasta
    if (m.sender !== '556391330669@s.whatsapp.net') return

    // Verifica se você está respondendo a uma figurinha
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    
    if (!/webp/.test(mime)) return m.reply(`*Responda a uma figurinha com ${usedPrefix + command} para salvá-la.* 🤨`)

    try {
        await m.react('📥')
        
        // Caminho da sua pasta
        const dir = path.join(process.cwd(), 'figu')
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)

        // Baixa a figurinha
        let media = await q.download()
        
        // Cria um nome único baseado no timestamp para não sobrescrever
        let fileName = `figu_${Date.now()}.webp`
        let filePath = path.join(dir, fileName)

        // Salva na pasta
        fs.writeFileSync(filePath, media)

        m.reply(`✅ *Figurinha salva com sucesso, Soberano!*\n\n📂 *Pasta:* /figu\n📄 *Arquivo:* ${fileName}\n\nAgora ela já faz parte do comando *${usedPrefix}fig*`)
    } catch (e) {
        console.error(e)
        m.reply('*Erro ao tentar salvar a figurinha.* ❌')
    }
}

handler.help = ['salvarfigu']
handler.tags = ['owner']
handler.command = ['salvarfigu', 'slv', 'salvar']
handler.rowner = true

export default handler