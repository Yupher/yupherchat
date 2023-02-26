import { Box, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleChat from "./SingleChat";

const Chatbox = () => {
  const chats = useSelector((state) => state.chats);
  return (
    <Box
      display={{ base: chats.selectedChat ? "flex" : "none", md: "flex" }}
      alignItems='center'
      flexDir='column'
      p={3}
      bg='white'
      width={{ base: "100%", md: "68%" }}
      borderRadius='lg'
      borderWidth='1px'
    >
      {chats.selectedChat ? (
        <SingleChat selectedChat={chats.selectedChat} />
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          height='100%'
        >
          <Text fontSize='3xl' pb={3} color='#c2c2c2'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Chatbox;
