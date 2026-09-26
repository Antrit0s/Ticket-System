import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../lib/hooks";
import { getHomePath } from "../../lib/navSidebar";
import type { UserRole } from "../../types";

interface Props {
  allowedRoles?: UserRole[];
}


export default function ProtectedRoute({ allowedRoles }: Props) {
  const user = useAppSelector((state) => state.authSlice.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = user.role ?? "user";
  if (allowedRoles && !allowedRoles.includes(role)) {
    toast.error("You don't have access to this page");
    return <Navigate to={getHomePath(role)} replace />;
  }

  return <Outlet />;
}
