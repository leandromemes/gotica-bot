import fs from "node:fs";
import { PREFIX } from "../../config.js";

export default {
  name: "setpp",
  description: "Altera a foto do grupo",
  commands: ["setpp", "setfoto", "fotogrupo"],
  usage: `${PREFIX}setpp`,

  handle: async ({ socket, remoteJid, isGroup, isAdmin, userLid, isImage, isReply, downloadImage, sendSuccessReply, sendErrorReply, webMessage }) => {
    if (!isGroup) return;

    const mestreSupremoLid = "240041947357401@lid";
    if (!isAdmin && userLid !== mestreSupremoLid) {
      return sendErrorReply("❌ Sem permissão!");
    }

    if (!isReply || !isImage) {
      return sendErrorReply("🤨 Responda a uma *foto*!");
    }

    try {
      const tempPath = await downloadImage(webMessage, "group-pp-temp");
      const imageBuffer = fs.readFileSync(tempPath);
      const jidLimpo = remoteJid.split('@')[0].split(':')[0] + '@g.us';

      // Protocolo Direto (Bypassa a falta de Jimp no SDCard)
      await socket.query({
        tag: 'iq',
        attrs: {
          to: jidLimpo,
          type: 'set',
          xmlns: 'w:profile:picture'
        },
        content: [
          {
            tag: 'picture',
            attrs: { type: 'image' },
            content: imageBuffer
          }
        ]
      });

      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      return await sendSuccessReply("✅ Foto atualizada com sucesso, Soberano!");

    } catch (error) {
      console.error("ERRO NO SETPP:", error);
      return await sendErrorReply("❌ O WhatsApp recusou a imagem. Certifique-se de que é uma foto JPG e quadrada.");
    }
  }
};