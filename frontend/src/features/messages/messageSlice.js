import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import messageService from "./messageService";
import io from "socket.io-client";
const END_POINT = "http://localhost:5000";

export const socket = io(END_POINT);

const initialState = {
  messages: [],
  notifications: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getMessages = createAsyncThunk(
  "messages/get",
  async (chatId, thunkAPI) => {
    try {
      socket.emit("join chat", chatId);

      const token = thunkAPI.getState().auth.user.token;
      return await messageService.getAll(chatId, token);
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

export const sendMessage = createAsyncThunk(
  "messages/send",
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await messageService.send(messageData, token);
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

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    reset: (state) => {
      state.messages = [];
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    recieveMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    setNotifications: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    resetNotifications: (state, action) => {
      state.notifications = state.notifications.filter(
        (notif) => notif._id !== action.payload._id,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.isSuccess = true;
        state.message = "";
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        // state.messages = [];
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        socket.emit("new message", action.payload);
        state.isSuccess = true;
        state.messages = [...state.messages, action.payload];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  newMessage,
  recieveMessage,
  setNotifications,
  resetNotifications,
} = messageSlice.actions;

export default messageSlice.reducer;
