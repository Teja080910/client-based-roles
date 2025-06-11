import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Key, Shield } from "lucide-react";

export function MappingSection({keycloakData}: { keycloakData: any }) {
    const mappings = {
        roleToScope: {
            '4': ['4', '5'], // manager -> read:documents, write:documents
            '5': ['4'], // viewer -> read:documents
            '6': ['4', '5'] // editor -> read:documents, write:documents
        },
        policyToRole: {
            '3': ['4'], // Manager Access Policy -> manager
            '5': ['5'] // Group Policy -> viewer
        },
        permissionToResource: {
            '2': ['3'], // Document Read Permission -> Document Management
            '3': ['3'], // Document Write Permission -> Document Management
            '4': ['5'] // Report Access Permission -> Reports
        }
    };
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5" />
                            Role to Scope Mappings
                        </CardTitle>
                        <CardDescription>
                            How roles are mapped to scopes for authorization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(mappings.roleToScope).map(([roleId, scopeIds]) => {
                                const role = [...keycloakData.roles.default, ...keycloakData.roles.created].find(r => r.id === roleId);
                                const scopes = scopeIds.map(scopeId =>
                                    [...keycloakData.scopes.default, ...keycloakData.scopes.created].find(s => s.id === scopeId)
                                );

                                return (
                                    <div key={roleId} className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-green-100 text-green-800">{role?.name}</Badge>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {scopes.map(scope => (
                                                <Badge key={scope?.id} variant="outline" className="text-xs">
                                                    {scope?.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Policy to Role Mappings
                        </CardTitle>
                        <CardDescription>
                            How policies are connected to roles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(mappings.policyToRole).map(([policyId, roleIds]) => {
                                const policy = [...keycloakData.policies.default, ...keycloakData.policies.created].find(p => p.id === policyId);
                                const roles = roleIds.map(roleId =>
                                    [...keycloakData.roles.default, ...keycloakData.roles.created].find(r => r.id === roleId)
                                );

                                return (
                                    <div key={policyId} className="p-3 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-purple-100 text-purple-800">{policy?.name}</Badge>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {roles.map(role => (
                                                <Badge key={role?.id} variant="outline" className="text-xs">
                                                    {role?.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Permission to Resource Mappings
                    </CardTitle>
                    <CardDescription>
                        How permissions are mapped to protected resources
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(mappings.permissionToResource).map(([permissionId, resourceIds]) => {
                            const permission = [...keycloakData.permissions.default, ...keycloakData.permissions.created].find(p => p.id === permissionId);
                            const resources = resourceIds.map(resourceId =>
                                [...keycloakData.resources.default, ...keycloakData.resources.created].find(r => r.id === resourceId)
                            );

                            return (
                                <div key={permissionId} className="p-3 border rounded-lg">
                                    <div className="mb-2">
                                        <Badge className="bg-blue-100 text-blue-800 text-xs mb-2">{permission?.name}</Badge>
                                    </div>
                                    <div className="space-y-1">
                                        {resources.map(resource => (
                                            <div key={resource?.id} className="text-sm">
                                                <div className="font-medium">{resource?.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{resource?.uri}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}