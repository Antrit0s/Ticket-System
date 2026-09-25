import { useState } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useGetAssetsQuery } from "../../features/assets/assetsApi";

const DEFAULT_ASSET_TYPES = ["Laptop", "Monitor", "Security Key", "Tablet"];
const ADD_NEW_TYPE = "__add_new__";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

export default function AssetTypeField({ value, onChange, error, helperText }: Props) {
  const { data: assets = [] } = useGetAssetsQuery();
  const [isCustomType, setIsCustomType] = useState(false);

  const assetTypes = [...new Set([...DEFAULT_ASSET_TYPES, ...assets.map((asset) => asset.type)])];

  if (isCustomType) {
    return (
      <Box>
        <TextField
          value={value}
          onChange={(event) => onChange(event.target.value)}
          label="New type name"
          fullWidth
          error={error}
          helperText={helperText}
        />
        <Button
          size="small"
          onClick={() => {
            onChange("");
            setIsCustomType(false);
          }}
          sx={{ mt: 0.5, minWidth: 0, px: 0, textTransform: "none" }}
        >
          Use an existing type
        </Button>
      </Box>
    );
  }

  return (
    <TextField
      value={value}
      select
      label="Type"
      fullWidth
      error={error}
      helperText={helperText}
      onChange={(event) => {
        const next = event.target.value;
        if (next === ADD_NEW_TYPE) {
          onChange("");
          setIsCustomType(true);
        } else {
          onChange(next);
        }
      }}
    >
      {assetTypes.map((assetType) => (
        <MenuItem key={assetType} value={assetType}>
          {assetType}
        </MenuItem>
      ))}
      <MenuItem value={ADD_NEW_TYPE}>+ Add new type…</MenuItem>
    </TextField>
  );
}
