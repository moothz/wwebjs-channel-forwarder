# WhatsApp Channel Forwarder

Este projeto tem como objetivo encaminhar mensagens de canais do WhatsApp para grupos de sua escolha.

## Funcionalidades

- Encaminha mensagens de canais para um ou mais grupos.
- Suporte para lista de permissão (whitelist) e lista de bloqueio (blacklist) de canais.
- Encaminha mensagens de texto, mídia (imagens, vídeos, stickers) e GIFs.
- Criado principalmente pois a EvolutionAPI não processa mensagens de canais, apenas de grupos

## Pré-requisitos

- Node.js
- Uma conta do WhatsApp

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/moothz/wwebjs-channel-forwarder.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Renomeie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente:
   - `CHANNELS_WHITELIST`: IDs dos canais que você deseja encaminhar (separados por vírgula). Deixe em branco para encaminhar de todos os canais.
   - `CHANNELS_BLACKLIST`: IDs dos canais que você não deseja encaminhar (separados por vírgula).
   - `GROUP_LIST`: IDs dos grupos para onde as mensagens serão encaminhadas (separados por vírgula).

## Como usar

1. Inicie o aplicativo:
   ```bash
   npm start
   ```

2. Na primeira vez que você executar, um código QR será exibido no terminal. Use o aplicativo do WhatsApp em seu celular para escanear o código QR.

3. Uma vez autenticado, o aplicativo estará pronto para encaminhar as mensagens dos canais para os grupos especificados.