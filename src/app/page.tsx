"use client";

import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { ClientOnly } from "@/components/ClientOnly";
import { RegistrationDialog } from "@/components/RegistrationDialog";
import { DevMockHelper } from "@/components/DevMockHelper";
import { Game, GamePlayer } from "@/types";
import { useState } from "react";
import { useRealtimeGames, useUserGames, useRegisterForGame } from "@/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Box,
  Typography,
  Alert,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  SportsVolleyball as BallIcon,
  Speaker as SpeakerIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

export default function Home() {
  return (
    <Layout>
      <ClientOnly
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <CircularProgress size={60} color="primary" />
          </Box>
        }
      >
        <HomeContent />
        <DevMockHelper />
      </ClientOnly>
    </Layout>
  );
}

function HomeContent() {
  const { user, loading } = useAuth();
  const [registrationDialog, setRegistrationDialog] = useState<{
    open: boolean;
    game: Game | null;
  }>({
    open: false,
    game: null,
  });

  // Use TanStack Query hooks
  const { data: games = [], isLoading: loadingGames } = useRealtimeGames({
    status: "upcoming",
  });

  const { data: userGames = [] } = useUserGames(user?.id || "", {
    enabled: !!user?.id, // Only fetch if user is logged in
  });

  const registerMutation = useRegisterForGame();


  const handleRegister = (gameId: string) => {
    if (!user) return;

    const game = games.find((g) => g.id === gameId);
    if (game) {
      setRegistrationDialog({
        open: true,
        game,
      });
    }
  };

  const handleRegistrationSubmit = async (
    gameId: string,
    willBringBall: boolean,
    willBringSpeaker: boolean
  ) => {
    if (!user) return;

    const gamePlayer: GamePlayer = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      joinedAt: new Date(),
      hasPaid: false,
      willBringBall,
      willBringSpeaker,
    };

    // Use the mutation - it handles errors automatically
    return registerMutation.mutateAsync({ gameId, player: gamePlayer });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isPlayerRegistered = (game: Game) => {
    if (!user) return false;
    return (
      game.players.some((p) => p.userId === user.id) ||
      game.waitingList.some((p) => p.userId === user.id)
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Box sx={{ textAlign: "center", py: 5, mb: 4 }}>
          <Box sx={{ maxWidth: "400px", mx: "auto" }}>
            <Box sx={{ fontSize: "4rem", mb: 3 }}>🏐</Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              NL Volleyball
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Sign in to join upcoming volleyball games
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
            Upcoming Games
          </Typography>

          {loadingGames ? (
            <Box py={4}>
              <CircularProgress />
            </Box>
          ) : games.length === 0 ? (
            <Box textAlign="center" py={2}>
              <Box sx={{ fontSize: "3rem", mb: 2 }}>🏐</Box>
              <Typography variant="h6" gutterBottom>
                No upcoming games scheduled
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Sign in to join volleyball games when they become available!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {games.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <Card sx={{ opacity: 0.7, position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0,0,0,0.1)",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: "white", textAlign: "center" }}
                      >
                        Sign in to register
                      </Typography>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {game.title}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(game.date)} at {formatTime(game.date)}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" noWrap>
                          {game.location.name}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {game.players.length}/{game.maxPlayers} players
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="primary">
                        €{game.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    );
  }

  if (user.role === "guest") {
    return (
      <Box>
        <Box sx={{ textAlign: "center", py: 5, mb: 4 }}>
          <Box sx={{ maxWidth: "500px", mx: "auto" }}>
            <Box sx={{ fontSize: "4rem", mb: 3 }}>⏳</Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              Welcome, {user.name}!
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
              Your account is pending approval. An administrator will review
              your request soon.
            </Typography>
            <Alert severity="warning" sx={{ mb: 4 }}>
              You can view upcoming games but cannot join until approved.
            </Alert>
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Upcoming Games
          </Typography>

          {loadingGames ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : games.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Box sx={{ fontSize: "3rem", mb: 2 }}>🏐</Box>
              <Typography variant="h6" gutterBottom>
                No upcoming games scheduled
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Once approved, you'll be able to join games when they become
                available!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {games.map((game) => (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <Card sx={{ opacity: 0.8, position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(255,165,0,0.1)",
                        zIndex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: "#e65100", textAlign: "center" }}
                      >
                        Pending Approval
                      </Typography>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {game.title}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(game.date)} at {formatTime(game.date)}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" noWrap>
                          {game.location.name}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {game.players.length}/{game.maxPlayers} players
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="primary">
                        €{game.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Ready for your next volleyball match?
          </Typography>
        </Box>
        {user.role === "admin" && (
          <Box display="flex" gap={1}>
            <Tooltip title="Admin Panel">
              <IconButton
                onClick={() => (window.location.href = "/admin")}
                color="primary"
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Manage Games">
              <IconButton
                onClick={() => (window.location.href = "/games")}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* Quick Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
          mb: 4,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Games
            </Typography>
            <Typography variant="h3" color="primary">
              {games.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Available to join
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Registrations
            </Typography>
            <Typography variant="h3" color="success.main">
              {userGames.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Games joined
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Status
            </Typography>
            <Chip
              label={
                user.role === "admin"
                  ? "Admin"
                  : user.role === "user"
                  ? "Approved"
                  : user.role
              }
              color={
                user.role === "admin"
                  ? "primary"
                  : user.role === "user"
                  ? "success"
                  : "warning"
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {user.role === "admin" ? "Full access" : "Can join games"}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Upcoming Games */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Upcoming Games
        </Typography>

        {loadingGames ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : games.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Box sx={{ fontSize: "3rem", mb: 2 }}>🏐</Box>
            <Typography variant="h6" gutterBottom>
              No upcoming games scheduled
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Check back later for new games to join!
            </Typography>
            {user?.role === "admin" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => (window.location.href = "/games/create")}
              >
                Create First Game
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {games.map((game) => {
              const registered = isPlayerRegistered(game);
              const ballBringers = game.players.filter(
                (p) => p.willBringBall
              ).length;
              const speakerBringers = game.players.filter(
                (p) => p.willBringSpeaker
              ).length;
              const isFull = game.players.length >= game.maxPlayers;

              return (
                <Grid item xs={12} md={6} lg={4} key={game.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={2}
                      >
                        <Typography variant="h6" component="h3">
                          {game.title}
                        </Typography>
                        <Box display="flex" gap={0.5}>
                          {ballBringers > 0 && (
                            <Tooltip
                              title={`${ballBringers} bringing volleyball`}
                            >
                              <BallIcon fontSize="small" color="primary" />
                            </Tooltip>
                          )}
                          {speakerBringers > 0 && (
                            <Tooltip
                              title={`${speakerBringers} bringing speaker`}
                            >
                              <SpeakerIcon fontSize="small" color="primary" />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(game.date)} at {formatTime(game.date)}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" noWrap>
                          {game.location.name}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {game.players.length}/{game.maxPlayers} players
                        </Typography>
                        {game.waitingList.length > 0 && (
                          <Chip
                            size="small"
                            label={`${game.waitingList.length} waiting`}
                          />
                        )}
                      </Box>

                      <Typography variant="h6" color="primary">
                        €{game.price}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      {registered ? (
                        <Button disabled fullWidth>
                          {game.players.some((p) => p.userId === user.id)
                            ? "Registered"
                            : "On Waiting List"}
                        </Button>
                      ) : isFull ? (
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => handleRegister(game.id)}
                        >
                          Join Waiting List
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleRegister(game.id)}
                        >
                          Register
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* My Games */}
      {userGames.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            My Upcoming Games
          </Typography>

          <Grid container spacing={3}>
            {userGames.map((game) => (
              <Grid item xs={12} md={6} key={game.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {game.title}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatDate(game.date)} at {formatTime(game.date)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {game.location.name}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Registration Dialog */}
      <RegistrationDialog
        open={registrationDialog.open}
        onClose={() => setRegistrationDialog({ open: false, game: null })}
        game={registrationDialog.game}
        onRegister={handleRegistrationSubmit}
        userName={user?.name || ""}
      />
    </Box>
  );
}
