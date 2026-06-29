import {
  Box,
  Button,
  List,
  ListItemButton,
  Typography,
  IconButton,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

import {
  getSessions,
  createSession,
  deleteSession
} from "../service/service";

// -----------------------------
// SAFE DATE PARSER (FIXED)
// -----------------------------
const parseDate = (dateString) => {
  if (!dateString) return null;

  // Expected: "18-06-2026 17:38:16"
  const [datePart, timePart] = dateString.split(" ");
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split("-");

  return new Date(`${year}-${month}-${day}T${timePart}`);
};

// -----------------------------
// Helpers
// -----------------------------
const getDateGroup = (dateString) => {
  const date = parseDate(dateString);

  if (!date || isNaN(date)) return "Unknown";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const groupByDate = (chats) =>
  chats.reduce((acc, chat) => {
    if (!acc[chat.dateGroup]) {
      acc[chat.dateGroup] = [];
    }
    acc[chat.dateGroup].push(chat);
    return acc;
  }, {});

const sortGroups = (groups) => {
  return Object.keys(groups).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;

    if (a === "Yesterday") return -1;
    if (b === "Yesterday") return 1;

    return 0;
  });
};

// -----------------------------
// COMPONENT
// -----------------------------
export default function ChatSidebar({ selected, setSelected }) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  // -----------------------------
  // Load Sessions
  // -----------------------------
  const loadSessions = async () => {
    try {
      setLoading(true);

      const response = await getSessions();
      const sessions = response?.results || response || [];

      const formatted = sessions.map((item) => {
        const activityDate = item.last_activity || item.started_at;

        return {
          id: item.id,
          title: item.title || "New Chat",
          session_token: item.session_token,
          last_activity: activityDate,
          dateGroup: getDateGroup(activityDate)
        };
      });

      setChats(formatted);

      if (formatted.length > 0) {
        setSelected(formatted[0].id);
      } else {
        setSelected(null);
      }
    } catch (error) {
      console.error("Load Sessions Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // -----------------------------
  // Create Session
  // -----------------------------
  const handleNewChat = async () => {
    try {
      const session = await createSession();

      const newChat = {
        id: session.id,
        title: session.title || "New Chat",
        session_token: session.session_token,
        last_activity: new Date().toISOString(),
        dateGroup: "Today"
      };

      setChats((prev) => [newChat, ...prev]);
      setSelected(newChat.id);
    } catch (err) {
      console.error("Create Session Error:", err);
    }
  };

  // -----------------------------
  // Delete Session
  // -----------------------------
  const handleDelete = async (id) => {
    try {
      await deleteSession(id);

      const updated = chats.filter((chat) => chat.id !== id);

      setChats(updated);

      if (selected === id) {
        setSelected(updated.length ? updated[0].id : null);
      }
    } catch (err) {
      console.error("Delete Session Error:", err);
    }
  };

  // -----------------------------
  // GROUP DATA
  // -----------------------------
  const groupedChats = groupByDate(chats);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden"
      }}
    >
      {/* New Chat */}
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          sx={{ textTransform: "none", py: 0.8 }}
        >
          New Chat
        </Button>
      </Box>

      {/* Empty State */}
      {chats.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography color="text.secondary">
            No chats found
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflowY: "auto", px: 0.5 }}>
          {sortGroups(groupedChats).map((group) => (
            <Box key={group}>
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  display: "block",
                  color: "text.secondary",
                  fontWeight: 600
                }}
              >
                {group}
              </Typography>

              <List disablePadding>
                {groupedChats[group]
                  .sort((a, b) => {
                    const d1 = parseDate(b.last_activity);
                    const d2 = parseDate(a.last_activity);
                    return (d1 || 0) - (d2 || 0);
                  })
                  .map((chat) => (
                    <ListItemButton
                      key={chat.id}
                      selected={selected === chat.id}
                      onClick={() => setSelected(chat.id)}
                      sx={{
                        mx: 0.5,
                        my: 0.3,
                        py: 1,
                        px: 1.2,
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        "&:hover": { bgcolor: "action.hover" },
                        "&.Mui-selected": {
                          bgcolor: "primary.main",
                          color: "#fff"
                        }
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "0.85rem"
                        }}
                      >
                        {chat.title}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(chat.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemButton>
                  ))}
              </List>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}