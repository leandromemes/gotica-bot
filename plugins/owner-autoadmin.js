/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const handler = async (m, { conn, isAdmin }) => {
  if (isAdmin) return m.reply('*⚠️ Você já é um administrador deste grupo.*')
  
  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote')
    await m.react('✅')
    m.reply('*👑 Poder concedido! soberano Agora é um administrador.*')
  } catch (e) {
    console.error(e)
    m.reply('*❌ Ocorreu um erro ao tentar te dar adm. Verifique se eu tenho as permissões necessárias.*')
  }
}

handler.help = ['autoadmin']
handler.tags = ['owner']
handler.command = ['seradmin', 'viraradm', 'meadm']
handler.rowner = true // Exclusivo para o Soberano
handler.group = true // Só funciona em grupos
handler.botAdmin = true // O bot precisa ser adm para promover

export default handler