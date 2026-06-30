

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecobin_core.settings')
django.setup()

from api.models import WasteCategory, SmartBin

def seed():
    print("Seeding EcoBin initial platform variables...")
    
    # 1. Base Waste Categories
    categories = [
        {"name": "Plastic", "desc": "PET bottles, containers, clean wrappers."},
        {"name": "Organic", "desc": "Food scraps, yard waste, compostable items."},
        {"name": "Paper/Cardboard", "desc": "Cardboard boxes, office paper, newspapers."},
        {"name": "Electronic (E-Waste)", "desc": "Old devices, batteries, broken circuits."}
    ]
    
    for cat in categories:
        obj, created = WasteCategory.objects.get_or_create(
            category_name=cat["name"],
            defaults={"description": cat["desc"]}
        )
        if created:
            print(f"Created category: {cat['name']}")

    # 2. Mock IoT Smart Bins
    bins = [
        {"loc": "Downtown Shopping Center Gate A", "cap": 100.0, "lat": 40.7128, "lng": -74.0060},
        {"loc": "Residential Suburb Block C Park", "cap": 80.0, "lat": 40.7250, "lng": -73.9920},
        {"loc": "University Tech Campus Hub", "cap": 120.0, "lat": 40.7010, "lng": -74.0150}
    ]
    
    for b in bins:
        obj, created = SmartBin.objects.get_or_create(
            location=b["loc"],
            defaults={"capacity": b["cap"], "latitude": b["lat"], "longitude": b["lng"], "fill_level": 0.0}
        )
        if created:
            print(f"Provisioned Smart Bin at: {b['loc']}")

    print("Data seeding completed successfully! Backend is ready.")

if __name__ == '__main__':
    seed()