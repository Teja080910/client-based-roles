'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Gavel,
  Globe,
  Lock,
  Settings,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { useRouter } from 'next/navigation';

const stats = [
  {
    name: 'Total Realms',
    value: '3',
    change: '+1',
    changeType: 'positive',
    icon: Globe,
  },
  {
    name: 'Active Clients',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: Settings,
  },
  {
    name: 'Total Users',
    value: '1,234',
    change: '+89',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Active Sessions',
    value: '45',
    change: '-3',
    changeType: 'negative',
    icon: Activity,
  },
];

const recentActivity = [
  {
    id: '1',
    type: 'client',
    action: 'created',
    resource: 'mobile-app-v2',
    user: 'admin',
    timestamp: '2 minutes ago',
    status: 'success',
    icon: Settings,
  },
  {
    id: '2',
    type: 'policy',
    action: 'updated',
    resource: 'Admin Role Policy',
    user: 'john.doe',
    timestamp: '5 minutes ago',
    status: 'success',
    icon: Shield,
  },
  {
    id: '3',
    type: 'user',
    action: 'login_failed',
    resource: 'jane.smith',
    user: 'system',
    timestamp: '10 minutes ago',
    status: 'warning',
    icon: Users,
  },
  {
    id: '4',
    type: 'permission',
    action: 'evaluated',
    resource: 'Document Access',
    user: 'demo-app',
    timestamp: '15 minutes ago',
    status: 'success',
    icon: Lock,
  },
];

const quickActions = [
  {
    title: 'Create Realm',
    description: 'Set up a new authentication realm',
    icon: Globe,
    href: '/realms/create',
    color: 'bg-blue-500',
  },
  {
    title: 'Add Client',
    description: 'Register a new OAuth/OIDC client',
    icon: Settings,
    href: '/clients/create',
    color: 'bg-green-500',
  },
  {
    title: 'Create Policy',
    description: 'Define new authorization policy',
    icon: Shield,
    href: '/policies/create',
    color: 'bg-purple-500',
  },
  {
    title: 'Evaluate Permissions',
    description: 'Test authorization policies',
    icon: Gavel,
    href: '/evaluation',
    color: 'bg-orange-500',
  },
];

export default function AdminDashboard() {
  const { session, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Loading...</p>
    </div>;
  }

  if (!session) {
    router.push("/");
  }
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your Keycloak administration environment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className={`${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>
              Commonly used management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            <CardDescription>
              Latest changes and events in your realm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-full bg-gray-100">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.resource}
                    </span>
                    <Badge
                      variant={activity.status === 'success' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {activity.action}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>by {activity.user}</span>
                    <span className="mx-1">•</span>
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {activity.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">System Health</CardTitle>
          <CardDescription>
            Current status of Keycloak services and components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Authentication</p>
                <p className="text-sm text-green-700">All services operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Authorization</p>
                <p className="text-sm text-green-700">All policies active</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Database</p>
                <p className="text-sm text-yellow-700">High connection usage</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}