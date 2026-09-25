import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import type { Appointment } from "../../types";
import { toast } from "react-toastify";
import { useAppSelector } from "../../lib/hooks";
import { getErrorMessage } from "../../lib/errorMessage";
import {
  useGetCategoriesQuery,
  useDeleteTicketMutation,
  useGetTicketActivityQuery,
  useGetTicketMessagesQuery,
  useGetTicketQuery,
  useLogTicketActivityMutation,
  useSendTicketMessageMutation,
  useUpdateTicketMutation,
} from "../../features/tickets/ticketsApi";
import { useGetAssetQuery, useUpdateAssetMutation } from "../../features/assets/assetsApi";
import { useGetUsersQuery } from "../../features/users/usersApi";
import { useTheme } from "@mui/material/styles";
import AppointmentFormDialog from "../admin/AppointmentFormDialog";
import { useGetAppointmentsQuery, useUpdateAppointmentMutation } from "../../features/appointments/appointmentsApi";
import TicketHeader from "./ticket-details/TicketHeader";
import TicketStatusPanel from "./ticket-details/TicketStatusPanel";
import AssignedAdminCard from "./ticket-details/AssignedAdminCard";
import TicketAppointmentSection from "./ticket-details/TicketAppointmentSection";
import TicketAssetSection from "./ticket-details/TicketAssetSection";
import ConversationPanel from "./ticket-details/ConversationPanel";
import ReplyBox from "./ticket-details/ReplyBox";
import ActivityTimeline from "./ticket-details/ActivityTimeline";

type Filter = "all" | "support" | "customer";

