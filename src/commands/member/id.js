/**
 * Comando para capturar IDs e LIDs
 * Essencial para configurar a Proteção do Mestre Supremo.
 * @author Leandro (Soberano) & Gemini
 */

export default {
  name: "id",
  description: "Mostra o ID do grupo, seu LID ou de quem você marcar.",
  commands: ["id", "jid", "identificador"],

  handle: async ({ remoteJid, userLid, sendReply, webMessage }) => {
    // Captura o ID do grupo atual
    const groupJid = remoteJid;
    // Captura o LID de quem enviou o comando
    const myLid = userLid;
    
    // Tenta capturar o JID de alguém marcado ou de uma resposta
    let targetJid;
    const mentions = webMessage.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const reply = webMessage.message?.extendedTextMessage?.contextInfo?.participant;

    if (mentions?.length > 0) targetJid = mentions[0];
    else if (reply) targetJid = reply;

    let msg = `🆔 *IDENTIFICADORES* 🆔\n\n`;
    
    msg += `🏰 *ID deste Grupo:* \n\`${groupJid}\`\n\n`;
    
    msg += `👤 *Seu Identificador (LID):* \n\`${myLid}\`\n`;

    if (targetJid) {
        msg += `\n🎯 *ID do Alvo marcado:* \n\`${targetJid}\``;
    }

    msg += `\n\n_faça bom proveito do ID do grupo mestre!_ 🫡`;

    await sendReply(msg);
  }
};