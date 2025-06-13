import { Client } from '@/types/interfaces';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export const ClientSelector = ({ clients, onClientSelect }: { clients: Client[], onClientSelect: (client: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client>({ clientId: 'AOL', name: '' } as Client);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
                <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900">
                        {selectedClient ? selectedClient.clientId : 'Select a client'}
                    </span>
                    {selectedClient && (
                        <span className="text-xs text-gray-500">{selectedClient.name}</span>
                    )}
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="py-1">
                        {clients.map((client) => (
                            <button
                                key={client.id}
                                onClick={() => {
                                    onClientSelect(client.clientId);
                                    setSelectedClient(client);
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">{client.clientId}</span>
                                    <span className="text-xs text-gray-500">{client.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};