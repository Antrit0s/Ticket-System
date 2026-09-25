import { Alert, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useAppSelector } from "../../lib/hooks";
import { useGetTicketsQuery } from "../../features/tickets/ticketsApi";
import { useGetAssetsQuery } from "../../features/assets/assetsApi";

export default function OverviewPage() {
  const user = useAppSelector((state) => state.authSlice.user);
  const { data: tickets = [], isError: ticketsError } = useGetTicketsQuery(
    user ? { creatorId: user.id } : undefined,
    { pollingInterval: 5000 },
  );
  const { data: assets = [], isError: assetsError } = useGetAssetsQuery(
    user ? { userId: user.id } : undefined,
  );

  if (!user) return null;

  if (ticketsError || assetsError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Could not load your overview data. Please try again later.
        </Alert>
      </Box>
    );
  }

  const stats = [
    { label: "My tickets", value: tickets.length },
    {
      label: "Active",
      value: tickets.filter(
        (ticket) => ticket.status === "open" || ticket.status === "in_progress",
      ).length,
    },
    {
      label: "Resolved",
      value: tickets.filter(
        (ticket) => ticket.status === "resolved" || ticket.status === "closed",
      ).length,
    },
    { label: "My assets", value: assets.length },
  ];

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Hello, {user.name.split(" ")[0]}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Here's a quick look at your IT requests and equipment.
      </Typography>

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
            <Card>
              <CardContent>
                <Typography variant="h2">{stat.value}</Typography>
                <Typography variant="caption">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
