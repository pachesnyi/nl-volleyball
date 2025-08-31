"use client";

import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Game } from "@/types";
import { useState } from "react";
import { useGames, useDeleteGame } from "@/hooks";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ViewModule as ViewModuleIcon,
  TableRows as TableRowsIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  SportsVolleyball as BallIcon,
  Speaker as SpeakerIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export default function GamesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    gameId: string;
    gameTitle: string;
  }>({
    open: false,
    gameId: "",
    gameTitle: "",
  });
  const [deleting, setDeleting] = useState(false);

  // Use TanStack Query hooks
  const { 
    data: games = [], 
    isLoading: loadingGames 
  } = useGames({}, {
    enabled: user?.role === "admin", // Only fetch if user is admin
  });
  
  const deleteGameMutation = useDeleteGame();

  const handleDeleteClick = (gameId: string, gameTitle: string) => {
    setDeleteDialog({
      open: true,
      gameId,
      gameTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.gameId) return;

    setDeleting(true);
    try {
      await deleteGameMutation.mutateAsync(deleteDialog.gameId);
      setDeleteDialog({ open: false, gameId: "", gameTitle: "" });
    } catch (error) {
      console.error("Error deleting game:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, gameId: "", gameTitle: "" });
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

  // Data Grid columns configuration
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Game Title",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.row.date.toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric" 
          })}
        </Typography>
      ),
    },
    {
      field: "time",
      headerName: "Time",
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {formatTime(params.row.date)}
        </Typography>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.row.location.address}>
          <Typography variant="body2" noWrap>
            {params.row.location.name}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "players",
      headerName: "Players",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center" gap={0.5}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {params.row.players.length}/{params.row.maxPlayers}
          </Typography>
        </Box>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">€{params.row.price}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.row.status}
          color={
            params.row.status === "upcoming" ? "primary" :
            params.row.status === "cancelled" ? "error" : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "payments",
      headerName: "Payments",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        const paidCount = params.row.players.filter((p: any) => p.hasPaid).length;
        const totalCount = params.row.players.length;
        const percentage = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
        
        return (
          <Box display="flex" alignItems="center" gap={0.5}>
            <PaymentIcon 
              fontSize="small" 
              color={percentage === 100 ? "success" : percentage > 0 ? "warning" : "disabled"} 
            />
            <Typography variant="body2">
              {paidCount}/{totalCount}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "equipment",
      headerName: "Equipment",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        const ballBringers = params.row.players.filter((p: any) => p.willBringBall).length;
        const speakerBringers = params.row.players.filter((p: any) => p.willBringSpeaker).length;
        
        return (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Tooltip title={`${ballBringers} bringing volleyball`}>
              <BallIcon 
                fontSize="small" 
                color={ballBringers > 0 ? "primary" : "disabled"}
              />
            </Tooltip>
            <Tooltip title={`${speakerBringers} bringing speaker`}>
              <SpeakerIcon 
                fontSize="small" 
                color={speakerBringers > 0 ? "primary" : "disabled"}
              />
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="View details">
            <IconButton
              size="small"
              onClick={() => router.push(`/games/${params.row.id}`)}
            >
              <PersonIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit game">
            <IconButton
              size="small"
              onClick={() => router.push(`/games/create?edit=${params.row.id}`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete game">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row.id, params.row.title)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) {
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
            You need admin privileges to access game management.
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" gutterBottom>
              Game Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage volleyball games
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <Tabs
              value={viewMode}
              onChange={(_, newValue) => setViewMode(newValue)}
              variant="standard"
            >
              <Tab 
                icon={<ViewModuleIcon />} 
                label="Cards" 
                value="cards"
                iconPosition="start"
              />
              <Tab 
                icon={<TableRowsIcon />} 
                label="Table" 
                value="table"
                iconPosition="start"
              />
            </Tabs>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push("/games/create")}
            >
              Create Game
            </Button>
          </Box>
        </Box>

        {loadingGames ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : games.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" gutterBottom>
              No games created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Create your first game to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push("/games/create")}
            >
              Create First Game
            </Button>
          </Box>
        ) : (
          <>
            {/* Card View */}
            {viewMode === "cards" && (
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
                {games.map((game) => (
                  <Card key={game.id} elevation={2}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6" component="h2">
                          {game.title}
                        </Typography>
                        <Chip
                          label={game.status}
                          color={
                            game.status === "upcoming" ? "primary" :
                            game.status === "cancelled" ? "error" : "default"
                          }
                          size="small"
                        />
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <ScheduleIcon sx={{ mr: 1, fontSize: 18 }} color="action" />
                        <Typography variant="body2">
                          {formatDate(game.date)} at {formatTime(game.date)}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationIcon sx={{ mr: 1, fontSize: 18 }} color="action" />
                        <Typography variant="body2" noWrap>
                          {game.location.name}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={2}>
                        <PersonIcon sx={{ mr: 1, fontSize: 18 }} color="action" />
                        <Typography variant="body2">
                          {game.players.length}/{game.maxPlayers} players
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Price: €{game.price}
                      </Typography>
                      
                      {game.players.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Paid: {game.players.filter(p => p.hasPaid).length}/{game.players.length}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        onClick={() => router.push(`/games/${game.id}`)}
                      >
                        View Details
                      </Button>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/games/create?edit=${game.id}`)}
                          title="Edit game"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(game.id, game.title)}
                          title="Delete game"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}

            {/* Table View */}
            {viewMode === "table" && (
              <Paper elevation={1} sx={{ height: 600 }}>
                <DataGrid
                  rows={games}
                  columns={columns}
                  pageSizeOptions={[10, 25, 50]}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                    sorting: {
                      sortModel: [{ field: 'date', sort: 'asc' }],
                    },
                  }}
                  sx={{
                    border: 0,
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                />
              </Paper>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Delete Game
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete "{deleteDialog.gameTitle}"? 
              This action cannot be undone and will remove all player registrations.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              disabled={deleting}
              variant="contained"
            >
              {deleting ? <CircularProgress size={20} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}