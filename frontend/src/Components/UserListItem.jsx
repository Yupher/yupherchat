import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleClick }) => {
  return (
    <Box
      onClick={handleClick}
      cursor='pointer'
      bg='#E8E8E8'
      _hover={{ color: "white", background: "#38B2AC" }}
      width='100%'
      display='flex'
      alignItems='center'
      color='black'
      px={2}
      py={2}
      mb={2}
      borderRadius='lg'
    >
      <Avatar
        src={user.picture}
        alt={user.name}
        name={user.name}
        mr={2}
        size='sm'
        cursor='pointer'
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize='xs'>
          <b>Email: </b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
