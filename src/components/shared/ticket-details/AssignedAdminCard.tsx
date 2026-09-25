interface Props {
  assignee: { id: string; name: string; department?: string } | undefined;
}

import { Avatar, Box, Typography } from "@mui/material";
import { initials } from "../../../lib/utils";

export default function AssignedAdminCard({ assignee }: Props) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Assigned Administrator
      </Typography>
      {assignee ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
            {initials(assignee.name)}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {assignee.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {assignee.department ?? "IT Support"}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Unassigned
        </Typography>
      )}
    </Box>
  );
}
