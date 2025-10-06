const { PREFIX } = require(`${BASE_DIR}/config`);
const axios = require("axios");
const { SPIDER_API_BASE_URL, SPIDER_API_TOKEN } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  // NOVO NOME BASE DO COMANDO
  name: "apisaldo", 
  description: "Consulta o saldo de requests restantes da Spider X API",
  // NOVOS ALIASES
  commands: ["apisaldo", "spider"], 
  usage: `${PREFIX}apisaldo`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, sendWaitReact }) => {
    await sendWaitReact();

    const response = await axios.get(
      `${SPIDER_API_BASE_URL}/saldo?api_key=${SPIDER_API_TOKEN}`
    );

    if (!response.data.success) {
      throw new DangerError(`Erro ao consultar saldo! ${response.message}`);
    }

    const { user, plan, requests_left, end_date } = response.data;

    const [year, month, day] = end_date.split("-");

    await sendSuccessReply(`🤖 *Saldo da Spider X API*
      
👤 *Usuário:* ${user}
📦 *Plano:* ${plan}
🔢 *Requests restantes:* ${requests_left}
📅 *Validade do plano:* ${day}/${month}/${year}`);
  },
};