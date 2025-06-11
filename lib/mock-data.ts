import { Permission, Policy, Resource, Role, Scope, User } from '@/types/interfaces';


export const mockScopes: Scope[] = [
  {
    id: '1',
    name: 'read',
    displayName: 'Read Access',
  },
  {
    id: '2',
    name: 'write',
    displayName: 'Write Access',
  },
  {
    id: '3',
    name: 'delete',
    displayName: 'Delete Access',
  },
  {
    id: '4',
    name: 'admin',
    displayName: 'Admin Access',
  },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    name: 'user-resource',
    displayName: 'User Management',
    type: 'urn:demo-app:resources:user',
    owner: 'demo-app',
    ownerManagedAccess: false,
    scopes: mockScopes.slice(0, 3),
  },
  {
    id: '2',
    name: 'document-resource',
    displayName: 'Document Management',
    type: 'urn:demo-app:resources:document',
    owner: 'demo-app',
    ownerManagedAccess: false,
    scopes: mockScopes,
  },
  {
    id: '3',
    name: 'admin-resource',
    displayName: 'Admin Panel',
    type: 'urn:demo-app:resources:admin',
    owner: 'demo-app',
    ownerManagedAccess: false,
    scopes: [mockScopes[3]],
  },
];

export const mockPolicies: Policy[] = [
  {
    id: '1',
    name: 'Admin Role Policy',
    description: 'Policy for admin role',
    type: 'role',
    logic: 'POSITIVE',
    decisionStrategy: 'UNANIMOUS',
    roles: ['admin'],
  },
  {
    id: '2',
    name: 'User Role Policy',
    description: 'Policy for user role',
    type: 'role',
    logic: 'POSITIVE',
    decisionStrategy: 'UNANIMOUS',
    roles: ['user'],
  },
  {
    id: '3',
    name: 'Business Hours Policy',
    description: 'Only allow access during business hours',
    type: 'time',
    logic: 'POSITIVE',
    decisionStrategy: 'UNANIMOUS',
    config: {
      hour: '9',
      hourEnd: '17',
      dayMonth: '',
      dayMonthEnd: '',
      month: '',
      monthEnd: '',
      year: '',
      yearEnd: '',
    },
  },
];

export const mockPermissions: Permission[] = [
  {
    id: '1',
    name: 'User Management Permission',
    description: 'Permission to manage users',
    type: 'resource',
    logic: 'POSITIVE',
    decisionStrategy: 'UNANIMOUS',
    resources: ['1'],
    policies: ['1', '2'],
  },
  {
    id: '2',
    name: 'Document Read Permission',
    description: 'Permission to read documents',
    type: 'scope',
    logic: 'POSITIVE',
    decisionStrategy: 'AFFIRMATIVE',
    scopes: ['1'],
    policies: ['2'],
  },
  {
    id: '3',
    name: 'Admin Access Permission',
    description: 'Full admin access permission',
    type: 'resource',
    logic: 'POSITIVE',
    decisionStrategy: 'UNANIMOUS',
    resources: ['3'],
    policies: ['1', '3'],
  },
];

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'admin',
    description: 'Administrator role with full access',
    composite: false,
    clientRole: false,
    containerId: 'demo-realm',
  },
  {
    id: '2',
    name: 'user',
    description: 'Standard user role',
    composite: false,
    clientRole: false,
    containerId: 'demo-realm',
  },
  {
    id: '3',
    name: 'manager',
    description: 'Manager role with elevated permissions',
    composite: true,
    clientRole: false,
    containerId: 'demo-realm',
    composites: {
      realm: ['user'],
    },
  },
  {
    id: '4',
    name: 'demo-app-user',
    description: 'Demo app specific user role',
    composite: false,
    clientRole: true,
    containerId: 'demo-app',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'System',
    lastName: 'Administrator',
    enabled: true,
    emailVerified: true,
    createdTimestamp: Date.now() - 86400000,
    realmRoles: ['admin', 'user'],
    clientRoles: {
      'demo-app': ['demo-app-user'],
    },
  },
  {
    id: '2',
    username: 'john.doe',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    enabled: true,
    emailVerified: true,
    createdTimestamp: Date.now() - 172800000,
    realmRoles: ['user'],
    clientRoles: {
      'demo-app': ['demo-app-user'],
    },
  },
  {
    id: '3',
    username: 'jane.smith',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    enabled: true,
    emailVerified: false,
    createdTimestamp: Date.now() - 259200000,
    realmRoles: ['manager', 'user'],
    clientRoles: {},
  },
];