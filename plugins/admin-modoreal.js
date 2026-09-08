/**
 * Plugin Admin Modo Real - ༄ Đev Šoberano ×͜×
 */

import { simple } from "../../lib/simple.js";
import config from "../config.js";

export default {
    name: "modoreal",
    description: "Gerencia o modo real de envio",
    category: "admin",
    cooldown: 3,
    async execute({ conn, m, args, reply, isOwner }) {
        if (!isOwner) {
            return reply("❌ Apenas o dono pode usar este comando.");
        }

        const action = args[0]?.toLowerCase();
        
        if (!action) {
            return reply("⚠️ Use: `/modoreal on` ou `/modoreal off`", { parse_mode: "Markdown" });
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