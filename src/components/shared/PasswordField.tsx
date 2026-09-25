import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "slotProps">;

// Password input with a show/hide (eye) toggle. Drop-in replacement for
// TextField — spread the react-hook-form field onto it as usual.
export default function PasswordField(props: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      {...props}
      type={show ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((prev) => !prev)}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
