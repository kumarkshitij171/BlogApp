# Node Image
FROM node:20.10.0-alpine3.13

# Create frontend directory
WORKDIR /usr/src/frontend

# Install app dependencies
COPY package*.json ./

# copy the rest of the files
COPY . .

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 5173

# Serve the app
CMD ["npm", "run dev"]