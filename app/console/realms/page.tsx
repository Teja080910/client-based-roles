'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Client } from '@/types/interfaces';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CreateClientDialog from '../clients/create-client-dialog';

export default function RealmsPage() {
  const [realms, setRealms] = useState([]);
  const [newRealm, setNewRealm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [realm, setRealm] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchRealms();
  }, []);

  const fetchRealms = async () => {
    const res = await fetch('/api/keycloak/realms');
    const data = await res.json();
    console.log('Fetched realms:', data);
    setRealms(data);
  };

  // fetch clients for a  selected realm
  const fetchClients = async (realm: string) => {
    const res = await fetch(`/api/keycloak/realms/clients?realm=${realm}`);
    const data = await res.json();
    console.log(`Fetched clients for realm ${realm}:`, data);
    setClients(data);
  };

  const createRealm = async () => {
    const res = await fetch('/api/keycloak/realms', {
      method: 'POST',
      body: JSON.stringify({ realm: newRealm }),
    });
    if (res.ok) {
      toast.success('Realm created successfully');
      setNewRealm('');
      setOpen(false);
      fetchRealms();
    } else {
      toast.error('Failed to create realm');
    }
  };

  const deleteRealm = async (realm: string) => {
    const res = await fetch(`/api/keycloak/realms`, {
      method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ realm }),
    });
    if (res.ok) {
      toast.success(`Deleted realm: ${realm}`);
      fetchRealms();
    } else {
      toast.error(`Failed to delete ${realm}`);
    }
  };

  const deleteClient = async (clientId: string) => {
    const res = await fetch(`/api/keycloak/realms/clients`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId }),
    });
    if (res.ok) {
      toast.success(`Deleted client: ${clientId}`);
      fetchClients(realm);
    } else {
      toast.error(`Failed to delete client: ${clientId}`);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Realms</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Realm</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Realm</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Realm name"
              value={newRealm}
              onChange={(e) => setNewRealm(e.target.value)}
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createRealm}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="single" collapsible className="w-full" onValueChange={(value) => {
        if (value) {
          setClients([])
          setRealm(value);
          fetchClients(value);
        }
      }}>
        {realms.map((realm: any) => (
          <AccordionItem key={realm.id} value={realm.realm}>
            <AccordionTrigger>{realm.realm}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {/* Actions: Edit / Delete */}
                <div className="flex justify-end space-x-2">
                  <Dialog
                    open={selectedRealm === realm.realm}
                    onOpenChange={(open) =>
                      setSelectedRealm(open ? realm.realm : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Realm (Not Supported)</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm text-muted-foreground">
                        Keycloak does not allow renaming realms directly. You must
                        export the realm and re-import under a new name.
                      </p>
                      <DialogFooter className="mt-4">
                        <Button onClick={() => setSelectedRealm(null)}>OK</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    onClick={() => deleteRealm(realm.realm)}
                  >
                    Delete
                  </Button>
                </div>

                {/* Clients */}
                <div className="border rounded-xl bg-muted/40 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-primary">Clients</h2>
                    <div className='flex items-center gap-8'>
                      <CreateClientDialog fetchData={() => fetchClients(realm)} />
                      <span className="text-sm text-muted-foreground">
                        {clients?.length ?? 0} {clients?.length === 1 ? "client" : "clients"}
                      </span>
                    </div>
                  </div>

                  {clients && clients.length > 0 ? (
                    <ul className="space-y-2">
                      {clients.map((client: any) => (
                        <li
                          key={client.id}
                          className="flex items-center justify-between bg-white dark:bg-background border rounded-lg p-3 hover:shadow transition"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm text-foreground">
                              {client.clientId}
                            </span>
                            {/* Optional client description or type */}
                            {client.description && (
                              <span className="text-xs text-muted-foreground">
                                – {client.description}
                              </span>
                            )}
                          </div>

                          {/* Actions (optional) */}
                          <div className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => router.push(`/console/clients/${client.clientId}`)}>
                              View
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteClient(client.id)}>
                              Delete
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No clients found for this realm.
                    </div>
                  )}
                </div>

              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
