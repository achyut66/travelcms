# Dockerfile in client directory
FROM node:18-alpine

WORKDIR /app

# Copy only package.json first for caching
COPY package.json ./

# If using yarn
# RUN yarn install

# If using npm
RUN npm install

# Copy remaining files
COPY . .

EXPOSE 3000

CMD ["npm", "run","dev"]
