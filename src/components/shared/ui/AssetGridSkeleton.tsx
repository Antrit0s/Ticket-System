import { Box, Card, CardContent, Grid, Skeleton } from "@mui/material";

interface Props {
  count?: number;
}

export default function AssetGridSkeleton({ count = 6 }: Props) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent
              sx={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Skeleton variant="text" width="60%" height={26} />
                <Skeleton variant="rounded" width={55} height={24} />
              </Box>
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="40%" height={18} />
              <Box sx={{ mt: 3 }}>
                <Skeleton variant="rounded" width="100%" height={32} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
