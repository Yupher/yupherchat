import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Box, Spinner } from "@chakra-ui/react";
import { getChats, reset } from "../features/chat/chatSlice";
import SideDrawer from "../Components/layouts/SideDrawer";
import MyChats from "../Components/chats/MyChats";
import Chatbox from "../Components/chats/Chatbox";
import {
  socket,
  setNotifications,
  recieveMessage,
} from "../features/messages/messageSlice";
import { getAuthUser } from "../features/auth/authSlice";

const Chats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { chats, selectedChat, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.chats);

  useEffect(() => {
    dispatch(getAuthUser());
    socket.connect();
  }, []);
  useEffect(() => {
    socket.on("message recieved", (socketMessage) => {
      if (!selectedChat) {
        const sound = new Audio("/sounds/harry-maguire.mp3");
        sound.play();

        dispatch(setNotifications(socketMessage));
      } else if (socketMessage.chat._id !== selectedChat._id) {
        const sound = new Audio("/sounds/harry-maguire.mp3");
        sound.play();
        dispatch(setNotifications(socketMessage));
      } else {
        dispatch(recieveMessage(socketMessage));
      }
    });
    return () => socket.off("message recieved");
  }, [selectedChat]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (!auth.isLoading && (!auth.user || auth.isError)) {
      auth.isError && toast.error(auth.message);
      navigate("/");
      socket.disconnect();
      dispatch(reset());
    } else {
      dispatch(getChats());
    }

    dispatch(reset());
  }, [
    navigate,
    auth.user,
    isError,
    auth.isError,
    message,
    auth.message,
    auth.isLoading,
  ]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <SideDrawer user={auth.user} loadingUser={auth.isLoading} />
      <Box
        display='flex'
        justifyContent='space-between '
        w='100%'
        h='91.5vh'
        p='10px'
      >
        <MyChats />
        <Chatbox />
      </Box>
    </div>
  );
};

export default Chats;
