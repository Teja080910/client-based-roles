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
  Key, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  Users,
  Settings,
  Globe,
  Eye
} from 'lucide-react';
import { mockRoles } from '@/lib/mock-data';

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roles] = useState(mockRoles);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleTypeIcon = (role: typeof roles[0]) => {
    if (role.clientRole) {
      return <Settings className="h-4 w-4" />;
    }
    if (role.composite) {
      return <Shield className="h-4 w-4" />;
    }
    return <Key className="h-4 w-4" />;
  };

  const getRoleTypeColor = (role: typeof roles[0]) => {
    if (role.clientRole) {
      return 'bg-blue-100 text-blue-800';
    }
    if (role.composite) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getRoleTypeName = (role: typeof roles[0]) => {
    if (role.clientRole) {
      return 'Client Role';
    }
    if (role.composite) {
      return 'Composite Role';
    }
    return 'Realm Role';
  };

  const realmRoles = filteredRoles.filter(r => !r.clientRole).length;
  const clientRoles = filteredRoles.filter(r => r.clientRole).length;
  const compositeRoles = filteredRoles.filter(r => r.composite).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
          <p className="text-gray-600 mt-2">
            Manage realm and client roles for authorization
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Roles
            </CardTitle>
            <Key className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{filteredRoles.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              All role types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Realm Roles
            </CardTitle>
            <Globe className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{realmRoles}</div>
            <p className="text-xs text-gray-500 mt-1">
              Realm-level roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Client Roles
            </CardTitle>
            <Settings className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{clientRoles}</div>
            <p className="text-xs text-gray-500 mt-1">
              Client-specific roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Composite Roles
            </CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{compositeRoles}</div>
            <p className="text-xs text-gray-500 mt-1">
              Roles with sub-roles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search roles by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>
            Manage realm and client roles that define user permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Container</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Composite</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getRoleTypeColor(role)}`}>
                        {getRoleTypeIcon(role)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{role.name}</div>
                        <div className="text-sm text-gray-500">ID: {role.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleTypeColor(role)}>
                      {getRoleTypeName(role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {role.containerId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {role.description || 'No description'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {role.composite ? (
                        <Badge variant="default" className="text-xs bg-purple-100 text-purple-800">
                          <Shield className="mr-1 h-3 w-3" />
                          Composite
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Simple
                        </Badge>
                      )}
                      {role.composite && role.composites?.realm && (
                        <span className="text-xs text-gray-500">
                          ({role.composites.realm.length} sub-roles)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRoles.length === 0 && (
            <div className="text-center py-8">
              <Key className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new role.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Role
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Role Types</CardTitle>
            <CardDescription>
              Different types of roles in Keycloak
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
                <p className="text-sm text-gray-500">Roles specific to individual client applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className="p-2 rounded-lg bg-purple-100">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Composite Roles</h4>
                <p className="text-sm text-gray-500">Roles that contain other roles as members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Role Management</CardTitle>
            <CardDescription>
              Best practices for role management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Role Hierarchy</h4>
              <p className="text-sm text-gray-500">
                Use composite roles to create hierarchical permission structures
              </p>
            </div>
            <div className="p-3 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Principle of Least Privilege</h4>
              <p className="text-sm text-gray-500">
                Grant users only the minimum roles necessary for their tasks
              </p>
            </div>
            <div className="p-3 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Role Naming</h4>
              <p className="text-sm text-gray-500">
                Use clear, descriptive names that indicate the role's purpose
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}