
import ProtectedPage from '@/components/dashboard/prev-dashboard';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, Settings, Users } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { ClientSelector } from './client-select';
import { PermissionMatrix } from './permissions';
import { UserProfile } from './user';

export default function DashboardPage() {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const { session, status } = useAuth();
    const [selectedClient, setSelectedClient] = useState<string>('AOL');
    const token = session?.accessToken;

    console.log('Session:', session);

    useEffect(() => {
        fetchPermissions();
        fetchRoles();
    }, [token, selectedClient]);

    const fetchPermissions = async () => {
        const res = await fetch('/api/keycloak/evaluate', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                realm: 'master',
                clientId: selectedClient,
                accessToken: token,
            }),
        });
        const data = await res.json();
        setPermissions(data);
    };
    const fetchRoles = async () => {
        const url = `/api/keycloak/evaluate?realm=master&clientId=${selectedClient}&userId=${'5843f8c0-7a40-4e7e-b8a4-3fef2ee527be'}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setRoles(data.roles);
        setClients(data.clients);
        console.log('Roles:', data);
    }

    const handleClientSelect = (client: string) => {
        console.log('Selected client:', client);
        setSelectedClient(client);
        fetchPermissions()
    }

    useEffect(() => {
        if (session?.expires) {
            const expired = new Date(session.expires) < new Date();
            if (expired) {
                signOut();
            }
        }
    }, [session, status]);

    return (
        !session ? <ProtectedPage /> :
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Settings className="h-5 w-5 text-white" />
                                </div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Keycloak RBAC Dashboard
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Welcome back!</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-2"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* User Profile */}
                        <div className="lg:col-span-1">
                            <UserProfile roles={roles} />
                        </div>

                        {/* Client Selection */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Users className="h-5 w-5 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900">Select Client Application</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Choose a client to view your available permissions and actions
                                </p>
                                <ClientSelector clients={clients} onClientSelect={(e) => handleClientSelect(e)} />
                            </div>
                        </div>
                    </div>

                    {permissions?.length > 0 && (
                        <div className="mt-8">
                            <PermissionMatrix
                                actions={permissions}
                                clientName={'AOL'}
                            />
                        </div>
                    )}

                    {permissions.length === 0 && (
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start space-x-3">
                                <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                                        Getting Started
                                    </h3>
                                    <p className="text-blue-800 mb-4">
                                        This dashboard shows your role-based access control permissions across different client applications.
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
                                        <li>Your current roles: <strong>ADMIN</strong> and <strong>TEACHER</strong></li>
                                        <li>Select a client application above to see your available permissions</li>
                                        <li>Each permission shows what you can do and where you can access it</li>
                                        <li>Green cards indicate allowed actions, gray cards show restricted access</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    );
}
