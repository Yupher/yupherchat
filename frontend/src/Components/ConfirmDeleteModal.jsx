import { useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { deleteGroup as deleteGroupFunction } from "../features/chat/chatSlice";
import { toast } from "react-toastify";

const ConfirmDeleteModal = ({ selectedChat, closeParentModal }) => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, isSuccess } = useSelector((state) => state.chats);

  //   useEffect(() => {
  //     if (isSuccess) {
  //       toast.success("Group deleted");
  //       onClose();
  //       closeParentModal();
  //     }
  //   }, [isSuccess]);
  const deleteGroup = () => {
    dispatch(deleteGroupFunction(selectedChat._id));
  };

  return (
    <>
      <Button
        colorScheme='red'
        size='md'
        h='2rem'
        textAlign='center'
        p={5}
        mr={3}
        onClick={onOpen}
      >
        Delete the Group
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box paddingY='3rem' width='100%'>
              <Text mb={2}>
                Are you sure you want to delete the group ? This action is
                irreversible, all yhe data within this chat will be lost forever
              </Text>
              <Text mb={2}>Press confirm to delete or cancel to go back</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} variant='ghost' onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='red'
              isLoading={isLoading}
              onClick={deleteGroup}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmDeleteModal;
