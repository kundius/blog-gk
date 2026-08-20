FROM node:22-alpine
RUN npm install -g opencode-ai
WORKDIR /app
EXPOSE 5023
CMD ["opencode", "serve", "--hostname", "0.0.0.0", "--port", "5023"]