# Carbon Tracker - Emissions Analysis Platform

A comprehensive carbon emissions tracking and analysis platform for monitoring Scope 3 emissions across suppliers, materials, and transportation.

## 🌟 Features

### 📊 Hotspot Analysis
- **Top Suppliers Tracking**: Monitor emissions from key suppliers with visual contribution breakdowns
- **Material Hotspots**: Analyze emissions by material type (Steel, Aluminum, Plastic, Cotton) with interactive charts
- **Transport Emissions**: Track emissions across different transport modes (Air, Truck, Ship, Rail)
- **Timeline Visualization**: View emissions trends over time

### 📥 Data Ingestion
- **Drag & Drop Upload**: Easy file upload interface for invoices and data files
- **Multiple Data Sources**: Support for Invoice, Transport, Supplier, and Electricity data
- **API Integrations**: Connect with logistics providers (DHL, Maersk, FedEx)
- **Status Tracking**: Real-time processing status for uploaded files

### 💡 Recommendations
- **Supplier Optimization**: Get recommendations to switch to lower-emission suppliers
- **Transport Mode Switching**: Analyze impact of changing from air to ship transport
- **Material Alternatives**: Explore recycled material options
- **What-If Scenarios**: Calculate potential savings from different strategies
- **Cost-Benefit Analysis**: View emissions reductions alongside cost implications

### 🧮 Carbon Calculation
- **Interactive Calculator**: Calculate emissions using Activity Data × Emission Factor
- **Visual Breakdowns**: Donut chart showing emissions by category (Materials, Transport, Packaging)
- **Emission Factor Database**: Comprehensive database with regional and material-specific factors
- **Confidence Ratings**: Track data quality with confidence indicators
- **Multiple Regions**: Support for EU, Europe, and global emission factors

### 🔍 Audit & Trust
- **Data Lineage Tracking**: Full transparency on data sources and calculations
- **Document Verification**: Upload and verify supporting documents
- **Source Attribution**: Clear citation of emission factors and databases
- **Confidence Scoring**: Rate data quality and reliability
- **Audit Reports**: Generate downloadable verification reports

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#4a7fb8` - Actions and primary elements
- **Success Green**: `#7cb860` - Positive indicators and eco-friendly options
- **Warning Yellow**: `#f4b740` - Caution and processing states
- **Error Red**: `#e74c3c` - Errors and critical alerts
- **Neutral Grays**: Light backgrounds and text hierarchy

### Typography
- **Font Family**: System fonts (-apple-system, Segoe UI, Roboto)
- **Headers**: 600 weight, 18-24px
- **Body**: 400 weight, 14-16px
- **Small Text**: 12-13px for metadata

### Components
- **Cards**: Elevated with subtle shadows and rounded corners
- **Tables**: Clean, striped rows with hover states
- **Badges**: Color-coded status indicators
- **Buttons**: Primary (blue), Secondary (green), Outline styles
- **Progress Bars**: Visual representation of percentages and contributions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
Hackathon1/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── HotspotAnalysis.tsx
│   │   ├── DataIngestion.tsx
│   │   ├── Recommendations.tsx
│   │   ├── CarbonCalculation.tsx
│   │   └── AuditTrust.tsx
│   ├── component/
│   │   ├── dashboard/
│   │   └── ui/
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
└── tsconfig.json
```

## 🎯 Use Cases

1. **Supply Chain Managers**: Track and optimize supplier emissions
2. **Sustainability Officers**: Monitor progress toward carbon reduction goals
3. **Procurement Teams**: Make data-driven decisions on supplier selection
4. **Auditors**: Verify carbon calculations with transparent data lineage
5. **Executives**: View high-level emissions dashboards and recommendations

## 📊 Data Sources

The platform supports multiple data input methods:
- **Manual Upload**: CSV, PDF files for invoices and reports
- **API Integration**: Direct connections to logistics providers
- **Database Import**: Bulk data from existing systems

## 🔐 Data Quality

- **Confidence Ratings**: High, Medium, Low indicators for data quality
- **Source Citations**: All emission factors cite authoritative databases (Ecoinvent, DEPA)
- **Verification Status**: Track processing status of all uploaded data
- **Audit Trail**: Complete lineage from source data to final calculations

## 🌍 Emission Factor Coverage

### Materials
- Steel, Aluminum, Plastic, Cotton
- Regional variations (EU, Europe, Global)

### Transport
- Air, Truck, Ship, Rail
- Mode-specific factors per ton-km

### Energy
- Regional grid electricity factors
- Renewable vs. conventional sources

## 🤝 Contributing

This is a hackathon project demonstrating carbon tracking capabilities.

## 📝 License

MIT License - Feel free to use and modify

## 🎨 Design Credits

UI design inspired by modern carbon accounting platforms with focus on:
- Clean, professional aesthetics
- Data visualization best practices
- Accessibility and usability
- Executive-friendly dashboards

---

Built with ❤️ for sustainable supply chains
</Parameter>
<parameter name="Complexity">5
