import {
  Box,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
  Icon
} from "@mui/material";

export default function ChatContent() {
  
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >      
      <Box
        sx={{
          pl: 1,
          pt: 1,
          pb: 0,
          pr: 0,
          m: 0,
          borderTop: 1,
          borderColor: "divider"
        }}
      >
        <TextField
            fullWidth
            placeholder="Type a message..."
            multiline
            minRows={1}
            maxRows={2}
            size="small"
            InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    <IconButton color="primary">
                        <Icon fontSize="medium">send</Icon>
                    </IconButton>
                    <IconButton color="primary">
                        <Icon fontSize="medium">done_all</Icon>
                    </IconButton>
                </InputAdornment>
                ),
                startAdornment: (
                <InputAdornment position="start">
                    <IconButton color="primary">
                        <Icon fontSize="medium">attach_file</Icon>
                    </IconButton>
                </InputAdornment>
                )
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
    </Box>
  );
}