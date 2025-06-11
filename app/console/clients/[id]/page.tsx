"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client } from '@/types/interfaces';
import {
    FileText,
    Filter,
    Key,
    Plus,
    Search,
    Settings,
    Shield,
    Users
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CopyClientDialog from './copy-clinet-dialog';
import { DataCard } from './data-card';
import { MappingSection } from './role-mapping';

// Mock data structure
const keycloakData = {
    permissions: {
        default: [
            { id: '1', name: 'Default Permission', type: 'resource', decisionStrategy: 'UNANIMOUS', resources: ['1'], policies: ['1'] }
        ],
        created: [
            { id: '2', name: 'Document Read Permission', type: 'scope', decisionStrategy: 'AFFIRMATIVE', resources: ['3'], scopes: ['4'], policies: ['3'] },
            { id: '3', name: 'Document Write Permission', type: 'scope', decisionStrategy: 'AFFIRMATIVE', resources: ['3'], scopes: ['5'], policies: ['3'] },
            { id: '4', name: 'Report Access Permission', type: 'resource', decisionStrategy: 'UNANIMOUS', resources: ['5'], policies: ['4'] }
        ]
    }
};

export default function ClientsDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('roles');
    const params = useParams()
    const clientName = params.id?.toString().toUpperCase()
    const clientId = params.id;
    const [client, setClient] = useState<Client>();
    const [roles, setRoles] = useState<{
        defaultRoles: any[];
        customRoles: any[];
    }>({
        defaultRoles: [],
        customRoles: []
    });
    const [scopes, setScopes] = useState<any>({
        defaultRoles: [],
        customRoles: []
    });
    const [resources, setResources] = useState<any>({
        defaultRoles: [],
        customRoles: []
    });
    const [policies, setPolicies] = useState<any>({
        defaultPolicies: [],
        customPolicies: []
    });
    const [permissions, setPermissions] = useState<any>({
        defaultPermissions: [],
        customPermissions: []
    });
    const [copyClient, setCopyClient] = useState<any>(null);
    const [copyClientOpen, setCopyClientOpen] = useState(false);

    useEffect(() => {
        fetchClientData();
    }, [clientName]);

    const fetchClientData = async () => {
        try {
            const response = await fetch(`/api/keycloak/clients/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch client data');
            }
            const data = await response.json();
            setClient(data);
        } catch (error) {
            console.error('Error fetching client data:', error);
        }
    }

    const fetchRoles = async () => {
        try {
            const response = await fetch(`/api/keycloak/clients/${client?.id}/roles`);
            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }

    const fetchScopes = async () => {
        try {
            const response = await fetch(`/api/keycloak/clients/${client?.id}/scopes`);
            if (!response.ok) {
                throw new Error('Failed to fetch scopes');
            }
            const data = await response.json();
            setScopes(data);
        } catch (error) {
            console.error('Error fetching scopes:', error);
        }
    }

    const fetchResources = async () => {
        try {
            const response = await fetch(`/api/keycloak/clients/${client?.id}/resources`);
            if (!response.ok) {
                throw new Error('Failed to fetch resources');
            }
            const data = await response.json();
            setResources(data);
            console.log('Resources data:', data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    }

    const fetchPolicies = async () => {
        try {
            const response = await fetch(`/api/keycloak/clients/${client?.id}/policies`);
            if (!response.ok) {
                throw new Error('Failed to fetch policies');
            }
            const data = await response.json();
            setPolicies(data);
            console.log('Policies data:', data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    }

    const fetchPermissions = async () => {
        try {
            const res = await fetch(`/api/keycloak/clients/${client?.id}/permissions`);
            if (!res.ok) {
                throw new Error('Failed to fetch permissions');
            }
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };


    const fetchMappings = async () => {
        try {
            const response = await fetch(`/api/keycloak/clients/${client?.id}/mappings`);
            if (!response.ok) {
                throw new Error('Failed to fetch mappings');
            }
            const data = await response.json();
            console.log('Mappings data:', data);
        } catch (error) {
            console.error('Error fetching mappings:', error);
        }
    }

    const copyClientData = async () => {
        await fetchRoles();
        await fetchScopes();
        await fetchResources();
        await fetchPolicies();

        const newCopyClient = {
            roles: [...roles?.defaultRoles, ...roles?.customRoles],
            scopes: [...scopes?.defaultScopes, ...scopes?.customScopes],
            resources: [...resources?.defaultResources, ...resources?.customResources],
            policies: [...policies?.defaultPolicies, ...policies?.customPolicies]
        };

        console.log('Copy Client Data:', newCopyClient);

        setCopyClient(newCopyClient);

        setCopyClientOpen(true);
    };


    type TabKey = 'roles' | 'scopes' | 'resources' | 'policies' | 'permissions' | 'mappings';

    const fetchMap = {
        roles: fetchRoles,
        scopes: fetchScopes,
        resources: fetchResources,
        policies: fetchPolicies,
        permissions: fetchPermissions,
        mappings: fetchMappings,
    };

    useEffect(() => {
        if (!client) return;
        const key = activeTab as TabKey;
        const fetchFn = fetchMap[key];
        fetchFn();
    }, [activeTab, client]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary rounded-lg">
                            <Shield className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{clientName} Client Dashboard</h1>
                            <p className="text-muted-foreground">
                                Manage and visualize your {clientName} client configuration
                            </p>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search roles, scopes, resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <CopyClientDialog open={copyClientOpen} setOpen={setCopyClientOpen} newCopyClient={copyClient} CopyClient={copyClientData} />
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="roles" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Roles
                        </TabsTrigger>
                        <TabsTrigger value="scopes" className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Scopes
                        </TabsTrigger>
                        <TabsTrigger value="resources" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Resources
                        </TabsTrigger>
                        <TabsTrigger value="policies" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Policies
                        </TabsTrigger>
                        <TabsTrigger value="permissions" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Permissions
                        </TabsTrigger>
                        {/* <TabsTrigger value="mappings" className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Mappings
                        </TabsTrigger> */}
                    </TabsList>

                    {/* Roles Tab */}
                    <TabsContent value="roles" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-blue-100 text-blue-800">Default Roles</Badge>
                                    <span className="text-sm text-muted-foreground">System-defined roles</span>
                                </div>
                                <DataCard
                                    title="Default Roles"
                                    data={roles.defaultRoles}
                                    type="roles"
                                    icon={Users}
                                    searchTerm={searchTerm}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-green-100 text-green-800">Created Roles</Badge>
                                    <span className="text-sm text-muted-foreground">Custom-defined roles</span>
                                </div>
                                <DataCard
                                    title="Created Roles"
                                    data={roles.customRoles}
                                    type="roles"
                                    icon={Users}
                                    searchTerm={searchTerm}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Scopes Tab */}
                    <TabsContent value="scopes" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-blue-100 text-blue-800">Default Scopes</Badge>
                                    <span className="text-sm text-muted-foreground">OpenID Connect standard scopes</span>
                                </div>
                                <DataCard
                                    title="Default Scopes"
                                    data={scopes.defaultScopes}
                                    type="scopes"
                                    icon={Key}
                                    searchTerm={searchTerm}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-green-100 text-green-800">Created Scopes</Badge>
                                    <span className="text-sm text-muted-foreground">Application-specific scopes</span>
                                </div>
                                <DataCard
                                    title="Created Scopes"
                                    data={scopes.customScopes}
                                    type="scopes"
                                    icon={Key}
                                    searchTerm={searchTerm}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Resources Tab */}
                    <TabsContent value="resources" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-blue-100 text-blue-800">Default Resources</Badge>
                                    <span className="text-sm text-muted-foreground">System resources</span>
                                </div>
                                <DataCard
                                    title="Default Resources"
                                    data={resources.defaultResources}
                                    type="resources"
                                    icon={FileText}
                                    searchTerm={searchTerm}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-green-100 text-green-800">Created Resources</Badge>
                                    <span className="text-sm text-muted-foreground">Application resources</span>
                                </div>
                                <DataCard
                                    title="Created Resources"
                                    data={resources.customResources}
                                    type="resources"
                                    icon={FileText}
                                    searchTerm={searchTerm}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Policies Tab */}
                    <TabsContent value="policies" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-blue-100 text-blue-800">Default Policies</Badge>
                                    <span className="text-sm text-muted-foreground">System policies</span>
                                </div>
                                <DataCard
                                    title="Default Policies"
                                    data={policies.defaultPolicies}
                                    type="policies"
                                    icon={Shield}
                                    searchTerm={searchTerm}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-green-100 text-green-800">Created Policies</Badge>
                                    <span className="text-sm text-muted-foreground">Custom authorization policies</span>
                                </div>
                                <DataCard
                                    title="Created Policies"
                                    data={policies.customPolicies}
                                    type="policies"
                                    icon={Shield}
                                    searchTerm={searchTerm}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Permissions Tab */}
                    <TabsContent value="permissions" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-blue-100 text-blue-800">Default Permissions</Badge>
                                    <span className="text-sm text-muted-foreground">System permissions</span>
                                </div>
                                <DataCard
                                    title="Default Permissions"
                                    data={permissions.defaultPermissions}
                                    type="permissions"
                                    icon={Settings}
                                    searchTerm={searchTerm}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-green-100 text-green-800">Created Permissions</Badge>
                                    <span className="text-sm text-muted-foreground">Custom access permissions</span>
                                </div>
                                <DataCard
                                    title="Created Permissions"
                                    data={permissions.customPermissions}
                                    type="permissions"
                                    icon={Settings}
                                    searchTerm={searchTerm}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Mappings Tab */}
                    <TabsContent value="mappings">
                        <MappingSection keycloakData={keycloakData} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}