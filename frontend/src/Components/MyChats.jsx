import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import SearchLoading from "./SearchLoading";
import { selectChat } from "../features/chat/chatSlice";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, message, chats, selectedChat } = useSelector(
    (state) => state.chats,
  );
  const { user } = useSelector((state) => state.auth);

  const getsender = (users) => {
    return users.filter((chatUser) => chatUser._id !== user._id)[0].name;
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      width={{ base: "100%", md: "31%" }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        width={"100%"}
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "22px", lg: "28px" }}
        fontWeight='bold'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Text>My Chats</Text>
        <GroupChatModal>
          <Button
            display='flex'
            rightIcon={<i className='fas fa-plus' />}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display='flex'
        flexDir='column'
        p={3}
        width='100%'
        height='100%'
        borderRadius='lg'
        overflowY='hidden '
        overflowX='hidden'
        bg='#f8f8f8'
      >
        {isLoading ? (
          <SearchLoading />
        ) : (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => dispatch(selectChat(chat))}
                cursor='pointer'
                bg={
                  selectedChat && selectedChat._id === chat._id
                    ? "#38b2ac"
                    : "#e8e8e8"
                }
                color={
                  selectedChat && selectedChat._id === chat._id
                    ? "#fff"
                    : "#000"
                }
                px={3}
                py={2}
                borderRadius='lg'
              >
                <Text>
                  {chat.isGroupChat ? chat.chatName : getsender(chat.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
