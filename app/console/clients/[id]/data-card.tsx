import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DataCard({ title, data, type, icon: Icon, searchTerm }: { title: string; data: any[]; type: string; icon: React.ElementType; searchTerm: string; }) {
    const filteredData = data?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="h-fit">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5" />
                    {title}
                    <Badge variant="secondary" className="ml-auto">
                        {filteredData?.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {filteredData?.map((item) => (
                    <div key={item?.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            {type === 'roles' && (
                                <Badge variant={item.composite ? "default" : "secondary"}>
                                    {item.composite ? 'Composite' : 'Simple'}
                                </Badge>
                            )}
                            {type === 'policies' && (
                                <Badge variant="outline">{item.type}</Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        {item.uri && (
                            <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                                {item.uri}
                            </div>
                        )}
                        {item.protocol && (
                            <Badge variant="outline" className="text-xs">{item.protocol}</Badge>
                        )}
                        {type === "resources" && item.scopes?.length > 0 && (
                            <div className="flex gap-2 items-center">
                                <div>Scopes:</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                {item.scopes.map((scope: any) => (
                                    <Badge key={scope.id || scope.name} variant="outline" className="text-xs">
                                        {scope.name}
                                    </Badge>
                                ))}
                            </div>
                            </div>
                        )}

                    </div>
                ))}
            </CardContent>
        </Card>
    );
}