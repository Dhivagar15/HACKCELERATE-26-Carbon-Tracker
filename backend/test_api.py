import requests
import json
import io

# Test the ScopeZero Backend API
BASE_URL = "http://localhost:8000/api"

def test_backend():
    print("🧪 Testing ScopeZero Backend API...")
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/dashboard")
        print(f"Server is running - Status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print(" Server is not running. Please start the backend first.")
        return
    
    # Test 2: Get emission factors
    print("\n Testing emission factors...")
    response = requests.get(f"{BASE_URL}/emission-factors")
    if response.status_code == 200:
        factors = response.json()
        print(f" Found {len(factors['materials'])} material factors")
        print(f" Found {len(factors['transport'])} transport factors")
    else:
        print(f" Failed to get emission factors: {response.status_code}")
    
    # Test 3: Upload sample CSV
    print("\n Testing CSV upload...")
    sample_csv = """Date,Supplier,Material,Weight,Distance,TransportMode,Region
2024-01-15,Tesla Energy,Aluminum,1500,800,Cargo Ship,North America
2024-02-10,Global Steel Co,Steel,3000,1200,Heavy Duty Truck,Asia
2024-03-05,EcoPlastic Ltd,Plastic,800,2400,Air Cargo,Europe"""
    
    files = {'file': ('test_data.csv', io.StringIO(sample_csv), 'text/csv')}
    response = requests.post(f"{BASE_URL}/upload", files=files)
    
    if response.status_code == 200:
        result = response.json()
        print(f" Upload successful: {result['records_processed']} records processed")
        print(f"   Suppliers detected: {result['suppliers_detected']}")
        print(f"   Materials detected: {result['materials_detected']}")
    else:
        print(f" Upload failed: {response.status_code}")
        print(response.text)
    
    # Test 4: Get dashboard data
    print("\n Testing dashboard data...")
    response = requests.get(f"{BASE_URL}/dashboard")
    if response.status_code == 200:
        dashboard = response.json()
        print(f" Total emissions: {dashboard['total_emissions']} kg CO2e")
        print(f"   Suppliers: {len(dashboard['suppliers'])}")
        print(f"   Materials: {len(dashboard['materials'])}")
        print(f"   Transport modes: {len(dashboard['transport_modes'])}")
    else:
        print(f" Dashboard failed: {response.status_code}")
    
    # Test 5: Get recommendations
    print("\n Testing recommendations...")
    response = requests.get(f"{BASE_URL}/recommendations")
    if response.status_code == 200:
        recommendations = response.json()
        print(f" Generated {len(recommendations)} recommendations")
        for rec in recommendations[:2]:  # Show first 2
            print(f"   - {rec['title']}: {rec['reduction_absolute']} kg CO2e reduction")
    else:
        print(f" Recommendations failed: {response.status_code}")
    
    # Test 6: Get audit info
    print("\n Testing audit information...")
    response = requests.get(f"{BASE_URL}/audit")
    if response.status_code == 200:
        audit = response.json()
        print(f" Audit data retrieved:")
        print(f"   Total records: {audit['total_records']}")
        print(f"   Data quality score: {audit['data_quality_score']}%")
        print(f"   Completeness: {audit['completeness_score']}%")
    else:
        print(f" Audit failed: {response.status_code}")
    
    print("\n Backend testing completed!")
    print("\nNext steps:")
    print("1. Update your React frontend to use these API endpoints")
    print("2. Replace DataContext calculations with API calls")
    print("3. Test CSV upload from the UI")

if __name__ == "__main__":
    test_backend()