export type UserRole = "user" | "admin";
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  department?: string;
  password: string;
  otp?: string | null;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  categoryId: string;
  creatorId: string;
  assigneeId: string | null;
  assetId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  userId: string | null;
  name: string;
  serialNumber: string;
  type: string;
  status: "assigned" | "maintenance" | "returned";
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
  otp?: string;
  role?: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface Appointment {
  id: string;
  ticketId: string;
  technicianId: string;
  userId: string;
  scheduledAt: string;
  durationMinutes: number;
  location: string;
  status?: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  text: string;
  createdAt: string;
  attachment?: string;
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  action: string;
  createdAt: string;
}
