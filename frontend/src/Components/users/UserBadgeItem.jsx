import { Box, Text } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      variant='solid'
      fontSize={14}
      bg='purple'
      color='white'
      cursor='pointer'
      onClick={handleFunction}
      _hover={{ backgroundColor: "#c61a09", opacity: 0.7 }}
      transition='all  .5s ease'
    >
      <Text>
        {user.name}
        <i
          className='fas fa-times'
          style={{ fontSize: "10px", paddingLeft: "7px" }}
        />
      </Text>
    </Box>
  );
};

export default UserBadgeItem;
