import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
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
  const [showEmojis, setShowEmojis] = useState(false);
  const dispatch = useDispatch();
  const onChange = (e) => setContent(e.target.value);

  const showEmojisPanel = () => setShowEmojis(!showEmojis);
  const emojiClick = (emojiData, event) => {
    setContent(content + emojiData.emoji);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setShowEmojis(false);
    let message = {
      chatId: selectedChat._id,
      type: "text message",
      content,
    };

    socket.emit("new message", message);

    setContent("");
    socket.off("new message");
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
      {showEmojis && (
        <Box position='absolute' right='10' bottom='80px' zIndex='99'>
          <EmojiPicker
            onEmojiClick={emojiClick}
            width={300}
            height={400}
            lazyLoadEmojis
          />
        </Box>
      )}
      <FormControl
        //isRequired
        mt={3}
        width='100%'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        onClick={() => showEmojis && setShowEmojis(false)}
      >
        <InputGroup>
          <Input
            // width='80%'
            variant='filled'
            bg='#fff'
            placeholder='Enter a message'
            mr={2}
            value={content}
            autoFocus
            onChange={onChange}
          />
          <InputRightElement
            variant='filled'
            width={"1rem"}
            bg='rgba(255,255,255,0)'
            mr={5}
          >
            <IconButton
              size='sm'
              onClick={showEmojisPanel}
              bg='none'
              icon={
                <i
                  className='fas fa-smile'
                  style={{ fontSize: "1.3em", color: "#c2c2c2" }}
                />
              }
            />
          </InputRightElement>
        </InputGroup>

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
