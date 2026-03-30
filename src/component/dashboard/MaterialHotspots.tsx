interface Material {
    id: string;
    name: string;
    percentage: number;
    emissions: number;
}

interface MaterialHotspotsProps {
    materials: Material[];
    totalEmissions: number;
}

const barColors = [
    "bg-chart-bar-1",
    "bg-chart-bar-2",
    "bg-chart-bar-3",
    "bg-chart-bar-4",
];

const emissionBadgeColors = [
    "bg-emission-badge-1 text-white",
    "bg-emission-badge-2 text-white",
    "bg-emission-badge-3 text-white",
    "bg-emission-badge-4 text-white",
];

export function MaterialHotspots({ materials, totalEmissions }: MaterialHotspotsProps) {
    const months = ["Jan", "Mar", "May", "Sep", "Tue", "Nov"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Bar chart */}
            <div>
                <div className="mb-6">
                    <span className="text-muted-foreground">CO<sub>2</sub>e: </span>
                    <span className="text-2xl font-bold text-foreground">
                        {totalEmissions.toLocaleString()} tCO<sub>2</sub>e
                    </span>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-foreground">1,500 tCO<sub>2</sub>ee</span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                        89, O<sub>2</sub>e
                    </span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">≈⚙️D:3-cXO</span>
                </div>

                <div className="space-y-4">
                    {materials.map((material, index) => (
                        <div key={material.id} className="flex items-center gap-4">
                            <span className="w-20 text-foreground font-medium">{material.name}</span>
                            <div className="flex-1 flex items-center gap-3">
                                <div className="flex-1 h-6 bg-muted rounded overflow-hidden relative">
                                    <div
                                        className={`h-full ${barColors[index % barColors.length]} rounded transition-all duration-700 flex items-center justify-center`}
                                        style={{ width: `${material.percentage}%` }}
                                    >
                                        <span className="text-white text-xs font-medium">{material.percentage}%</span>
                                    </div>
                                </div>
                                <span className="text-foreground w-10 text-right">{material.percentage}%</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-4 text-sm text-muted-foreground px-24">
                    {months.map((month) => (
                        <span key={month}>{month}</span>
                    ))}
                </div>
            </div>

            {/* Right side - Emissions badges */}
            <div>
                <div className="flex gap-2 mb-6 flex-wrap">
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-foreground">9.1,00<sub>4</sub>↵</span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground flex items-center gap-1">
                        ≙ Tme
                    </span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">⚙️ Srvgo</span>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">≣ 1bal</span>
                    <span className="text-muted-foreground">›</span>
                </div>

                <div className="space-y-4">
                    {materials.map((material, index) => (
                        <div key={material.id} className="flex items-center h-6">
                            <div className="flex-1">
                                <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${emissionBadgeColors[index % emissionBadgeColors.length]}`}>
                                    {material.emissions} tCO<sub>2</sub>e
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                    <span>Jan</span>
                    <span>Mar↓</span>
                    <span>Sue₸</span>
                    <span>Nov</span>
                </div>
            </div>
        </div>
    );
}