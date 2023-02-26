import { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup } from "../features/chat/chatSlice";
import {
  searchUsers,
  reset as clearSearch,
} from "../features/users/usersSlice";
import UserListItem from "./UserListItem";
import { toast } from "react-toastify";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [groupData, setGroupData] = useState({
    name: "",
    users: [],
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const { selectedChat, chats, isError, isLoading, message } = useSelector(
    (state) => state.chats,
  );

  const onChange = (e) =>
    setGroupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSearch = (e) => {
    let { value } = e.target;
    if (!value) {
      dispatch(clearSearch());
    } else {
      dispatch(searchUsers(value));
    }
  };

  const onUserClick = (user) => {
    let exist = false;
    groupData.users.forEach((groupUser) => {
      if (groupUser === user._id) {
        toast.error("User already added");
        exist = true;
      }
    });
    if (!exist) {
      setGroupData((prev) => ({
        ...prev,
        users: [user._id, ...prev.users],
      }));
      setSelectedUsers([...selectedUsers, user]);
      dispatch(clearSearch());
    }
  };
  const handleDelete = (deletedUser) => {
    setSelectedUsers(selectedUsers.filter((su) => su._id !== deletedUser._id));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createGroup(groupData));
    dispatch(clearSearch());
    onClose();
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='35px' display='flex' justifyContent='center'>
            Create a group chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl>
              <Input
                name='name'
                value={groupData.name}
                onChange={onChange}
                placeholder='Chat name'
                mb={3}
              />
            </FormControl>
            <FormControl>
              <Input
                onChange={handleSearch}
                placeholder='Search users to add by name or email'
                mb={1}
                name='search'
              />
            </FormControl>
            <Box width='100%' display='flex' flexWrap='wrap'>
              {selectedUsers.length > 0 &&
                selectedUsers.map((selectedUser) => (
                  <UserBadgeItem
                    key={selectedUser._id}
                    handleFunction={() => handleDelete(selectedUser)}
                    user={selectedUser}
                  />
                ))}
            </Box>

            {users.isLoading ? (
              <Spinner size='xs' />
            ) : (
              users.users.length > 0 &&
              users.users
                .slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => onUserClick(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='teal'
              variant='solid'
              mr={3}
              onClick={onSubmit}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