export default function TicketDetailsPage() {
  const { id: ticketId = "" } = useParams();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.authSlice.user);
  const { data: ticket, isLoading, isError } = useGetTicketQuery(ticketId);
  const { data: messages = [], isFetching: isFetchingMessages } = useGetTicketMessagesQuery(ticketId, { pollingInterval: 3000 });
  const { data: activity = [] } = useGetTicketActivityQuery(ticketId);
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [filter, setFilter] = useState<Filter>("all");
  const [reply, setReply] = useState("");
  const [sendReply, { isLoading: isSending }] = useSendTicketMessageMutation();
  const [logActivity] = useLogTicketActivityMutation();
  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null);
  const { data: appointments = [], isLoading: isLoadingAppointments } = useGetAppointmentsQuery(ticketId ? { ticketId } : undefined);
  const [updateAppointment] = useUpdateAppointmentMutation();
  const { data: ticketAsset, isLoading: isLoadingAsset } = useGetAssetQuery(ticket?.assetId || "", { skip: !ticket?.assetId });
  const [updateAsset] = useUpdateAssetMutation();
  const theme = useTheme();
  const role = currentUser?.role ?? "user";

  const ticketAppointment = appointments[0];
  const categoryName = categories.find((category) => category.id === ticket?.categoryId)?.name ?? "General";
  const assignee = ticket?.assigneeId ? users.find((user) => user.id === ticket.assigneeId) ?? undefined : undefined;
  const statusLabel = theme.palette.customStatus[ticket?.status ?? ""]?.label ?? ticket?.status ?? "";
  const isCreator = ticket && currentUser ? ticket.creatorId === currentUser.id : false;

  const goBack = () => navigate(role === "admin" ? "/admin" : "/dashboard/tickets");

  const onSendReply = async () => {
    const text = reply.trim();
    if (!text || !ticketId || !currentUser) return;
    const messageResult = await sendReply({ ticketId, senderId: currentUser.id, text });
    if (messageResult.error) { toast.error(getErrorMessage(messageResult.error)); return; }
    const activityResult = await logActivity({ ticketId, action: `${currentUser.name} replied` });
    if (activityResult.error) { toast.error(getErrorMessage(activityResult.error)); return; }
    setReply("");
  };

  const onChangeStatus = async (newStatus: string) => {
    if (!ticket || !ticketId) return;
    const oldLabel = theme.palette.customStatus[ticket.status]?.label ?? ticket.status;
    const newLabel = theme.palette.customStatus[newStatus as string]?.label ?? newStatus;
    const result = await updateTicket({ id: ticketId, patch: { status: newStatus as never } });
    if (result.error) { toast.error(getErrorMessage(result.error)); return; }
    const action = `Status changed from ${oldLabel} to ${newLabel}`;
    await logActivity({ ticketId, action });
    toast.success(`Ticket marked as ${newLabel}`);
  };

  const onDeleteTicket = async () => {
    if (!ticketId) return;
    const confirmed = window.confirm("Delete this ticket? This action cannot be undone.");
    if (!confirmed) return;
    const result = await deleteTicket(ticketId);
    if (result.error) { toast.error(getErrorMessage(result.error)); return; }
    toast.success("Ticket deleted");
    navigate(role === "admin" ? "/admin" : "/dashboard");
  };

  const handleCancelAppointment = async () => {
    const result = await updateAppointment({ id: ticketAppointment?.id ?? "", patch: { status: "cancelled" } });
    if (result.error) {
      console.error("Cancel error:", result.error);
      toast.error(getErrorMessage(result.error));
    } else {
      toast.success("Appointment cancelled");
    }
  };

  const handleAssetStatusChange = async (newStatus: string) => {
    if (!ticketAsset) return;
    const result = await updateAsset({ id: ticketAsset.id, patch: { status: newStatus } });
    if (result.error) {
      console.error("Asset update error:", result.error);
      toast.error(getErrorMessage(result.error));
      return;
    }
    toast.success("Asset status updated");
  };

  if (!currentUser) return null;
  if (isLoading) return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
  if (isError) return <Box sx={{ p: 4, textAlign: "center" }}><Typography color="error">Could not load this ticket.</Typography></Box>;
  if (!ticket) return <Box sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">Ticket not found.</Typography></Box>;
  if (role !== "admin" && ticket.creatorId !== currentUser.id) return <Box sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">You don't have access to this ticket.</Typography></Box>;

  return (
    <Box>
      <TicketHeader
        ticket={ticket}
        categoryName={categoryName}
        assignee={assignee}
        isCreator={isCreator}
        role={role}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onBack={goBack}
        onCloseStatus={() => onChangeStatus("closed")}
        onReopenStatus={() => onChangeStatus("open")}
        onDeleteTicket={onDeleteTicket}
      />
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 4 } }}>
        <Box sx={{ width: { md: 230 }, flexShrink: 0, borderRight: { md: 1 }, borderColor: "divider", pr: { md: 3 } }}>
          <TicketStatusPanel status={ticket.status} statusLabel={statusLabel} role={role} onChangeStatus={onChangeStatus} />
          <AssignedAdminCard assignee={assignee} />
          <TicketAppointmentSection
            ticketAppointment={ticketAppointment}
            isLoading={isLoadingAppointments}
            role={role}
            users={users}
            onEdit={(appointment) => { setEditAppointment(appointment); setAppointmentDialogOpen(true); }}
            onCancel={handleCancelAppointment}
            onSchedule={() => { setEditAppointment(null); setAppointmentDialogOpen(true); }}
          />
          {ticket.assetId && (
            <TicketAssetSection
              asset={ticketAsset ? { id: ticketAsset.id, name: ticketAsset.name, serialNumber: ticketAsset.serialNumber, type: ticketAsset.type, status: ticketAsset.status } : undefined}
              isLoading={isLoadingAsset}
              role={role}
              onStatusChange={handleAssetStatusChange}
            />
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ConversationPanel
            messages={messages}
            filter={filter}
            onFilterChange={(filterValue) => setFilter(filterValue)}
            isFetchingMessages={isFetchingMessages}
            users={users}
          />
          <ReplyBox value={reply} onChange={setReply} onSend={onSendReply} isSending={isSending} />
          <ActivityTimeline activity={activity} />
        </Box>
      </Box>
      <AppointmentFormDialog
        open={appointmentDialogOpen}
        onClose={() => { setAppointmentDialogOpen(false); setEditAppointment(null); }}
        defaultTicketId={ticketId}
        initialAppointment={editAppointment}
      />
    </Box>
  );
}
