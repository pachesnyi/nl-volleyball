import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { User, UserRole } from '@/types';
import { UsersService } from '@/services/users.service';
import { QueryConfig } from '@/services/base.service';

/**
 * Fetch all users (admin only)
 */
export const useUsers = (
  options?: Partial<UseQueryOptions<User[], Error>>
) => {
  return useQuery({
    queryKey: UsersService.getAllUsersQueryKey(),
    queryFn: () => UsersService.fetchAllUsers(),
    ...QueryConfig.STATIC, // User data changes less frequently
    ...options,
  });
};

/**
 * Update user role mutation
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) => 
      UsersService.updateUserRole(userId, newRole),
    
    // Optimistic update
    onMutate: async ({ userId, newRole }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: UsersService.getAllUsersQueryKey() });
      
      // Snapshot previous value
      const previousUsers = queryClient.getQueryData<User[]>(UsersService.getAllUsersQueryKey());
      
      // Optimistically update the user
      if (previousUsers) {
        const updatedUsers = previousUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        );
        queryClient.setQueryData(UsersService.getAllUsersQueryKey(), updatedUsers);
      }
      
      return { previousUsers };
    },
    
    onError: (error, _, context) => {
      // Revert optimistic update on error
      if (context?.previousUsers) {
        queryClient.setQueryData(UsersService.getAllUsersQueryKey(), context.previousUsers);
      }
      console.error('❌ Update user role error:', error);
    },
    
    onSuccess: () => {
      // Invalidate users query to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: [UsersService.QUERY_KEYS.USERS] 
      });
    },
  });
};