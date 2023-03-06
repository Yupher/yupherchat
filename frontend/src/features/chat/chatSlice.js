import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatService from "./chatService";

const initialState = {
  chats: [],
  selectedChat: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getChats = createAsyncThunk("chat/get", async (_, thunkAPI) => {
  try {
    return await chatService.getChats();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const accessChat = createAsyncThunk(
  "chat/access",
  async (userId, thunkAPI) => {
    try {
      return await chatService.accessChat(userId);
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

export const createGroup = createAsyncThunk(
  "chat/createGroup",
  async (groupData, thunkAPI) => {
    try {
      return await chatService.createGroup(groupData);
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

export const renameGroup = createAsyncThunk(
  "chat/renameGroup",
  async (groupData, thunkAPI) => {
    try {
      return await chatService.renameGroup(groupData);
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

export const addToGroup = createAsyncThunk(
  "chat/addToGroup",
  async (groupData, thunkAPI) => {
    try {
      return await chatService.addToGroup(groupData);
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

export const deleteFromGroup = createAsyncThunk(
  "chat/deleteFromGroup",
  async (groupData, thunkAPI) => {
    try {
      return await chatService.deleteFromGroup(groupData);
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

export const deleteGroup = createAsyncThunk(
  "chat/deleteGroup",
  async (id, thunkAPI) => {
    try {
      return await chatService.deleteGroup(id);
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

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = "";
    },
    selectChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
    clearChats: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getChats.rejected, (state, action) => {
        state.chats = [];
        chatService.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(accessChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        state.selectedChat = action.payload;
        state.chats = [action.payload, ...state.chats];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(accessChat.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(createGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.selectedChat = action.payload;
        state.chats = [action.payload, ...state.chats];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(renameGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(renameGroup.fulfilled, (state, action) => {
        state.selectedChat = action.payload;
        state.chats = [
          action.payload,
          ...state.chats.filter((chat) => chat._id !== action.payload._id),
        ];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(renameGroup.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(addToGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToGroup.fulfilled, (state, action) => {
        state.selectedChat = action.payload;
        state.chats = [
          action.payload,
          ...state.chats.filter((chat) => chat._id !== action.payload._id),
        ];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addToGroup.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(deleteFromGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFromGroup.fulfilled, (state, action) => {
        state.selectedChat = null;
        state.chats = [
          ...state.chats.filter((chat) => chat._id !== action.payload._id),
        ];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteFromGroup.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(deleteGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.selectedChat = null;
        state.chats = [
          ...state.chats.filter((chat) => chat._id !== action.payload.id),
        ];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export const { reset, selectChat, clearSelectedChat, clearChats } =
  chatSlice.actions;
export default chatSlice.reducer;
