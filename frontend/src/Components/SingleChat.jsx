import { Box, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import useSound from "use-sound";
import {
  getMessages,
  reset as resetMessage,
  socket,
  recieveMessage,
  setNotifications,
} from "../features/messages/messageSlice";
import SingleChatHeader from "./SingleChatHeader";
import SendMessageInput from "./SendMessageInput";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ selectedChat }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);
  const auth = useSelector((state) => state.auth);
  const chats = useSelector((state) => state.chats);

  const lastMessageRef = useRef(null);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.messages]);
  useEffect(() => {
    if (messages.isError) {
      toast.error(messages.isError);
    } else {
      dispatch(getMessages(selectedChat._id));
    }
  }, [messages.isError, selectedChat]);

  return (
    <>
      <SingleChatHeader
        resetMessage={resetMessage}
        selectedChat={selectedChat}
      />
      <Box
        display='flex'
        flexDir='column'
        justifyContent='flex-end'
        p={3}
        bg='#e8e8e8'
        width='100%'
        height='100%'
        borderRadius='lg'
        overflow='hidden'
      >
        {messages.isLoading ? (
          <Spinner size='xl' w='20' h='20' alignSelf='center' margin='auto' />
        ) : (
          <>
            {messages.messages.length > 0 ? (
              <div className='messages'>
                <ScrollableChat
                  lastMessageRef={lastMessageRef}
                  messages={messages.messages}
                />
              </div>
            ) : (
              <Text
                w='45%'
                h='20'
                fontSize='30px'
                textAlign='center'
                alignSelf='center'
                margin='auto'
                color='#c2c2c2'
              >
                Send a message to{" "}
                {selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : selectedChat.users[0]._id !== auth.user._id
                  ? selectedChat.users[0].name.toUpperCase()
                  : selectedChat.users[1].name.toUpperCase()}
              </Text>
            )}
          </>
        )}
        <SendMessageInput selectedChat={selectedChat} />
      </Box>
    </>
  );
};

export default SingleChat;
