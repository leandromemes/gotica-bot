/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

let handler = async (m, { text, conn }) => {
    // Inicializa o usuário no banco de dados se não existir (Sem trava de registro) 🌙
    let user = global.db.data.users[m.sender]
    if (!user) {
        global.db.data.users[m.sender] = {
            afk: -1,
            afkReason: '',
            name: conn.getName(m.sender)
        }
        user = global.db.data.users[m.sender]
    }

    user.afk = + new Date()
    user.afkReason = text || ''
    
    let msgAfk = `*┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆*\n`
    msgAfk += `*💤 MODO AFK ATIVADO*\n`
    msgAfk += `*─━━━━┉❈⏤͟͟͞͞★꙲⃝͟💤❈┉━━━━─*\n`
    msgAfk += `*┇┆👤 Usuário:* ${conn.getName(m.sender)}\n`
    msgAfk += `*┇┆📝 Motivo:* ${user.afkReason || 'Não especificado'}\n`
    msgAfk += `*┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ*\n\n`
    msgAfk += `_Eu vou avisar quando alguém responder suas mensagens enquanto você estiver fora!_ 💋`

    await conn.reply(m.chat, msgAfk, m)
}

handler.before = async function (m, { conn }) {
    if (m.fromMe) return 
    if (!global.db || !global.db.data || !global.db.data.users) return

    let user = global.db.data.users[m.sender]
    
    // 1. LÓGICA DE RETORNO (SAIR DO AFK) 💫
    if (user && user.afk > -1) {
        if (!m.text.match(/^(\.|\/|\#|!)afk/i)) {
            let tempo = +new Date - user.afk
            let ms = tempo
            let h = Math.floor(ms / 3600000)
            let m_a = Math.floor((ms % 3600000) / 60000)
            let s = Math.floor((ms % 60000) / 1000)
            
            let tempoFormatado = `${h > 0 ? h + 'h ' : ''}${m_a > 0 ? m_a + 'm ' : ''}${s}s`
            
            let msgVolta = `*┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆*\n`
            msgVolta += `*👋 BEM-VINDO(A) DE VOLTA!*\n`
            msgVolta += `*─━━━━┉❈⏤͟͟͞͞★꙲⃝͟✨❈┉━━━━─*\n`
            msgVolta += `*┇┆Você não está mais em modo AFK.*\n`
            msgVolta += `*┇┆⏱️ Tempo fora:* ${tempoFormatado}\n`
            msgVolta += `*┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ*\n`
            
            await conn.reply(m.chat, msgVolta, m)
            
            user.afk = -1
            user.afkReason = ''
        }
    }

    // 2. LÓGICA DE AVISO (QUANDO ALGUÉM RESPONDE OU MARCA) 🌙
    let jid = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null)
    
    if (jid && jid !== m.sender) {
        let afkUser = global.db.data.users[jid]
        if (afkUser && afkUser.afk > -1) {
            let reason = afkUser.afkReason || 'Não especificado'
            let tempoAfk = +new Date - afkUser.afk
            let h = Math.floor(tempoAfk / 3600000)
            let m_t = Math.floor((tempoAfk % 3600000) / 60000)

            let msgAviso = `*┎┶┅┅┅━═⋅═━━━━═⋅═━┅┅┅┅☾⋆*\n`
            msgAviso += `*⚠️ USUÁRIO AUSENTE*\n`
            msgAviso += `*─━━━━┉❈⏤͟͟͞͞★꙲⃝͟🖤❈┉━━━━─*\n`
            msgAviso += `*┇┆Ele(a) não vai ver sua resposta agora.*\n`
            msgAviso += `*┇┆📝 Motivo:* ${reason}\n`
            msgAviso += `*┇┆⏱️ Ausente há:* ${h > 0 ? h + 'h ' : ''}${m_t}m\n`
            msgAviso += `*┇├┉━┅━┅━┅━┅━┅━┅━⋅≎⋆ᐧ*\n`
            
            await conn.reply(m.chat, msgAviso, m)
        }
    }
}

handler.help = ['afk']
handler.tags = ['diversão']
handler.command = ['afk']
handler.group = true

export default handler