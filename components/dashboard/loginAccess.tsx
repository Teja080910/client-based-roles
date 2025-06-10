"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowRight, User, Key, Globe } from "lucide-react";

interface LoginAccessProps {
  title?: string;
  description?: string;
  onLoginClick?: () => void;
  showFeatures?: boolean;
}

export default function LoginAccess({ 
  title = "Authentication Required",
  description = "Please log in to access this content and manage your account.",
  onLoginClick,
  showFeatures = true
}: LoginAccessProps) {
  
  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      // Default behavior - redirect to login page
      window.location.href = '/';
    }
  };

  const features = [
    {
      icon: User,
      title: "User Management",
      description: "Manage user accounts, roles, and permissions"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Control access with granular role assignments"
    },
    {
      icon: Globe,
      title: "Multi-Organization",
      description: "Support for multiple organizations and countries"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl shadow-blue-500/10">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {title}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                {description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Features Section */}
            {showFeatures && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div 
                      key={index}
                      className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Login Button */}
            <div className="text-center space-y-4">
              <Button 
                onClick={handleLoginClick}
                className="w-full max-w-sm h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <Key className="w-5 h-5 mr-3" />
                Login to Continue
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              
              <p className="text-sm text-gray-500">
                Secure authentication powered by enterprise-grade security
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Secure Access</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Your data is protected with industry-standard encryption and multi-factor authentication. 
                    All access attempts are logged and monitored for security.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}