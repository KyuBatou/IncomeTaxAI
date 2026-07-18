import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { Document, Packer, Paragraph, TextRun } from "docx";
import DownloadIcon from "@mui/icons-material/Download";
import { clarifyChatMessage, getSessionMessages, sendChatMessage, sendSimilarMessage } from "../service/service";
import { useEffect, useRef, useState } from "react";
import { MatxLoading } from "app/components";
import ChatWelcome from "./ChatWelcome";
import ChatFooter from "./ChatFooter";
import { saveAs } from "file-saver";
import { ThinkingDots } from "./ThinkingDots";
import ReactMarkdown from "react-markdown";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { marked } from "marked";
import html2pdf from "html2pdf.js";

export default function ChatContent({ sessionId }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  const [replyContext, setReplyContext] = useState(null);

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
        results: [],
        sources_used: [],
      },
    ]);
  
    clear?.();
  
    try {
      let res;
  
      if (replyContext) {
        // Refine request
        res = await sendChatMessage({
          sessionId,
          message,
          files,
          model: "case_law_research",
          maxLength: 500,
  
          // extra data
          replyContext,
        });
  
        setReplyContext(null);
      } else {
        // Normal request
        res = await sendChatMessage({
          sessionId,
          message,
          files,
          model: "case_law_research",
          maxLength: 500,
        });
      }
  
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
              ? { 
                ...m,
                thinking: false,
                ai_answer: res?.answer || "",
                results: res?.results || [],
                sources_used: res?.sources_used || [],
              }
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
  // clarify
  const handleClarify = async ({ message, files }) => {
    try {
      const res = await clarifyChatMessage({
        sessionId,
        message,
        files,
        model: "case_law_research",
        maxLength: 500,
      });

      return res || {};
    } catch (err) {
      console.error(err);
      return [];
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
  

  const handleDownloadWord = async (text) => {
    const tokens = marked.lexer(text);
  
    const children = [];
  
    tokens.forEach((token) => {
      if (token.type === "heading") {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: token.text,
                bold: true,
                size: token.depth === 1 ? 32 : 26,
              }),
            ],
            spacing: {
              after: 200,
            },
          })
        );
      }
  
      else if (token.type === "paragraph") {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: token.text.replace(/\*\*/g, ""),
                size: 24,
              }),
            ],
            spacing: {
              after: 120,
            },
          })
        );
      }
  
      else if (token.type === "list") {
        token.items.forEach((item) => {
          children.push(
            new Paragraph({
              text: item.text,
              bullet: {
                level: 0,
              },
            })
          );
        });
      }
    });
  
    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "ai-response.docx");
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById("pdf-content");
  
    html2pdf()
      .set({
        margin: 10,
        filename: "ai-response.pdf",
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };

  const handleRefine = (msg) => {
    setReplyContext({
      question: msg.user_query,
      answer: msg.ai_answer,
    });
  };
  
  const handleSimilar = async (msg) => {
    const tempId = Date.now();
  
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        user_query: msg.user_query,
        ai_answer: "",
        created_at: new Date().toISOString(),
        thinking: true,
        results: [],
        sources_used: [],
      },
    ]);
  
    try {
      const res = await sendSimilarMessage({
        sessionId,
        message: msg.user_query,
        question: msg.user_query,
        answer: msg.ai_answer,
        files: [],
        model: "case_law_research",
        maxLength: 500,
      });
  
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                thinking: false,
                ai_answer: res?.answer || "",
                results: res?.results || [],
                sources_used: res?.sources_used || [],
              }
            : m
        )
      );
    } catch (err) {
      console.error(err);
  
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                thinking: false,
                ai_answer: "❌ Failed to get response",
              }
            : m
        )
      );
    }
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
                    <div
                    id="pdf-content"
                    style={{
                      width: "700px",
                      maxWidth: "100%",
                      padding: "20px",
                      boxSizing: "border-box",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                      textAlign: "justify",
                      background: "#fff",
                    }}
                  >
                    <ReactMarkdown>
                      {msg.ai_answer || ""}
                    </ReactMarkdown>
                    </div>
                  )}
                </Typography>
                {/* Sources */}
                {Array.isArray(msg.sources_used) && msg.sources_used.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                      {msg.sources_used.map((item) => (
                        <Typography
                          key={item.id}
                          component="a"
                          href={`https://incometaxlibrary.in/judgement/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            fontSize: 13,
                            color: "primary.main",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {item.heading}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}
                {Array.isArray(msg.results) && msg.results.length > 0 && (
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ p: 2 }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell width={10}>Date</TableCell>
                          <TableCell width={15}>Citation</TableCell>
                          <TableCell width={20}>Court</TableCell>
                          <TableCell width={45}>Party Name</TableCell>
                          <TableCell width={10}>Section</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {msg.results.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.dateofjudgement}</TableCell>
                            <TableCell>{row.citation}</TableCell>
                            <TableCell>{row.court_name}</TableCell>
                            <TableCell>
                              <Typography
                                component="a"
                                href={`https://incometaxlibrary.com/gst/judgements/${row.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: "primary.main",
                                  textDecoration: "none",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {row.partyname}
                              </Typography>
                            </TableCell>
                            <TableCell>{row.sectionno}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
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
                        onClick={() => handleDownloadWord(msg.ai_answer)}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        Download Word
                      </Button>

                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadPdf(msg.ai_answer)}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        Download Pdf
                      </Button>

                      <Button
                        size="small"
                        startIcon={<AutoFixHighIcon />}
                        onClick={() => handleRefine(msg)}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        Refine
                      </Button>

                      <Button
                        size="small"
                        startIcon={<CompareArrowsIcon />}
                        onClick={() => handleSimilar(msg)}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        Rewrite
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
        onClarify={handleClarify}
        replyContext={replyContext}
        setReplyContext={setReplyContext}
      />
    </Box>
  );
}