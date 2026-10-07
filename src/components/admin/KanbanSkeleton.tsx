import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

export default function KanbanSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
        alignItems: "start",
      }}
    >
      {Array.from({ length: 4 }).map((_, colIdx) => (
        <Box
          key={colIdx}
          sx={{
            bgcolor: "action.hover",
            borderRadius: 2,
            p: 1.5,
            minHeight: 200,
          }}
        >
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
              pb: 1,
            }}
          >
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="rounded" width={28} height={20} />
          </Box>

          
          <Stack spacing={1.5}>
            {Array.from({ length: colIdx === 0 ? 3 : 2 }).map((_, cardIdx) => (
              <Card key={cardIdx}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Skeleton variant="text" width="65%" height={20} />
                    <Skeleton variant="text" width={45} height={18} />
                  </Box>
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={16}
                    sx={{ mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="50%"
                    height={16}
                    sx={{ mb: 1.5 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Skeleton variant="rounded" width={60} height={20} />
                    <Skeleton variant="text" width={55} height={16} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
