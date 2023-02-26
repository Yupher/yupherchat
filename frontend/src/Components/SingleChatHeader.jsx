import { Box, IconButton, Text } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { clearSelectedChat } from "../features/chat/chatSlice";
import React from "react";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ProfileModal from "./ProfileModal";

const SingleChatHeader = ({ selectedChat, resetMessage }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const getSender = () => {
    return selectedChat.users.filter((u) => u._id !== auth.user._id)[0];
  };
  const onClickBack = () => {
    dispatch(clearSelectedChat());
    dispatch(resetMessage());
  };
  return (
    <>
      <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w='100%'
        display='flex'
        justifyContent={{ base: "space-between" }}
        alignItems='center'
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onClickBack}
          icon={<i className='fas fa-arrow-left' />}
        />
        {selectedChat.isGroupChat ? (
          <>
            {selectedChat.chatName.toUpperCase()}
            <UpdateGroupChatModal />
          </>
        ) : (
          <>
            {getSender().name.toUpperCase()}
            <ProfileModal user={getSender()} />
          </>
        )}
      </Text>
    </>
  );
};

export default SingleChatHeader;
