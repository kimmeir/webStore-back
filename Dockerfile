FROM node:20-alpine
LABEL authors="kimmeir"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3400
CMD ["npm", "run", "start"]