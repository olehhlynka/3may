import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './pages/main-page.tsx';
import SignIn from './pages/sign-in.tsx';
import CreatePost from './pages/create-post.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: 'sign-in',
    element: <SignIn />
  },
  {
    path: 'create-post',
    element: <CreatePost />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
