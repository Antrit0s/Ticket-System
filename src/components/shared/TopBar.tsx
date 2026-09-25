import { useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { initials } from "../../lib/utils";
import { getPageTitle } from "../../lib/navTopbar";
import { useThemeMode } from "../../lib/themeMode";
import MaterialUISwitch from "./MaterialUISwitch";
import UserTourButton from "../user/UserTourButton";
import type { User } from "../../types";

interface Props {
  user: User;
  drawerWidth: number;
  onLogout: () => void;
}

export default function TopBar({ user, drawerWidth, onLogout }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggle } = useThemeMode();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const role = user.role ?? "user";

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleSetting = (setting: string) => {
    handleCloseUserMenu();
    if (setting === "profile") navigate("/profile");
    else if (setting === "logout") onLogout();
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        transition: "width 0.2s ease, margin 0.2s ease",
      }}
    >
      <Toolbar>
        <Typography variant="h2" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
          {getPageTitle(location.pathname)}
        </Typography>

        {role === "user" && <UserTourButton />}

        <MaterialUISwitch checked={mode === "dark"} onChange={toggle} sx={{ mr: 1 }} />

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton id="profile-menu-button" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34, fontSize: 15 }}>
                {initials(user.name)}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {role === "admin" ? "Administrator" : "User"}
                {user.department ? ` · ${user.department}` : ""}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => handleSetting("profile")}>Profile</MenuItem>
            <MenuItem onClick={() => handleSetting("logout")}>
              <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
