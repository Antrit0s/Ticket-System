import { Box } from "@mui/material";
import TicketStatusPanel from "./TicketStatusPanel.tsx";
import AssignedAdminCard from "./AssignedAdminCard.tsx";
import TicketAppointmentSection from "./TicketAppointmentSection.tsx";
import TicketAssetSection from "./TicketAssetSection.tsx";
import RequesterCard from "./RequesterCard.tsx";
import type { Appointment, Asset, Ticket, User } from "../../../types/index.ts";

interface Props {
  ticket: Ticket;
  role: string;
  statusLabel: string;
  assignee: User | undefined;
  requester: User | undefined;
  ticketAppointment: Appointment | undefined;
  isLoadingAppointments: boolean;
  ticketAsset: Asset | undefined;
  isLoadingAsset: boolean;
  users: User[];
  onChangeStatus: (newStatus: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: () => void;
  onScheduleAppointment: () => void;
  onAssetStatusChange: (newStatus: string) => void;
}

export default function TicketSidebar({
  ticket,
  role,
  statusLabel,
  assignee,
  requester,
  ticketAppointment,
  isLoadingAppointments,
  ticketAsset,
  isLoadingAsset,
  users,
  onChangeStatus,
  onEditAppointment,
  onCancelAppointment,
  onScheduleAppointment,
  onAssetStatusChange,
}: Props) {
  return (
    <Box sx={{ width: { md: 280 }, flexShrink: 0 }}>
      <TicketStatusPanel
        status={ticket.status}
        statusLabel={statusLabel}
        role={role}
        onChangeStatus={onChangeStatus}
      />
      {role === "admin" && <RequesterCard requester={requester} />}
      <AssignedAdminCard assignee={assignee} />
      <TicketAppointmentSection
        ticketAppointment={ticketAppointment}
        isLoading={isLoadingAppointments}
        role={role}
        users={users}
        onEdit={onEditAppointment}
        onCancel={onCancelAppointment}
        onSchedule={onScheduleAppointment}
      />
      {ticket.assetId && (
        <TicketAssetSection
          asset={ticketAsset}
          isLoading={isLoadingAsset}
          role={role}
          onStatusChange={onAssetStatusChange}
        />
      )}
    </Box>
  );
}
