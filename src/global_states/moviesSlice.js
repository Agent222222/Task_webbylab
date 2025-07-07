import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    movies: {       
        data: [],      // holds the array
        meta: null,   
        status: null   
    },
    isLoading: false,
    error: "",
};

//as we are using thunk here, we should be using the createAsyncThunk for the fetch


export const fetchMovies = createAsyncThunk(
    "movies/fetchMovies",
    async ({token, title, actor}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                sort: "year",
                order: "DESC",
                limit: "10",
                offset: "0",
            });

            if (title) params.append("title", title);
            if (actor) params.append("actor", actor);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/movies?${params.toString()}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error();

            return await response.json();
        } catch (error) {
            return rejectWithValue("Failed to fetch movies");
        }
    }
);

export const addMovie = createAsyncThunk(
    "movies/addMovie",
    async ({token, MovieData}, { rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/movies`, {
                method: "POST",
                headers: { 
                    Authorization: token,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(MovieData),
            });
            if (!response.ok) throw new Error();
            return await response.json();
        } catch {
            return rejectWithValue(`Failed to add Movie ${MovieData.title}`);
        }
    }
);

export const updateMovie = createAsyncThunk(
    "movies/updateMovies",
    async ({ token, id, data }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/movies/${id}`, {
                method: "PATCH",
                headers: { 
                    Authorization: token,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error();
            return { id, data: await response.json() };
        } catch {
            return rejectWithValue(`Failed to update Movie ${id}`);
        }
    }
);

export const deleteMovie = createAsyncThunk(
    "movies/deleteMovie",
    async ({token, id}, { rejectWithValue }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/movies/${id}`, {
                method: "DELETE",
                headers: { 
                    Authorization: token,
                    "Content-Type": "application/json" 
                },
            });
            if (!response.ok) throw new Error();

            return id;
        } catch {
            return rejectWithValue(`Failed to delete Movie ${id}`);
        }
    }
);

//this function is used to get details of the particular movie when we go to the url "movies/:id"
export const fetchMovieData = createAsyncThunk(
    "movies/fetchMovieData",
    async ({token, id}, { rejectWithValue }) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}/movies/${id}`, {
                method: "GET",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error();

            return await response.json();
        } catch (error) {
            return rejectWithValue(`Failed to fetch Movie ${id}`);
        }
    }
);

const MoviesSlice = createSlice({
    name: "movies",
    initialState,
    extraReducers: (builder) => { // for all above functions handling into the state
        builder
            .addCase(fetchMovies.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.movies.data = action.payload.data;
                state.movies.meta = action.payload.meta;
                state.movies.status = action.payload.status;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
        builder
            .addCase(addMovie.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(addMovie.fulfilled, (state, action) => {
                state.isLoading = false;
                state.movies.data.push(action.payload.data);
            })
            .addCase(addMovie.rejected, (state, action) => { 
                state.error = action.payload; 
            })
        builder
            .addCase(updateMovie.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(updateMovie.fulfilled, (state, { payload: { id, data } }) => {
                state.isLoading = false;
                const idx = state.movies.data.findIndex(p => p.id === id);
                if (idx !== -1) state.movies.data[idx] = { ...state.movies.data[idx], ...data };
            })
            .addCase(updateMovie.rejected, (state, action) => { 
                state.error = action.payload; 
            })
        builder
            .addCase(deleteMovie.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(deleteMovie.fulfilled, (state, {payload}) => {
                state.isLoading = false;
                state.movies.data = state.movies.data.filter(p => p.id !== payload);
            })
            .addCase(deleteMovie.rejected, (state, action) => { 
                state.error = action.payload; 
            })
        builder
            .addCase(fetchMovieData.pending, (state) => {
                state.isLoading = true;
                state.error = "";
                state.comments = [];
            })
            .addCase(fetchMovieData.fulfilled, (state, action) => {
                state.isLoading = false;
                const updated = action.payload.data;
                const idx = state.movies.data.findIndex(p => p.id === updated.id);
                if (idx !== -1) state.movies.data[idx] = updated;

            })
            .addCase(fetchMovieData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
})

export default MoviesSlice.reducer;