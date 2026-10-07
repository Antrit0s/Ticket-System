import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

interface Props {
  count?: number;
}

export default function CardListSkeleton({ count = 4 }: Props) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx}>
          <CardContent>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Box sx={{ width: "40%" }}>
                <Skeleton variant="text" height={28} width="90%" />
                <Skeleton variant="text" height={18} width="50%" />
              </Box>
              <Skeleton variant="rounded" width={75} height={24} />
            </Box>

            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />

            <Box
              sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "center" }}
            >
              <Skeleton variant="rounded" width={60} height={22} />
              <Skeleton variant="text" width={140} height={18} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
