import { Avatar, Box, Typography } from "@mui/material";
import { initials } from "../../../lib/utils";
import SectionCard from "./SectionCard";

interface Props {
  requester:
    | {
        id: string;
        name: string;
        email?: string;
        department?: string;
      }
    | undefined;
}

export default function RequesterCard({ requester }: Props) {
  return (
    <SectionCard title="Requester">
      {requester ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontSize: 14,
              bgcolor: "primary.main",
            }}
          >
            {initials(requester.name)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, lineHeight: 1.3 }}
            >
              {requester.name}
            </Typography>
            {requester.email && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", lineHeight: 1.3 }}
              >
                {requester.email}
              </Typography>
            )}
            {requester.department && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", lineHeight: 1.3 }}
              >
                {requester.department}
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Unknown
        </Typography>
      )}
    </SectionCard>
  );
}
