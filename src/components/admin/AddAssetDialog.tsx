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
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useCreateAssetMutation } from "../../features/assets/assetsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { getErrorMessage } from "../../lib/errorMessage";
import AssetTypeField from "./AssetTypeField";

const schema = z.object({
  name: z.string().min(3, "Asset name is too short"),
  serialNumber: z.string().min(3, "Serial number is required"),
  type: z.string().min(2, "Enter a type"),
  userId: z.string().min(1, "Pick an employee"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddAssetDialog({ open, onClose }: Props) {
  const [createAsset, { isLoading }] = useCreateAssetMutation();
  const { data: users = [] } = useGetUsersQuery();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      serialNumber: "",
      type: "",
      userId: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await createAsset({
      name: values.name,
      serialNumber: values.serialNumber,
      type: values.type,
      userId: values.userId,
    });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }
    toast.success("Asset added to inventory");
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Asset</DialogTitle>
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
          <Controller
            name="userId"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Assign to User"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.email}){user.role === "admin" ? " — Admin" : ""}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={22} color="inherit" /> : "Add Asset"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
