import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../lib/hooks";
import { getHomePath } from "../../lib/navSidebar";
import type { UserRole } from "../../types";

interface Props {
  allowedRoles?: UserRole[];
}

// Guards the protected pages. If there is no logged-in user, send them to the
// auth screen. If the user's role isn't allowed for this area, send them to
// their own home with a toast.
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
