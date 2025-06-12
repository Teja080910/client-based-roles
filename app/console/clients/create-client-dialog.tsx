import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateClientDialog({ fetchData }: { fetchData: (e: string) => void }) {
    const [clientId, setClientId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);

    const handleCreate = async () => {
        if (!clientId || !name) {
            alert("Please fill in both Client ID and Name.");
            return;
        }
        try {
            const response = await fetch('/api/keycloak/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: clientId,
                    name: name,
                    description: description
                })
            });
            if (response.ok) {
                console.log('Client created successfully:', await response.json());
                fetchData(clientId);
                setOpen(false);
            } else {
                console.error('Failed to create client:', await response.json());
                alert('Failed to create client. Please try again.');
            }
        } catch (error) {
            console.error('Error creating client:', error);
            alert('An error occurred while creating the client. Please try again.');
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-black hover:text-white hover:bg-blue-700 cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Client
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Client</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Client ID"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                    />
                    <Input
                        placeholder="Client Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Client Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
