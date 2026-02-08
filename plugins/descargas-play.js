/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import ytSearch from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, isOwner }) => {
    const devLeandro = "dev Leandro"
    const botNameGotica = "Gótica Bot"
    
    // --- RODÍZIO DE CHAVES DO SOBERANO ---
    // A chave paga 'txsO...' foi movida para o FINAL da lista.
    const apiKeys = [
        '377a576cf1mshec53a3d9ff35714p1d9884jsn4749e1861bba', // Grátis 1
        '4e61f221e1msh8d02792557a1937p1c822fjsn459f1d89968b', // Grátis 2
        '0e8051bfbdmsh4a65402152f1739p144c60jsn8f077e3708ab', // Grátis 3
        'txsOVBIevZekrQ6MC2bV'  // ✨ CHAVE PAGA (Última Opção)
    ]
    const apiHost = 'spotify-downloader9.p.rapidapi.com'
    
    if (!text.trim()) return conn.reply(m.chat, `*🦇 Hey Soberano!* Digite o nome da música para buscar.`, m)

    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key }})

    try {
        let search = await ytSearch(text)
        let video = search.videos[0]
        if (!video) return m.reply("*🦇 Erro:* Música não encontrada no YouTube.")

        let { title, thumbnail, timestamp, url } = video
        
        await conn.reply(m.chat, `*🦇 ─ ☾ GOTICA PLAY ☽ ─ 🦇*\n\n> *🎵 Título »* _${title}_\n> *⏳ Duração »* _${timestamp}_\n\n*🌑 AGUARDE! Buscando na Database...*`, m, {
            contextInfo: {
                externalAdReply: {
                    title: botNameGotica,
                    body: `By: ${devLeandro}`,
                    mediaType: 1,
                    thumbnailUrl: thumbnail,
                    renderLargerThumbnail: true,
                    sourceUrl: url
                }
            }
        })

        let downloadUrl = null

        for (let key of apiKeys) {
            try {
                const headers = { 'x-rapidapi-key': key, 'x-rapidapi-host': apiHost }
                
                let sRes = await fetch(`https://${apiHost}/search?q=${encodeURIComponent(title)}&type=track&limit=1`, { headers })
                let sJson = await sRes.json()

                // Log para controle do Soberano no terminal
                console.log(`[LOG] Testando chave: ${key.substring(0,5)}... | Status: ${sRes.status}`)

                let trackId = sJson?.data?.tracks?.items?.[0]?.id || 
                              sJson?.data?.items?.[0]?.id || 
                              sJson?.items?.[0]?.id

                if (!trackId) continue

                let dlRes = await fetch(`https://${apiHost}/downloadSong?songId=${trackId}`, { headers })
                let dlJson = await dlRes.json()
                downloadUrl = dlJson.data?.downloadLink || dlJson?.downloadLink
                
                if (downloadUrl) break 
            } catch (err) {
                continue 
            }
        }

        if (!downloadUrl) throw 'Todas as chaves esgotaram, inclusive a reserva paga.'

        await conn.sendMessage(m.chat, {
            audio: { url: downloadUrl },
            fileName: `${title}.mp3`,
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: m })
        
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

    } catch (e) {
        console.error(e)
        m.reply(`*🦇 Erro:* Não foi possível processar o download. Verifique o terminal para detalhes.`)
    }
}

handler.help = ["mus"]
handler.tags = ["descargas"]
handler.command = ["play", "musica",'p'] 
handler.group = true
handler.register = false 

export default handler