# Node Image
FROM node:20.10.0-alpine3.13

# Create backend directory
WORKDIR /usr/src/backend

# Install app dependencies
COPY package*.json ./

# copy the rest of the files
COPY . .

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 8000

# Serve the app
CMD ["npm", "start"]