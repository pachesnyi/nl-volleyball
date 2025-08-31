import { User, UserRole } from '@/types';
import { BaseService } from './base.service';
import { getAllUsers, updateUserRole } from '@/lib/utils';

/**
 * Users service with TanStack Query integration
 */
export class UsersService extends BaseService {
  // Query Keys
  static readonly QUERY_KEYS = {
    USERS: 'users',
    USER: 'user',
  } as const;

  /**
   * Fetch all users (admin only)
   */
  static async fetchAllUsers(): Promise<User[]> {
    try {
      return await getAllUsers();
    } catch (error) {
      this.handleServiceError(error, 'fetchAllUsers');
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    try {
      return await updateUserRole(userId, newRole);
    } catch (error) {
      this.handleServiceError(error, 'updateUserRole');
    }
  }

  // Query key generators
  static getAllUsersQueryKey() {
    return this.createQueryKey(this.QUERY_KEYS.USERS);
  }

  static getUserQueryKey(userId: string) {
    return this.createQueryKey(this.QUERY_KEYS.USER, { id: userId });
  }
}