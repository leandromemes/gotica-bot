import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import moment from 'moment-timezone'

global.botNumber = '556391176144' 
global.owner = [
  ['556391176144', 'Gótica Bot - Leandro', true],
  ['556391176144', 'Dev Leandro Rocha', true],
  ['18294868853', 'Suporte Técnico', true]
];

global.mods = []
global.suittag = ['556391176144']
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
global.dev = 'Desenvolvido por: Leandro Rocha ⚙️'
global.textbot = '𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 𝙈𝘿 • Criado por Leandro Rocha'
global.etiqueta = 'dev Leandro Rocha ⚡'

global.Rubysessions = 'RubySession' 
global.jadi = 'GoticaJadiBots'
global.RubyJadibts = true 

global.moneda = 'GóticaCoins'
global.banner = 'https://files.catbox.moe/yyk5xo.jpg'
global.avatar = 'https://files.catbox.moe/yyk5xo.jpg'
global.canal = 'https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u'
global.md = 'https://github.com/leandromemes/gotica-bot'
global.correo = 'leandromemes.lr@gmail.com'

global.msg = {
  admin: '⚠️ *Este comando é apenas para administradores do grupo!*',
  group: '⚠️ *Este comando só pode ser usado dentro de grupos!*',
  private: '⚠️ *Este comando só pode ser usado no chat privado!*',
  owner: '⚠️ *Este comando é restrito ao meu criador (Leandro Rocha)!*',
  wait: '⌛ *Processando... Aguarde um momento por favor.*',
  error: '❌ *Ocorreu um erro ao executar este comando!*'
}

global.catalogo = fs.existsSync('./src/catalogo.jpg') ? fs.readFileSync('./src/catalogo.jpg') : fs.readFileSync('./src/yyk5xo.jpg') 
global.estilo = { 
  key: { 
    fromMe: false, 
    participant: `0@s.whatsapp.net`, 
    ...(false ? { remoteJid: "556391176144-1625305606@g.us" } : {}) 
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