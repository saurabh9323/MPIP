FROM node:20-alpine

# 1. App lives here inside container
WORKDIR /app/gateway

# 2. Install dependencies
COPY package*.json ./
RUN npm install --production

# 3. Copy source code
COPY . .

# 4. Install PM2
RUN npm install -g pm2

# 5. Expose gateway port (change if different)
EXPOSE 4000

# 6. Start via PM2 (foreground, Docker-friendly)
CMD ["pm2-runtime", "npm", "--", "start"]
