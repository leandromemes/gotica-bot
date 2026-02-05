import axios from "axios"

// Configurações do Desenvolvedor - Gótica Bot
const devLeandro = "Dev Leandro"
const botNameGotica = "Gótica Bot"
const SPIDER_API_TOKEN = "txsOVBIevZekrQ6MC2bV" // Seu Token VIP
const SPIDER_API_BASE_URL = "https://api.spiderx.com.br/api"

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `🦇 *Hey Soberano!* Digite o nome da música que deseja buscar.`, m)
    }

    // Se o usuário enviar um link, avisar que este comando é para busca por nome
    if (text.includes("http://") || text.includes("https://")) {
        return m.reply(`🦇 *Aviso:* Para baixar via link, use o comando de link direto (em breve). Para agora, digite apenas o *nome* da música.`)
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key }})

    // --- CHAMADA À API SPIDER X ---
    // Endpoint: /downloads/play-audio?search=NOME&api_key=TOKEN
    const apiUrl = `${SPIDER_API_BASE_URL}/downloads/play-audio?search=${encodeURIComponent(text)}&api_key=${SPIDER_API_TOKEN}`
    
    const { data } = await axios.get(apiUrl)

    if (!data || !data.url) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
      return m.reply("🦇 *Erro:* Nenhum resultado encontrado.")
    }

    // --- INFOS DA MÚSICA ---
    let { title, description, thumbnail, url, channel, total_duration_in_seconds } = data
    
    // Converter segundos para MM:SS
    const duration = new Date(total_duration_in_seconds * 1000).toISOString().substr(14, 5)

    const infoMessage = `
🦇 ─ ☾ *GOTICA PLAY* ☽ ─ 🦇

> 🎵 \`Título\` » *${title}*
> 📺 \`Canal\` » *${channel?.name || 'Desconhecido'}*
> ⏳ \`Duração\` » *${duration}*

🌑 *Olá! o áudio está sendo enviado...*
    `.trim()

    // Enviar a imagem com os detalhes
    const thumb = (await conn.getFile(thumbnail))?.data
    await conn.reply(m.chat, infoMessage, m, {
      contextInfo: {
        externalAdReply: {
          title: botNameGotica,
          body: `By: ${devLeandro}`,
          mediaType: 1,
          thumbnail: thumb,
          renderLargerThumbnail: true,
          mediaUrl: url,
          sourceUrl: url
        }
      }
    })

    // Enviar o Áudio
    await conn.sendMessage(m.chat, {
      audio: { url: data.url },
      fileName: `${title}.mp3`,
      mimetype: "audio/mpeg",
      ptt: false
    }, { quoted: m })
    
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key }})

  } catch (error) {
    console.error("Erro Spider X:", error)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key }})
    let erroMsg = error.response?.data?.message || error.message
    return m.reply(`🦇 *Erro VIP:* Falha na Spider X.\n\n*Motivo:* ${erroMsg}`)
  }
}

handler.help = ["play"]
handler.tags = ["descargas"]
handler.command = ["play", "musica"]

export default handler