interface Props {
  activity: { id: string; action: string; createdAt: string }[];
}

import { Box, Stack, Typography } from "@mui/material";
import { relativeTime } from "../../../lib/utils";

export default function ActivityTimeline({ activity }: Props) {
  if (!activity || activity.length === 0) return null;
  return (
    <Stack spacing={1.5} sx={{ mt: 4 }}>
      {activity.map((activityItem) => (
        <Box key={activityItem.id} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "grey.400", flexShrink: 0 }} />
          <Typography variant="body2" color="text.secondary">{activityItem.action}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
            {relativeTime(activityItem.createdAt)}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
