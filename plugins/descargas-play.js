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
    
    // ✨ CONFIGURAÇÃO SPIDER X API - ATUALIZADA 💋
    const spiderKey = 'T8a5maZdw3RW6dvKNHfO'
    const baseURL = 'https://api.spiderx.com.br/api/downloads'
    
    if (!text.trim()) return conn.reply(m.chat, '*✨ Hey!* Digite o nome da música para buscar.', m)

    // Impedir uso de links conforme a regra da base
    if (text.includes("http://") || text.includes("https://")) {
        return m.reply('*💋 Erro:* Não use links aqui! Para baixar com link, use o comando de YouTube.')
    }

    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key }})

    try {
        // Chamada com a nova URL da documentação
        let res = await fetch(`${baseURL}/play-audio?search=${encodeURIComponent(text)}&api_key=${spiderKey}`)
        
        // Verificação se a resposta é JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return m.reply("*🌙 Erro:* A API Spider X mudou algo ou está em manutenção. Tente novamente mais tarde.")
        }

        let data = await res.json()

        // Verificando se a URL do áudio existe na resposta
        if (!data || !data.url) {
            return m.reply("*💫 Erro:* Música não encontrada na Spider X!")
        }

        // Enviar informativo da música
        await conn.reply(m.chat, `*💋 ─ ☾ GOTICA PLAY ☽ ─ 💫*\n\n> *🎵 Título »* _${data.title}_\n> *⏳ Duração »* _${data.total_duration_in_seconds}s_\n> *📺 Canal »* _${data.channel.name}_\n\n*⭐ AGUARDE! Enviando áudio...*`, m, {
            contextInfo: {
                externalAdReply: {
                    title: botNameGotica,
                    body: `By: ${devLeandro}`,
                    mediaType: 1,
                    thumbnailUrl: data.thumbnail,
                    renderLargerThumbnail: true,
                    sourceUrl: data.youtube_video_url || data.url
                }
            }
        })

        // Envia o áudio
        await conn.sendMessage(m.chat, {
            audio: { url: data.url },
            fileName: `${data.title}.mp3`,
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

    } catch (e) {
        console.error('ERRO SPIDER X:', e)
        m.reply('*🖤 Erro:* A API não respondeu corretamente. Verifique sua conexão ou a chave de API.')
    }
}

handler.help = ["play"]
handler.tags = ["descargas"]
handler.command = ["play", "musica", "p", "pa"] 
handler.group = true
handler.register = false

export default handler