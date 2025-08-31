"use client";

import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Game, GameFormData } from "@/types";
import { useState, useEffect, Suspense } from "react";
import { useGame, useCreateGame, useUpdateGame } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
  Alert,
  Autocomplete,
  Grid,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const commonLocations = [
  "Beach Volleyball Center Amsterdam",
  "Sportpark De Toekomst",
  "Beach Club O2",
  "Beachclub Sportstrand",
  "Beach Volleyball Club Utrecht",
  "Custom Location...",
];


function CreateGamePageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editGameId = searchParams.get("edit");
  const isEditing = Boolean(editGameId);

  const [formData, setFormData] = useState<GameFormData>({
    title: "",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow by default
    location: {
      name: "",
      address: "",
      googleMapsUrl: "",
    },
    maxPlayers: 12,
    price: 5,
    needsBall: true,
    needsSpeaker: true,
  });

  const [locationInput, setLocationInput] = useState("");
  const [customLocation, setCustomLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Use TanStack Query hooks
  const { 
    data: gameData, 
    isLoading: loadingGame 
  } = useGame(editGameId || '', {
    enabled: isEditing && Boolean(editGameId), // Only fetch if editing
  });
  
  const createGameMutation = useCreateGame();
  const updateGameMutation = useUpdateGame();

  // Update form data when game data loads
  useEffect(() => {
    if (gameData) {
      setFormData({
        title: gameData.title,
        date: gameData.date,
        location: gameData.location,
        maxPlayers: gameData.maxPlayers,
        price: gameData.price,
        needsBall: gameData.needsBall,
        needsSpeaker: gameData.needsSpeaker,
      });
      setLocationInput(gameData.location.name);
      setCustomLocation(!commonLocations.includes(gameData.location.name));
    }
  }, [gameData]);


  const handleLocationChange = (value: string | null) => {
    if (value === "Custom Location..." || !value) {
      setCustomLocation(true);
      setLocationInput("");
      setFormData(prev => ({
        ...prev,
        location: { name: "", address: "", googleMapsUrl: "" }
      }));
    } else {
      setCustomLocation(false);
      setLocationInput(value);
      setFormData(prev => ({
        ...prev,
        location: { 
          name: value, 
          address: `${value} Address`, // Placeholder
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(value)}`
        }
      }));
    }
  };

  const handleCustomLocationChange = (value: string) => {
    setLocationInput(value);
    setFormData(prev => ({
      ...prev,
      location: {
        name: value,
        address: value,
        googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(value)}`
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        setError("Game title is required");
        return;
      }
      if (!formData.location.name.trim()) {
        setError("Location is required");
        return;
      }
      if (formData.maxPlayers < 2 || formData.maxPlayers > 50) {
        setError("Max players must be between 2 and 50");
        return;
      }
      if (formData.price < 0 || formData.price > 100) {
        setError("Price must be between €0 and €100");
        return;
      }
      if (formData.date < new Date()) {
        setError("Game date must be in the future");
        return;
      }

      const gameData = {
        title: formData.title.trim(),
        date: formData.date,
        location: formData.location,
        maxPlayers: formData.maxPlayers,
        price: formData.price,
        needsBall: formData.needsBall,
        needsSpeaker: formData.needsSpeaker,
      };

      if (isEditing && editGameId) {
        await updateGameMutation.mutateAsync({ gameId: editGameId, updates: gameData });
      } else {
        await createGameMutation.mutateAsync(gameData);
      }

      router.push("/games");
    } catch (error) {
      console.error("Error saving game:", error);
      setError(`Failed to ${isEditing ? "update" : "create"} game. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

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
            You need admin privileges to create or edit games.
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          <Box display="flex" alignItems="center" mb={4}>
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
                {isEditing ? "Edit Game" : "Create New Game"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isEditing ? "Update game details" : "Set up a new volleyball game"}
              </Typography>
            </Box>
          </Box>

          <Card>
            <CardContent>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Game Title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, title: e.target.value }))
                      }
                      required
                      placeholder="e.g., Thursday Evening Volleyball"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <DateTimePicker
                      label="Date & Time"
                      value={formData.date}
                      onChange={(newValue) => {
                        if (newValue) {
                          setFormData(prev => ({ ...prev, date: newValue }));
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Max Players"
                      type="number"
                      value={formData.maxPlayers}
                      onChange={(e) =>
                        setFormData(prev => ({ 
                          ...prev, 
                          maxPlayers: parseInt(e.target.value) || 12 
                        }))
                      }
                      required
                      inputProps={{ min: 2, max: 50 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Price (€)"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData(prev => ({ 
                          ...prev, 
                          price: parseFloat(e.target.value) || 0 
                        }))
                      }
                      required
                      inputProps={{ min: 0, max: 100, step: 0.5 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    {!customLocation ? (
                      <Autocomplete
                        fullWidth
                        options={commonLocations}
                        value={locationInput || null}
                        onChange={(_, newValue) => handleLocationChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Location"
                            required
                            placeholder="Select or search for a location"
                          />
                        )}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label="Custom Location"
                        value={locationInput}
                        onChange={(e) => handleCustomLocationChange(e.target.value)}
                        required
                        placeholder="Enter custom location name and address"
                        helperText="This will be used to generate Google Maps links"
                      />
                    )}
                    {!customLocation && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setCustomLocation(true)}
                        sx={{ mt: 1 }}
                      >
                        Enter custom location
                      </Button>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Equipment Needs
                    </Typography>
                    <Box display="flex" gap={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.needsBall}
                            onChange={(e) =>
                              setFormData(prev => ({ 
                                ...prev, 
                                needsBall: e.target.checked 
                              }))
                            }
                          />
                        }
                        label="Need volleyball"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.needsSpeaker}
                            onChange={(e) =>
                              setFormData(prev => ({ 
                                ...prev, 
                                needsSpeaker: e.target.checked 
                              }))
                            }
                          />
                        }
                        label="Need speaker/music"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                      <Button
                        variant="outlined"
                        onClick={() => router.push("/games")}
                        disabled={submitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <CircularProgress size={20} />
                        ) : isEditing ? (
                          "Update Game"
                        ) : (
                          "Create Game"
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </LocalizationProvider>
    </Layout>
  );
}

export default function CreateGamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateGamePageContent />
    </Suspense>
  );
}