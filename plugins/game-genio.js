/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `*✨ Por favor, Soberano, faça uma pergunta ao Gênio.* 💋\n\n*Exemplo:* ${usedPrefix}${command} Eu serei rico?`, m)

  const respostas = [
    'Sim.',
    'É melhor eu não te dizer agora... 🌙',
    'Sim, definitivamente.',
    'Você deve confiar nisso.',
    'Minhas fontes dizem que não. 🖤',
    'Não conte com isso.',
    'Não posso prever agora.',
    'Muito duvidoso.',
    'As perspectivas não são boas.',
    'Concentre-se e pergunte novamente.',
    'Na minha opinião, sim.',
    'É verdade.',
    'Provavelmente.',
    'Tudo indica que sim.',
    'Minha resposta é não.',
    'Definitivamente não.',
    'Pergunte em outro momento.',
    'Não tenho certeza, tente de novo.',
    'Claro que sim! ✨',
    'Os sinais apontam que sim.',
    'Talvez.',
    'Duvido muito.',
    'Não vejo como possível.',
    'Pode ser, mas não se confie.',
    'Conte com isso.',
    'Não saberia te dizer.',
    'Confie na sua intuição. 💫',
    'Parece que sim, mas com cautela.',
    'Meus sensores dizem que sim.',
    'Não posso responder a isso agora.',
    'Com certeza.',
    'Só o tempo dirá.',
    'Não há dúvida alguma.',
    'Não é o momento adequado para saber.',
    'É altamente provável.',
    'Não crie ilusões. 🖤',
    'Definitivamente sim.',
    'Não está claro neste momento.',
    'Depende de como você vê.',
    'Prefiro não responder. 💋'
  ]

  // Link novo e estável (Imgur ou similar é melhor que Catbox)
  const imagen = 'https://files.catbox.moe/0g7l2j.png' 

  const resposta = respostas[Math.floor(Math.random() * respostas.length)]

  await conn.sendMessage(m.chat, { 
    image: { url: imagen }, 
    caption: `---⭑꒷꒦꒷〘 PREVISÃO 〙꒷꒦꒷⭑---\n\n*💋 Pergunta:* ${text}\n\n*🔮 Resposta:* ${resposta}\n\n╰─⭑꒷꒦꒷〘 🌙🖤 〙꒷꒦꒷⭑─╯`,
    mimetype: 'image/jpeg'
  }, { quoted: m })
}

handler.help = ['genio <pergunta>']
handler.tags = ['fun']
handler.command = ['akinator', 'genio', 'gênio']

// Regras do Soberano
handler.register = false

export default handler