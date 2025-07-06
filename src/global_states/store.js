import { configureStore } from "@reduxjs/toolkit"

import moviesReducer from "./moviesSlice.js";
import authReducer from "./authSlice.js";

const store = configureStore({
    reducer: {
        movies: moviesReducer,
        user: authReducer,
    }
});

export default store;