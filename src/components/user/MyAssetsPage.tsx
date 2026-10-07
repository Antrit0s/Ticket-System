import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../lib/hooks";
import { useGetAssetsQuery } from "../../features/assets/assetsApi";
import { motion } from "framer-motion";
import { listContainer, listItem } from "../../lib/animations";
import AssetGridSkeleton from "../shared/ui/AssetGridSkeleton.tsx";

export default function MyAssetsPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authSlice.user);
  const {
    data: assets = [],
    isLoading,
    isError,
  } = useGetAssetsQuery(user ? { userId: user.id } : undefined);

  if (!user) return null;

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Could not load your assets. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        My Assets
      </Typography>

      {isLoading ? (
        <AssetGridSkeleton count={6} />
      ) : assets.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No assets assigned to you.
          </Typography>
        </Card>
      ) : (
        <motion.div variants={listContainer} initial="hidden" animate="show">
          <Grid container spacing={2}>
            {assets.map((assetItem) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={assetItem.id}>
                <motion.div variants={listItem} style={{ height: "100%" }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="subtitle1">
                          {assetItem.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={assetItem.type}
                          variant="outlined"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Serial: {assetItem.serialNumber}
                      </Typography>
                      <Typography variant="caption">
                        Status: {assetItem.status}
                      </Typography>
                      <Box sx={{ mt: "auto", pt: 2 }}>
                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              `/dashboard/tickets/new?assetId=${assetItem.id}`,
                            )
                          }
                        >
                          Report issue
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}
    </Box>
  );
}
