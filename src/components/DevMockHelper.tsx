"use client";

import { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { createMockGames } from "@/lib/mock-data";
import { getGames, deleteGame, createGame } from "@/lib/games";
import { useAuth } from "@/contexts/AuthContext";

export function DevMockHelper() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  console.log("🛠️ DevMockHelper render:", {
    nodeEnv: process.env.NODE_ENV,
    userRole: user?.role,
    userName: user?.name,
  });

  // Show if user is admin (remove NODE_ENV check for debugging)
  if (!user || user.role !== "admin") {
    return null;
  }

  const handleAddMockGames = async () => {
    console.log("🎮 Starting mock games addition...");
    setLoading(true);
    setMessage(null);

    console.log(user, "USER");

    try {
      const mockGames = createMockGames();
      console.log("📦 Created mock games:", mockGames.length);

      for (const mockGame of mockGames) {
        try {
          console.log(`📝 Adding game: ${mockGame.title}`);
          // Remove the id and timestamps for creation
          const { id, createdAt, updatedAt, ...gameData } = mockGame;
          await createGame(gameData);
          console.log(`✅ Added mock game: ${mockGame.title}`);
        } catch (error) {
          console.error(`❌ Failed to add mock game: ${mockGame.title}`, error);
          throw error;
        }
      }

      setMessage({
        type: "success",
        text: `Added ${mockGames.length} mock games successfully!`,
      });
      console.log("✅ Mock games addition completed");
    } catch (error) {
      console.error("❌ Error adding mock games:", error);
      setMessage({
        type: "error",
        text: `Failed to add mock games: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllGames = async () => {
    if (
      !confirm(
        "Are you sure you want to delete ALL games? This cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const games = await getGames();

      for (const game of games) {
        await deleteGame(game.id);
      }

      setMessage({
        type: "success",
        text: `Deleted ${games.length} games successfully!`,
      });
    } catch (error) {
      console.error("Error clearing games:", error);
      setMessage({
        type: "error",
        text: "Failed to clear games. Check console for details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        bgcolor: "background.paper",
        border: "2px solid",
        borderColor: "warning.main",
        borderRadius: 2,
        p: 2,
        boxShadow: 4,
        maxWidth: 300,
      }}
    >
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ color: "warning.main", fontWeight: "bold" }}
      >
        🚧 DEV TOOLS
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2, fontSize: "0.75rem" }}>
          {message.text}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={1}>
        <Button
          size="small"
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
          onClick={handleAddMockGames}
          disabled={loading}
          fullWidth
        >
          Add Mock Games
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          onClick={handleClearAllGames}
          disabled={loading}
          fullWidth
        >
          Clear All Games
        </Button>
      </Box>

      <Typography
        variant="caption"
        sx={{ color: "text.secondary", mt: 1, display: "block" }}
      >
        Development mode only
      </Typography>
    </Box>
  );
}
