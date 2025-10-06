# Guia de Contribuição - Gótica Bot 🖤

O Gótica Bot é um projeto open source (código aberto) criado e mantido pelo **Leandro**. Sua contribuição é essencial para melhorias, correções de bugs e adição de novas funcionalidades.

## 🚀 Como Contribuir

Valorizamos código limpo e testado. Para começar a colaborar:

### Antes de Abrir um Pull Request
1. **Fork** o repositório `leandromemes/gotica-bot` no GitHub.
2. **Clone** o seu fork localmente.
3. **Crie uma branch** com nome descritivo (ex: `feat/comando-novo` ou `fix/corrige-comando-x`).
4. **Implemente** suas mudanças seguindo o padrão de código existente.
5. **Teste** todas as mudanças com o Node.js na versão 20 ou superior.
6. **Documente** o funcionamento com prints ou GIFs.

## 📋 Template Obrigatório para Pull Requests (PRs)

Seu PR deve seguir este padrão para agilizar a revisão:

### Título
Descrição clara e concisa do que foi implementado ou corrigido.

### Tipo de Mudança
Marque uma ou mais opções:
- [ ] 🐛 **Bug fix** (correção que resolve um problema de funcionamento)
- [ ] ✨ **Nova funcionalidade** (adiciona um novo recurso ao bot)
- [ ] 💥 **Breaking change** (mudança que exige que os usuários atualizem algo)
- [ ] ♻️ **Refatoração** (melhoria na estrutura ou performance do código)
- [ ] 📚 **Documentação** (mudanças apenas em arquivos de guia/README)

### Descrição Detalhada
Explique:
- Qual é o problema que esta PR resolve (ou qual funcionalidade adiciona).
- Por que a mudança é necessária.
- Como o código funciona.

### Checklist Obrigatório
- [ ] Foi testado no Node.js (v20+).
- [ ] Inclui prints/screenshots do comando em funcionamento.
- [ ] Usa funções já existentes na pasta `src/utils` quando aplicável.
- [ ] Segue o padrão de template de comandos (abaixo).
- [ ] Código devidamente comentado em português.

## 🔧 Criando Novos Comandos

### Template Obrigatório
Use o arquivo `🤖-como-criar-comandos.js` (ou similar) como base. **SEMPRE** utilize este template:

```javascript
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "comando",
  description: "Descrição do comando",
  commands: ["comando1", "comando2"],
  usage: `${PREFIX}comando`,
  /**
   * @param {import('baileys').AnyMessageContent} message
   * @returns {Promise<void>}
   */
  handle: async ({}) => {
    // código do comando
  },
};
