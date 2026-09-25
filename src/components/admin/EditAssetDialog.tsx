import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useUpdateAssetMutation } from "../../features/assets/assetsApi";
import { getErrorMessage } from "../../lib/errorMessage";
import type { Asset } from "../../types";
import AssetTypeField from "./AssetTypeField";

const schema = z.object({
  name: z.string().min(3, "Asset name is too short"),
  serialNumber: z.string().min(3, "Serial number is required"),
  type: z.string().min(2, "Enter a type"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  asset: Asset | null;
  onClose: () => void;
}

// Dialog for admins to edit an asset's name, serial number, and type.
export default function EditAssetDialog({ open, asset, onClose }: Props) {
  const [updateAsset, { isLoading }] = useUpdateAssetMutation();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      serialNumber: "",
      type: "",
    },
  });

  // Re-seed the form each time the dialog opens or its target changes.
  useEffect(() => {
    if (open && asset) {
      reset({
        name: asset.name,
        serialNumber: asset.serialNumber,
        type: asset.type,
      });
    }
  }, [open, asset, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!asset) return;
    const result = await updateAsset({
      id: asset.id,
      patch: {
        name: values.name,
        serialNumber: values.serialNumber,
        type: values.type,
      },
    });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }
    toast.success("Asset updated");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Asset</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Asset Name"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="serialNumber"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Serial Number"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <AssetTypeField
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={22} color="inherit" /> : "Save changes"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
