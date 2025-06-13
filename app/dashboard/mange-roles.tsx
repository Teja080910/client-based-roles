"use client";

import ProtectedPage from "@/components/dashboard/prev-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { availableRoles, mockUsers, statusColors } from "@/types/default-dashboard-values";
import {
    AlertCircle,
    Building,
    Calendar,
    CheckCircle,
    Crown,
    Edit,
    Globe,
    LogOut,
    Search,
    Settings,
    Shield,
    Trash2,
    UserPlus,
    Users,
    XCircle
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

const statusIcons = {
    Active: CheckCircle,
    Inactive: XCircle,
    Pending: AlertCircle
};

export default function ManageRolesPages() {
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRoles, setEditingRoles] = useState<string[]>([]);
    const router = useRouter();
    const { session, loading } = useAuth();

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = selectedRole === "all" ||
            user.roles.some(role => role.toLowerCase() === selectedRole.toLowerCase());

        const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setEditingRoles([...user.roles]);
        setIsEditDialogOpen(true);
    };

    const handleSaveRoles = () => {
        if (selectedUser) {
            setUsers(users.map(user =>
                user.id === selectedUser.id
                    ? { ...user, roles: editingRoles }
                    : user
            ));
            setIsEditDialogOpen(false);
            setSelectedUser(null);
            setEditingRoles([]);
        }
    };

    const handleRoleToggle = (roleId: string) => {
        const roleName = availableRoles.find(r => r.id === roleId)?.name || roleId;
        setEditingRoles(prev =>
            prev.includes(roleName)
                ? prev.filter(r => r !== roleName)
                : [...prev, roleName]
        );
    };

    const handleStatusChange = (userId: string, newStatus: string) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, status: newStatus }
                : user
        ));
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const getRoleColor = (roleName: string) => {
        const role = availableRoles.find(r => r.name === roleName);
        return role?.color || "bg-gray-500";
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">Loading...</p>
        </div>;
    }

    return (
        (!session) ? <ProtectedPage /> :
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                User Role Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage user roles, permissions, and access levels
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {
                                session &&
                                <Button
                                    onClick={() => router.push("/console")}
                                    className="bg-gradient-to-r cursor-pointer from-violet-600 to-gray-600 hover:from-blue-700 hover:to-green-700 text-white"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Console
                                </Button>
                            }
                            <Button
                                onClick={() => router.push("/register")}
                                className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                            <Button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="bg-gradient-to-r cursor-pointer from-red-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                LogOut
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Users</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {users.filter(u => u.status === "Active").length}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Admins</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {users.filter(u => u.roles.some(r => r.includes("Admin"))).length}
                                        </p>
                                    </div>
                                    <Crown className="w-8 h-8 text-orange-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {users.filter(u => u.status === "Pending").length}
                                        </p>
                                    </div>
                                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-gray-900">Users & Roles</CardTitle>
                                    <CardDescription>
                                        View and manage user roles and permissions
                                    </CardDescription>
                                </div>

                                {/* Search and Filters */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 w-64"
                                        />
                                    </div>

                                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Filter by role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            {availableRoles.map(role => (
                                                <SelectItem key={role.id} value={role.name}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Roles</TableHead>
                                            <TableHead>Organizations</TableHead>
                                            <TableHead>Countries</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((user) => {
                                            const StatusIcon = statusIcons[user.status as keyof typeof statusIcons];
                                            return (
                                                <TableRow key={user.id} className="hover:bg-gray-50/50">
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}${user.lastName}`} />
                                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                                    {getInitials(user.firstName, user.lastName)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {user.firstName} {user.lastName}
                                                                </p>
                                                                <p className="text-sm text-gray-500">@{user.username}</p>
                                                                <p className="text-xs text-gray-400">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.roles.map((role) => (
                                                                <Badge
                                                                    key={role}
                                                                    className={`${getRoleColor(role)} text-white text-xs px-2 py-1`}
                                                                >
                                                                    {role}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            {user.organizations.slice(0, 2).map((org) => (
                                                                <div key={org} className="flex items-center text-xs text-gray-600">
                                                                    <Building className="w-3 h-3 mr-1" />
                                                                    {org.length > 20 ? `${org.substring(0, 20)}...` : org}
                                                                </div>
                                                            ))}
                                                            {user.organizations.length > 2 && (
                                                                <p className="text-xs text-gray-400">
                                                                    +{user.organizations.length - 2} more
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Globe className="w-4 h-4 mr-1" />
                                                            {user.countries.join(", ")}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <StatusIcon className="w-4 h-4" />
                                                            <Badge className={`${statusColors[user.status as keyof typeof statusColors]} border-0`}>
                                                                {user.status}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {formatDate(user.lastLogin)}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditUser(user)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>

                                                            <Select
                                                                value={user.status}
                                                                onValueChange={(value) => handleStatusChange(user.id, value)}
                                                            >
                                                                <SelectTrigger className="h-8 w-24 text-xs">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Active">Active</SelectItem>
                                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                                </SelectContent>
                                                            </Select>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {filteredUsers.length === 0 && (
                                <div className="text-center py-12">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No users found matching your criteria</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Edit User Roles Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-500" />
                                    Edit User Roles
                                </DialogTitle>
                                <DialogDescription>
                                    Modify roles for {selectedUser?.firstName} {selectedUser?.lastName}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            {selectedUser && getInitials(selectedUser.firstName, selectedUser.lastName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{selectedUser?.firstName} {selectedUser?.lastName}</p>
                                        <p className="text-sm text-gray-500">{selectedUser?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-medium">Assign Roles</Label>
                                    {availableRoles.map((role) => (
                                        <div key={role.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                            <Checkbox
                                                id={role.id}
                                                checked={editingRoles.includes(role.name)}
                                                onCheckedChange={() => handleRoleToggle(role.id)}
                                                className="border-gray-300"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-3 h-3 rounded-full ${role.color}`}></div>
                                                    <Label htmlFor={role.id} className="font-medium cursor-pointer">
                                                        {role.name}
                                                    </Label>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveRoles}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
    );
}