// src/services/youtube.js

const axios = require('axios');

// 🚨 SUA CHAVE DE API REAL INSERIDA AQUI! 🚨
const API_KEY = "AIzaSyA6XLJGL9Zna1AH9OZUk_Jms8px5c187BA"; 
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Encontra o ID e o nome do canal dado um termo de pesquisa.
 */
async function searchChannel(query) {
    const searchUrl = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&maxResults=1&key=${API_KEY}`;
    
    try {
        const response = await axios.get(searchUrl);
        const item = response.data.items[0];
        if (!item) return null;

        return {
            channelId: item.id.channelId,
            channelName: item.snippet.channelTitle
        };
    } catch (error) {
        console.error("Erro na busca do canal na API do YouTube:", error);
        return null;
    }
}

/**
 * Consulta a contagem de inscritos e a URL da miniatura dado o ID do canal.
 */
async function getChannelDetails(channelId) {
    // Pedimos estatísticas E a miniatura (snippet)
    const statsUrl = `${BASE_URL}/channels?part=statistics,snippet&id=${channelId}&key=${API_KEY}`;

    try {
        const response = await axios.get(statsUrl);
        const item = response.data.items[0];
        
        if (!item) return { subscribers: "Não Informado", thumbnailUrl: null };
        
        const subscribers = item.statistics?.subscriberCount ? parseInt(item.statistics.subscriberCount).toLocaleString('pt-BR') : "Não Informado";
        
        // Extrai a URL da miniatura (usando a versão alta para melhor qualidade)
        const thumbnailUrl = item.snippet.thumbnails.high.url || item.snippet.thumbnails.default.url;
        
        return { subscribers, thumbnailUrl };
        
    } catch (error) {
        console.error("Erro ao obter estatísticas e miniatura:", error);
        return { subscribers: "Não Informado", thumbnailUrl: null };
    }
}

module.exports = { searchChannel, getChannelDetails };