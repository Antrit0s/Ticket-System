import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  SupportAgent as SupportAgentIcon,
} from "@mui/icons-material";
import { navItems, getHomePath } from "../../lib/navSidebar";
import type { UserRole } from "../../types";
import { useEffect, useRef } from "react";

interface Props {
  role: UserRole;
  open: boolean;
  onToggle: () => void;
  currentPath: string;
  drawerWidth: number;
}

export default function Sidebar({
  role,
  open,
  onToggle,
  currentPath,
  drawerWidth,
}: Props) {
  const items = navItems[role];
  const homePath = getHomePath(role);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const autoCollapsed = useRef(false);
  //collapse on small screens
  useEffect(() => {
    if (!isSmallScreen) {
      autoCollapsed.current = false;
      return;
    }

    if (!autoCollapsed.current) {
      autoCollapsed.current = true;
      if (open) onToggle();
    }
  }, [isSmallScreen, open, onToggle]);

  const handleNavClick = () => {
    if (isSmallScreen && open) onToggle();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: "width 0.2s ease",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: 1,
          borderColor: "divider",
          transition: "width 0.2s ease",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        id="app-sidebar"
        sx={{
          p: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
            mb: 3,
            minHeight: 40,
          }}
        >
          {open ? (
            <Typography
              variant="h1"
              noWrap
              component={RouterLink}
              to={homePath}
              sx={{
                fontWeight: 700,
                flex: 1,
                minWidth: 0,
                color: "text.primary",
                textDecoration: "none",
              }}
            >
              IT Service Desk
            </Typography>
          ) : (
            <SupportAgentIcon sx={{ color: "primary.main" }} />
          )}
        </Box>

        <List disablePadding sx={{ flex: 1, overflowY: "auto" }}>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip
                key={item.path}
                title={open ? "" : item.label}
                placement="right"
                arrow
              >
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={handleNavClick}
                  selected={currentPath === item.path}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
                    px: open ? 2 : 1.5,
                    justifyContent: open ? "flex-start" : "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 0,
                      justifyContent: "center",
                    }}
                  >
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  {open && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>

        <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"}>
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              alignSelf: open ? "flex-end" : "center",
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
            }}
          >
            {open ? (
              <ChevronLeft fontSize="small" />
            ) : (
              <ChevronRight fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
