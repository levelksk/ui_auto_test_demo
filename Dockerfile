FROM ghcr.io/puppeteer/puppeteer:latest

USER root

WORKDIR /app

RUN sed -i 's|http://deb.debian.org|http://mirrors.aliyun.com|g' /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
    sed -i 's|http://deb.debian.org|http://mirrors.aliyun.com|g' /etc/apt/sources.list 2>/dev/null || true

RUN apt-get update && apt-get install -y \
    fonts-wqy-zenhei \
    fonts-wqy-microhei \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY backend ./backend
COPY frontend ./frontend

RUN mkdir -p midscene_run/report midscene_run/log screenshots && \
    chown -R pptruser:pptruser /app

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/home/pptruser/.cache/puppeteer/chrome/linux-146.0.7680.153/chrome-linux64/chrome

EXPOSE 3000

USER pptruser

CMD ["node", "backend/server.js"]
