import { useEffect } from "react";
import { Navigate } from "react-router-dom";
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

const Chats = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chats, selectedChat, isLoading, isError, isSuccess, message } =
    useSelector((state) => state.chats);

  useEffect(() => {
    console.log(selectedChat);
    socket.on(
      "message recieved",
      (socketMessage) => {
        console.log(socketMessage);
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
      },
      [selectedChat],
    );
    return () => socket.off("message recieved");
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (!user) {
      socket.disconnect();
      dispatch(reset());
    } else {
      dispatch(getChats());
    }

    dispatch(reset());
  }, [user, isError, message]);

  if (!user) {
    return <Navigate to='/' />;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <SideDrawer user={user} />
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
