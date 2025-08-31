"use client";

import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Game, GamePlayer } from "@/types";
import { useState } from "react";
import { useGame, useUpdatePaymentStatus } from "@/hooks";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Euro as EuroIcon,
  Person as PersonIcon,
  SportsVolleyball as BallIcon,
  Speaker as SpeakerIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

export default function GameDetailsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;

  // Use TanStack Query hooks
  const { 
    data: game, 
    isLoading: loadingGame 
  } = useGame(gameId, {
    enabled: Boolean(gameId) && user?.role === "admin", // Only fetch if admin
  });
  
  const updatePaymentMutation = useUpdatePaymentStatus();
  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean;
    player: GamePlayer | null;
  }>({
    open: false,
    player: null,
  });
  const [updatingPayment, setUpdatingPayment] = useState(false);


  const handlePaymentToggle = (player: GamePlayer) => {
    setPaymentDialog({
      open: true,
      player,
    });
  };

  const handlePaymentUpdate = async (hasPaid: boolean) => {
    if (!paymentDialog.player || !game) return;

    setUpdatingPayment(true);
    try {
      await updatePaymentMutation.mutateAsync({
        gameId: game.id,
        playerId: paymentDialog.player.userId,
        hasPaid
      });
      setPaymentDialog({ open: false, player: null });
    } catch (error) {
      console.error("Error updating payment status:", error);
    } finally {
      setUpdatingPayment(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const paidPlayers = game?.players.filter(p => p.hasPaid).length || 0;
  const totalPlayers = game?.players.length || 0;
  const ballBringers = game?.players.filter(p => p.willBringBall).length || 0;
  const speakerBringers = game?.players.filter(p => p.willBringSpeaker).length || 0;

  if (loading || loadingGame) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <Layout>
        <Box textAlign="center" py={8}>
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You need admin privileges to view game details.
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (!game) {
    return (
      <Layout>
        <Box textAlign="center" py={8}>
          <Typography variant="h4" gutterBottom>
            Game Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            The game you're looking for doesn't exist.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/games")}
          >
            Back to Games
          </Button>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center">
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push("/games")}
              sx={{ mr: 2 }}
            >
              Back to Games
            </Button>
            <Box>
              <Typography variant="h3" gutterBottom>
                {game.title}
              </Typography>
              <Chip
                label={game.status}
                color={
                  game.status === "upcoming" ? "primary" :
                  game.status === "cancelled" ? "error" : "default"
                }
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/games/create?edit=${game.id}`)}
          >
            Edit Game
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Game Details Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Game Details
                </Typography>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <ScheduleIcon sx={{ mr: 1 }} color="action" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDate(game.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatTime(game.date)}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="flex-start" mb={2}>
                  <LocationIcon sx={{ mr: 1, mt: 0.5 }} color="action" />
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {game.location.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {game.location.address}
                    </Typography>
                    {game.location.googleMapsUrl && (
                      <Button
                        size="small"
                        href={game.location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 0.5, p: 0, minWidth: 'auto' }}
                      >
                        View on Maps
                      </Button>
                    )}
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <EuroIcon sx={{ mr: 1 }} color="action" />
                  <Typography variant="body2">
                    €{game.price} per person
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ mr: 1 }} color="action" />
                  <Typography variant="body2">
                    {totalPlayers}/{game.maxPlayers} players registered
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Equipment Status
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <BallIcon sx={{ mr: 1, fontSize: 20 }} color="action" />
                  <Typography variant="body2">
                    Volleyball: {ballBringers > 0 ? `${ballBringers} bringing` : "None assigned"}
                  </Typography>
                  {game.needsBall && ballBringers === 0 && (
                    <Chip size="small" label="Needed" color="warning" sx={{ ml: 1 }} />
                  )}
                </Box>

                <Box display="flex" alignItems="center">
                  <SpeakerIcon sx={{ mr: 1, fontSize: 20 }} color="action" />
                  <Typography variant="body2">
                    Speaker: {speakerBringers > 0 ? `${speakerBringers} bringing` : "None assigned"}
                  </Typography>
                  {game.needsSpeaker && speakerBringers === 0 && (
                    <Chip size="small" label="Needed" color="warning" sx={{ ml: 1 }} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Status Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Status
                </Typography>
                
                <Box display="flex" alignItems="center" mb={2}>
                  <PaymentIcon sx={{ mr: 1 }} color="action" />
                  <Typography variant="body2">
                    {paidPlayers}/{totalPlayers} players paid (€{paidPlayers * game.price} collected)
                  </Typography>
                </Box>

                {totalPlayers > 0 && (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Payment Progress
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: 8,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(paidPlayers / totalPlayers) * 100}%`,
                          height: "100%",
                          bgcolor: "success.main",
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((paidPlayers / totalPlayers) * 100)}% complete
                    </Typography>
                  </Paper>
                )}

                {game.tikkieUrl && (
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      href={game.tikkieUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Tikkie Link
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Registered Players */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Registered Players ({totalPlayers})
                </Typography>

                {totalPlayers === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No players registered yet.
                  </Typography>
                ) : (
                  <List dense>
                    {game.players.map((player, index) => (
                      <ListItem key={player.userId} divider={index < game.players.length - 1}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                            {player.userName.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={player.userName}
                          secondary={
                            <Box>
                              {player.hasPaid ? (
                                <Chip size="small" label="Paid" color="success" />
                              ) : (
                                <Chip size="small" label="Unpaid" color="default" />
                              )}
                              {player.willBringBall && (
                                <Chip size="small" label="🏐" sx={{ ml: 0.5 }} />
                              )}
                              {player.willBringSpeaker && (
                                <Chip size="small" label="🔊" sx={{ ml: 0.5 }} />
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handlePaymentToggle(player)}
                            color={player.hasPaid ? "success" : "default"}
                          >
                            {player.hasPaid ? <CheckIcon /> : <PaymentIcon />}
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Waiting List */}
          {game.waitingList.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Waiting List ({game.waitingList.length})
                  </Typography>
                  <List dense>
                    {game.waitingList.map((player, index) => (
                      <ListItem key={player.userId} divider={index < game.waitingList.length - 1}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                            {player.userName.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={player.userName}
                          secondary={`Position ${index + 1} in queue`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Payment Status Dialog */}
        <Dialog
          open={paymentDialog.open}
          onClose={() => setPaymentDialog({ open: false, player: null })}
          aria-labelledby="payment-dialog-title"
        >
          <DialogTitle id="payment-dialog-title">
            Update Payment Status
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" mb={2}>
              Player: {paymentDialog.player?.userName}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={paymentDialog.player?.hasPaid || false}
                  disabled={updatingPayment}
                />
              }
              label={`Mark as ${paymentDialog.player?.hasPaid ? 'unpaid' : 'paid'}`}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setPaymentDialog({ open: false, player: null })}
              disabled={updatingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handlePaymentUpdate(!paymentDialog.player?.hasPaid)}
              variant="contained"
              disabled={updatingPayment}
            >
              {updatingPayment ? <CircularProgress size={20} /> : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}