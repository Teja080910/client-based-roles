'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Minus,
  Users,
  Key,
  Settings,
  Shield,
  Crown,
  Building
} from 'lucide-react';
import { mockUsers, mockRoles } from '@/lib/mock-data';

export default function RoleMappingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users] = useState(mockUsers);
  const [roles] = useState(mockRoles);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUserData = users.find(u => u.id === selectedUser);

  const getUserRealmRoles = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user?.realmRoles) return [];
    return roles.filter(role => 
      !role.clientRole && user.realmRoles?.includes(role.name)
    );
  };

  const getUserClientRoles = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user?.clientRoles) return [];
    
    const clientRoles: Array<{role: any, client: string}> = [];
    Object.entries(user.clientRoles).forEach(([clientId, roleNames]) => {
      roleNames.forEach(roleName => {
        const role = roles.find(r => r.clientRole && r.name === roleName && r.containerId === clientId);
        if (role) {
          clientRoles.push({ role, client: clientId });
        }
      });
    });
    return clientRoles;
  };

  const getAvailableRealmRoles = (userId: string) => {
    const user = users.find(u => u.id === userId);
    const userRoles = user?.realmRoles || [];
    return roles.filter(role => 
      !role.clientRole && !userRoles.includes(role.name)
    );
  };

  const getRoleIcon = (role: any) => {
    if (role.name === 'admin') return Crown;
    if (role.composite) return Shield;
    if (role.clientRole) return Settings;
    return Key;
  };

  const getRoleColor = (role: any) => {
    if (role.name === 'admin') return 'bg-red-100 text-red-800';
    if (role.composite) return 'bg-purple-100 text-purple-800';
    if (role.clientRole) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const totalMappings = users.reduce((total, user) => {
    const realmRoles = user.realmRoles?.length || 0;
    const clientRoles = Object.values(user.clientRoles || {}).reduce((sum, roles) => sum + roles.length, 0);
    return total + realmRoles + clientRoles;
  }, 0);

  const usersWithRoles = users.filter(user => 
    (user.realmRoles && user.realmRoles.length > 0) || 
    (user.clientRoles && Object.keys(user.clientRoles).length > 0)
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Mapping</h1>
          <p className="text-gray-600 mt-2">
            Assign and manage user role mappings for realm and client roles
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Users with Roles
            </CardTitle>
            <UserCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{usersWithRoles}</div>
            <p className="text-xs text-gray-500 mt-1">
              Have assigned roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Mappings
            </CardTitle>
            <Key className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalMappings}</div>
            <p className="text-xs text-gray-500 mt-1">
              Role assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Available Roles
            </CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{roles.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Realm and client roles
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Select User</CardTitle>
            <CardDescription>
              Choose a user to view and manage their role mappings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedUser === user.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.username} • {user.email}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={user.enabled ? 'default' : 'secondary'} className="text-xs">
                          {user.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        {user.emailVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Role Management</CardTitle>
            <CardDescription>
              {selectedUserData 
                ? `Manage roles for ${selectedUserData.firstName} ${selectedUserData.lastName}`
                : 'Select a user to manage their roles'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedUserData ? (
              <div className="space-y-6">
                {/* Current Realm Roles */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Realm Roles</h4>
                  <div className="space-y-2">
                    {getUserRealmRoles(selectedUser).map((role) => {
                      const IconComponent = getRoleIcon(role);
                      return (
                        <div key={role.id} className="flex items-center justify-between p-2 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className={`p-1 rounded ${getRoleColor(role)}`}>
                              <IconComponent className="h-3 w-3" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{role.name}</div>
                              {role.description && (
                                <div className="text-xs text-gray-500">{role.description}</div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                    {getUserRealmRoles(selectedUser).length === 0 && (
                      <p className="text-sm text-gray-500">No realm roles assigned</p>
                    )}
                  </div>
                </div>

                {/* Current Client Roles */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Client Roles</h4>
                  <div className="space-y-2">
                    {getUserClientRoles(selectedUser).map(({ role, client }, index) => {
                      const IconComponent = getRoleIcon(role);
                      return (
                        <div key={`${role.id}-${index}`} className="flex items-center justify-between p-2 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className={`p-1 rounded ${getRoleColor(role)}`}>
                              <IconComponent className="h-3 w-3" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{role.name}</div>
                              <div className="text-xs text-gray-500">Client: {client}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                    {getUserClientRoles(selectedUser).length === 0 && (
                      <p className="text-sm text-gray-500">No client roles assigned</p>
                    )}
                  </div>
                </div>

                {/* Add Roles */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Available Roles</h4>
                  <div className="space-y-2">
                    {getAvailableRealmRoles(selectedUser).slice(0, 3).map((role) => {
                      const IconComponent = getRoleIcon(role);
                      return (
                        <div key={role.id} className="flex items-center justify-between p-2 rounded-lg border border-dashed">
                          <div className="flex items-center space-x-3">
                            <div className={`p-1 rounded ${getRoleColor(role)}`}>
                              <IconComponent className="h-3 w-3" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{role.name}</div>
                              {role.description && (
                                <div className="text-xs text-gray-500">{role.description}</div>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No user selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a user from the list to manage their role mappings
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Users Role Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Role Summary</CardTitle>
          <CardDescription>
            Overview of role assignments across all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Realm Roles</TableHead>
                <TableHead>Client Roles</TableHead>
                <TableHead>Total Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const realmRoleCount = user.realmRoles?.length || 0;
                const clientRoleCount = Object.values(user.clientRoles || {}).reduce((sum, roles) => sum + roles.length, 0);
                const totalRoles = realmRoleCount + clientRoleCount;
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.enabled ? 'default' : 'secondary'} className="text-xs">
                          {user.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        {user.emailVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.realmRoles?.map((roleName) => (
                          <Badge key={roleName} variant="secondary" className="text-xs">
                            {roleName}
                          </Badge>
                        )) || <span className="text-sm text-gray-500">None</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(user.clientRoles || {}).map(([client, roleNames]) =>
                          roleNames.map((roleName) => (
                            <Badge key={`${client}-${roleName}`} variant="outline" className="text-xs">
                              {client}:{roleName}
                            </Badge>
                          ))
                        )}
                        {clientRoleCount === 0 && <span className="text-sm text-gray-500">None</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={totalRoles > 0 ? 'default' : 'secondary'}>
                        {totalRoles}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Mapping Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Role Types</CardTitle>
            <CardDescription>
              Understanding different types of roles in Keycloak
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className="p-2 rounded-lg bg-green-100">
                <Key className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Realm Roles</h4>
                <p className="text-sm text-gray-500">Global roles that apply across the entire realm</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className="p-2 rounded-lg bg-blue-100">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Client Roles</h4>
                <p className="text-sm text-gray-500">Specific to individual client applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className="p-2 rounded-lg bg-purple-100">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Composite Roles</h4>
                <p className="text-sm text-gray-500">Roles that contain other roles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Best Practices</CardTitle>
            <CardDescription>
              Guidelines for effective role management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Principle of Least Privilege</h4>
              <p className="text-sm text-gray-500">
                Assign only the minimum roles necessary for users to perform their tasks
              </p>
            </div>
            <div className="p-3 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Use Composite Roles</h4>
              <p className="text-sm text-gray-500">
                Group related permissions into composite roles for easier management
              </p>
            </div>
            <div className="p-3 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Regular Audits</h4>
              <p className="text-sm text-gray-500">
                Periodically review and update role assignments to maintain security
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}