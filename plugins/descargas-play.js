/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗     ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣     ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩     ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import fetch from 'node-fetch'
import fs from 'fs'

let handler = async (m, { conn, text }) => {
    const devLeandro = "༄ Đev Šoberano ×͜×"

    // Configuração da API Soberana
    const minhaApiURL = 'http://162.35.162.178:3000'
    const apiKey = 'sb_bot_gotica_8f9a2b' // Coloque aqui o token cadastrado na API

    if (!text.trim()) return conn.reply(m.chat, '*✨ Hey!* Digite o nome da música para buscar.', m)

    if (text.includes("http://") || text.includes("https://")) {
        return m.reply('*💋 Erro:* Não use links aqui! Para baixar com link, use o comando de YouTube.')
    }

    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key }})

    try {
        // Envia a requisição com o parâmetro 'apikey'
        const endpoint = `${minhaApiURL}/play?search=${encodeURIComponent(text)}&apikey=${apiKey}`
        let res = await fetch(endpoint)

        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
            return m.reply("*🌙 Erro:* Minha API não respondeu em JSON. Ela está rodando?")
        }

        let data = await res.json()

        // Tratamento para caso o token seja recusado
        if (res.status === 401 || res.status === 403) {
            return m.reply(`*🔑 Erro de Autenticação:* ${data.erro || 'Token inválido!'}`)
        }

        if (!data || (!data.url && !data.file)) {
            return m.reply("*💫 Erro:* Música não encontrada!")
        }

        const textoMensagem = `*💋 ─ ☾ GOTICA PLAY ☽ ─ 💫*\n\n` +
            `> *🎵 Título »* _${data.title}_\n` +
            `> *⏳ Duração »* _${data.total_duration_in_seconds}s_\n` +
            `> *📺 Canal »* _${data.channel?.name || 'YouTube'}_\n` +
            `> *👤 Dev »* _${devLeandro}_\n\n` +
            `*⭐ AGUARDE! Enviando áudio...*`

        // 1. Envia a imagem/thumbnail com a legenda
        if (data.thumbnail) {
            await conn.sendMessage(m.chat, {
                image: { url: data.thumbnail },
                caption: textoMensagem
            }, { quoted: m })
        } else {
            await conn.reply(m.chat, textoMensagem, m)
        }

        // 2. Prepara e envia o áudio
        let audioContent
        if (data.file && fs.existsSync(data.file)) {
            audioContent = fs.readFileSync(data.file)
        } else {
            audioContent = { url: data.url }
        }

        await conn.sendMessage(m.chat, {
            audio: audioContent,
            fileName: `${data.title}.mp3`,
            mimetype: "audio/mp4",
            ptt: false
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

    } catch (e) {
        console.error('ERRO API PRÓPRIA:', e)
        m.reply('*🖤 Erro:* Minha API não respondeu. Verifique se o processo está rodando no PM2.')
    }
}

handler.help = ["play"]
handler.tags = ["descargas"]
handler.command = ["play", "musica", "p"] 
handler.group = true
handler.register = false

export default handler