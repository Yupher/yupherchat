import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages, lastMessageRef }) => {
  const { user } = useSelector((state) => state.auth);
  const isSameSender = (mappedMessage, i) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== mappedMessage.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== user._id
    );
  };

  const islastMessage = (i) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id &&
      messages[messages.length - 1].sender._id !== user._id
    );
  };
  return (
    <>
      {messages.map((message, i) => (
        <div key={message._id} style={{ display: "flex" }}>
          {(isSameSender(message, i) || islastMessage(i)) && (
            <Tooltip
              label={message.sender.name}
              placement='bottom-start'
              hasArrow
            >
              <Avatar
                mt='7px'
                mr={1}
                size='sm'
                name={message.sender.name}
                src={message.sender.picture}
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor:
                message.sender._id === user._id ? "#6dc5f7" : "#b9f5d0",
              //marginLeft: "10px",
              marginBottom: "5px",
              padding: "5px 15px",
              borderRadius: "20px",
              fontSize: "1.1em",
              maxWidth: "75%",
              marginLeft: message.sender._id === user._id ? "auto" : "10px",
              marginRight: message.sender._id === user._id ? "10px" : "auto ",
            }}
          >
            {message.content}
          </span>
          <div ref={lastMessageRef} />
        </div>
      ))}
    </>
  );
};

export default ScrollableChat;
