import { PREFIX } from "../../config.js";
import { setX9Status } from "../../utils/database.js"; // Note: Verifique se essa função existe no seu database.js, se não existir, me avise que te mando a lógica.

export default {
  name: "x9",
  description: "Ativa ou desativa o monitoramento de fofocas do grupo.",
  commands: ["x9"],
  usage: `${PREFIX}x9 1 ou 0`,

  handle: async ({ args, remoteJid, sendReply, sendSuccessReact }) => {
    if (!args[0]) return sendReply(`❌ Use *${PREFIX}x9 1* para ligar ou *0* para desligar.`);

    const status = args[0] === "1";
    // Aqui estamos salvando no banco de dados se o grupo quer o X9
    setX9Status(remoteJid, status);
    
    await sendSuccessReact();
    const msg = status 
      ? "🕵️‍♂️ *MODO X9 ATIVADO!*                                                       Nada escapa dos meus olhos. Vou fofocar cada movimentação desses plebeus!" 
      : "🙈 *MODO X9 DESATIVADO.*                                                         Vou fingir que não vejo as vergonhas que vocês passam.";
    
    return await sendReply(msg);
  },
};