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
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'

// --- CONFIGURAÇÃO DE DONO ---
global.owner = [
  ['556391330669', 'Soberano Leandro', true],
  ['240041947357401@lid', 'Soberano Leandro (LID)', true],
  ['556391176144', 'Gótica Bot - Leandro', true]
]

// --- CONFIGURAÇÕES DO BOT ---
global.botname = '𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 𝙈𝘿'
global.prefix = '/' // Definido apenas um prefixo para evitar erros no menu 💋⭐
global.wm = 'dev Leandro • Gótica Bot ⚡'
global.packname = '𝙂𝙊́𝙏𝙄𝘾𝘼 𝘽𝙊𝙏 𝙈𝘿'
global.author = 'dev Leandro'

// --- CHAVES RAPIDAPI ---
global.apiKeys = [
    'SUA_CHAVE_1_AQUI', 
    'SUA_CHAVE_2_AQUI', 
    'SUA_CHAVE_3_AQUI'
]

// --- LINKS ---
global.banner = 'https://files.catbox.moe/yyk5xo.jpg'
global.canal = 'https://whatsapp.com/channel/0029Vb7PsjVA89Md7LCwWN1u'
global.md = 'https://github.com/leandromemes/gotica-bot'

// --- SISTEMA ---
global.languaje = 'Português'
global.vs = '7.3.0'

// --- [ CORREÇÃO DE RECARREGAMENTO NO WINDOWS ] --- 💫
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.bold.greenBright(`\n[ RESTARTING ] → `) + chalk.white(`settings.js atualizado!`))
  
  // O segredo está aqui: pathToFileURL resolve o erro de 'C:' no Windows 💋
  import(`${pathToFileURL(file).href}?update=${Date.now()}`)
})