import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import messageReducer from "../features/messages/messageSlice";
import usersReducer from "../features/users/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatReducer,
    users: usersReducer,
    messages: messageReducer,
  },
});
