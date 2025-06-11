export const mockUsers = [
  {
    id: "1",
    username: "john_doe",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    roles: ["Admin", "User"],
    organizations: ["Microsoft Corporation", "Apple Inc"],
    countries: ["US"],
    status: "Active",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    username: "jane_smith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    roles: ["Manager", "User"],
    organizations: ["Google LLC", "Amazon Web Services"],
    countries: ["US"],
    status: "Active",
    lastLogin: "2024-01-14T15:45:00Z",
    createdAt: "2024-01-02T00:00:00Z"
  },
  {
    id: "3",
    username: "bob_wilson",
    firstName: "Bob",
    lastName: "Wilson",
    email: "bob.wilson@example.com",
    roles: ["User"],
    organizations: ["SAP SE", "Siemens AG"],
    countries: ["DE"],
    status: "Inactive",
    lastLogin: "2024-01-10T09:15:00Z",
    createdAt: "2024-01-03T00:00:00Z"
  },
  {
    id: "4",
    username: "alice_brown",
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@example.com",
    roles: ["Super Admin"],
    organizations: ["Toyota Motor Corporation", "Sony Corporation"],
    countries: ["JP"],
    status: "Active",
    lastLogin: "2024-01-15T14:20:00Z",
    createdAt: "2024-01-04T00:00:00Z"
  },
  {
    id: "5",
    username: "charlie_davis",
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@example.com",
    roles: ["User"],
    organizations: ["Shopify Inc", "BlackBerry Limited"],
    countries: ["CA"],
    status: "Pending",
    lastLogin: null,
    createdAt: "2024-01-15T12:00:00Z"
  }
];

export const availableRoles = [
  { id: "super_admin", name: "Super Admin", description: "Full system access", color: "bg-red-500" },
  { id: "admin", name: "Admin", description: "Administrative privileges", color: "bg-orange-500" },
  { id: "manager", name: "Manager", description: "Team management access", color: "bg-blue-500" },
  { id: "user", name: "User", description: "Standard user access", color: "bg-green-500" },
  { id: "viewer", name: "Viewer", description: "Read-only access", color: "bg-gray-500" }
];

export const statusColors = {
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800"
};

export const excludedClients = [
  'account',
  'account-console',
  'admin-cli',
  'broker',
  'realm-management',
  'security-admin-console'
];