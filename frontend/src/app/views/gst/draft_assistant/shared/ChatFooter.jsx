import { useRef, useState } from "react";
import {
    Box,
    Chip,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

export default function ChatFooter({
    onSend,
    loading = false,
}) {
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);
    const [form, setForm] = useState({
        user_name: "",
        business_name: "",
        gstin: "",
        address: "",
    });

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
        setForm({
            user_name: "",
            business_name: "",
            gstin: "",
            address: "",
        });
    };

    const handleSend = async () => {
        if (!message.trim() && files.length === 0) return;

        await onSend?.({
            user_name: form.user_name,
            business_name: form.business_name,
            gstin: form.gstin,
            address: form.address,
            message,
            files,
            clear: () => {
                setMessage("");
                setFiles([]);
                setForm({
                    user_name: "",
                    business_name: "",
                    gstin: "",
                    address: "",
                });
            },
        });

        resetForm();
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

            <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="User Name"
                        value={form.user_name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                user_name: e.target.value,
                            }))
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Business Name"
                        value={form.business_name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                business_name: e.target.value,
                            }))
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="GSTIN"
                        value={form.gstin}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                gstin: e.target.value,
                            }))
                        }
                    />
                </Grid>

                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Address"
                        value={form.address}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                address: e.target.value,
                            }))
                        }
                    />
                </Grid>
            </Grid>
            <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={3}
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