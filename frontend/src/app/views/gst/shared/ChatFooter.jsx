import { useRef, useState } from "react";
import {
    Box,
    Chip,
    Icon,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

export default function ChatFooter({
    onSend,
    onClarify,
    loading = false,
}) {
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);
    const [clarifyOptions, setClarifyOptions] = useState([]);

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);

        setFiles((prev) => {
            const existing = new Set(
                prev.map((f) => `${f.name}-${f.size}`)
            );

            const unique = selected.filter(
                (f) => !existing.has(`${f.name}-${f.size}`)
            );

            return [...prev, ...unique];
        });

        e.target.value = "";
    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setMessage("");
        setFiles([]);
    };

    const handleSend = async () => {
        if (!message.trim() && files.length === 0) return;

        await onSend?.({
            message,
            files,
            clear: () => {
                setMessage("");
                setFiles([]);
            },
        });

        resetForm();
    };

    const handleClarify = async () => {
        if (!message.trim() && files.length === 0) return;      
        try {
          const res = await onClarify?.({
            message,
            files,
          });
          
          setClarifyOptions(res?.options || []);
        } catch (err) {
          console.error(err);
        }
    };

    return (
        <Box
            sx={{
                pl: 1,
                pt: 1,
                pb: 0,
                pr: 0,
                borderTop: 1,
                borderColor: "divider",
            }}
        >
            {clarifyOptions.length > 0 && (
                <Box
                    sx={{
                        mt: 1,
                        mb: 1,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: "grey.50",
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                    >
                    <Typography
                        variant="caption"
                        sx={{
                        display: "block",
                        mb: 1,
                        fontWeight: 600,
                        color: "text.secondary",
                        }}
                    >
                        Choose a clarification
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                    >
                        {clarifyOptions.map((option, index) => (
                        <Chip
                            key={index}
                            label={option}
                            clickable
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                            setMessage(option);
                            setClarifyOptions([]);
                            }}
                            sx={{
                            borderRadius: "20px",
                            cursor: "pointer",
                            transition: "all .2s ease",
                            "&:hover": {
                                bgcolor: "primary.main",
                                color: "#000",
                                borderColor: "primary.main",
                                transform: "translateY(-2px)",
                                boxShadow: 2,
                            },
                            }}
                        />
                        ))}
                    </Stack>
                </Box>
            )}
            {/* Hidden File Input */}
            <input
                hidden
                multiple
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Selected Files */}
            {files.length > 0 && (
                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ mb: 1 }}
                >
                    {files.map((file, index) => (
                        <Chip
                            key={`${file.name}-${index}`}
                            label={file.name}
                            size="small"
                            icon={<Icon fontSize="small">description</Icon>}
                            onDelete={() => handleRemoveFile(index)}
                        />
                    ))}
                </Stack>
            )}

            <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={2}
                size="small"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (
                        e.key === "Enter" &&
                        !e.shiftKey
                    ) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                            >
                                <Icon>attach_file</Icon>
                            </IconButton>
                            <IconButton
                                color="primary"
                                disabled={loading}
                                onClick={handleClarify}
                                title="Clarify"
                            >
                                <Icon>help_outline</Icon>
                            </IconButton>

                        </InputAdornment>
                    ),

                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                color="primary"
                                disabled={loading}
                                onClick={handleSend}
                                title="Send"
                            >
                                <Icon>send</Icon>
                            </IconButton>

                        </InputAdornment>
                    ),
                }}
            />
            <Typography
                variant="caption"
                sx={{
                    fontSize: '12px',
                    display: "block",
                    color: 'red'
                }}
            >
                Disclaimer: ITL AI provides information for general purposes only and is not a substitute for professional legal advice. ITL AI may make mistakes. Please verify all information before relying on it.
            </Typography>

        </Box>
    );
}