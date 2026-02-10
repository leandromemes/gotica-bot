/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
    const devLeandro = "dev Leandro"
    const botNameGotica = "Gótica Bot"
    
    // ✨ CONFIGURAÇÃO SPIDER X API - PLANO GOLD
    const spiderKey = 'SUA-CHAVE-AQUI'
    const baseURL = 'LINK'
    
    if (!text.trim()) return conn.reply(m.chat, '*🦇 Hey Soberano!* Digite o nome da música para buscar.', m)

    // Impedir uso de links conforme a regra da base
    if (text.includes("http://") || text.includes("https://")) {
        return m.reply('*🦇 Erro:* Não use links aqui! Para baixar com link, use o comando de YouTube.')
    }

    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key }})

    try {
        // Chamada oficial da API Paga
        let res = await fetch(`${baseURL}/play-audio?search=${encodeURIComponent(text)}&api_key=${spiderKey}`)
        let data = await res.json()

        if (!data || !data.url) {
            return m.reply("*🦇 Erro:* Nenhum resultado encontrado na Spider X!")
        }

        // Enviar informativo da música antes do áudio
        await conn.reply(m.chat, `*🦇 ─ ☾ GOTICA PLAY ☽ ─ 🦇*\n\n> *🎵 Título »* _${data.title}_\n> *⏳ Duração »* _${data.total_duration_in_seconds}s_\n> *📺 Canal »* _${data.channel.name}_\n\n*🌑 AGUARDE! Enviando áudio...*`, m, {
            contextInfo: {
                externalAdReply: {
                    title: botNameGotica,
                    body: `By: ${devLeandro}`,
                    mediaType: 1,
                    thumbnailUrl: data.thumbnail,
                    renderLargerThumbnail: true,
                    sourceUrl: data.url
                }
            }
        })

        // Envia o áudio direto da URL da API
        await conn.sendMessage(m.chat, {
            audio: { url: data.url },
            fileName: `${data.title}.mp3`,
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

    } catch (e) {
        console.error('ERRO SPIDER X:', e)
        m.reply('*🦇 Erro:* A API Spider X não respondeu. Verifique se o servidor deles está online ou se seu token mudou.')
    }
}

handler.help = ["play"]
handler.tags = ["descargas"]
handler.command = ["play", "musica", "p", "pa"] 
handler.group = true
handler.register = false

export default handler
