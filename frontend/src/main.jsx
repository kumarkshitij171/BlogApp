import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import Post from './components/Post.jsx'
import CreatePost from './components/CreatePost.jsx'
import EditPost from './components/EditPost.jsx'
import PaymentSuccessPage from './components/helper/PaymentSuccessPage.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/create-post',
        element: <CreatePost />
      },
      {
        path: '/blog/:id',
        element: <Post />
      },
      {
        path: '/edit-post/:id',
        element: <EditPost />
      },
      {
        path: '/payment-success',
        element: <PaymentSuccessPage />
      },
    ],
    errorElement: <NotFoundPage />
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
