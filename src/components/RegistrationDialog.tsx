"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  SportsVolleyball as BallIcon,
  Speaker as SpeakerIcon,
} from "@mui/icons-material";
import { Game } from "@/types";

interface RegistrationDialogProps {
  open: boolean;
  onClose: () => void;
  game: Game | null;
  onRegister: (gameId: string, willBringBall: boolean, willBringSpeaker: boolean) => Promise<void>;
  userName: string;
}

export function RegistrationDialog({
  open,
  onClose,
  game,
  onRegister,
  userName,
}: RegistrationDialogProps) {
  const [willBringBall, setWillBringBall] = useState(false);
  const [willBringSpeaker, setWillBringSpeaker] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!game) return;

    setRegistering(true);
    setError("");

    try {
      await onRegister(game.id, willBringBall, willBringSpeaker);
      onClose();
      // Reset form
      setWillBringBall(false);
      setWillBringSpeaker(false);
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to register. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handleClose = () => {
    if (!registering) {
      onClose();
      // Reset form
      setWillBringBall(false);
      setWillBringSpeaker(false);
      setError("");
    }
  };

  if (!game) return null;

  const ballBringers = game.players.filter(p => p.willBringBall).length;
  const speakerBringers = game.players.filter(p => p.willBringSpeaker).length;
  const needsBallHelp = game.needsBall && ballBringers === 0;
  const needsSpeakerHelp = game.needsSpeaker && speakerBringers === 0;

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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="registration-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="registration-dialog-title">
        Register for {game.title}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box mb={3}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {formatDate(game.date)} at {formatTime(game.date)}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {game.location.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            €{game.price} per person
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Hi {userName}! 👋
        </Typography>
        
        <Typography variant="body1" gutterBottom>
          You're registering for this volleyball game. Can you help bring any equipment?
        </Typography>

        <Box mt={3} mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Equipment Status:
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={1} mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <BallIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Volleyball: {ballBringers > 0 ? `${ballBringers} bringing` : "None assigned"}
              </Typography>
              {needsBallHelp && (
                <Chip size="small" label="Help needed!" color="warning" />
              )}
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <SpeakerIcon fontSize="small" color="action" />
              <Typography variant="body2">
                Speaker: {speakerBringers > 0 ? `${speakerBringers} bringing` : "None assigned"}
              </Typography>
              {needsSpeakerHelp && (
                <Chip size="small" label="Help needed!" color="warning" />
              )}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={willBringBall}
                  onChange={(e) => setWillBringBall(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <BallIcon fontSize="small" />
                  <span>I'll bring a volleyball</span>
                  {needsBallHelp && <span style={{ color: "#f59e0b" }}>🙏</span>}
                </Box>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={willBringSpeaker}
                  onChange={(e) => setWillBringSpeaker(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <SpeakerIcon fontSize="small" />
                  <span>I'll bring a speaker/music</span>
                  {needsSpeakerHelp && <span style={{ color: "#f59e0b" }}>🙏</span>}
                </Box>
              }
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Don't worry if you can't bring anything - we'll figure it out! 😊
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={registering}>
          Cancel
        </Button>
        <Button
          onClick={handleRegister}
          variant="contained"
          disabled={registering}
        >
          {registering ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              <span>Registering...</span>
            </Box>
          ) : (
            "Register"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}