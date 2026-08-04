FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
RUN apk add --no-cache openssl ca-certificates curl
RUN curl -sSf -o /usr/local/share/ca-certificates/russian-trusted-root-ca.crt \
  https://gu-st.ru/content/lending/russian_trusted_root_ca_pem.crt && \
  update-ca-certificates
ENV NODE_OPTIONS="--use-system-ca"
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
EXPOSE 4000
# Миграции применяются вручную (./run.sh deploy), не при каждом старте контейнера.
CMD ["node", "dist/main.js"]
