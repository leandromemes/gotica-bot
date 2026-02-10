/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const handler = async (m, { conn, args, participants, command, isAdmin, isOwner }) => {
  // Esculacho para curiosos
  if (!isAdmin && !isOwner) return m.reply('🤔 Quem você pensa que é? Você não passa de um inseto insignificante nesse grupo. Só o Soberano ou os ADMs têm o direito de fazer uma limpa aqui!')

  const ddd = args[0]
  if (!ddd || !ddd.startsWith('+')) {
    return m.reply(`*🦇 Erro:* Você deve especificar um DDD válido com o sinal de +.\nExemplo: *.${command} +5511*`)
  }

  const botNumber = conn.user.id.split(':')[0]
  const groupMetadata = await conn.groupMetadata(m.chat)
  const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)

  const matching = participants.filter(p => 
    p.id.startsWith(ddd.replace('+', '')) &&
    p.id !== botNumber &&
    !admins.includes(p.id)
  )

  // Comando para LISTAR os números por DDD
  if (command === 'listaddd') {
    if (matching.length === 0) return m.reply(`*🦇 Erro:* Não encontrei nenhum usuário com o DDD/Prefixo ${ddd}`)

    const lista = matching.map((p, i) => `${i + 1}. wa.me/${p.id.split('@')[0]}`).join('\n')
    return m.reply(`🔎 *Lista de usuários com o DDD ${ddd}:*\n\n${lista}`)
  }

  // Comando para BANIR os números por DDD
  if (command === 'banddd') {
    if (matching.length === 0) return m.reply(`*🦇 Erro:* Não encontrei usuários para expulsar com o DDD ${ddd}`)

    m.reply(`*🌑 Iniciando extermínio de ${matching.length} insetos...*`)

    for (let p of matching) {
      // Delay de 0.5s conforme solicitado para ser rápido e seguro
      await new Promise(resolve => setTimeout(resolve, 500))
      await conn.groupParticipantsUpdate(m.chat, [p.id], 'remove').catch(_ => null)
    }
    return m.reply(`*✅ Sucesso:* O DDD ${ddd} foi limpo. ${matching.length} usuários foram removidos.`)
  }
}

handler.help = ['banddd']
handler.tags = ['admin']
handler.command = ['listaddd', 'banddd'] // Handlers atualizados
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.register = false 

export default handler