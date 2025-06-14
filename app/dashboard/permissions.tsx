import { ChevronRight, Shield, X } from 'lucide-react';

export interface Permissions {
  rsid: string;
  rsname: string;
  scopes: string[];
}

export const PermissionMatrix = ({ actions, clientName }: { actions: Permissions[], clientName: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Available Actions in {clientName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Based on your assigned roles and permissions
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {actions.length === 0 ? (
          <div className="text-center py-8">
            <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Permissions Available</h4>
            <p className="text-gray-500">You don't have any permissions for this client application.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {actions.map((permission, index) => (
              <div
                key={`${permission.rsid}-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Resource Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 capitalize">
                          {permission.rsname}
                        </h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {permission?.scopes?.length} Action{permission?.scopes?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {permission?.scopes?.map((scope, scopeIndex) => {

                    return (
                      <div
                        key={`${scope}-${scopeIndex}`}
                        className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h5 className={`text-sm font-medium }`}>
                                  {scope.split(':')[1]}
                                </h5>
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                                  {scope}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )
        }      </div>
    </div>
  );
}