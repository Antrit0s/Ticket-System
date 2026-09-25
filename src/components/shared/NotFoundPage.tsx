import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../lib/hooks";
import { getHomePath } from "../../lib/navSidebar";
import type { UserRole } from "../../types";

// A simple 404 page that redirects to the correct home page based on the logged-in user's role.
export default function NotFoundPage() {
  const user = useAppSelector((state) => state.authSlice.user);

  const homePath = user
    ? getHomePath(user.role as UserRole)
    : "/";

  return <Navigate to={homePath} replace />;
}