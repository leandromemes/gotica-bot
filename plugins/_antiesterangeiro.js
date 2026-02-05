/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

const TARGET_JID_DONO = '240041947357401@lid'
const DONO_PHONE = '556391330669'

let handler = m => m
handler.before = async function (m, { conn, isBotAdmin }) {
    if (!m.isGroup) return !1
    
    // REGRA SOBERANA: O sistema nunca rejeita o Leandro
    const eDono = (m.sender.includes(DONO_PHONE) || m.sender === TARGET_JID_DONO)
    if (eDono) return !1

    let chat = global.db.data.chats[m.chat]
    
    // Verifica se o Bot é ADM e se a função antiesterangeiro está ativa
    if (isBotAdmin && chat?.antiesterangeiro) {
        // Lista de prefixos de países bloqueados (Spam/Estrangeiros)
        const prefixosBloqueados = ['6', '90', '963', '966', '967', '249', '212', '92', '93', '94', '7', '49', '2', '91', '48']
        
        if (prefixosBloqueados.some(prefixo => m.sender.startsWith(prefixo))) {
            try {
                // Rejeita o pedido de entrada ou remove o participante
                await conn.groupRequestParticipantsUpdate(m.chat, [m.sender], 'reject')
                console.log(`[🛡️ SEGURANÇA] Estrangeiro ${m.sender} barrado pelo Soberano.`)
            } catch (e) {
                console.error('Erro ao barrar estrangeiro:', e)
            }
        }
    }
    return !0
}

export default handler