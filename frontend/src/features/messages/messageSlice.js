import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import messageService from "./messageService";
import io from "socket.io-client";
const VITE_ENDPOINT = import.meta.env.VITE_ENDPOINT || "http://localhost:5000";

export const socket = io(VITE_ENDPOINT, {
  withCredentials: true,
  autoConnect: true,
  transports: ["websocket"],
});

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

      return await messageService.getAll(chatId);
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

// export const sendMessage = createAsyncThunk(
//   "messages/send",
//   async (messageData, thunkAPI) => {
//     try {
//       socket.emit("new message", messageData);
//       socket.on("error", (err) => console.log(err));
//       socket.on("message saved", (message) => {
//         console.log(message);
//         //messageSlice.actions.recieveMessage(message);
//       });
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   },
// );

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
    sendMessage: (state, action) => {
      state.isSuccess = true;
      state.messages = [...state.messages, action.payload];
    },
    sendMessageError: (state, action) => {
      state.isSuccess = false;
      state.isError = true;
      state.message = action.payload;
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
        state.messages = [...state.messages, ...action.payload.reverse()];
        state.isSuccess = true;
        state.message = "";
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        // state.messages = [];
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
    // .addCase(sendMessage.fulfilled, (state, action) => {
    //   state.isSuccess = true;
    //   // state.messages = [...state.messages, action.payload];
    // })
    // .addCase(sendMessage.rejected, (state, action) => {
    //   state.message = action.payload;
    // });
  },
});

export const {
  reset,
  newMessage,
  recieveMessage,
  setNotifications,
  resetNotifications,
  sendMessage,
  sendMessageError,
} = messageSlice.actions;

export default messageSlice.reducer;
