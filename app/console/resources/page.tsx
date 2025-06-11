'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockPermissions, mockPolicies } from '@/lib/mock-data';
import { Resource } from '@/types/interfaces';
import {
  Edit,
  Eye,
  FileText,
  Globe,
  Plus,
  Search,
  Settings,
  Shield,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/keycloak/resources");
      const data = await response.json();

      const allResources: Resource[] = [];

      data.forEach((clientItem: any) => {
        const { clientId, resources } = clientItem;

        resources.forEach((res: any) => {
          const resource: Resource = {
            id: res._id || res.id || "", // fallback
            name: res.name,
            displayName: res.displayName || undefined,
            type: res.type || undefined,
            uri: res.uris?.[0] || undefined,
            icon_uri: res.icon_uri || undefined,
            owner: res.owner?.name || res.owner?.id || undefined,
            ownerManagedAccess: res.ownerManagedAccess ?? false,
            scopes: res.scopes?.map((s: any) => ({
              id: s.id || "",
              name: s.name,
              displayName: s.displayName,
              iconUri: s.iconUri,
            })) || [],
            attributes: res.attributes || {},
          };

          allResources.push(resource);
        });
      });

      setResources(allResources);
      console.log("🔵 Final parsed resources:", allResources);
    } catch (error) {
      console.error("🔴 Error fetching resources:", error);
    }
  };


  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionsUsingResource = (resourceId: string) => {
    return mockPermissions.filter(permission =>
      permission.resources?.includes(resourceId)
    );
  };

  const getPoliciesUsingResource = (resourceId: string) => {
    return mockPolicies.filter(policy =>
      policy.resources?.includes(resourceId)
    );
  };

  const getResourceTypeIcon = (type?: string) => {
    if (!type) return <FileText className="h-4 w-4" />;

    if (type.includes('user')) return <Shield className="h-4 w-4" />;
    if (type.includes('admin')) return <Settings className="h-4 w-4" />;
    if (type.includes('document')) return <FileText className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const getResourceTypeColor = (type?: string) => {
    if (!type) return 'bg-gray-100 text-gray-800';

    if (type.includes('user')) return 'bg-blue-100 text-blue-800';
    if (type.includes('admin')) return 'bg-red-100 text-red-800';
    if (type.includes('document')) return 'bg-green-100 text-green-800';
    return 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 mt-2">
            Manage protected resources and their associated scopes
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Resources
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{resources.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Protected resources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              User Resources
            </CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {resources.filter(r => r.type?.includes('user')).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              User management resources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Document Resources
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {resources.filter(r => r.type?.includes('document')).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Document resources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Admin Resources
            </CardTitle>
            <Settings className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {resources.filter(r => r.type?.includes('admin')).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Administrative resources
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
                placeholder="Search resources by name, display name, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Protected Resources ({filteredResources.length})</CardTitle>
          <CardDescription>
            Resources that are protected by authorization policies and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => {
                const permissionsUsingResource = getPermissionsUsingResource(resource.id);
                const policiesUsingResource = getPoliciesUsingResource(resource.id);

                return (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getResourceTypeColor(resource.type)}`}>
                          {getResourceTypeIcon(resource.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {resource.displayName || resource.name}
                          </div>
                          <div className="text-sm text-gray-500">{resource.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {resource.type ? (
                        <Badge variant="outline" className={getResourceTypeColor(resource.type)}>
                          {resource.type.split(':').pop()?.toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">No type</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{resource.owner}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {resource.scopes?.length > 0 ? (
                          resource.scopes.map((scope) => (
                            <Badge key={scope.id} variant="secondary" className="text-xs">
                              {scope.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">No scopes</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {permissionsUsingResource.length}
                        </span>
                        <span className="text-sm text-gray-500">permissions</span>
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
                );
              })}
            </TableBody>
          </Table>

          {filteredResources.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new resource.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Resource
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resource Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">About Resources</CardTitle>
            <CardDescription>
              Understanding protected resources in authorization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">What are Resources?</h4>
              <p className="text-sm text-gray-500">
                Resources represent the assets, data, or functionality that you want to protect.
                They can be anything from API endpoints to documents or user interfaces.
              </p>
            </div>
            <div className="p-3 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Resource Types</h4>
              <p className="text-sm text-gray-500">
                Resources can be categorized by type (e.g., user, document, admin) to help
                organize and manage authorization policies more effectively.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Resource Management</CardTitle>
            <CardDescription>
              How resources work with scopes and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className="p-2 rounded-lg bg-blue-100">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Scopes</h4>
                <p className="text-sm text-gray-500">Define what actions can be performed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className="p-2 rounded-lg bg-green-100">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Permissions</h4>
                <p className="text-sm text-gray-500">Control who can access resources</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className="p-2 rounded-lg bg-purple-100">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Ownership</h4>
                <p className="text-sm text-gray-500">Resources are owned by clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}