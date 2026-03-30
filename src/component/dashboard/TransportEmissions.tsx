import { Badge } from "@/components/ui/badge";

interface TransportMode {
    id: string;
    mode: string;
    emissions: number;
}

interface TransportEmissionsProps {
    modes: TransportMode[];
}

export function TransportEmissions({ modes }: TransportEmissionsProps) {
    return (
        <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Transport Emissions</h3>
            <div className="space-y-3">
                {modes.map((transport) => (
                    <div key={transport.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Badge variant="mode" className="text-xs">Mode</Badge>
                            <span className="text-foreground">{transport.mode}</span>
                        </div>
                        <span className="text-muted-foreground">
                            {transport.emissions.toLocaleString()} tCO<sub>2</sub>e
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}