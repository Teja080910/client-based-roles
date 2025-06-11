import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function CopyClientDialog({ open, setOpen, newCopyClient, CopyClient }: { open: boolean; setOpen: (open: boolean) => void; newCopyClient: any; CopyClient: ()=> void }) {
    const [clientId, setClientId] = useState("");
    const [name, setName] = useState("");
    const handleCreate = async () => {
        if (!clientId || !name) {
            alert("Please fill in both Client ID and Name.");
            return;
        }

        if (newCopyClient && Object.keys(newCopyClient).length === 0) {
            alert("No client data to copy. Please provide valid data.");
            return;
        }

        try {
            const response = await fetch('/api/keycloak/clients/copy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clientId: clientId,
                    name: name,
                    copyData: newCopyClient
                })
            });
            if (response.ok) {
                console.log('Client copied successfully:', await response.json());
            } else {
                console.error('Failed to copy client:', await response.json());
            }
        } catch (error) {
            console.error('Error copying client:', error);
        }
    }
    return (
        <Dialog open={open} >
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={()=> CopyClient()}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Client
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
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}