'use client';

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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function RealmsPage() {
  const [realms, setRealms] = useState([]);
  const [newRealm, setNewRealm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);

  const fetchRealms = async () => {
    const res = await fetch('/api/keycloak/realms');
    const data = await res.json();
    setRealms(data);
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
      body: JSON.stringify({ realm }),
    });
    if (res.ok) {
      toast.success(`Deleted realm: ${realm}`);
      fetchRealms();
    } else {
      toast.error(`Failed to delete ${realm}`);
    }
  };

  useEffect(() => {
    fetchRealms();
  }, []);

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

      <div className="grid gap-2">
        {realms.length > 0 && realms?.map((realm: any) => (
          <div
            key={realm.id}
            className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
          >
            <div>{realm.realm}</div>
            <div className="space-x-2">
              {/* Simulated edit */}
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
          </div>
        ))}
      </div>
    </div>
  );
}
