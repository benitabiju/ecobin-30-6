from django.core.management.base import BaseCommand
from api.models import WasteCategory
import uuid

class Command(BaseCommand):
    help = 'Seed the database with comprehensive waste categories and nested items'

    def handle(self, *args, **kwargs):
        categories_data = [
            {
                "name": "Municipal & Household Waste",
                "icon": "Trash2",
                "description": "General non-hazardous waste generated from households and local businesses.",
                "items": [
                    {
                        "name": "General Trash",
                        "description": "Non-recyclable household items like wrappers and broken toys.",
                        "type": "General Waste",
                        "method": "Dispose of in the regular trash bin for landfill or incineration.",
                        "statusBadge": "bg-gray-100 text-gray-700"
                    },
                    {
                        "name": "Soiled Paper",
                        "description": "Paper towels, tissues, and greasy pizza boxes.",
                        "type": "General Waste",
                        "method": "Cannot be recycled. Place in general waste or compost if applicable.",
                        "statusBadge": "bg-gray-100 text-gray-700"
                    },
                    {
                        "name": "Composite Packaging",
                        "description": "Packaging made of multiple mixed materials (e.g. foil-lined chip bags).",
                        "type": "Non-Recyclable",
                        "method": "Place in the general waste bin.",
                        "statusBadge": "bg-gray-100 text-gray-700"
                    }
                ]
            },
            {
                "name": "Organic & Food Waste",
                "icon": "Leaf",
                "description": "Biodegradable organic matter typically generated from food preparation.",
                "items": [
                    {
                        "name": "Fruit and Vegetable Scraps",
                        "description": "Peels, cores, and discarded parts of fruits and vegetables.",
                        "type": "Compostable",
                        "method": "Place in a green organics bin or home compost.",
                        "statusBadge": "bg-green-100 text-green-700"
                    },
                    {
                        "name": "Coffee Grounds and Tea Bags",
                        "description": "Used coffee grounds and paper tea bags (without staples).",
                        "type": "Compostable",
                        "method": "Add to compost bin.",
                        "statusBadge": "bg-green-100 text-green-700"
                    },
                    {
                        "name": "Meat and Dairy Scraps",
                        "description": "Leftover animal products.",
                        "type": "Organic",
                        "method": "Place in municipal green bins only (do not home-compost).",
                        "statusBadge": "bg-green-100 text-green-700"
                    }
                ]
            },
            {
                "name": "Recyclable Waste",
                "icon": "Recycle",
                "description": "Clean, sorted materials that can be processed into new products.",
                "items": [
                    {
                        "name": "Aluminum Cans",
                        "description": "Beverage cans and clean aluminum foil.",
                        "type": "Recyclable",
                        "method": "Rinse out liquids and place in the blue recycling bin.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    },
                    {
                        "name": "Clean Cardboard",
                        "description": "Flattened corrugated cardboard and shipping boxes.",
                        "type": "Recyclable",
                        "method": "Flatten completely and place in recycling.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    }
                ]
            },
            {
                "name": "Plastic Waste",
                "icon": "Box",
                "description": "Various forms of synthetic plastic resins. Sorted by resin identification code.",
                "items": [
                    {
                        "name": "PET (Type 1)",
                        "description": "Clear plastics like water and soda bottles.",
                        "type": "Recyclable",
                        "method": "Empty contents, crush to save space, and recycle.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    },
                    {
                        "name": "HDPE (Type 2)",
                        "description": "Opaque plastics like milk jugs and shampoo bottles.",
                        "type": "Recyclable",
                        "method": "Rinse thoroughly before recycling.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    },
                    {
                        "name": "PVC (Type 3)",
                        "description": "Pipes, shower curtains, and certain packaging.",
                        "type": "Non-Recyclable",
                        "method": "Rarely accepted in curbside bins; take to a specialized facility.",
                        "statusBadge": "bg-gray-100 text-gray-700"
                    },
                    {
                        "name": "LDPE (Type 4)",
                        "description": "Grocery bags and plastic wrap.",
                        "type": "Recyclable (Special)",
                        "method": "Return to grocery store drop-off bins; do not put in curbside.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    }
                ]
            },
            {
                "name": "Paper & Cardboard",
                "icon": "FileText",
                "description": "Paper products derived from wood pulp.",
                "items": [
                    {
                        "name": "Newspaper & Magazines",
                        "description": "Printed newsprint and glossy magazines.",
                        "type": "Recyclable",
                        "method": "Keep dry and place in the recycling bin.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    },
                    {
                        "name": "Office Paper",
                        "description": "White printer paper, envelopes, and junk mail.",
                        "type": "Recyclable",
                        "method": "Shred sensitive documents before recycling.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    }
                ]
            },
            {
                "name": "Glass",
                "icon": "Wine",
                "description": "Glass containers and broken glass.",
                "items": [
                    {
                        "name": "Glass Bottles & Jars",
                        "description": "Clear, brown, or green glass containers.",
                        "type": "Recyclable",
                        "method": "Rinse and remove lids before recycling.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    },
                    {
                        "name": "Broken Glass",
                        "description": "Shattered windows, mirrors, or drinking glasses.",
                        "type": "Hazardous",
                        "method": "Wrap securely in newspaper and place in general waste.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Metals",
                "icon": "Database",
                "description": "Ferrous and non-ferrous metal items.",
                "items": [
                    {
                        "name": "Steel/Tin Cans",
                        "description": "Soup cans and canned food containers.",
                        "type": "Recyclable",
                        "method": "Rinse out and place in the recycling bin.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    },
                    {
                        "name": "Scrap Metal",
                        "description": "Large metal items, pipes, and old tools.",
                        "type": "Recyclable",
                        "method": "Take to a scrap metal recycling facility.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    }
                ]
            },
            {
                "name": "E-Waste",
                "icon": "Laptop",
                "description": "Discarded electrical or electronic devices.",
                "items": [
                    {
                        "name": "Laptops & Computers",
                        "description": "Old PCs, laptops, and networking equipment.",
                        "type": "Electronic",
                        "method": "Drop off at a certified e-waste recycling center.",
                        "statusBadge": "bg-purple-100 text-purple-700"
                    },
                    {
                        "name": "Mobile Phones",
                        "description": "Smartphones and old cellular devices.",
                        "type": "Electronic",
                        "method": "Use a specialized trade-in or e-waste drop-off.",
                        "statusBadge": "bg-purple-100 text-purple-700"
                    }
                ]
            },
            {
                "name": "Battery Waste",
                "icon": "Battery",
                "description": "Used and depleted batteries of all chemistries.",
                "items": [
                    {
                        "name": "Lithium-ion Batteries",
                        "description": "Rechargeable batteries from phones and laptops.",
                        "type": "Hazardous",
                        "method": "Tape terminals and take to an e-waste or battery drop-off.",
                        "statusBadge": "bg-red-100 text-red-700"
                    },
                    {
                        "name": "Alkaline Batteries",
                        "description": "Standard AA, AAA, C, and D batteries.",
                        "type": "General/Hazardous",
                        "method": "Check local guidelines; often accepted at battery drop-offs.",
                        "statusBadge": "bg-orange-100 text-orange-700"
                    }
                ]
            },
            {
                "name": "Construction & Demolition Waste",
                "icon": "Hammer",
                "description": "Debris generated during the construction, renovation, and demolition of buildings.",
                "items": [
                    {
                        "name": "Concrete & Bricks",
                        "description": "Broken concrete chunks and old bricks.",
                        "type": "Construction",
                        "method": "Hire a skip bin or take to a construction aggregate recycler.",
                        "statusBadge": "bg-yellow-100 text-yellow-700"
                    },
                    {
                        "name": "Gypsum Drywall",
                        "description": "Scrap drywall and plasterboard.",
                        "type": "Construction",
                        "method": "Take to specialized drywall recycling facilities.",
                        "statusBadge": "bg-yellow-100 text-yellow-700"
                    }
                ]
            },
            {
                "name": "Industrial Waste",
                "icon": "Factory",
                "description": "Waste produced by industrial activity and manufacturing.",
                "items": [
                    {
                        "name": "Industrial Solvents",
                        "description": "Leftover chemicals from manufacturing processes.",
                        "type": "Hazardous",
                        "method": "Must be handled by licensed hazardous waste contractors.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Agricultural Waste",
                "icon": "Tractor",
                "description": "Waste from farming, livestock, and agricultural operations.",
                "items": [
                    {
                        "name": "Crop Residues",
                        "description": "Stalks, leaves, and seed pods.",
                        "type": "Organic",
                        "method": "Compost or use as animal bedding/feed.",
                        "statusBadge": "bg-green-100 text-green-700"
                    },
                    {
                        "name": "Pesticide Containers",
                        "description": "Empty jugs previously containing toxic pesticides.",
                        "type": "Hazardous",
                        "method": "Triple rinse and return to an agricultural chemical collection program.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Biomedical & Medical Waste",
                "icon": "Stethoscope",
                "description": "Waste containing infectious or potentially infectious materials.",
                "items": [
                    {
                        "name": "Used Syringes & Sharps",
                        "description": "Needles, scalpels, and broken medical glass.",
                        "type": "Biomedical",
                        "method": "Place in an approved rigid sharps container and take to a medical facility.",
                        "statusBadge": "bg-red-100 text-red-700"
                    },
                    {
                        "name": "Biohazard Bags",
                        "description": "Bags containing blood-soaked bandages or biological matter.",
                        "type": "Biomedical",
                        "method": "Must be incinerated by a specialized biohazard contractor.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Hazardous Waste",
                "icon": "AlertTriangle",
                "description": "Waste with properties that make it dangerous to human health or the environment.",
                "items": [
                    {
                        "name": "Paint & Thinners",
                        "description": "Leftover household paint and toxic thinners.",
                        "type": "Hazardous",
                        "method": "Take to a household hazardous waste drop-off event.",
                        "statusBadge": "bg-red-100 text-red-700"
                    },
                    {
                        "name": "Household Cleaners",
                        "description": "Bleach, ammonia, and chemical cleaning products.",
                        "type": "Hazardous",
                        "method": "Do not pour down the drain. Take to a specialized facility.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Radioactive Waste",
                "icon": "Radiation",
                "description": "Materials that emit radioactive energy.",
                "items": [
                    {
                        "name": "Smoke Detectors",
                        "description": "Old ionization smoke alarms containing Americium-241.",
                        "type": "Radioactive",
                        "method": "Return to the manufacturer or take to a specialized e-waste facility.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Chemical Waste",
                "icon": "FlaskConical",
                "description": "Excess, unneeded, or expired chemicals.",
                "items": [
                    {
                        "name": "Lab Chemicals",
                        "description": "Expired reagents and laboratory solutions.",
                        "type": "Hazardous",
                        "method": "Dispose of via a licensed chemical waste management company.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Textile Waste",
                "icon": "Shirt",
                "description": "Discarded clothing, fabrics, and textiles.",
                "items": [
                    {
                        "name": "Usable Clothing",
                        "description": "Shirts, pants, and jackets in good condition.",
                        "type": "Reusable",
                        "method": "Donate to a local charity or thrift store.",
                        "statusBadge": "bg-teal-100 text-teal-700"
                    },
                    {
                        "name": "Torn Fabrics",
                        "description": "Ripped or stained clothing.",
                        "type": "Recyclable",
                        "method": "Drop off at a textile recycling bin for downcycling into rags.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    }
                ]
            },
            {
                "name": "Rubber Waste",
                "icon": "Circle",
                "description": "Discarded rubber items and synthetic polymers.",
                "items": [
                    {
                        "name": "Scrap Tires",
                        "description": "Used automotive or bicycle tires.",
                        "type": "Recyclable",
                        "method": "Take to a tire recycling facility (do not put in landfill).",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    }
                ]
            },
            {
                "name": "Wood Waste",
                "icon": "TreePine",
                "description": "Scrap lumber, pallets, and woody debris.",
                "items": [
                    {
                        "name": "Untreated Lumber",
                        "description": "Raw, unpainted, unstained wood.",
                        "type": "Compostable",
                        "method": "Chip for mulch or send to an organic waste facility.",
                        "statusBadge": "bg-green-100 text-green-700"
                    },
                    {
                        "name": "Treated Wood",
                        "description": "Painted or pressure-treated lumber.",
                        "type": "Hazardous",
                        "method": "Must go to a specialized landfill; do not burn or compost.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Food Industry Waste",
                "icon": "Utensils",
                "description": "Waste originating from restaurants and food manufacturing.",
                "items": [
                    {
                        "name": "Used Cooking Oil",
                        "description": "Grease and fry oil from commercial kitchens.",
                        "type": "Recyclable",
                        "method": "Collect in drums and arrange pickup by a biofuel recycling service.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    }
                ]
            },
            {
                "name": "Mining Waste",
                "icon": "Mountain",
                "description": "Tailings, slag, and rock waste from mineral extraction.",
                "items": [
                    {
                        "name": "Mine Tailings",
                        "description": "Leftover crushed rock and processing fluids.",
                        "type": "Industrial",
                        "method": "Managed on-site via specialized tailing dams.",
                        "statusBadge": "bg-yellow-100 text-yellow-700"
                    }
                ]
            },
            {
                "name": "Marine Waste",
                "icon": "Anchor",
                "description": "Waste recovered from oceans, or generated by the maritime industry.",
                "items": [
                    {
                        "name": "Fishing Nets (Ghost Nets)",
                        "description": "Discarded synthetic fishing nets.",
                        "type": "Recyclable",
                        "method": "Take to marine recycling initiatives that turn them into new plastics.",
                        "statusBadge": "bg-blue-100 text-blue-700"
                    }
                ]
            },
            {
                "name": "Automotive Waste",
                "icon": "Car",
                "description": "Waste generated from vehicle maintenance.",
                "items": [
                    {
                        "name": "Used Engine Oil",
                        "description": "Drained motor oil.",
                        "type": "Hazardous",
                        "method": "Take to an auto parts store or specialized collection center.",
                        "statusBadge": "bg-red-100 text-red-700"
                    },
                    {
                        "name": "Lead-Acid Car Batteries",
                        "description": "Standard 12V vehicle batteries.",
                        "type": "Hazardous",
                        "method": "Exchange at an auto parts store for recycling.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            },
            {
                "name": "Miscellaneous Waste",
                "icon": "Archive",
                "description": "Items that do not fit neatly into other categories.",
                "items": [
                    {
                        "name": "Incandescent Light Bulbs",
                        "description": "Old-style filament bulbs.",
                        "type": "General Waste",
                        "method": "Wrap in paper and dispose of in general trash.",
                        "statusBadge": "bg-gray-100 text-gray-700"
                    },
                    {
                        "name": "Fluorescent Tubes",
                        "description": "Long lighting tubes containing mercury vapor.",
                        "type": "Hazardous",
                        "method": "Take to a hazardous waste or specialized lighting drop-off.",
                        "statusBadge": "bg-red-100 text-red-700"
                    }
                ]
            }
        ]

        count = 0
        for data in categories_data:
            obj, created = WasteCategory.objects.update_or_create(
                category_name=data["name"],
                defaults={
                    "description": data["description"],
                    "icon": data["icon"],
                    "items": data["items"]
                }
            )
            if created:
                count += 1
                self.stdout.write(self.style.SUCCESS(f'Created category: {data["name"]}'))
            else:
                self.stdout.write(f'Updated category: {data["name"]}')

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} new waste categories.'))
