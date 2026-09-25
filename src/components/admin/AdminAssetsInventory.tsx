import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGetAssetsQuery } from "../../features/assets/assetsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import AddAssetDialog from "./AddAssetDialog";
import AssignAssetDialog from "./AssignAssetDialog";
import EditAssetDialog from "./EditAssetDialog";
import PaginationControls from "../shared/PaginationControls";
import type { Asset } from "../../types";

const PAGE_SIZE = 8;

export default function AdminAssetsInventory() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAssetId, setMenuAssetId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, type]);

  const { data: assets = [], isLoading } = useGetAssetsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const getUserName = (userId: string | null) =>
    users.find((user) => user.id === userId)?.name ?? userId;
  const assetTypes = [...new Set(assets.map((asset) => asset.type))];

  const filteredAssets = useMemo(() => {
    const searchQuery = search.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesSearch =
        !searchQuery ||
        asset.name.toLowerCase().includes(searchQuery) ||
        asset.serialNumber.toLowerCase().includes(searchQuery);
      const matchesType = !type || asset.type === type;
      return matchesSearch && matchesType;
    });
  }, [assets, search, type]);

  const pageCount = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        All Assets
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(event) => setType(event.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {assetTypes.map((assetType) => (
              <MenuItem key={assetType} value={assetType}>
                {assetType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => setDialogOpen(true)}>
          Add Asset
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Serial</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned to</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAssets.map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.serialNumber}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.status}</TableCell>
                  <TableCell>{getUserName(asset.userId)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        setMenuAssetId(asset.id);
                        setAnchorEl(event.currentTarget);
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <PaginationControls
        total={filteredAssets.length}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setEditingAsset(
              assets.find((asset) => asset.id === menuAssetId) ?? null,
            );
            setEditDialogOpen(true);
            setAnchorEl(null);
          }}
        >
          Edit asset
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAssignDialogOpen(true);
            setAnchorEl(null);
          }}
        >
          Assign to User
        </MenuItem>
      </Menu>

      <AssignAssetDialog
        open={assignDialogOpen}
        assetId={menuAssetId}
        onClose={() => setAssignDialogOpen(false)}
      />

      <AddAssetDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <EditAssetDialog
        open={editDialogOpen}
        asset={editingAsset}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingAsset(null);
        }}
      />
    </Box>
  );
}
