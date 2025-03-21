/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect } from "react";
import {
  Avatar,
  CircularProgress,
  IconButton,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { Send, Close } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useChatbot } from "../../hooks/useChatbot";
import { RagChatButton } from "./RagChatButton";
import { BotIcon } from "lucide-react";

const ChatBotContainer = styled(Box)`
  position: fixed;
  bottom: 34px !important;
  right: 64px !important;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ChatBubbleStyled = styled(motion.div)`
  width: 450px;
  height: 550px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const MessageContainer = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: 20px 30px 0px;
  border-top: 1px solid #e0e0e0;
`;

const RagChatDrawer = () => {
  const {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isLoading,
    isChatOpen,
    toggleChat,
  } = useChatbot();

  const messagesEndRef = useRef(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Focus input when chat is opened
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isChatOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <ChatBotContainer>
      <AnimatePresence>
        {isChatOpen ? (
          <ChatBubbleStyled
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
              borderBottom="1px solid #e0e0e0"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ background: "#1976d2" }}>
                  <BotIcon />
                </Avatar>
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="h6">Task Assistant</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ask about your tasks
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={toggleChat}>
                <Close />
              </IconButton>
            </Box>

            <MessageContainer>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  alignSelf={
                    message.sender === "user" ? "flex-end" : "flex-start"
                  }
                  maxWidth="85%"
                  p={1.5}
                  borderRadius={2}
                  display={"flex"}
                  gap={1}
                  // bgcolor={message.sender === "user" ? "#1976d2" : "#f0f0f0"}
                  // color={message.sender === "user" ? "white" : "black"}
                >
                  {/* {message.content} */}
                  {message.sender === "bot" && (
                    <Avatar sx={{ background: "#F0F5F8" }}>
                      <BotIcon color="black" />
                    </Avatar>
                  )}

                  <Box
                    sx={{
                      borderRadius: "10px",
                      p: 2,
                      textAlign: "left",
                      backgroundColor:
                        message.sender === "user" ? "#1976d2" : "#F0F5F8",
                      color: message.sender === "user" ? "white" : "black",
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {message.content.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.content.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "20px"}}>
                  <Avatar sx={{ background: "#F0F5F8" }}>
                    <BotIcon color="black" />
                  </Avatar>

                  <CircularProgress color="info" size={24} />
                </Box>
              )}
              {/* {isLoading && <CircularProgress size={24} />} */}
              <div ref={messagesEndRef} />
            </MessageContainer>

            <form onSubmit={handleSubmit} >
              <InputContainer>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  multiline
                  inputRef={inputRef}
                  maxRows={3}
                  onKeyDown={handleKeyDown}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about your tasks..."
                />
                <IconButton
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send sx={{ color: "#1976d2"}}/>
                </IconButton>
              </InputContainer>
              <Typography variant="subtitle2" color="textSecondary" sx={{ maxWidth: "90%", textAlign: "left", padding: "5px 30px 20px"}}>
                Try: "show all tasks", "high priority tasks", "find [task name]", "tasks due today", show status [status].
              </Typography>
            </form>
          </ChatBubbleStyled>
        ) : (
          // <ChatButton initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={toggleChat}>
          //   <ChatBubble />
          // </ChatButton>
          <RagChatButton onClick={toggleChat} />
        )}
      </AnimatePresence>
    </ChatBotContainer>
  );
};

export default RagChatDrawer;
