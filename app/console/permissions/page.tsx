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
    Lock,
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    Shield,
    FileText,
    Settings
} from 'lucide-react';
import { mockPermissions, mockResources, mockScopes, mockPolicies } from '@/lib/mock-data';

export default function PermissionsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPermissions = mockPermissions.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getResourceNames = (resourceIds?: string[]) => {
        if (!resourceIds) return [];
        return resourceIds.map(id => {
            const resource = mockResources.find(r => r.id === id);
            return resource?.name || id;
        });
    };

    const getScopeNames = (scopeIds?: string[]) => {
        if (!scopeIds) return [];
        return scopeIds.map(id => {
            const scope = mockScopes.find(s => s.id === id);
            return scope?.name || id;
        });
    };

    const getPolicyNames = (policyIds?: string[]) => {
        if (!policyIds) return [];
        return policyIds.map(id => {
            const policy = mockPolicies.find(p => p.id === id);
            return policy?.name || id;
        });
    };

    const getPermissionTypeIcon = (type: string) => {
        switch (type) {
            case 'resource':
                return <FileText className="h-4 w-4" />;
            case 'scope':
                return <Eye className="h-4 w-4" />;
            default:
                return <Lock className="h-4 w-4" />;
        }
    };

    const getDecisionStrategyColor = (strategy: string) => {
        switch (strategy) {
            case 'UNANIMOUS':
                return 'bg-red-100 text-red-800';
            case 'AFFIRMATIVE':
                return 'bg-green-100 text-green-800';
            case 'CONSENSUS':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const resourcePermissions = filteredPermissions.filter(p => p.type === 'resource').length;
    const scopePermissions = filteredPermissions.filter(p => p.type === 'scope').length;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Permissions</h1>
                    <p className="text-gray-600 mt-2">
                        Manage resource and scope permissions for authorization
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Permission
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Permissions
                        </CardTitle>
                        <Lock className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{filteredPermissions.length}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Active authorization permissions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Resource Permissions
                        </CardTitle>
                        <FileText className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{resourcePermissions}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Resource-based permissions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Scope Permissions
                        </CardTitle>
                        <Eye className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{scopePermissions}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Scope-based permissions
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
                                placeholder="Search permissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Permissions Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Authorization Permissions</CardTitle>
                    <CardDescription>
                        Configure permissions that control access to resources and scopes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Decision Strategy</TableHead>
                                <TableHead>Resources/Scopes</TableHead>
                                <TableHead>Policies</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPermissions.map((permission) => (
                                <TableRow key={permission.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 rounded-lg bg-gray-100">
                                                {getPermissionTypeIcon(permission.type)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{permission.name}</div>
                                                {permission.description && (
                                                    <div className="text-sm text-gray-500">{permission.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {permission.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getDecisionStrategyColor(permission.decisionStrategy)}>
                                            {permission.decisionStrategy}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {permission.resources && permission.resources.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {getResourceNames(permission.resources).map((name, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            {permission.scopes && permission.scopes.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {getScopeNames(permission.scopes).map((name, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {permission.policies && getPolicyNames(permission.policies).map((name, index) => (
                                                <Badge key={index} variant="default" className="text-xs">
                                                    {name}
                                                </Badge>
                                            ))}
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
                </CardContent>
            </Card>
        </div>
    );
}