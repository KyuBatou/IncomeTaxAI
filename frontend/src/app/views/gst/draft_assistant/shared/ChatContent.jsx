import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Document, Packer, Paragraph, TextRun } from "docx";
import DownloadIcon from "@mui/icons-material/Download";
import { getSessionMessages, sendChatMessage } from "../service/service";
import { useEffect, useRef, useState } from "react";
import { MatxLoading } from "app/components";
import ChatWelcome from "./ChatWelcome";
import ChatFooter from "./ChatFooter";
import { saveAs } from "file-saver";
import { ThinkingDots } from "./ThinkingDots";
import ReactMarkdown from "react-markdown";

export default function ChatContent({ sessionId }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  const typeText = (text, callback, speed = 2) => {
    let i = 0;
    const interval = setInterval(() => {
      callback(text.slice(0, i));
      i++;
  
      if (i > text.length) clearInterval(interval);
    }, speed);
  };

  const loadMessages = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const data = await getSessionMessages(sessionId);
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // load on session change
  useEffect(() => {
    loadMessages();
  }, [sessionId]);

  const handleSend = async ({ message, files, clear }) => {
    if (!message?.trim() && !files?.length) return;
  
    const tempId = Date.now();
  
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        user_query: message,
        ai_answer: "",
        created_at: new Date().toISOString(),
        streaming: true,
        thinking: true,
      },
    ]);
  
    clear?.();
  
    try {
      let res;
      // Normal request
      res = await sendChatMessage({
        sessionId,
        message,
        files,
        model: "draft_assistant",
        maxLength: 500,
      });
  
      const answer = res?.answer || "No response";
  
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, thinking: false, ai_answer: "" }
            : m
        )
      );
  
      typeText(answer, (partial) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { ...m, ai_answer: partial }
              : m
          )
        );
      }, 1.5);
    } catch (err) {
      console.error(err);
  
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                ai_answer: "❌ Failed to get response",
                thinking: false,
              }
            : m
        )
      );
    }
  };

  const formatTime = (value) => {
    if (!value) return "";
  
    const [datePart, timePart] = value.split(" ");
    if (!datePart || !timePart) return "";
  
    const [day, month, year] = datePart.split("-");
  
    const date = new Date(`${year}-${month}-${day}T${timePart}`);
  
    if (isNaN(date)) return "";
  
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    return `${formattedDate} ${formattedTime}`;
  };
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };
  

  const handleDownload = async (text) => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  size: 24,
                }),
              ],
            }),
          ],
        },
      ],
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "ai-response.docx");
  };

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* Chat Area */}
      <Box
        ref={chatRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <MatxLoading />
          </Box>
        )}

        {/* Empty State */}
        {!loading && messages.length === 0 && <ChatWelcome />}

        {/* Messages */}
        {!loading && messages.map((msg) => (
          <Box key={msg.id}>
            
            {/* USER */}
            {!msg.results?.length && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: "80%",
                  bgcolor: "primary.main",
                  color: "#fff",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" textAlign="justify">
                  {msg.user_query}
                </Typography>
              </Paper>
            </Box>
            )}

            {/* AI */}
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  maxWidth: "80%",
                  bgcolor: "background.paper",
                  color: "text.primary",
                  borderRadius: 2,
                }}
              >
                {/* AI text */}
                {/* <Typography variant="body2" textAlign="justify">
                  {msg.thinking ? <ThinkingDots /> : msg.ai_answer}
                </Typography> */}
                <Typography
                  component="div"
                  variant="body2"
                  textAlign="justify"
                >
                  {msg.thinking ? (
                    <ThinkingDots />
                  ) : (
                    <ReactMarkdown>
                      {msg.ai_answer || ""}
                    </ReactMarkdown>
                  )}
                </Typography>
                {/* ACTION ROW */}
                {!msg.thinking && !loading && !msg.results && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* LEFT SIDE → ACTION BUTTONS */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleCopy(msg.ai_answer)}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        Copy
                      </Button>

                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(msg.ai_answer)}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        Download
                      </Button>
                    </Stack>

                    {/* RIGHT SIDE → TIME */}
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.6,
                        ml: "auto",
                        pl: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatTime(msg.created_at)}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        ))}
      </Box>
      <ChatFooter
        loading={loading}
        onSend={handleSend}
      />
    </Box>
  );
}