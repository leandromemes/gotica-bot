/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import { tmpdir } from 'os'
import path, { join } from 'path'
import { readdirSync, statSync, unlinkSync, existsSync } from 'fs'

let handler = async (m, { conn, __dirname }) => { 

    // Primeiro enviamos a mensagem para garantir que o bot não tente ler 'm' depois que os arquivos sumirem
    await conn.reply(m.chat, '*🧹 Iniciando faxina nas pastas temporárias...*', m)

    try {
        const pastas = [tmpdir(), join(__dirname, '../tmp')]
        let contador = 0

        pastas.forEach(diretorio => {
            if (existsSync(diretorio)) {
                const arquivos = readdirSync(diretorio)
                for (const arquivo of arquivos) {
                    const caminhoCompleto = join(diretorio, arquivo)
                    try {
                        // Não deleta arquivos de sistema essenciais
                        if (arquivo === '.gitignore' || arquivo === 'readme.txt') continue
                        
                        unlinkSync(caminhoCompleto)
                        contador++
                    } catch (err) {
                        // Pula arquivos que estão abertos ou protegidos
                        continue
                    }
                }
            }
        })

        return conn.reply(m.chat, `*✅ Faxina concluída, Soberano!*\n\n> *Arquivos removidos:* ${contador}\n> *Status:* Sistema leve.`, m)

    } catch (e) {
        console.error(e)
        return conn.reply(m.chat, '*❌ Ocorreu um erro crítico durante a limpeza.*', m)
    }
}

handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = ['deltmp', 'limpartmp', 'limparlixo']
handler.rowner = true 

export default handler