import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import ProfileModal from "../users/ProfileModal";
import { logout, reset as userReset } from "../../features/auth/authSlice";
import { accessChat, reset as chatReset } from "../../features/chat/chatSlice";
import { resetNotifications } from "../../features/messages/messageSlice";
import {
  searchUsers,
  reset as searchReset,
} from "../../features/users/usersSlice";
import { toast } from "react-toastify";
import SearchLoading from "./SearchLoading";
import UserListItem from "../users/UserListItem";

const SideDrawer = ({ user }) => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { users, isLoading, isError, message } = useSelector(
    (state) => state.users,
  );
  const { notifications } = useSelector((state) => state.messages);

  const onChange = (e) => {
    dispatch(searchReset());
    setSearch(e.target.value);
  };
  const onSearch = (e) => {
    e.preventDefault();
    if (!search) {
      dispatch(searchReset());
      return;
    }

    dispatch(searchUsers(search));
  };

  const onLogout = () => {
    dispatch(userReset());
    dispatch(chatReset());
    dispatch(logout());
  };

  const onUserClick = (userId) => {
    dispatch(accessChat(userId));
    onClose();
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError]);

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        height='8.5vh'
        borderWidth='1px'
      >
        <Tooltip label='Search users to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <i className='fas fa-search' />
            <Text display={{ base: "none", md: "flex" }} px='4'>
              Search users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize='2xl'>Chat App</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <i
                className='fas fa-bell'
                style={{
                  fontSize: "1.2em",
                  margin: ".8em",
                  color: notifications.length === 0 ? "#c2c2c2" : "black",
                }}
              />
            </MenuButton>
            <MenuList pl={2}>
              {notifications.length === 0 ? (
                <Text>No new messages</Text>
              ) : (
                notifications.map((notif, i) => (
                  <div key={notif._id + i.toString()}>
                    <MenuDivider />
                    <MenuItem>
                      New message from:{" "}
                      <Text fontWeight='bold'>
                        {notif.chat.isGroupChat
                          ? notif.chatName
                          : notif.chat.users[0]._id !== user._id
                          ? notif.chat.users[0].name.toUpperCase()
                          : notif.chat.users[1].name.toUpperCase()}
                      </Text>
                    </MenuItem>
                  </div>
                ))
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<i className='fas fa-chevron-down' />}
            >
              <Avatar
                size='sm'
                cursor='pointer'
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Search users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search users by name or email'
                mr='2'
                value={search}
                onChange={onChange}
              />
              <Button onClick={onSearch}>Go</Button>
            </Box>
            {isLoading ? (
              <SearchLoading />
            ) : (
              users.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleClick={() => onUserClick(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
