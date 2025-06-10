'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Shield,
  Key,
  Settings,
  Globe,
  FileText,
  Eye,
  UserCheck,
  Lock,
  Gavel,
} from 'lucide-react';

const navigation = [
  {
    name: 'Realms',
    href: '/console/realms',
    icon: Globe,
    description: 'Manage authentication realms',
  },
  {
    name: 'Clients',
    href: '/console/clients',
    icon: Settings,
    description: 'OAuth/OIDC client applications',
  },
  {
    name: 'Resources',
    href: '/console/resources',
    icon: FileText,
    description: 'Protected resources',
  },
  {
    name: 'Scopes',
    href: '/console/scopes',
    icon: Eye,
    description: 'Authorization scopes',
  },
  {
    name: 'Policies',
    href: '/console/policies',
    icon: Shield,
    description: 'Authorization policies',
  },
  {
    name: 'Permissions',
    href: '/console/permissions',
    icon: Lock,
    description: 'Resource permissions',
  },
  {
    name: 'Policy Evaluation',
    href: '/console/evaluation',
    icon: Gavel,
    description: 'Test authorization policies',
  },
  {
    name: 'Roles',
    href: '/console/roles',
    icon: Key,
    description: 'Realm and client roles',
  },
  {
    name: 'Role Mapping',
    href: '/console/role-mapping',
    icon: UserCheck,
    description: 'Assign roles to users',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200 cursor-pointer" onClick={()=> router.push('/console')}>
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Keycloak</h1>
            <p className="text-xs text-gray-500">Administration</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                )}
                aria-hidden="true"
              />
              <div>
                <div>{item.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}