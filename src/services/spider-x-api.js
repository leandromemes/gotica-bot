/**
 * Funções de comunicação
 * com a API do Spider X.
 *
 * @author Dev Gui
 */
const axios = require("axios");

const { SPIDER_API_TOKEN, SPIDER_API_BASE_URL } = require("../config");

/**
 * Não configure o token da Spider X API aqui, configure em: src/config.js
 */
const spiderAPITokenConfigured =
  SPIDER_API_TOKEN && SPIDER_API_TOKEN !== "seu_token_aqui";

const messageIfTokenNotConfigured = `Token da API do Spider X não configurado!
      
Para configurar, entre na pasta: \`src\` 
e edite o arquivo \`config.js\`:

Procure por:

\`exports.SPIDER_API_TOKEN = "seu_token_aqui";\`

Para obter o seu token, 
crie uma conta em: https://api.spiderx.com.br
e contrate um plano!`;

exports.spiderAPITokenConfigured = spiderAPITokenConfigured;

exports.play = async (type, search) => {
  if (!search) {
    throw new Error("Você precisa informar o que deseja buscar!");
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  const { data } = await axios.get(
    `${SPIDER_API_BASE_URL}/downloads/play-${type}?search=${encodeURIComponent(
      search
    )}&api_key=${SPIDER_API_TOKEN}`
  );

  return data;
};

exports.download = async (type, url) => {
  if (!url) {
    throw new Error(
      "Você precisa informar uma URL do YouTube do que deseja buscar!"
    );
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  const { data } = await axios.get(
    `${SPIDER_API_BASE_URL}/downloads/${type}?url=${encodeURIComponent(
      url
    )}&api_key=${SPIDER_API_TOKEN}`
  );

  return data;
};

exports.gemini = async (text) => {
  if (!text) {
    throw new Error("Você precisa informar o parâmetro de texto!");
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  const { data } = await axios.post(
    `${SPIDER_API_BASE_URL}/ai/gemini?api_key=${SPIDER_API_TOKEN}`,
    {
      text,
    }
  );

  return data.response;
};

exports.attp = async (text) => {
  if (!text) {
    throw new Error("Você precisa informar o parâmetro de texto!");
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  return `${SPIDER_API_BASE_URL}/stickers/attp?text=${encodeURIComponent(
    text
  )}&api_key=${SPIDER_API_TOKEN}`;
};

exports.ttp = async (text) => {
  if (!text) {
    throw new Error("Você precisa informar o parâmetro de texto!");
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  return `${SPIDER_API_BASE_URL}/stickers/ttp?text=${encodeURIComponent(
    text
  )}&api_key=${SPIDER_API_TOKEN}`;
};

exports.search = async (type, search) => {
  if (!search) {
    throw new Error("Você precisa informar o parâmetro de pesquisa!");
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  const { data } = await axios.get(
    `${SPIDER_API_BASE_URL}/search/${type}?search=${encodeURIComponent(
      search
    )}&api_key=${SPIDER_API_TOKEN}`
  );

  return data;
};

exports.welcome = (title, description, imageURL) => {
  if (!title || !description || !imageURL) {
    throw new Error(
      "Você precisa informar o título, descrição e URL da imagem!"
    );
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  return `${SPIDER_API_BASE_URL}/canvas/welcome?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(
    description
  )}&image_url=${encodeURIComponent(imageURL)}&api_key=${SPIDER_API_TOKEN}`;
};

exports.exit = (title, description, imageURL) => {
  if (!title || !description || !imageURL) {
    throw new Error(
      "Você precisa informar o título, descrição e URL da imagem!"
    );
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  return `${SPIDER_API_BASE_URL}/canvas/goodbye?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(
    description
  )}&image_url=${encodeURIComponent(imageURL)}&api_key=${SPIDER_API_TOKEN}`;
};

exports.imageAI = async (description) => {
  if (!description) {
    throw new Error("Você precisa informar a descrição da imagem!");
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  const { data } = await axios.get(
    `${SPIDER_API_BASE_URL}/ai/flux?text=${encodeURIComponent(
      description
    )}&api_key=${SPIDER_API_TOKEN}`
  );

  return data;
};

exports.canvas = (type, imageURL) => {
  if (!imageURL) {
    throw new Error("Você precisa informar a URL da imagem!");
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  return `${SPIDER_API_BASE_URL}/canvas/${type}?image_url=${encodeURIComponent(
    imageURL
  )}&api_key=${SPIDER_API_TOKEN}`;
};
/**
 * Envia uma imagem existente e um prompt para a IA editar ou modificar.
 *
 * @param {string} base64Image A imagem em formato Base64.
 * @param {string} prompt O texto descrevendo a edição.
 * @returns {Promise<string>} A URL da imagem editada.
 */
exports.editImageAI = async (base64Image, prompt) => {
  if (!base64Image || !prompt) {
    throw new Error("Você precisa informar a imagem em Base64 e o prompt de edição!");
  }

  if (!spiderAPITokenConfigured) {
    throw new Error(messageIfTokenNotConfigured);
  }

  // 🚨 Endpoint de geração de imagem da Spider X
  const url = `${SPIDER_API_BASE_URL}/ai/generate-image?api_key=${SPIDER_API_TOKEN}`; 

  try {
      const { data } = await axios.post(url, {
        prompt: prompt,
        image_base64: base64Image, // Enviamos a imagem em Base64
        model: "gemini-2.5-flash" 
      });

      // Se a API retornar a URL diretamente no objeto data:
      if (data && data.url) {
        return data.url;
      }
      
      // Se a API retornar em um formato aninhado:
      if (data && data.result && data.result.url) {
          return data.result.url;
      }

      // Se a API retornar um erro, ou o formato for inesperado
      throw new Error(data.message || "A API de IA da Spider X não conseguiu editar a imagem. Tente um prompt diferente.");

  } catch (error) {
      // Trata erros de requisição
      const errorMessage = error.response?.data?.message || error.message || "Erro desconhecido ao comunicar com a API de IA.";
      throw new Error(errorMessage);
  }
};