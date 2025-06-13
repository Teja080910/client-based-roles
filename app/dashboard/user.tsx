import { Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

export interface Roles {
    id: string;
    name: string;
    description: string;
}

export const UserProfile = ({roles}: {roles: Roles[] }) => {
    const { session } = useAuth();
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{session?.user?.username}</h3>
          <p className="text-sm text-gray-500">{session?.user?.email}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Assigned Roles</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles?.map((role:any) => (
            <span
              key={role.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {role.name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};