"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countries, organizationsByCountry } from "@/types/defaut-values";
import { Building, Eye, EyeOff, Globe, Lock, Mail, Router, Search, User, UserPlus, X } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [organizationSearch, setOrganizationSearch] = useState("");
    const [countrySearch, setCountrySearch] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        loginField: ""
    });
    const router = useRouter();

    // Get available organizations based on selected countries
    const getAvailableOrganizations = () => {
        if (selectedCountries.length === 0) {
            return [];
        }

        const availableOrgs: string[] = [];
        selectedCountries.forEach(countryCode => {
            const countryOrgs = organizationsByCountry[countryCode as keyof typeof organizationsByCountry] || [];
            availableOrgs.push(...countryOrgs);
        });

        return [...new Set(availableOrgs)]; // Remove duplicates
    };

    const availableOrganizations = getAvailableOrganizations();

    const filteredOrganizations = availableOrganizations.filter(org =>
        org.toLowerCase().includes(organizationSearch.toLowerCase())
    );

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        country.code.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const handleOrganizationToggle = (org: string) => {
        setSelectedOrganizations(prev =>
            prev.includes(org)
                ? prev.filter(o => o !== org)
                : [...prev, org]
        );
    };

    const gotoSignIn = () => {
        router.push('/');
    }

    const handleCountryToggle = (countryCode: string) => {
        setSelectedCountries(prev => {
            const newCountries = prev.includes(countryCode)
                ? prev.filter(c => c !== countryCode)
                : [...prev, countryCode];

            // Clear organizations that are no longer available when countries change
            if (!prev.includes(countryCode)) {
                // Country was added, no need to clear organizations
                return newCountries;
            } else {
                // Country was removed, clear organizations from that country
                const removedCountryOrgs = organizationsByCountry[countryCode as keyof typeof organizationsByCountry] || [];
                setSelectedOrganizations(prevOrgs =>
                    prevOrgs.filter(org => !removedCountryOrgs.includes(org))
                );
                return newCountries;
            }
        });
    };

    const removeOrganization = (org: string) => {
        setSelectedOrganizations(prev => prev.filter(o => o !== org));
    };

    const removeCountry = (countryCode: string) => {
        // Remove organizations from this country when country is removed
        const removedCountryOrgs = organizationsByCountry[countryCode as keyof typeof organizationsByCountry] || [];
        setSelectedOrganizations(prev =>
            prev.filter(org => !removedCountryOrgs.includes(org))
        );
        setSelectedCountries(prev => prev.filter(c => c !== countryCode));
    };

    const getCountryName = (code: string) => {
        return countries.find(country => country.code === code)?.name || code;
    };

    const handleRegistration = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare data for Keycloak
        const registrationData = {
            username: formData.username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            organizations: selectedOrganizations,
            countries: selectedCountries, // Country codes for Keycloak
            attributes: {
                organizations: selectedOrganizations,
                countryCodes: selectedCountries,
                countryNames: selectedCountries.map(code => getCountryName(code))
            }
        };

        console.log("Registration data for Keycloak:", registrationData);
        setShowPasswordDialog(true);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle login logic
        console.log("Login attempted with:", formData.loginField, formData.password);
    };

    const handlePasswordSet = (e: React.FormEvent) => {
        e.preventDefault();

        // Complete registration data with password
        const completeRegistrationData = {
            username: formData.username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            organizations: selectedOrganizations,
            countries: selectedCountries,
            attributes: {
                organizations: selectedOrganizations,
                countryCodes: selectedCountries,
                countryNames: selectedCountries.map(code => getCountryName(code))
            }
        };

        setShowPasswordDialog(false);
        console.log("Complete registration data for Keycloak:", completeRegistrationData);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl shadow-blue-500/10">
                    <CardHeader className="space-y-4 text-center">
                        <div className="flex justify-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Create Account
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">
                                Join us today and get started
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleRegistration} className="space-y-6">
                            {/* Personal Information Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                                First Name
                                            </Label>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                            Username
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="johndoe"
                                                value={formData.username}
                                                onChange={(e) => handleInputChange("username", e.target.value)}
                                                className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Countries and Organizations */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                        Location & Organizations
                                    </h3>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Countries
                                        </Label>
                                        <div className="border border-gray-200 rounded-lg p-3 min-h-[120px] max-h-[200px] overflow-y-auto focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                            {selectedCountries.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {selectedCountries.map((countryCode) => (
                                                        <Badge key={countryCode} variant="secondary" className="px-2 py-1 text-xs">
                                                            {countryCode} - {getCountryName(countryCode)}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCountry(countryCode)}
                                                                className="ml-2 hover:text-red-500 transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Search Bar */}
                                            <div className="relative mb-3">
                                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder="Search countries..."
                                                    value={countrySearch}
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                    className="pl-10 h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                {filteredCountries.length > 0 ? (
                                                    filteredCountries.slice(0, 10).map((country) => (
                                                        <div key={country.code} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={country.code}
                                                                checked={selectedCountries.includes(country.code)}
                                                                onCheckedChange={() => handleCountryToggle(country.code)}
                                                                className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                                            />
                                                            <Label htmlFor={country.code} className="text-sm text-gray-700 cursor-pointer">
                                                                {country.code} - {country.name}
                                                            </Label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-sm text-gray-500 text-center py-2">
                                                        No countries found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            Organizations
                                            {selectedCountries.length > 0 && (
                                                <span className="text-xs text-gray-500">
                                                    ({availableOrganizations.length} available)
                                                </span>
                                            )}
                                        </Label>
                                        <div className="border border-gray-200 rounded-lg p-3 min-h-[120px] max-h-[200px] overflow-y-auto focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                                            {selectedCountries.length === 0 ? (
                                                <div className="text-sm text-gray-500 text-center py-8">
                                                    Please select countries first to see available organizations
                                                </div>
                                            ) : (
                                                <>
                                                    {selectedOrganizations.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {selectedOrganizations.map((org) => (
                                                                <Badge key={org} variant="secondary" className="px-2 py-1 text-xs">
                                                                    {org}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeOrganization(org)}
                                                                        className="ml-2 hover:text-red-500 transition-colors"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Search Bar */}
                                                    <div className="relative mb-3">
                                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            type="text"
                                                            placeholder="Search organizations..."
                                                            value={organizationSearch}
                                                            onChange={(e) => setOrganizationSearch(e.target.value)}
                                                            className="pl-10 h-9 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        {filteredOrganizations.length > 0 ? (
                                                            filteredOrganizations.slice(0, 10).map((org) => (
                                                                <div key={org} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={org}
                                                                        checked={selectedOrganizations.includes(org)}
                                                                        onCheckedChange={() => handleOrganizationToggle(org)}
                                                                        className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                                                    />
                                                                    <Label htmlFor={org} className="text-sm text-gray-700 cursor-pointer">
                                                                        {org}
                                                                    </Label>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-sm text-gray-500 text-center py-2">
                                                                No organizations found
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                <Button
                                    type="submit"
                                    className="w-full max-w-md h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    Create Account
                                </Button>
                            </div>
                        </form>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => gotoSignIn()}
                                className="text-sm text-blue-600 cursor-pointer hover:text-blue-700 transition-colors font-medium"
                            >
                                Already have an account? Sign in
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Password Dialog */}
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-white" />
                                </div>
                                Set Your Password
                            </DialogTitle>
                            <DialogDescription>
                                Complete your registration by setting a secure password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePasswordSet} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Password must be at least 8 characters long
                                </p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium"
                            >
                                Complete Registration
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}