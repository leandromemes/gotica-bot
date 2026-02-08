/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Busca as configurações do chat atual no banco de dados
  let chat = global.db.data.chats[m.chat]

  if (!text) {
    await m.react('❓')
    return m.reply(`*⚠️ Soberano, informe o novo prefix para este grupo.*\n*Exemplo:* \`${usedPrefix + command} #\``)
  }

  // Verifica se o texto não é muito longo (prefixos geralmente são 1 caractere)
  if (text.length > 3) {
    await m.react('❌')
    return m.reply('*❌ Soberano, o prefix é muito longo. Use no máximo 3 caracteres.*')
  }

  // Salva o novo prefixo apenas para este grupo no banco de dados
  chat.prefix = text

  // ✅ REAÇÃO: Confirmando que o comando foi processado
  await m.react('✅')

  conn.reply(m.chat, `*✨ Prefix Alterado com Sucesso!* \n\n*A partir de agora, neste grupo, use:* \`${text}\` \n*Exemplo:* \`${text}menu\``, m)
}

handler.help = ['prefixo <caractere>']
handler.tags = ['group', 'admin']
handler.command = ['prefixo', 'prefix', 'setprefix']

handler.group = true 
handler.admin = true // Admins e o Soberano podem mudar
handler.rowner = false // Mudei para false para seus admins poderem configurar os grupos deles

export default handler