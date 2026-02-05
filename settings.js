/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import moment from 'moment-timezone'

global.botNumber = '556391176144' 

// CONFIGURAÇÃO SUPREMA DE DONO (DEUS)
global.owner = [
  ['556391330669', 'Soberano Mestre Leandro', true],
  ['240041947357401@lid', 'Soberano Mestre Leandro (LID)', true],
  ['556391176144', 'Gótica Bot - Leandro', true],
  ['18294868853', 'Suporte Técnico', true]
];

global.mods = []
global.suittag = ['556391330669']
global.prems = []

// PREFIXO COMO STRING PARA EVITAR ERROS NO HANDLER
global.prefix = new RegExp('^[' + ('.').replace(/[|\\{}()[\]^$+*?.]/g, '\\$&') + ']')
global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.languaje = 'Português'
global.vs = '7.3.0'
global.nameqr = 'Gótica-Bot-MD'
global.namebot = '𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 𝙈𝘿 🤖'
global.wm = 'dev Leandro • Gótica Bot ⚡'
global.botname = '𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 𝙈𝘿'
global.packname = '𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 𝙈𝘿'
global.author = 'dev Leandro'
global.dev = 'Desenvolvido por: Leandro ⚙️'
global.textbot = '𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 𝙈𝘿 • Criado por Leandro'
global.etiqueta = 'dev Leandro ⚡'

global.Rubysessions = 'GoticaSession' 
global.jadi = 'GoticaJadiBots'
global.RubyJadibts = true 

global.moneda = 'GóticaCoins'
global.banner = 'https://files.catbox.moe/yyk5xo.jpg'
global.avatar = 'https://files.catbox.moe/yyk5xo.jpg'
global.canal = 'https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u'
global.md = 'https://github.com/leandromemes/gotica-bot'
global.correo = 'leandromemes.lr@gmail.com'

// --- MENSAGENS COM PURO DEBOCHE ---
global.msg = {
  admin: '💅 *Quem você pensa que é? Hum hum... Ponha-se no seu lugar! Este comando é exclusivo para os Admins. Você não tem brilho para usar isso!*',
  group: '🙄 *Querido(a), este comando só funciona em grupos. Não tente brilhar no privado que aqui você é só um plebeu comum!*',
  private: '🤫 *Shhh! Esse comando é íntimo, só para o meu privado. Não exponha sua falta de classe em grupos!*',
  owner: '👑 *Pare tudo! Quem te deu audácia? Este comando é restrito ao meu Mestre Supremo Leandro. Você não tem o pedigree necessário!*',
  wait: '⌛ *Aguarde, plebeu... Estou processando. Nem tudo é no seu tempo, tenha paciência ou retire-se!*',
  error: '❌ *Ai que horror! Ocorreu um erro. Até eu me cansei da sua incompetência agora!*'
}

global.catalogo = fs.existsSync('./src/catalogo.jpg') ? fs.readFileSync('./src/catalogo.jpg') : fs.readFileSync('./src/yyk5xo.jpg') 
global.estilo = { 
  key: { 
    fromMe: false, 
    participant: `0@s.whatsapp.net`, 
    ...(false ? { remoteJid: "556391330669-1625305606@g.us" } : {}) 
  }, 
  message: { 
    orderMessage: { 
      itemCount : 999999, 
      status: 1, 
      surface : 1, 
      message: '𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏', 
      orderTitle: 'Leandro Dev', 
      thumbnail: global.catalogo, 
      sellerJid: '0@s.whatsapp.net'
    }
  }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Arquivo 'settings.js' atualizado com sucesso!"))
  import(`${file}?update=${Date.now()}`)
})