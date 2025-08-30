"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Avatar,
  Chip,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { 
  CalendarIcon,
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  SpeakerWaveIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

interface Player {
  id: string;
  name: string;
  position: number;
  isChecked: boolean;
  avatar?: string | null;
  hasBall?: boolean;
  hasSound?: boolean;
}

interface Game {
  id: string;
  date: string;
  time: string;
  location: string;
  locationUrl: string;
  price: number;
  paymentStatus: string;
  currentPlayers: number;
  maxPlayers: number;
  waitingList: number;
  isPaid: boolean;
  players: Player[];
  waitingListPlayers: Player[];
}

interface GameRegistrationCardProps {
  game: Game;
  onRegister: () => void;
}

export function GameRegistrationCard({ game, onRegister }: GameRegistrationCardProps) {
  const isWaitingListFull = game.waitingListPlayers.length >= 7;

  return (
    <Card sx={{ width: '100%', bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: 3 }}>
      <CardHeader sx={{ pb: 2 }}>
        {/* Game Status */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Playing
            </Typography>
            <Button
              variant="text"
              size="small"
              sx={{ color: 'text.secondary', minWidth: 'auto', p: 1 }}
            >
              <CalendarIcon className="w-5 h-5" />
            </Button>
          </Box>

          {/* Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CalendarIcon className="w-5 h-5" style={{ color: '#6b7280' }} />
            <Typography variant="h6" component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {game.date}
            </Typography>
          </Box>

          {/* Time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ClockIcon className="w-5 h-5" style={{ color: '#6b7280' }} />
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>{game.time}</Typography>
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <MapPinIcon className="w-5 h-5" style={{ color: '#6b7280' }} />
            <Typography
              component="a"
              href={game.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                '&:hover': { color: 'primary.dark' }
              }}
            >
              {game.location}
            </Typography>
          </Box>

          {/* Price */}
          <Button
            disabled
            variant="contained"
            sx={{
              width: '100%',
              bgcolor: '#fef3c7',
              color: '#374151',
              mb: 3,
              '&.Mui-disabled': {
                bgcolor: '#fef3c7',
                color: '#374151'
              }
            }}
            startIcon={<span className="text-lg">💰</span>}
          >
            €{game.price.toFixed(2)} - {game.paymentStatus}
          </Button>

          {/* Player Count */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UserGroupIcon className="w-5 h-5" style={{ color: '#6b7280' }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {game.currentPlayers}/{game.maxPlayers}
                {game.waitingList > 0 && (
                  <Typography component="sup" sx={{ color: 'warning.main', ml: 0.5 }}>+{game.waitingList}</Typography>
                )}
              </Typography>
            </Box>
            <Chip
              color={game.isPaid ? "success" : "warning"}
              variant="outlined"
              size="small"
              label={game.isPaid ? "Paid" : "Pending"}
            />
          </Box>
        </Box>
      </CardHeader>

      <CardContent sx={{ pt: 0, maxHeight: 384, overflowY: 'auto' }}>
        {/* Regular Players */}
        <Box sx={{ '& > :not(:last-child)': { mb: 1 }, mb: 3 }}>
          {game.players.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </Box>

        {/* Waiting List */}
        {game.waitingListPlayers.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ bgcolor: '#fef2f2', borderRadius: 2, p: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#b91c1c', mb: 2 }}>
                Waiting list
              </Typography>
              <Box sx={{ '& > :not(:last-child)': { mb: 1 } }}>
                {game.waitingListPlayers.map((player) => (
                  <PlayerRow 
                    key={player.id} 
                    player={player} 
                    isWaitingList 
                  />
                ))}
              </Box>
            </Box>
          </>
        )}

        {/* Register Button */}
        <Box sx={{ mt: 4 }}>
          <Button
            color="warning"
            variant="contained"
            sx={{ width: '100%', fontWeight: 600 }}
            startIcon={<UserGroupIcon className="w-5 h-5" />}
            onClick={onRegister}
            disabled={isWaitingListFull}
          >
            Register
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function PlayerRow({ player, isWaitingList = false }: { 
  player: Player; 
  isWaitingList?: boolean; 
}) {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      p: 1, 
      borderRadius: 2, 
      '&:hover': { bgcolor: '#f9fafb' },
      transition: 'background-color 0.2s'
    }}>
      {/* Position Number */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: '60px' }}>
        {isWaitingList && (
          <SpeakerWaveIcon className="w-4 h-4" style={{ color: '#ef4444' }} />
        )}
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', width: '24px' }}>
          {player.position}
        </Typography>
      </Box>

      {/* Icons for ball/sound */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {player.hasBall && (
          <Box sx={{ 
            width: 16, 
            height: 16, 
            bgcolor: '#fb923c', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <span className="text-white text-xs">🏐</span>
          </Box>
        )}
        {player.hasSound && (
          <SpeakerWaveIcon className="w-4 h-4" style={{ color: '#3b82f6' }} />
        )}
      </Box>

      {/* Avatar */}
      <Avatar
        src={player.avatar || undefined}
        sx={{ width: 32, height: 32, fontSize: '0.875rem' }}
      >
        {player.name.charAt(0)}
      </Avatar>

      {/* Name */}
      <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500, color: 'text.primary' }}>
        {player.name}
      </Typography>

      {/* Checkbox */}
      <Box sx={{ 
        width: 20, 
        height: 20, 
        border: 2, 
        borderColor: '#d1d5db', 
        borderRadius: 0.5, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {player.isChecked && (
          <CheckIcon className="w-3 h-3" style={{ color: '#16a34a' }} />
        )}
      </Box>
    </Box>
  );
}