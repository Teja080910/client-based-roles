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
    Shield,
    Search,
    Plus,
    Edit,
    Trash2,
    Users,
    Clock,
    Code,
    Filter
} from 'lucide-react';
import { mockPolicies } from '@/lib/mock-data';

const policyTypeIcons = {
    role: Users,
    time: Clock,
    user: Users,
    client: Shield,
    group: Users,
    js: Code,
    aggregate: Filter,
    regex: Code,
};

const policyTypeColors = {
    role: 'bg-blue-100 text-blue-800',
    time: 'bg-green-100 text-green-800',
    user: 'bg-purple-100 text-purple-800',
    client: 'bg-orange-100 text-orange-800',
    group: 'bg-pink-100 text-pink-800',
    js: 'bg-yellow-100 text-yellow-800',
    aggregate: 'bg-indigo-100 text-indigo-800',
    regex: 'bg-red-100 text-red-800',
};

export default function PoliciesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [policies] = useState(mockPolicies);

    const filteredPolicies = policies.filter(policy =>
        policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const policyStats = {
        total: policies.length,
        role: policies.filter(p => p.type === 'role').length,
        time: policies.filter(p => p.type === 'time').length,
        other: policies.filter(p => !['role', 'time'].includes(p.type)).length,
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Authorization Policies</h1>
                    <p className="text-gray-600 mt-2">
                        Manage authorization policies that define access rules
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Policy
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Policies
                        </CardTitle>
                        <Shield className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{policyStats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Role Policies
                        </CardTitle>
                        <Users className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{policyStats.role}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Time Policies
                        </CardTitle>
                        <Clock className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{policyStats.time}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Other Types
                        </CardTitle>
                        <Filter className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{policyStats.other}</div>
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
                                placeholder="Search policies by name, description, or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Policies Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Policies ({filteredPolicies.length})</CardTitle>
                    <CardDescription>
                        Authorization policies that control access to resources
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Logic</TableHead>
                                <TableHead>Decision Strategy</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPolicies.map((policy) => {
                                const IconComponent = policyTypeIcons[policy.type] || Shield;
                                const typeColor = policyTypeColors[policy.type] || 'bg-gray-100 text-gray-800';

                                return (
                                    <TableRow key={policy.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${typeColor}`}>
                                                    <IconComponent className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{policy.name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={typeColor}>
                                                {policy.type.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={policy.logic === 'POSITIVE' ? 'default' : 'destructive'}
                                                className="text-xs"
                                            >
                                                {policy.logic}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">
                                                {policy.decisionStrategy}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600">
                                                {policy.description || 'No description'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
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
                </CardContent>
            </Card>

            {/* Policy Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Policy Types</CardTitle>
                        <CardDescription>
                            Different types of authorization policies available
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Role-based Policy</h4>
                                <p className="text-sm text-gray-500">Grant access based on user roles</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                            <div className="p-2 rounded-lg bg-green-100">
                                <Clock className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Time-based Policy</h4>
                                <p className="text-sm text-gray-500">Restrict access to specific time periods</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border">
                            <div className="p-2 rounded-lg bg-yellow-100">
                                <Code className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">JavaScript Policy</h4>
                                <p className="text-sm text-gray-500">Custom logic using JavaScript</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Decision Strategies</CardTitle>
                        <CardDescription>
                            How multiple policies are evaluated together
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-1">Unanimous</h4>
                            <p className="text-sm text-gray-500">All policies must grant access</p>
                        </div>
                        <div className="p-3 rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-1">Affirmative</h4>
                            <p className="text-sm text-gray-500">At least one policy must grant access</p>
                        </div>
                        <div className="p-3 rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-1">Consensus</h4>
                            <p className="text-sm text-gray-500">Majority of policies must grant access</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}