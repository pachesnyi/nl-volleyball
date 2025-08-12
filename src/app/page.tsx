'use client';

import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-6xl mb-6"
            >
              🏐
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Volleyball Matches
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join friendly volleyball matches in your area. Sign in to get started!
            </p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  if (user.role === 'guest') {
    return (
      <Layout>
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-md mx-auto">
            <div className="text-4xl mb-6">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {user.name}!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your account is pending approval. An administrator will review your request soon.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                You can view upcoming games but cannot join until approved.
              </p>
            </div>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-gray-600">
            Ready for your next volleyball match?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upcoming Games
            </h3>
            <p className="text-gray-600 mb-4">
              View and join upcoming volleyball matches.
            </p>
            <div className="text-2xl text-blue-600 font-bold">3</div>
            <p className="text-sm text-gray-500">Available this week</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              My Games
            </h3>
            <p className="text-gray-600 mb-4">
              Games you've registered for.
            </p>
            <div className="text-2xl text-green-600 font-bold">1</div>
            <p className="text-sm text-gray-500">Joined</p>
          </motion.div>

          {(user.role === 'admin') && (
            <motion.div
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Admin Panel
              </h3>
              <p className="text-gray-600 mb-4">
                Manage games and users.
              </p>
              <Button size="sm">
                Manage
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
