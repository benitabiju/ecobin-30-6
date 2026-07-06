import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecobin_core.settings')
django.setup()

from api.models import WasteCategory

wasteCategoriesStr = """
[
  {
    "id": "CAT-MHW",
    "name": "Municipal & Household Waste",
    "icon": "Home",
    "description": "Everyday items discarded by the public.",
    "items": [
      {
        "name": "General Household Waste",
        "description": "Non-recyclable household items, mixed garbage.",
        "type": "General Waste",
        "method": "Municipal Bin",
        "statusBadge": "bg-gray-100 text-gray-800"
      },
      {
        "name": "Used Sponges & Scrubbers",
        "description": "Synthetic kitchen sponges and cleaning pads.",
        "type": "General Waste",
        "method": "Municipal Bin",
        "statusBadge": "bg-gray-100 text-gray-800"
      },
      {
        "name": "Broken Ceramics",
        "description": "Plates, mugs, and non-recyclable glassware.",
        "type": "General Waste",
        "method": "Wrap safely, Municipal Bin",
        "statusBadge": "bg-gray-100 text-gray-800"
      }
    ]
  },
  {
    "id": "CAT-OFW",
    "name": "Organic & Food Waste",
    "icon": "Leaf",
    "description": "Biodegradable waste from food preparation and gardens.",
    "items": [
      {
        "name": "Vegetable & Fruit Peels",
        "description": "Organic remains from kitchen prep.",
        "type": "Compostable",
        "method": "Compost Bin / Green Bin",
        "statusBadge": "bg-green-100 text-green-800"
      },
      {
        "name": "Coffee Grounds & Tea Bags",
        "description": "Used coffee and plastic-free tea bags.",
        "type": "Compostable",
        "method": "Compost Bin",
        "statusBadge": "bg-green-100 text-green-800"
      },
      {
        "name": "Garden Trimmings",
        "description": "Leaves, grass, and small branches.",
        "type": "Compostable",
        "method": "Green Bin / Yard Waste",
        "statusBadge": "bg-green-100 text-green-800"
      }
    ]
  },
  {
    "id": "CAT-REC",
    "name": "Recyclable Waste",
    "icon": "Recycle",
    "description": "General sorted materials ready for the recycling plant.",
    "items": [
      {
        "name": "Mixed Recyclables",
        "description": "Clean, mixed recyclable items.",
        "type": "Recyclable",
        "method": "Blue Bin / Recycling Depot",
        "statusBadge": "bg-blue-100 text-blue-800"
      }
    ]
  },
  {
    "id": "CAT-PLAST",
    "name": "Plastic Waste",
    "icon": "Package",
    "description": "All plastic resin types, from bottles to packaging.",
    "items": [
      {
        "name": "PET (Type 1)",
        "description": "Water bottles, clear plastic cups.",
        "type": "Recyclable",
        "method": "Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "HDPE (Type 2)",
        "description": "Milk jugs, shampoo bottles.",
        "type": "Recyclable",
        "method": "Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "PVC (Type 3)",
        "description": "Pipes, shower curtains. Rarely recyclable curbside.",
        "type": "General Waste",
        "method": "Specialized Drop-off / Trash",
        "statusBadge": "bg-gray-100 text-gray-800"
      },
      {
        "name": "LDPE (Type 4)",
        "description": "Grocery bags, cling wrap.",
        "type": "Recyclable",
        "method": "Store Drop-off",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "PP (Type 5)",
        "description": "Yogurt containers, straws.",
        "type": "Recyclable",
        "method": "Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "PS (Type 6 - Styrofoam)",
        "description": "Takeout containers, packing peanuts.",
        "type": "General Waste",
        "method": "Specialized Drop-off / Trash",
        "statusBadge": "bg-gray-100 text-gray-800"
      },
      {
        "name": "Other Plastics (Type 7)",
        "description": "Mixed plastics, acrylic, nylon.",
        "type": "General Waste",
        "method": "Check local guidelines",
        "statusBadge": "bg-gray-100 text-gray-800"
      }
    ]
  },
  {
    "id": "CAT-PAP",
    "name": "Paper & Cardboard",
    "icon": "FileText",
    "description": "Paper products, boxes, and reading materials.",
    "items": [
      {
        "name": "Corrugated Cardboard",
        "description": "Shipping boxes, flattened and dry.",
        "type": "Recyclable",
        "method": "Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "Newspapers & Magazines",
        "description": "Clean, unsoiled paper.",
        "type": "Recyclable",
        "method": "Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "Shredded Paper",
        "description": "Secure documents, shredded.",
        "type": "Recyclable",
        "method": "Paper Bag inside Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      }
    ]
  },
  {
    "id": "CAT-GLS",
    "name": "Glass",
    "icon": "GlassWater",
    "description": "Glass bottles and jars.",
    "items": [
      {
        "name": "Clear Glass Bottles",
        "description": "Beverage bottles, rinsed.",
        "type": "Recyclable",
        "method": "Glass Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "Colored Glass (Brown/Green)",
        "description": "Beer and wine bottles.",
        "type": "Recyclable",
        "method": "Glass Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      }
    ]
  },
  {
    "id": "CAT-MET",
    "name": "Metals",
    "icon": "Hammer",
    "description": "Aluminum, steel, and tin.",
    "items": [
      {
        "name": "Aluminum Cans",
        "description": "Soda and beer cans, empty and rinsed.",
        "type": "Recyclable",
        "method": "Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "Steel / Tin Cans",
        "description": "Soup and food cans.",
        "type": "Recyclable",
        "method": "Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "Scrap Metal",
        "description": "Large metal items, pipes.",
        "type": "Recyclable",
        "method": "Scrap Yard Drop-off",
        "statusBadge": "bg-blue-100 text-blue-800"
      }
    ]
  },
  {
    "id": "CAT-EW",
    "name": "E-Waste",
    "icon": "Monitor",
    "description": "Electronic devices and appliances.",
    "items": [
      {
        "name": "Laptops & Computers",
        "description": "Old or broken computer hardware.",
        "type": "Hazardous",
        "method": "E-Waste Drop-off",
        "statusBadge": "bg-red-100 text-red-800"
      },
      {
        "name": "Smartphones & Tablets",
        "description": "Mobile devices and chargers.",
        "type": "Hazardous",
        "method": "E-Waste Drop-off",
        "statusBadge": "bg-red-100 text-red-800"
      },
      {
        "name": "Televisions",
        "description": "CRTs, LCDs, and plasma screens.",
        "type": "Hazardous",
        "method": "Special E-Waste Collection",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-BAT",
    "name": "Battery Waste",
    "icon": "Battery",
    "description": "Rechargeable and single-use batteries.",
    "items": [
      {
        "name": "Lithium-Ion Batteries",
        "description": "Found in phones, laptops, and power tools. High fire risk.",
        "type": "Hazardous",
        "method": "Battery Drop-off Location",
        "statusBadge": "bg-red-100 text-red-800"
      },
      {
        "name": "Alkaline Batteries",
        "description": "Standard AA, AAA, C, D cells.",
        "type": "Hazardous",
        "method": "Battery Drop-off Location",
        "statusBadge": "bg-red-100 text-red-800"
      },
      {
        "name": "Lead-Acid Batteries",
        "description": "Car and UPS batteries.",
        "type": "Hazardous",
        "method": "Auto Parts Store / Scrap Yard",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-CND",
    "name": "Construction & Demolition Waste",
    "icon": "HardHat",
    "description": "Debris from building, renovating, or tearing down structures.",
    "items": [
      {
        "name": "Concrete & Rubble",
        "description": "Crushed stone, brick, and concrete.",
        "type": "Recyclable",
        "method": "C&D Recycling Facility",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "Drywall & Gypsum",
        "description": "Wallboard from construction.",
        "type": "General Waste",
        "method": "C&D Disposal",
        "statusBadge": "bg-gray-100 text-gray-800"
      }
    ]
  },
  {
    "id": "CAT-IND",
    "name": "Industrial Waste",
    "icon": "Factory",
    "description": "Waste produced by industrial activity.",
    "items": [
      {
        "name": "Industrial Sludge",
        "description": "Semi-solid by-products from manufacturing.",
        "type": "Hazardous",
        "method": "Licensed Industrial Disposal",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-AGR",
    "name": "Agricultural Waste",
    "icon": "Tractor",
    "description": "Waste from farming and agricultural operations.",
    "items": [
      {
        "name": "Crop Residue",
        "description": "Stalks, stems, and leaves post-harvest.",
        "type": "Compostable",
        "method": "On-site Composting / Mulch",
        "statusBadge": "bg-green-100 text-green-800"
      },
      {
        "name": "Pesticide Containers",
        "description": "Empty, rinsed chemical jugs.",
        "type": "Hazardous",
        "method": "Agricultural Hazmat Drop-off",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-MED",
    "name": "Biomedical & Medical Waste",
    "icon": "Cross",
    "description": "Waste from healthcare facilities.",
    "items": [
      {
        "name": "Used Syringes & Sharps",
        "description": "Needles and scalpels.",
        "type": "Biomedical",
        "method": "Certified Sharps Container",
        "statusBadge": "bg-purple-100 text-purple-800"
      },
      {
        "name": "Biohazard Bags",
        "description": "Blood-soaked bandages and materials.",
        "type": "Biomedical",
        "method": "Incineration via Certified Carrier",
        "statusBadge": "bg-purple-100 text-purple-800"
      }
    ]
  },
  {
    "id": "CAT-HAZ",
    "name": "Hazardous Waste",
    "icon": "AlertTriangle",
    "description": "Dangerous, toxic, or flammable household or commercial items.",
    "items": [
      {
        "name": "Fluorescent Tubes",
        "description": "Contain small amounts of mercury.",
        "type": "Hazardous",
        "method": "Hazmat Drop-off",
        "statusBadge": "bg-red-100 text-red-800"
      },
      {
        "name": "Paint & Solvents",
        "description": "Oil-based paints and thinners.",
        "type": "Hazardous",
        "method": "Hazmat Drop-off",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-RAD",
    "name": "Radioactive Waste",
    "icon": "Radiation",
    "description": "Materials emitting ionizing radiation.",
    "items": [
      {
        "name": "Medical Isotopes",
        "description": "Low-level waste from treatments.",
        "type": "Hazardous",
        "method": "Specialized Radioactive Disposal",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-CHEM",
    "name": "Chemical Waste",
    "icon": "FlaskConical",
    "description": "Unused or expired chemical reagents.",
    "items": [
      {
        "name": "Lab Chemicals",
        "description": "Acids, bases, and reactive materials.",
        "type": "Hazardous",
        "method": "Certified Chemical Disposal",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-TEX",
    "name": "Textile Waste",
    "icon": "Shirt",
    "description": "Clothing, fabrics, and rags.",
    "items": [
      {
        "name": "Used Clothing",
        "description": "Wearable or unwearable garments.",
        "type": "Recyclable",
        "method": "Textile Donation / Recycling Bin",
        "statusBadge": "bg-blue-100 text-blue-800"
      }
    ]
  },
  {
    "id": "CAT-RUB",
    "name": "Rubber Waste",
    "icon": "Car",
    "description": "Tires and industrial rubber.",
    "items": [
      {
        "name": "Old Tires",
        "description": "Car, truck, and bike tires.",
        "type": "Recyclable",
        "method": "Tire Recycling Center",
        "statusBadge": "bg-blue-100 text-blue-800"
      }
    ]
  },
  {
    "id": "CAT-WOOD",
    "name": "Wood Waste",
    "icon": "TreePine",
    "description": "Lumber and branches.",
    "items": [
      {
        "name": "Untreated Wood",
        "description": "Clean pallets and off-cuts.",
        "type": "Recyclable",
        "method": "Wood Recycling Facility",
        "statusBadge": "bg-blue-100 text-blue-800"
      },
      {
        "name": "Treated Wood",
        "description": "Painted or pressure-treated lumber.",
        "type": "General Waste",
        "method": "Landfill / Specialized Disposal",
        "statusBadge": "bg-gray-100 text-gray-800"
      }
    ]
  },
  {
    "id": "CAT-FOOD",
    "name": "Food Industry Waste",
    "icon": "Utensils",
    "description": "Waste from restaurants and food processing.",
    "items": [
      {
        "name": "Used Cooking Oil",
        "description": "Fats, oils, and grease (FOG).",
        "type": "Recyclable",
        "method": "Oil Recycling Collection",
        "statusBadge": "bg-blue-100 text-blue-800"
      }
    ]
  },
  {
    "id": "CAT-MINE",
    "name": "Mining Waste",
    "icon": "Mountain",
    "description": "Tailings and mine rock.",
    "items": [
      {
        "name": "Mine Tailings",
        "description": "Residue of ore processing.",
        "type": "Hazardous",
        "method": "Tailing Ponds",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-MAR",
    "name": "Marine Waste",
    "icon": "Anchor",
    "description": "Debris found in or from the ocean.",
    "items": [
      {
        "name": "Fishing Nets",
        "description": "Discarded 'ghost' nets.",
        "type": "Recyclable",
        "method": "Specialized Marine Recycling",
        "statusBadge": "bg-blue-100 text-blue-800"
      }
    ]
  },
  {
    "id": "CAT-AUTO",
    "name": "Automotive Waste",
    "icon": "Wrench",
    "description": "Car parts and fluids.",
    "items": [
      {
        "name": "Used Engine Oil",
        "description": "Contaminated motor oil.",
        "type": "Hazardous",
        "method": "Auto Parts Store Recycling",
        "statusBadge": "bg-red-100 text-red-800"
      }
    ]
  },
  {
    "id": "CAT-MISC",
    "name": "Miscellaneous Waste",
    "icon": "MoreHorizontal",
    "description": "Items that don't fit into standard categories.",
    "items": [
      {
        "name": "Mixed Trash",
        "description": "Unidentifiable or heavily mixed debris.",
        "type": "General Waste",
        "method": "Municipal Bin",
        "statusBadge": "bg-gray-100 text-gray-800"
      }
    ]
  }
]
"""

wasteCategories = json.loads(wasteCategoriesStr)

print("Seeding waste categories...")
for cat_data in wasteCategories:
    cat, created = WasteCategory.objects.get_or_create(
        category_name=cat_data["name"],
        defaults={
            "description": cat_data["description"],
            "icon": cat_data["icon"],
            "items": cat_data["items"]
        }
    )
    if not created:
        cat.description = cat_data["description"]
        cat.icon = cat_data["icon"]
        cat.items = cat_data["items"]
        cat.save()

print(f"Successfully seeded {len(wasteCategories)} categories!")
