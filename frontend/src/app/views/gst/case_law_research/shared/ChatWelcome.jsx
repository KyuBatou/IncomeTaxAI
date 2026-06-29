import { Box, Typography, Stack, Chip, Button } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BoltIcon from "@mui/icons-material/Bolt";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export default function ChatWelcome() {
    const prompts = [
        "Explain GST input tax credit simply with example",
        "Break down Section 17(5) of CGST Act",
        "Summarize a Supreme Court judgment in simple terms",
        "Convert complex legal text into simple language",
        "Find contradictions in a legal provision",
        "Generate counter-arguments for a legal claim",
        "Create a step-by-step legal analysis framework",
        "Draft notice reply under GST provisions",
        "Explain legal terms in plain English",
    ];
    return (
        <Box
            sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            }}
        >
            <Box
            sx={{
                textAlign: "center",
            }}
            >
            {/* Icon */}
            <Box
                sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                }}
            >
                <AutoAwesomeIcon />
            </Box>

            {/* Title */}
            <Typography variant="h5" fontWeight={600}>
                AI Chat Assistant
            </Typography>

            {/* Subtitle */}
            <Typography
                variant="body2"
                sx={{
                mt: 1,
                color: "text.secondary",
                }}
            >
                Ask questions, generate insights, and refine ideas instantly.
            </Typography>

            {/* Feature chips */}
            <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
                sx={{ mt: 2 }}
            >
                <Chip icon={<BoltIcon />} label="Fast" size="small" />
                <Chip icon={<TipsAndUpdatesIcon />} label="Smart" size="small" />
                <Chip icon={<ChatBubbleOutlineIcon />} label="Context-aware" size="small" />
            </Stack>

            {/* Prompt buttons (ROW + WRAP FIXED) */}
            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                justifyContent="center"
                sx={{ mt: 3 }}
            >
                {prompts.map((text, i) => (
                <Button
                    key={i}
                    size="small"
                    variant="outlined"
                    sx={{
                    textTransform: "none",
                    borderColor: "divider",
                    color: "text.primary",
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.6,
                    fontSize: "0.75rem",
                    "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                    },
                    }}
                >
                    {text}
                </Button>
                ))}
            </Stack>
            </Box>
        </Box>
    );
}