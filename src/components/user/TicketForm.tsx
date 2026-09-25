import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateTicketMutation,
  useGetCategoriesQuery,
  useLogTicketActivityMutation,
} from "../../features/tickets/ticketsApi";
import { useGetAssetsQuery } from "../../features/assets/assetsApi";
import { useAppSelector } from "../../lib/hooks";
import { getErrorMessage } from "../../lib/errorMessage";

const schema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  categoryId: z.string().min(1, "Pick a category"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assetId: z.string().optional(),
  attachment: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

// Form to create a new ticket. If opened from an asset ("Report issue"),
// the asset is pre-selected via the ?assetId= query param.
export default function TicketForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAppSelector((state) => state.authSlice.user);
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [logActivity] = useLogTicketActivityMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: assets = [] } = useGetAssetsQuery(
    user ? { userId: user.id } : undefined,
  );

  const presetAssetId = searchParams.get("assetId") ?? "";

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      priority: "medium",
      assetId: presetAssetId,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    const result = await createTicket({
      title: values.title,
      description: values.description,
      categoryId: values.categoryId,
      priority: values.priority,
      assetId: values.assetId || null,
      creatorId: user.id,
    });
    if (result.error) {
      toast.error(getErrorMessage(result.error));
      return;
    }
    const ticketId = result.data?.id;
    if (ticketId) {
      await logActivity({
        ticketId,
        action: "Ticket created",
      });
    }

    toast.success("Ticket created");
    navigate("/dashboard/tickets");
  };

  return (
    <Card sx={{ maxWidth: 640, p: 3 }}>
      <Typography variant="h1" gutterBottom>
        New Ticket
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Description"
              multiline
              rows={4}
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="categoryId"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              select
              label="Category"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Priority" fullWidth>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="assetId"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Related asset" fullWidth>
              <MenuItem value="">None</MenuItem>
              {assets.map((assetItem) => (
                <MenuItem key={assetItem.id} value={assetItem.id}>
                  {assetItem.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={() => navigate("/dashboard/tickets")}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={22} color="inherit" /> : "Submit"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
