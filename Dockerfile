FROM node:18.15.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]

# docker image : docker pull blogify.azurecr.io/node-blogapp:v1
# deplyed on : blogify-node-app.azurewebsites.net