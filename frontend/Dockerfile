# 1. Base image
FROM node:20-alpine

# 2. App directory inside container
WORKDIR /app/frontend

# 3. Install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy source
COPY . .

# 5. Build Next.js app
RUN npm run build

# 6. Expose frontend port
EXPOSE 3000

# 7. Start frontend
CMD ["npm", "start"]
