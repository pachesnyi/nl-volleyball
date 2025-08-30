"use client";

import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { ClientOnly } from "@/components/ClientOnly";
import { Card, CardContent, CardHeader, CircularProgress, Box, Typography, Alert } from "@mui/material";

export default function Home() {
  return (
    <Layout>
      <ClientOnly
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress size={60} color="primary" />
          </Box>
        }
      >
        <HomeContent />
      </ClientOnly>
    </Layout>
  );
}

function HomeContent() {
  const { user, loading } = useAuth();

  console.log("HomeContent render:", { user, loading });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Box sx={{ maxWidth: '400px', mx: 'auto' }}>
          <Box sx={{ fontSize: '4rem', mb: 3 }}>
            🏐
          </Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            NL Volleyball
          </Typography>
        </Box>
      </Box>
    );
  }

  if (user.role === "guest") {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box sx={{ maxWidth: '400px', mx: 'auto' }}>
          <Box sx={{ fontSize: '4rem', mb: 3 }}>⏳</Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome, {user.name}!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Your account is pending approval. An administrator will review your
            request soon.
          </Typography>
          <Alert severity="warning">
            You can view upcoming games but cannot join until approved.
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Welcome back, {user.name}!
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Ready for your next volleyball match?
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Card sx={{ height: '100%' }}>
          <CardHeader sx={{ pb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              Upcoming Games
            </Typography>
          </CardHeader>
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              View and join upcoming volleyball matches.
            </Typography>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 0.5 }}>
              3
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Available this week
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ height: '100%' }}>
          <CardHeader sx={{ pb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              My Games
            </Typography>
          </CardHeader>
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Games you&apos;ve registered for.
            </Typography>
            <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold', mb: 0.5 }}>
              1
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Joined
            </Typography>
          </CardContent>
        </Card>

        {user.role === "admin" && (
          <Card sx={{ height: '100%' }}>
            <CardHeader sx={{ pb: 1 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Admin Panel
              </Typography>
            </CardHeader>
            <CardContent sx={{ pt: 0 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Manage games and users.
              </Typography>
              <Button size="small" color="primary">
                Manage
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
