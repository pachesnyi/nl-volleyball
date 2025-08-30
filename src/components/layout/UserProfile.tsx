"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Avatar,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { devProps } from "@/lib/dev-helpers";
import { useState } from "react";

export function UserProfile() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleClose();
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  if (!user) {
    return (
      <Button
        variant="contained"
        size="small"
        onClick={signInWithGoogle}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Sign In with Google
      </Button>
    );
  }

  return (
    <Box {...devProps('UserProfile')}>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        {...devProps('UserMenuTrigger')}
      >
        <Avatar
          src={user.photoURL || undefined}
          sx={{ width: 32, height: 32, cursor: 'pointer' }}
        >
          {user.name?.charAt(0)}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user.email}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
          Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
