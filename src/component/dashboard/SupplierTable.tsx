import { Package, Box, PlusCircle } from "lucide-react";

interface Supplier {
    id: string;
    name: string;
    icon: "package" | "box" | "plus";
    emissions: number;
    contribution: number;
    region: string;
}

interface SupplierTableProps {
    suppliers: Supplier[];
}

const iconMap = {
    package: Package,
    box: Box,
    plus: PlusCircle,
};

const iconColors = {
    package: "text-amber-500",
    box: "text-emerald-500",
    plus: "text-blue-500",
};

export function SupplierTable({ suppliers }: SupplierTableProps) {
    return (
        <div className="overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left py-4 px-4 font-medium text-muted-foreground">Supplier</th>
                        <th className="text-left py-4 px-4 font-medium text-muted-foreground">Emissions</th>
                        <th className="text-left py-4 px-4 font-medium text-muted-foreground">Contribution</th>
                        <th className="text-left py-4 px-4 font-medium text-muted-foreground">Region</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => {
                        const Icon = iconMap[supplier.icon];
                        return (
                            <tr key={supplier.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <Icon className={`h-5 w-5 ${iconColors[supplier.icon]}`} />
                                        <span className="font-medium text-foreground">{supplier.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="font-semibold text-foreground">
                                        {supplier.emissions.toLocaleString()} tCO<sub>2</sub>e
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-foreground">{supplier.contribution}%</span>
                                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-contribution-bar rounded-full transition-all duration-500"
                                                style={{ width: `${supplier.contribution}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-foreground">{supplier.region}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}