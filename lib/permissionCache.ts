// Permission Cache - In-memory caching for permissions and roles
// Reduces database queries with TTL-based expiration

import type { Permission, Role, CacheEntry } from '@/app/types/rbac';

const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

export class PermissionCache {
  private userPermissions: Map<string, CacheEntry<Permission[]>> = new Map();
  private userRoles: Map<string, CacheEntry<Role[]>> = new Map();
  private schoolData: Map<string, CacheEntry<any>> = new Map();

  /**
   * Cache permissions for a user with TTL
   */
  cacheUserPermissions(userId: string, permissions: Permission[], ttl: number = DEFAULT_TTL): void {
    this.userPermissions.set(userId, {
      data: permissions,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Get cached permissions if not expired
   */
  getUserPermissions(userId: string): Permission[] | null {
    const entry = this.userPermissions.get(userId);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.userPermissions.delete(userId);
      return null;
    }

    return entry.data;
  }

  /**
   * Cache roles for a user with TTL
   */
  cacheUserRoles(userId: string, roles: Role[], ttl: number = DEFAULT_TTL): void {
    this.userRoles.set(userId, {
      data: roles,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Get cached roles if not expired
   */
  getUserRoles(userId: string): Role[] | null {
    const entry = this.userRoles.get(userId);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.userRoles.delete(userId);
      return null;
    }

    return entry.data;
  }

  /**
   * Cache school data
   */
  cacheSchoolData(schoolId: string, data: any, ttl: number = DEFAULT_TTL): void {
    this.schoolData.set(schoolId, {
      data,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Get cached school data if not expired
   */
  getSchoolData(schoolId: string): any | null {
    const entry = this.schoolData.get(schoolId);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.schoolData.delete(schoolId);
      return null;
    }

    return entry.data;
  }

  /**
   * Invalidate all cache for a user
   * Call this when user roles change
   */
  invalidateUserCache(userId: string): void {
    this.userPermissions.delete(userId);
    this.userRoles.delete(userId);
  }

  /**
   * Invalidate school cache
   * Call this when school data changes
   */
  invalidateSchoolCache(schoolId: string): void {
    this.schoolData.delete(schoolId);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.userPermissions.clear();
    this.userRoles.clear();
    this.schoolData.clear();
  }

  /**
   * Get cache statistics for monitoring
   */
  getStats() {
    return {
      userPermissionsCached: this.userPermissions.size,
      userRolesCached: this.userRoles.size,
      schoolDataCached: this.schoolData.size,
    };
  }
}

// Global singleton cache instance
export const permissionCache = new PermissionCache();
