# Blog App

Welcome to the Blog App!

This is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Frontend

### Installation

1. Navigate to the `frontend` folder.
2. Run `npm install` to install dependencies.

cmd
``` bash
cd frontend
npm install
```

### Usage

To start the React app, run:

``` bash
npm run dev
```

The app will be running at `http://localhost:5173`.

## Backend

### Installation

1. Navigate to the `backend` folder.
2. Run `npm install` to install dependencies.

#### cmd
```bash
cd backend
npm install
```

### Configuration

Make sure you have MongoDB installed and running. Update the `.env` file in the `backend` folder with your MongoDB URI & Cloudinary API key.

### Usage

To start the Node.js server, run:

```bash
npm start
```

The server will be running on port `8080`.

## Features

- **Authentication**: User authentication using JWT tokens.
- **CRUD Operations**: Create, Read, Update, and Delete blog posts.
- **Responsive Design**: Mobile-friendly user interface.

## Technologies Used

- **Frontend**:
  - React.js
  - React Context (for state management)
  - React Router (for routing)
  - fetch (for HTTP requests)
  - Tailwind (for styling)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (with Mongoose for ORM)
  - JSON Web Tokens (JWT) for authentication


## Contributing

Contributions are welcome! Please feel free to submit pull requests.

### screenshots

- Home Page

![alt text](image.png)

- Create/Edit Post

![alt text](image-1.png)

- Delete Post

![alt text](image-2.png)

- Only Author have only edit and delete functionality

![alt text](image-3.png)