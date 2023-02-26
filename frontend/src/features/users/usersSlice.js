import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import usersService from "./usersService";

const initialState = {
  users: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const searchUsers = createAsyncThunk(
  "users/search",
  async (querry, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await usersService.search(querry, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = usersSlice.actions;
export default usersSlice.reducer;
