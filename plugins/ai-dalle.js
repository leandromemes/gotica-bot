/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import axios from 'axios'

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Para que serve: Gera imagens por IA.
    // Como usar: Comando + descrição da imagem.
    // Público: Membros, Adm e Dono.

    if (!args[0]) {
        await conn.reply(m.chat, `*┇┆🔍 O que você deseja criar?*\n\nExemplo: *${usedPrefix + command} uma gótica num castelo sombrio*`, m)
        return
    }

    const prompt = args.join(' ')
    const apiUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`

    try {
        await m.react('🎨')
        await conn.reply(m.chat, `*┇┆⏳ A desenhar...*\nAguarde, Soberano. A Gótica IA está a criar a sua arte.`, m)

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data)

        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `*✨ Resultado para:* "${prompt}"\n\n*✦ Gótica Bot - Dev Leandro Rocha*`,
            mimetype: 'image/jpeg',
            fileName: 'imagem.jpg'
        }, { quoted: m })
        
        await m.react('✅')

    } catch (error) {
        console.error('Erro ao gerar imagem:', error)
        await m.react('❌')
        await conn.reply(m.chat, `*┇┆⚠️ Erro:* O Soberano, a API de imagem falhou. Tente novamente em instantes.`, m)
    }
}

handler.help = ['dalle']
handler.tags = ['tools']
handler.command = ['dalle', 'gerar', 'iaimage']

// txt += '┇┆🔍 ${_p}gerar\n'

export default handler