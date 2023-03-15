# Step 1. Rebuild the source code only when needed
FROM node:18-alpine AS deps

WORKDIR /app
COPY frontend/dist ./frontend/dist

COPY package.json .
RUN npm install --production
COPY server.js .

CMD node server.js