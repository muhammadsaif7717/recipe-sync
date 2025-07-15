'use client';

import React, { useState, useMemo } from 'react';
import { Trash2, Shield, User, Search, Filter, UserCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { deleteUser, getUsers, updateUserRole } from '@/lib/getAPIs';
import Image from 'next/image';
import { toast } from 'sonner';

// Types
interface UserType {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  image: string;
  createdAt: string;
}

const AdminManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete' | 'role';
    userId: string;
    userName: string;
    newRole?: string;
  }>({
    isOpen: false,
    type: 'delete',
    userId: '',
    userName: '',
    newRole: '',
  });

  // TanStack Query
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserType[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000,
  });

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const adminCount = users.filter((user) => user.role === 'admin').length;
    const regularUserCount = users.filter(
      (user) => user.role === 'user',
    ).length;

    return {
      totalUsers,
      adminCount,
      regularUserCount,
    };
  }, [users]);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const user = users.find((u) => u._id === userId);

    if (user) {
      setConfirmDialog({
        isOpen: true,
        type: 'role',
        userId,
        userName: user.name,
        newRole,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const user = users.find((u) => u._id === userId);

    if (user) {
      setConfirmDialog({
        isOpen: true,
        type: 'delete',
        userId,
        userName: user.name,
      });
    }
  };

  const confirmAction = async () => {
    try {
      if (confirmDialog.type === 'delete') {
        console.log('Deleting user:', confirmDialog.userId);
        const res = await deleteUser(confirmDialog.userId);
        console.log(res);
        if (res.status === 200) {
          toast.success('User deleted successfully!');
          refetch();
        }
      } else if (confirmDialog.type === 'role') {
        console.log(
          'Changing role for user:',
          confirmDialog.userId,
          'to:',
          confirmDialog.newRole,
        );
        const res = await updateUserRole(
          confirmDialog.userId,
          confirmDialog.newRole!,
        );
        if (res.status === 200) {
          toast.success(
            `Role updated to "${confirmDialog.newRole}" successfully!`,
          );
          refetch();
        }
      }

      // Close the dialog
      setConfirmDialog({
        isOpen: false,
        type: 'delete',
        userId: '',
        userName: '',
      });

      // Optional: Refetch or invalidate data
      // queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Something went wrong while performing the action!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 dark:bg-slate-950'>
        <div className='mx-auto max-w-7xl'>
          <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900/80'>
            <div className='animate-pulse'>
              <div className='mb-4 h-6 w-32 rounded-lg bg-slate-200 sm:mb-6 sm:h-8 sm:w-48 dark:bg-slate-700'></div>

              {/* Mobile Loading Cards */}
              <div className='block space-y-4 md:hidden'>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700'
                  >
                    <div className='h-12 w-12 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700'></div>
                    <div className='min-w-0 flex-1'>
                      <div className='mb-2 h-4 w-24 rounded bg-slate-200 dark:bg-slate-700'></div>
                      <div className='h-3 w-32 rounded bg-slate-200 dark:bg-slate-700'></div>
                    </div>
                    <div className='h-6 w-16 rounded bg-slate-200 dark:bg-slate-700'></div>
                  </div>
                ))}
              </div>

              {/* Desktop Loading Table */}
              <div className='hidden space-y-4 md:block'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex items-center gap-4'>
                    <div className='h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700'></div>
                    <div className='flex-1'>
                      <div className='mb-2 h-4 w-32 rounded bg-slate-200 dark:bg-slate-700'></div>
                      <div className='h-3 w-48 rounded bg-slate-200 dark:bg-slate-700'></div>
                    </div>
                    <div className='h-6 w-20 rounded bg-slate-200 dark:bg-slate-700'></div>
                    <div className='h-6 w-24 rounded bg-slate-200 dark:bg-slate-700'></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex h-screen items-center justify-center text-rose-600'>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className='flex h-screen items-center justify-center text-slate-700 dark:text-slate-200'>
        No users found
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 dark:bg-slate-950'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-6 sm:mb-8'>
          <h1 className='mb-2 text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl dark:text-slate-100'>
            User Management
          </h1>
          <p className='text-sm text-slate-600 sm:text-base dark:text-slate-400'>
            Manage user accounts, roles, and permissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className='mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
          <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900/80'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 sm:h-12 sm:w-12 dark:bg-emerald-900/30'>
                <User className='h-5 w-5 text-emerald-600 sm:h-6 sm:w-6 dark:text-emerald-400' />
              </div>
              <div>
                <p className='text-xs text-slate-600 sm:text-sm dark:text-slate-400'>
                  Total Users
                </p>
                <p className='text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100'>
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900/80'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 sm:h-12 sm:w-12 dark:bg-amber-900/30'>
                <Shield className='h-5 w-5 text-amber-600 sm:h-6 sm:w-6 dark:text-amber-400' />
              </div>
              <div>
                <p className='text-xs text-slate-600 sm:text-sm dark:text-slate-400'>
                  Administrators
                </p>
                <p className='text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100'>
                  {stats.adminCount}
                </p>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2 sm:p-6 lg:col-span-1 dark:border-slate-700 dark:bg-slate-900/80'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 sm:h-12 sm:w-12 dark:bg-rose-900/30'>
                <UserCheck className='h-5 w-5 text-rose-600 sm:h-6 sm:w-6 dark:text-rose-400' />
              </div>
              <div>
                <p className='text-xs text-slate-600 sm:text-sm dark:text-slate-400'>
                  Regular Users
                </p>
                <p className='text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100'>
                  {stats.regularUserCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className='mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-900/80'>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400 sm:h-5 sm:w-5' />
              <input
                type='text'
                placeholder='Search users...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full rounded-lg border border-slate-300 bg-white py-2 pr-4 pl-9 text-sm text-slate-900 focus:border-transparent focus:ring-2 focus:ring-emerald-500 sm:pl-10 sm:text-base dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
              />
            </div>

            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4 text-slate-400 sm:h-5 sm:w-5' />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className='rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-transparent focus:ring-2 focus:ring-emerald-500 sm:px-4 sm:text-base dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
              >
                <option value='all'>All Roles</option>
                <option value='admin'>Administrators</option>
                <option value='user'>Regular Users</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div className='hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block dark:border-slate-700 dark:bg-slate-900/80'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-slate-50 dark:bg-slate-800/50'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-slate-100'>
                    User
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-slate-100'>
                    Role
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-medium text-slate-900 dark:text-slate-100'>
                    Joined
                  </th>
                  <th className='px-6 py-4 text-right text-sm font-medium text-slate-900 dark:text-slate-100'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className='transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <Image
                          height={40}
                          width={40}
                          src={user.image}
                          alt={user.name}
                          className='h-10 w-10 rounded-full border-2 border-slate-200 object-cover dark:border-slate-700'
                        />
                        <div>
                          <p className='font-medium text-slate-900 dark:text-slate-100'>
                            {user.name}
                          </p>
                          <p className='text-sm text-slate-600 dark:text-slate-400'>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <Shield className='h-3 w-3' />
                        ) : (
                          <User className='h-3 w-3' />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-600 dark:text-slate-400'>
                      {formatDate(user.createdAt)}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        {/* Role Toggle */}
                        <button
                          onClick={() => handleRoleChange(user._id, user.role)}
                          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                            user.role === 'admin'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50'
                          }`}
                        >
                          {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className='rounded-md p-2 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile & Tablet */}
        <div className='block space-y-4 md:hidden'>
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80'
            >
              <div className='flex items-start gap-4'>
                <Image
                  height={56}
                  width={56}
                  src={user.image}
                  alt={user.name}
                  className='h-12 w-12 flex-shrink-0 rounded-full border-2 border-slate-200 object-cover sm:h-14 sm:w-14 dark:border-slate-700'
                />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate font-semibold text-slate-900 dark:text-slate-100'>
                        {user.name}
                      </h3>
                      <p className='truncate text-sm text-slate-600 dark:text-slate-400'>
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                      }`}
                    >
                      {user.role === 'admin' ? (
                        <Shield className='h-3 w-3' />
                      ) : (
                        <User className='h-3 w-3' />
                      )}
                      {user.role}
                    </span>
                  </div>

                  <p className='mt-2 text-xs text-slate-500 sm:text-sm dark:text-slate-400'>
                    Joined {formatDate(user.createdAt)}
                  </p>

                  <div className='mt-3 flex items-center gap-2'>
                    <button
                      onClick={() => handleRoleChange(user._id, user.role)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                        user.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50'
                      }`}
                    >
                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className='rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className='py-12 text-center'>
              <User className='mx-auto mb-4 h-12 w-12 text-slate-400' />
              <p className='text-slate-600 dark:text-slate-400'>
                No users found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800'>
            <h3 className='mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100'>
              {confirmDialog.type === 'delete' ? 'Delete User' : 'Change Role'}
            </h3>
            <p className='mb-6 text-slate-600 dark:text-slate-400'>
              {confirmDialog.type === 'delete'
                ? `Are you sure you want to delete ${confirmDialog.userName}? This action cannot be undone.`
                : `Are you sure you want to change ${confirmDialog.userName}'s role to ${confirmDialog.newRole}?`}
            </p>
            <div className='flex gap-3'>
              <button
                onClick={() =>
                  setConfirmDialog({
                    isOpen: false,
                    type: 'delete',
                    userId: '',
                    userName: '',
                  })
                }
                className='flex-1 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                  confirmDialog.type === 'delete'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {confirmDialog.type === 'delete' ? 'Delete' : 'Change Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;
