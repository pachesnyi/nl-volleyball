"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { devProps } from "@/lib/dev-helpers";
import { Menu as MenuIcon } from "@mui/icons-material";
import { UserProfile } from "./UserProfile";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [{ name: "Home", href: "/" }];

  useEffect(() => {
    console.log(user);
  }, [user]);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsMenuOpen(open);
    };

  return (
    <Box {...devProps("Header")}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        }}
        {...devProps("AppBar")}
      >
        <Toolbar {...devProps("Toolbar")}>
          {/* Mobile menu toggle */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2, display: { sm: "none" } }}
              {...devProps("MobileMenuToggle")}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
              gap: 2,
            }}
            {...devProps("DesktopNavigation")}
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                passHref
                style={{ textDecoration: "none" }}
              >
                <Button
                  color={pathname === item.href ? "primary" : "inherit"}
                  variant={pathname === item.href ? "outlined" : "text"}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </Box>

          {/* User profile */}
          <Box sx={{ ml: "auto" }} {...devProps("UserProfileContainer")}>
            <UserProfile />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={toggleDrawer(false)}
        {...devProps("MobileDrawer")}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          {...devProps("MobileDrawerContent")}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <Link
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  <ListItemButton selected={pathname === item.href}>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

Header.displayName = "Header";
