import { FormControl, IconButton, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  socket,
  sendMessageError,
} from "../../features/messages/messageSlice";

const SendMessageInput = ({ selectedChat }) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const onChange = (e) => setContent(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    let message = {
      chatId: selectedChat._id,
      content,
    };
    socket.emit("new message", message);

    setContent("");
  };

  useEffect(() => {
    socket.on("message saved", (message) => {
      dispatch(sendMessage(message));
    });
    socket.on("send message error", (error) => {
      toast.error(error);
      dispatch(sendMessageError(error));
    });
    return () => {
      socket.off("message saved");
      socket.off("send message error");
    };
  }, [dispatch]);

  return (
    <form onSubmit={onSubmit}>
      <FormControl
        //isRequired
        mt={3}
        width='100%'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Input
          // width='80%'
          variant='filled'
          bg='#fff'
          placeholder='Enter a message'
          mr={2}
          value={content}
          onChange={onChange}
        />
        <IconButton
          type='submit'
          size='md'
          icon={<i className='fas fa-paper-plane' />}
        />
      </FormControl>
    </form>
  );
};

export default SendMessageInput;
