interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
}

import { Box, Button, CircularProgress, TextField } from "@mui/material";

export default function ReplyBox({ value, onChange, onSend, isSending }: Props) {
  return (
    <Box sx={{ mt: 3, display: "flex", gap: 1.5 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Write a reply"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
          }
        }}
      />
      <Button variant="contained" onClick={onSend} disabled={isSending}>
        {isSending ? <CircularProgress size={20} color="inherit" /> : "Send"}
      </Button>
    </Box>
  );
}
