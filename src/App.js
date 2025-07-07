import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import AuthForm from "./components/AuthForm";
import MovieList from "./components/MovieList";
import Error from "./components/Error";
import PageNotFound from "./components/PageNotFound";
import Movie from "./components/Movie";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useSelector } from "react-redux";
import Spinner from "./components/Spinner.jsx";

//configuration (in case npm i did not work after git pull):
// npm install react-router-dom
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p
// add @tailwind base; @tailwind components; @tailwind utilities; to index.css
// npm i redux 
// npm i react-redux
// npm i redux-thunk
// npm i @reduxjs/toolkit
// npm i axios

const router = createBrowserRouter([
  {path: "/", element: <Navigate replace to='/login'/>, errorElement: <Error/>},
  {path: "/login", element: <AuthForm/>, errorElement: <Error/>},
  {path: "/register", element: <AuthForm/>, errorElement: <Error/>},
  { 
    path: "/movies", 
    element: <ProtectedRoute><MovieList/></ProtectedRoute>, 
    errorElement: <Error/>
  },
  {
    path: "/movies/:id", 
    element: <ProtectedRoute>< Movie/></ProtectedRoute>, 
    errorElement: <Error/>, 
  },
  {path: "*", element: <PageNotFound/>},
]);

function App() {
  const isLoading = useSelector(state => state.user.isLoading);
  return ( 
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
