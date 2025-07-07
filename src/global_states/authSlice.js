import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = { // the whole state is only token and status so I decided not to put it into object user
    token: '',
    status: 0,
    isLoading: false,
    error: "",
};

// both login and register methods return

// the create session method
export const login = createAsyncThunk(
    "movies/fetchMovies",
    async (data, { rejectWithValue }) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/sessions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error();

            return await res.json();
        } catch (error) {
            return rejectWithValue("Failed to login");
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error();

            return await res.json();
        } catch {
            return rejectWithValue(`Failed to register`);
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setData(state, action){ // this action creator function is used along with the localStorage to store the authenticated user for him/her not to re-authenticate each time
            state.token = action.payload.token;
            state.status = action.payload.status;
            state.isLoading = false;
            state.error = "";
        },
        logout(state, action){ // this is used to remove the user from localStorage and logout
            state.token = "";
            state.status = 0;
            state.isLoading = false;
            state.error = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.token) {
                    state.token = action.payload.token;
                    state.status = 1;
                } else {
                    state.error = "Cannot be authenticated";
                }
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.token) {
                    state.token = action.payload.token;
                    state.status = 1;
                } else {
                    state.error = "Cannot be authenticated";
                }
            })
            .addCase(login.rejected, (state, action) => { 
                state.error = action.payload; 
            })
    }
});

export const { setData, logout } = authSlice.actions;

export default authSlice.reducer;