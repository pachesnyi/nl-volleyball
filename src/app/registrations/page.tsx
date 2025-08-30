"use client";

import { useState, useEffect } from "react";
import { GameRegistrationCard } from "@/components/GameRegistrationCard";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToGames, registerPlayerForGame } from "@/lib/games";
import { Game, GamePlayer } from "@/types";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";

// Transform Game data to match the component interface
const transformGameForComponent = (game: Game) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    const startTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    // Assume 2-hour sessions for display
    const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${startTime} – ${endTime}`;
  };

  return {
    id: game.id,
    date: formatDate(game.date),
    time: formatTime(game.date),
    location: game.location.name,
    locationUrl: game.location.googleMapsUrl,
    price: game.price,
    paymentStatus: game.tikkieUrl ? "Tikkie available" : "Tikkie soon",
    currentPlayers: game.players.length,
    maxPlayers: game.maxPlayers,
    waitingList: game.waitingList.length,
    isPaid: true, // For now, assume all games are paid
    players: game.players.map((player, index) => ({
      id: player.userId,
      name: player.userName,
      position: index + 1,
      isChecked: player.hasPaid,
      avatar: null,
      hasBall: player.willBringBall,
      hasSound: player.willBringSpeaker,
    })),
    waitingListPlayers: game.waitingList.map((player, index) => ({
      id: player.userId,
      name: player.userName,
      position: game.players.length + index + 1,
      isChecked: player.hasPaid,
      avatar: null,
      hasBall: player.willBringBall,
      hasSound: player.willBringSpeaker,
    }))
  };
};

export default function RegistrationsPage() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Subscribe to upcoming games
    const unsubscribe = subscribeToGames(
      (gamesData) => {
        setGames(gamesData);
        setLoading(false);
      },
      { status: 'upcoming' }
    );

    return unsubscribe;
  }, []);

  const handleRegister = async (gameId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const gamePlayer: GamePlayer = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        joinedAt: new Date(),
        hasPaid: false,
        willBringBall: false,
        willBringSpeaker: false,
      };

      await registerPlayerForGame(gameId, gamePlayer);
    } catch (error) {
      console.error("Error registering for game:", error);
      // TODO: Show error notification
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #facc15 0%, #fb923c 50%, #facc15 100%)',
        p: 2,
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 1,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            🏐 Volleymania
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Open Registrations
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* No Games State */}
        {!loading && games.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              No upcoming games at the moment
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151' }}>
              Check back later for new games to register for!
            </Typography>
          </Box>
        )}

        {/* Game Cards Grid */}
        {!loading && games.length > 0 && (
          <Grid container spacing={3}>
            {games.map((game) => (
              <Grid item xs={12} lg={6} key={game.id}>
                <GameRegistrationCard
                  game={transformGameForComponent(game)}
                  onRegister={() => handleRegister(game.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </Box>
  );
}