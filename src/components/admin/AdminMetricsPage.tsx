import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useGetTicketsQuery } from "../../features/tickets/ticketsApi";
import { useGetAssetsQuery } from "../../features/assets/assetsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";

export default function AdminMetricsPage() {
  const { data: tickets = [] } = useGetTicketsQuery(undefined, {
    pollingInterval: 5000,
  });
  const { data: assets = [] } = useGetAssetsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const stats = [
    { label: "Total tickets", value: tickets.length },
    {
      label: "Open",
      value: tickets.filter((ticket) => ticket.status === "open").length,
    },
    {
      label: "In progress",
      value: tickets.filter((ticket) => ticket.status === "in_progress").length,
    },
    {
      label: "Resolved",
      value: tickets.filter(
        (ticket) => ticket.status === "resolved" || ticket.status === "closed",
      ).length,
    },
    { label: "Total assets", value: assets.length },
    { label: "Total users", value: users.length },
  ];

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        System Metrics
      </Typography>
      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={stat.label}>
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
