import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RELACIONAMENTOS_FILE = path.resolve(__dirname, '..', '..', 'database', 'relacionamentos.json');

// --- Funções Internas de Leitura/Escrita ---
const readData = () => {
    if (!fs.existsSync(RELACIONAMENTOS_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(RELACIONAMENTOS_FILE, 'utf-8'));
    } catch (e) {
        return {};
    }
};

const writeData = (data) => {
    if (!fs.existsSync(path.dirname(RELACIONAMENTOS_FILE))) {
        fs.mkdirSync(path.dirname(RELACIONAMENTOS_FILE), { recursive: true });
    }
    fs.writeFileSync(RELACIONAMENTOS_FILE, JSON.stringify(data, null, 2));
};

// --- Funções Auxiliares ---
export const cleanJid = (jid) => jid ? jid.replace(/:[0-9][0-9]|:[0-9]/g, "").split('@')[0] + '@s.whatsapp.net' : "";

// --- FUNÇÕES DE RELACIONAMENTO ---
export const lerRelacionamentos = () => readData();
export const salvarRelacionamentos = (data) => writeData(data);

export const getRelacionamentoStatus = (groupId, jid) => {
    const cleanedJid = cleanJid(jid); 
    const relacionamentos = lerRelacionamentos();
    const groupRelacionamentos = relacionamentos[groupId] || {};
    return groupRelacionamentos[cleanedJid] || null;
};

export const terminarRelacionamento = (groupId, jid) => {
    const cleanedJid = cleanJid(jid); 
    const relacionamentos = lerRelacionamentos();
    const groupRelacionamentos = relacionamentos[groupId] || {};
    const status = groupRelacionamentos[cleanedJid];
    
    if (!status) return null;
    
    const parceiroJid = status.parceiro;
    delete groupRelacionamentos[cleanedJid];
    
    if (parceiroJid && groupRelacionamentos[parceiroJid]) {
        delete groupRelacionamentos[parceiroJid];
    }

    relacionamentos[groupId] = groupRelacionamentos;
    salvarRelacionamentos(relacionamentos);
    
    return parceiroJid;
};