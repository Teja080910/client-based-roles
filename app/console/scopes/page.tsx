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
    Eye,
    Search,
    Plus,
    Edit,
    Trash2,
    Shield,
    FileText,
    Settings
} from 'lucide-react';
import { mockScopes, mockResources, mockPolicies } from '@/lib/mock-data';

export default function ScopesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [scopes] = useState(mockScopes);

    const filteredScopes = scopes.filter(scope =>
        scope.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scope.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getResourcesUsingScope = (scopeId: string) => {
        return mockResources.filter(resource =>
            resource.scopes.some(scope => scope.id === scopeId)
        );
    };

    const getPoliciesUsingScope = (scopeId: string) => {
        return mockPolicies.filter(policy =>
            policy.scopes?.includes(scopeId)
        );
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Authorization Scopes</h1>
                    <p className="text-gray-600 mt-2">
                        Manage authorization scopes that define specific permissions
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Scope
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Scopes
                        </CardTitle>
                        <Eye className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{scopes.length}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Available authorization scopes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Used in Resources
                        </CardTitle>
                        <FileText className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {scopes.filter(scope => getResourcesUsingScope(scope.id).length > 0).length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Scopes assigned to resources
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Used in Policies
                        </CardTitle>
                        <Shield className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {scopes.filter(scope => getPoliciesUsingScope(scope.id).length > 0).length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Scopes referenced in policies
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
                                placeholder="Search scopes by name or display name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Scopes Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Scopes ({filteredScopes.length})</CardTitle>
                    <CardDescription>
                        Authorization scopes that define specific permissions and access levels
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Display Name</TableHead>
                                <TableHead>Resources</TableHead>
                                <TableHead>Policies</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredScopes.map((scope) => {
                                const resourcesUsingScope = getResourcesUsingScope(scope.id);
                                const policiesUsingScope = getPoliciesUsingScope(scope.id);

                                return (
                                    <TableRow key={scope.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 rounded-lg bg-blue-100">
                                                    <Eye className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{scope.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {scope.id}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-900">
                                                {scope.displayName || scope.name}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {resourcesUsingScope.length > 0 ? (
                                                    resourcesUsingScope.map((resource) => (
                                                        <Badge key={resource.id} variant="secondary" className="text-xs">
                                                            {resource.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500">No resources</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {policiesUsingScope.length > 0 ? (
                                                    policiesUsingScope.map((policy) => (
                                                        <Badge key={policy.id} variant="outline" className="text-xs">
                                                            {policy.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500">No policies</span>
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
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredScopes.length === 0 && (
                        <div className="text-center py-8">
                            <Eye className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No scopes found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new scope.'}
                            </p>
                            {!searchTerm && (
                                <div className="mt-6">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Scope
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Scope Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">About Scopes</CardTitle>
                        <CardDescription>
                            Understanding authorization scopes in Keycloak
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-1">What are Scopes?</h4>
                            <p className="text-sm text-gray-500">
                                Scopes represent specific permissions or actions that can be performed on resources.
                                They define the granular level of access control.
                            </p>
                        </div>
                        <div className="p-3 rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-1">Common Examples</h4>
                            <p className="text-sm text-gray-500">
                                read, write, delete, admin, view, edit, create, update
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Scope Usage</CardTitle>
                        <CardDescription>
                            How scopes are used in authorization
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                            <div className="p-2 rounded-lg bg-green-100">
                                <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Resource Association</h4>
                                <p className="text-sm text-gray-500">Scopes are assigned to resources</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Policy Evaluation</h4>
                                <p className="text-sm text-gray-500">Policies can target specific scopes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}