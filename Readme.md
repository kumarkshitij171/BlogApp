# Blog App

Welcome to the Blog App!

This is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Frontend

### Installation

1. Navigate to the `frontend` folder.
2. Run `npm install` to install dependencies.

cmd

```bash
cd frontend
npm install
```

### Usage

To start the React app, run:

```bash
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
- **Edit Profile**: Users can edit their profile information.
- **CRUD Operations**: Create, Read, Update, and Delete blog posts.
- **Responsive Design**: Mobile-friendly user interface.

## Technologies Used

- **Frontend**:
  - React.js
  - React Context (for state management)
  - React Router (for routing)
  - fetch (for HTTP requests)
  - Tailwind (for styling)
  - Yup (for form validation)
  - React Quill (for rich text editing)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (with Mongoose for ORM)
  - JSON Web Tokens (JWT) for authentication
  - Bcrypt (for password hashing)
  - Multer (for file uploads)
  - Cloudinary (for image uploads)
  - Sharp (for image resizing)

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

### Screenshots

- Home Page

![Home Page](image.png)

- Create/Edit Post

![Editor of the post](image-1.png)

- Delete Post

![Delete Post](image-2.png)

- Only Author have only edit and delete functionality

![Edit and Delete](image-3.png)

- User can view and update their profile

![Profile View](image-4.png)

- Comment and Reply on post

![Comment and Reply](CommentIMG.png)
<br>

### Deployed on Azure using Docker container

[Click Here!](https://github.com/kumarkshitij171/BlogApp/tree/Deployment)
