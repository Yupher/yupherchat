import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  Box,
  IconButton,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import UserBadgeItem from "../users/UserBadgeItem";
import {
  addToGroup,
  deleteFromGroup,
  renameGroup,
} from "../../features/chat/chatSlice";
import { toast } from "react-toastify";
import {
  searchUsers,
  reset as clearSearch,
} from "../../features/users/usersSlice";
import UserListItem from "../users/UserListItem";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const UpdateGroupChatModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { selectedChat, isLoading } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.auth);
  const users = useSelector((state) => state.users);

  const [chatName, setChatName] = useState(selectedChat.chatName);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const onChange = (e) => setChatName(e.target.value);
  const onSearch = (e) => {
    let { value } = e.target;
    if (!value) {
      dispatch(clearSearch());
    } else {
      dispatch(searchUsers(value));
    }
  };
  const onSubmit = () => {
    dispatch(renameGroup({ chatId: selectedChat._id, chatName }));
  };

  const handleAdd = (addedUser) => {
    let exist = false;
    selectedChat.users.forEach((u) => {
      if (u._id === addedUser._id) {
        exist = true;
      }
    });
    if (exist) {
      toast.error("User already exist");
    } else {
      dispatch(addToGroup({ chatId: selectedChat._id, userId: addedUser._id }));
      dispatch(clearSearch());
    }
  };

  const handleDelete = (deletedUser) => {
    dispatch(
      deleteFromGroup({ chatId: selectedChat._id, userId: deletedUser._id }),
    );
    onClose();
  };
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        onClick={onOpen}
        icon={<i className='far fa-edit' />}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='35px' display='flex' justifyContent='center'>
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display='flex' flexWrap='wrap' width='100%' pb={3}>
              {selectedChat.users.map((chatUser) => (
                <UserBadgeItem
                  key={chatUser._id}
                  handleFunction={() => handleDelete(chatUser)}
                  user={chatUser}
                />
              ))}
            </Box>
            <FormControl display='flex'>
              <InputGroup size='md'>
                <Input
                  pr='4.5rem'
                  colorScheme='teal'
                  value={chatName}
                  onChange={onChange}
                  mb={3}
                />
                <InputRightElement width='4.5rem'>
                  <Button
                    h='2rem'
                    size='sm'
                    colorScheme='teal'
                    isLoading={isLoading}
                    onClick={onSubmit}
                  >
                    Rename
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <Input
                onChange={onSearch}
                placeholder='Search users to add by name or email'
                mt={1}
                mb={3}
                name='search'
              />
            </FormControl>
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
                    handleClick={() => handleAdd(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            {selectedChat.groupAdmin._id === user._id ? (
              <ConfirmDeleteModal
                selectedChat={selectedChat}
                closeParentModal={onClose}
              />
            ) : (
              <Button
                colorScheme='red'
                size='md'
                h='2rem'
                textAlign='center'
                p={5}
                mr={3}
                onClick={() => handleDelete(user)}
              >
                Leave
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
