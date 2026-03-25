FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

RUN apt-get update && apt-get install -y \
    fonts-wqy-zenhei \
    fonts-wqy-microhei \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY backend ./backend
COPY frontend ./frontend

RUN mkdir -p midscene_run/report screenshots

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

EXPOSE 3000

USER pptruser

CMD ["node", "backend/server.js"]
