import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../lib/hooks.ts";
import { getHomePath } from "../../../lib/navSidebar.ts";
import type { UserRole } from "../../../types/index.ts";


export default function NotFoundPage() {
  const user = useAppSelector((state) => state.authSlice.user);

  const homePath = user
    ? getHomePath(user.role as UserRole)
    : "/";

  return <Navigate to={homePath} replace />;
}