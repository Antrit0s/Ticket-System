import type { MouseEvent } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { HelpOutlined } from "@mui/icons-material";
import { startUserTour } from "../../lib/userTour"; 

function handleClick(event: MouseEvent<HTMLButtonElement>) {
  if (event.detail === 0) return;
  startUserTour();
}

export default function UserTourButton() {
  return (
    <Tooltip title="Take a tour">
      <IconButton
        type="button"
        aria-label="Take a tour"
        onClick={handleClick}
        color="inherit"
      >
        <HelpOutlined />
      </IconButton>
    </Tooltip>
  );
}
