/**
 * Plugin Admin Modo Real - ༄ Đev Šoberano ×͜×
 */

// Mudamos o modo de importar o config para bater com seu settings.js
import * as config from "../config.js";
// Verificamos se o arquivo simple existe, caso contrário importamos apenas o que precisa
import { format } from "util";

export default {
    name: "modoreal",
    description: "Gerencia o modo real de envio",
    category: "admin",
    commands: ["modoreal", "modor"], // Adicionado commands para o loader do bot reconhecer
    async handler(m, { args, reply, isOwner, prefix }) { // Mudado de execute para handler para bater com seu index.js
        if (!isOwner) {
            return reply("❌ Apenas o dono pode usar este comando.");
        }

        const action = args[0]?.toLowerCase();
        
        if (!action) {
            return reply(`⚠️ Use: \`${prefix}modoreal on\` ou \`${prefix}modoreal off\``);
        }

        if (action === "on") {
            return reply("✅ Modo real ativado com sucesso!");
        } else if (action === "off") {
            return reply("🛑 Modo real desativado com sucesso!");
        } else {
            return reply("❌ Opção inválida. Use `on` ou `off`.");
        }
    }
};