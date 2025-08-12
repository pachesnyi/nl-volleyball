'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <motion.header 
      className="bg-white shadow-sm border-b"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <h1 className="text-xl font-bold text-gray-900">🏐 Volleyball Matches</h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={signInWithGoogle}>
                Sign In with Google
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}