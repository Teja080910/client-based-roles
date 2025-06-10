'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Settings,
    Plus,
    Search,
    Eye,
    Edit,
    Trash2,
    Shield,
    Key,
    Globe
} from 'lucide-react';
import { mockClients } from '@/lib/mock-data';

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [clients] = useState(mockClients);

    const filteredClients = clients.filter(client =>
        client.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600 mt-2">
                        Manage OAuth/OIDC client applications and their configurations
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Client
                </Button>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Client Management</CardTitle>
                    <CardDescription>
                        Configure and manage client applications for authentication and authorization
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search clients by ID, name, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Clients Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Protocol</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Access Type</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Settings className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium">{client.clientId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{client.name || client.clientId}</div>
                                                {client.description && (
                                                    <div className="text-sm text-gray-500">{client.description}</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {client.protocol}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={client.enabled ? "default" : "secondary"}
                                                className={client.enabled ? "bg-green-100 text-green-800" : ""}
                                            >
                                                {client.enabled ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                {client.publicClient ? (
                                                    <Badge variant="outline" className="text-blue-600">
                                                        <Globe className="mr-1 h-3 w-3" />
                                                        Public
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-purple-600">
                                                        <Shield className="mr-1 h-3 w-3" />
                                                        Confidential
                                                    </Badge>
                                                )}
                                                {client.serviceAccountsEnabled && (
                                                    <Badge variant="outline" className="text-orange-600">
                                                        <Key className="mr-1 h-3 w-3" />
                                                        Service Account
                                                    </Badge>
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
                    </div>

                    {filteredClients.length === 0 && (
                        <div className="text-center py-8">
                            <Settings className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new client.'}
                            </p>
                            {!searchTerm && (
                                <div className="mt-6">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Client
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Client Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Clients
                        </CardTitle>
                        <Settings className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{clients.length}</div>
                        <p className="text-xs text-gray-500 mt-1">
                            Registered applications
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Active Clients
                        </CardTitle>
                        <Shield className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {clients.filter(c => c.enabled).length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Currently enabled
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Service Accounts
                        </CardTitle>
                        <Key className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {clients.filter(c => c.serviceAccountsEnabled).length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            With service accounts
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}