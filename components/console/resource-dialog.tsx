"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CreateResourceDialog({ fetchData }: { fetchData: () => void }) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [uri, setUri] = useState("");
  const resourceTypes = [
    { label: "Default", value: "urn:default" },
    { label: "User Profile", value: "urn:user-profile" },
    { label: "Finance", value: "urn:finance:resource" },
    { label: "Custom", value: "custom" },
  ];

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/keycloak/clients");
        const data = await res.json();
        setClients(data || []);
        fetchData();
      } catch (err) {
        toast.error("Failed to fetch clients");
      }
    };

    fetchClients();
  }, []);

  const handleCreate = async () => {
    if (!selectedClientId) return toast.error("Please select a client");

    try {
      const res = await fetch("/api/keycloak/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: selectedClientId,
          name,
          type,
          uri,
          ownerManagedAccess: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create resource");
      }

      toast.success("✅ Resource created");
      setOpen(false);
      setSelectedClientId("");
      setName("");
      setType("");
      setUri("");
    } catch (err: any) {
      toast.error("❌ " + err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Resource
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Resource</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedClientId} value={selectedClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.clientId} value={client}>
                  {client.clientId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Resource Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select onValueChange={setType} value={type}>
            <SelectTrigger>
              <SelectValue placeholder="Select Resource Type" />
            </SelectTrigger>
            <SelectContent>
              {resourceTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="URI (optional)"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
