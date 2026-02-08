/**
 * ╔═╗ ╔═╗ ╔╦╗ ╦ ╔═╗ ╔═╗      ╔╗  ╔═╗ ╔╦╗
 * ║ ╦ ║ ║  ║  ║ ║   ╠═╣      ╠╩╗ ║ ║  ║ 
 * ╚═╝ ╚═╝  ╩  ╩ ╚═╝ ╩ ╩      ╚═╝ ╚═╝  ╩ 
 * @author Leandro Rocha
 * @link https://github.com/leandromemes
 * @project Gotica Bot
 */

import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*✨ O que deseja buscar?*\n\n*Exemplo:*\n*${usedPrefix + command} Naruto*`);

    try {
        await m.react('🔍');
        
        // Fazendo a busca via Pinterest da Lolhuman usando sua chave
        const res = await axios.get(`https://api.lolhuman.xyz/api/pinterest?apikey=${global.lolkeysapi}&query=${encodeURIComponent(text)}`);
        
        if (res.data.status !== 200) {
            return m.reply(`*⚠️ Erro na API:* ${res.data.message}`);
        }

        const image = res.data.result;

        // Envia a imagem real
        await conn.sendFile(m.chat, image, 'imagem.jpg', `*📌 PINTEREST*\n\n*🔍 Termo:* ${text}\n*👤 por:* gotica bot 💋`, m);
        await m.react('✅');

    } catch (e) {
        console.error(e);
        m.reply('*❌ Erro ao buscar imagem. Verifique se sua API Key é válida ou se o termo é permitido.*');
    }
};

handler.help = ['img'];
handler.tags = ['buscador'];
handler.command = ['pin', 'imagen', 'imagem', 'pinterest'];
handler.register = false; 

export default handler;