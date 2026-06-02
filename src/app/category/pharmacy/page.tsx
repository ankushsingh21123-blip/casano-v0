"use client";

import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Plus } from "lucide-react";

export default function PharmacyPage() {
  const categories = [
  {
    "name": "MEDICINES & TABLETS (COMMON OTC)",
    "image": "/images/pharmacy/pharmacy_tablets_1773350414069.png",
    "products": [
      {
        "id": "p1",
        "name": "Paracetamol Tablet Strip",
        "price": 428,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p2",
        "name": "Crocin Tablet Strip",
        "price": 139,
        "weight": "1 pack",
        "deliveryTime": "15 MINS",
        "stock": 3
      },
      {
        "id": "p3",
        "name": "Disprin Tablet Strip",
        "price": 426,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p4",
        "name": "Aspirin Tablet Strip",
        "price": 105,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p5",
        "name": "Ibuprofen Tablet Strip",
        "price": 248,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p6",
        "name": "Antacid Tablet Strip",
        "price": 279,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p7",
        "name": "Digene Tablet Strip",
        "price": 406,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p8",
        "name": "ENO Sachet Pack",
        "price": 165,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p9",
        "name": "Vitamin C Tablet Strip",
        "price": 68,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p10",
        "name": "Vitamin D3 Tablet Strip",
        "price": 419,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p11",
        "name": "Vitamin B12 Tablet Strip",
        "price": 386,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p12",
        "name": "Multivitamin Tablet Bottle",
        "price": 225,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p13",
        "name": "Calcium Tablet Strip",
        "price": 288,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p14",
        "name": "Iron & Folic Acid Tablet Strip",
        "price": 159,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p15",
        "name": "Zinc Tablet Strip",
        "price": 366,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p16",
        "name": "Omega 3 Capsule Bottle",
        "price": 285,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p17",
        "name": "Fish Oil Capsule Bottle",
        "price": 108,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p18",
        "name": "Biotin Tablet Strip",
        "price": 299,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p19",
        "name": "Melatonin Sleep Tablet Strip",
        "price": 346,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p20",
        "name": "Cetirizine Allergy Tablet Strip",
        "price": 345,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "SYRUPS & LIQUIDS",
    "image": "/images/pharmacy/pharmacy_syrups_1773350429761.png",
    "products": [
      {
        "id": "p21",
        "name": "Cough Syrup Bottle (100ml)",
        "price": 328,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p22",
        "name": "Benadryl Cough Syrup Bottle",
        "price": 439,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p23",
        "name": "Honey Lemon Cough Syrup",
        "price": 326,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p24",
        "name": "Antacid Liquid Bottle",
        "price": 405,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p25",
        "name": "Digene Syrup Bottle",
        "price": 148,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p26",
        "name": "Iron Syrup Bottle",
        "price": 179,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p27",
        "name": "Multivitamin Syrup Bottle",
        "price": 306,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p28",
        "name": "Calcium Syrup Bottle",
        "price": 65,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p29",
        "name": "Liver Tonic Syrup Bottle",
        "price": 368,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p30",
        "name": "Paediatric Paracetamol Syrup",
        "price": 319,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "DROPS",
    "image": "/images/pharmacy/pharmacy_drops_1773350603525.png",
    "products": [
      {
        "id": "p31",
        "name": "Eye Drops Bottle (Small)",
        "price": 286,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p32",
        "name": "Ear Drops Bottle",
        "price": 125,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p33",
        "name": "Nasal Drops Bottle",
        "price": 188,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p34",
        "name": "Nasal Saline Spray",
        "price": 59,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p35",
        "name": "Vitamin D3 Oral Drops",
        "price": 266,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p36",
        "name": "Colic Drops (Baby)",
        "price": 185,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "FIRST AID & WOUND CARE",
    "image": "/images/pharmacy/pharmacy_first_aid_1773350552887.png",
    "products": [
      {
        "id": "p37",
        "name": "Band-Aid / Adhesive Bandage Strip Pack",
        "price": 408,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p38",
        "name": "Elastic Bandage Roll",
        "price": 199,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p39",
        "name": "Crepe Bandage Roll",
        "price": 246,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p40",
        "name": "Sterile Gauze Pad Pack",
        "price": 245,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p41",
        "name": "Cotton Roll (100g)",
        "price": 228,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p42",
        "name": "Cotton Balls Pack",
        "price": 339,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p43",
        "name": "Medical Surgical Tape Roll",
        "price": 226,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p44",
        "name": "Antiseptic Cream Tube (Dettol/Savlon)",
        "price": 305,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p45",
        "name": "Betadine Antiseptic Solution Bottle",
        "price": 448,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p46",
        "name": "Hydrogen Peroxide Bottle",
        "price": 79,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p47",
        "name": "Burn Gel Tube",
        "price": 206,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p48",
        "name": "Wound Healing Ointment Tube",
        "price": 365,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p49",
        "name": "Antibiotic Ointment Tube",
        "price": 268,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p50",
        "name": "Sterile Disposable Gloves Pack",
        "price": 219,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p51",
        "name": "First Aid Box Kit",
        "price": 186,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p52",
        "name": "Triangular Bandage",
        "price": 425,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p53",
        "name": "Ice Pack (Reusable)",
        "price": 88,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p54",
        "name": "Hot Water Bag",
        "price": 359,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "SKIN CARE & OINTMENTS",
    "image": "/images/pharmacy/pharmacy_skin_care_1773351022741.png",
    "products": [
      {
        "id": "p55",
        "name": "Moisturising Lotion Bottle",
        "price": 166,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p56",
        "name": "Calamine Lotion Bottle",
        "price": 85,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p57",
        "name": "Sunscreen SPF 50 Tube",
        "price": 308,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p58",
        "name": "Antifungal Cream Tube",
        "price": 99,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p59",
        "name": "Anti-Itch Cream Tube",
        "price": 146,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p60",
        "name": "Hydrocortisone Cream Tube",
        "price": 145,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p61",
        "name": "Aloe Vera Gel Tube",
        "price": 128,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p62",
        "name": "Petroleum Jelly (Vaseline) Jar",
        "price": 239,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p63",
        "name": "Lip Balm Stick",
        "price": 126,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p64",
        "name": "Nappy Rash Cream Tube",
        "price": 205,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p65",
        "name": "Prickly Heat Powder Bottle",
        "price": 348,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p66",
        "name": "Talcum Powder Bottle",
        "price": 379,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p67",
        "name": "Medicated Soap Bar",
        "price": 106,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p68",
        "name": "Antiseptic Liquid (Dettol) Bottle",
        "price": 265,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "PAIN RELIEF",
    "image": "/images/pharmacy/pharmacy_skin_care_1773351022741.png",
    "products": [
      {
        "id": "p69",
        "name": "Pain Relief Spray Can",
        "price": 168,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p70",
        "name": "Pain Relief Gel Tube",
        "price": 119,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p71",
        "name": "Pain Relief Ointment Tube (Volini)",
        "price": 86,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p72",
        "name": "Moov Cream Tube",
        "price": 325,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p73",
        "name": "Tiger Balm Jar",
        "price": 388,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p74",
        "name": "Hot Pain Relief Patch Pack",
        "price": 259,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p75",
        "name": "Cold Pain Relief Patch Pack",
        "price": 66,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p76",
        "name": "Knee Support Brace",
        "price": 385,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p77",
        "name": "Wrist Support Band",
        "price": 208,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p78",
        "name": "Ankle Support Band",
        "price": 399,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p79",
        "name": "Back Support Belt",
        "price": 446,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p80",
        "name": "Neck Collar Support",
        "price": 445,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "DIGESTIVE & GUT HEALTH",
    "image": "/images/pharmacy/pharmacy_tablets_1773350414069.png",
    "products": [
      {
        "id": "p81",
        "name": "ORS Sachet Pack (Orange)",
        "price": 428,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p82",
        "name": "ORS Sachet Pack (Lemon)",
        "price": 139,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p83",
        "name": "Probiotic Capsule Strip",
        "price": 426,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p84",
        "name": "Isabgol Husk Powder Jar",
        "price": 105,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p85",
        "name": "Activated Charcoal Tablet Strip",
        "price": 248,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p86",
        "name": "Anti-Diarrhoea Tablet Strip",
        "price": 279,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p87",
        "name": "Laxative Tablet Strip",
        "price": 406,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p88",
        "name": "Gas Relief Tablet Strip",
        "price": 165,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p89",
        "name": "Liver Care Tablet Bottle",
        "price": 68,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "DIABETES CARE",
    "image": "/images/pharmacy/pharmacy_supplements_1773350570667.png",
    "products": [
      {
        "id": "p90",
        "name": "Glucometer Device",
        "price": 419,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p91",
        "name": "Glucometer Test Strips Box",
        "price": 386,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p92",
        "name": "Lancets Box",
        "price": 225,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p93",
        "name": "Insulin Syringe Pack",
        "price": 288,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p94",
        "name": "Diabetic Foot Cream Tube",
        "price": 159,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p95",
        "name": "Sugar-Free Sweetener Box",
        "price": 366,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p96",
        "name": "Diabetes Supplement Bottle",
        "price": 285,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "BLOOD PRESSURE & HEART",
    "image": "/images/pharmacy/pharmacy_first_aid_1773350552887.png",
    "products": [
      {
        "id": "p97",
        "name": "Digital BP Monitor Machine",
        "price": 108,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p98",
        "name": "BP Monitor Cuff (Wrist)",
        "price": 299,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p99",
        "name": "Pulse Oximeter Device",
        "price": 346,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p100",
        "name": "Digital Weighing Scale",
        "price": 345,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p101",
        "name": "Omega 3 Heart Care Capsule Bottle",
        "price": 328,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "THERMOMETERS & MONITORING",
    "image": "/images/pharmacy/pharmacy_first_aid_1773350552887.png",
    "products": [
      {
        "id": "p102",
        "name": "Digital Thermometer",
        "price": 439,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p103",
        "name": "Infrared Forehead Thermometer",
        "price": 326,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p104",
        "name": "Ear Thermometer",
        "price": 405,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p105",
        "name": "Room Thermometer",
        "price": 148,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p106",
        "name": "Nebuliser Machine",
        "price": 179,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p107",
        "name": "Inhaler Spacer Device",
        "price": 306,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p108",
        "name": "Peak Flow Meter",
        "price": 65,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "BABY & MOTHER CARE",
    "image": "/images/pharmacy/pharmacy_skin_care_1773351022741.png",
    "products": [
      {
        "id": "p109",
        "name": "Baby Diaper Pack (Small)",
        "price": 368,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p110",
        "name": "Baby Diaper Pack (Medium)",
        "price": 319,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p111",
        "name": "Baby Diaper Pack (Large)",
        "price": 286,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p112",
        "name": "Baby Wipes Pack",
        "price": 125,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p113",
        "name": "Baby Powder Bottle",
        "price": 188,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p114",
        "name": "Baby Lotion Bottle",
        "price": 59,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p115",
        "name": "Baby Oil Bottle",
        "price": 266,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p116",
        "name": "Baby Shampoo Bottle",
        "price": 185,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p117",
        "name": "Baby Soap Bar",
        "price": 408,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p118",
        "name": "Diaper Rash Cream Tube",
        "price": 199,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p119",
        "name": "Gripe Water Bottle",
        "price": 246,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p120",
        "name": "Baby Nasal Aspirator",
        "price": 245,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p121",
        "name": "Baby Thermometer",
        "price": 228,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p122",
        "name": "Maternity Pad Pack",
        "price": 339,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p123",
        "name": "Breast Pump (Manual)",
        "price": 226,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p124",
        "name": "Nipple Cream Tube",
        "price": 305,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p125",
        "name": "Pregnancy Test Kit",
        "price": 448,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p126",
        "name": "Ovulation Test Kit",
        "price": 79,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p127",
        "name": "Folic Acid Tablet Strip (Prenatal)",
        "price": 206,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "SEXUAL HEALTH & FAMILY PLANNING",
    "image": "/images/pharmacy/pharmacy_skin_care_1773351022741.png",
    "products": [
      {
        "id": "p128",
        "name": "Condom Pack (3s)",
        "price": 365,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p129",
        "name": "Condom Pack (10s)",
        "price": 268,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p130",
        "name": "Emergency Contraceptive Pill Strip",
        "price": 219,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p131",
        "name": "Lubricant Gel Tube",
        "price": 186,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "EYE, EAR & DENTAL CARE",
    "image": "/images/pharmacy/pharmacy_drops_1773350603525.png",
    "products": [
      {
        "id": "p132",
        "name": "Eye Wash Cup",
        "price": 425,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p133",
        "name": "Lubricating Eye Drops",
        "price": 88,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p134",
        "name": "Contact Lens Solution Bottle",
        "price": 359,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p135",
        "name": "Ear Wax Removal Drops",
        "price": 166,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p136",
        "name": "Ear Plugs Pack",
        "price": 85,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p137",
        "name": "Toothache Gel Tube",
        "price": 308,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p138",
        "name": "Sensitive Toothpaste Tube",
        "price": 99,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p139",
        "name": "Mouth Ulcer Gel Tube",
        "price": 146,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p140",
        "name": "Dental Floss Pack",
        "price": 145,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p141",
        "name": "Orthodontic Wax Pack",
        "price": 128,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "VITAMINS & SUPPLEMENTS",
    "image": "/images/pharmacy/pharmacy_supplements_1773350570667.png",
    "products": [
      {
        "id": "p142",
        "name": "Whey Protein Powder Jar",
        "price": 239,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p143",
        "name": "Immunity Booster Tablet Bottle",
        "price": 126,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p144",
        "name": "Ashwagandha Capsule Bottle",
        "price": 205,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p145",
        "name": "Turmeric Curcumin Capsule Bottle",
        "price": 348,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p146",
        "name": "Collagen Powder Sachet Pack",
        "price": 379,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p147",
        "name": "Electrolyte Powder Sachet Pack",
        "price": 106,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p148",
        "name": "Spirulina Tablet Bottle",
        "price": 265,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p149",
        "name": "Apple Cider Vinegar Bottle",
        "price": 168,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p150",
        "name": "Moringa Capsule Bottle",
        "price": 119,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p151",
        "name": "CoQ10 Capsule Bottle",
        "price": 86,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p152",
        "name": "Evening Primrose Oil Capsule Bottle",
        "price": 325,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p153",
        "name": "Glucosamine Tablet Bottle",
        "price": 388,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p154",
        "name": "Magnesium Tablet Bottle",
        "price": 259,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "SURGICAL & DISPOSABLES",
    "image": "/images/pharmacy/pharmacy_first_aid_1773350552887.png",
    "products": [
      {
        "id": "p155",
        "name": "Disposable Syringe (2ml) Pack",
        "price": 66,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p156",
        "name": "Disposable Syringe (5ml) Pack",
        "price": 385,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p157",
        "name": "Disposable Syringe (10ml) Pack",
        "price": 208,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p158",
        "name": "IV Cannula Pack",
        "price": 399,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p159",
        "name": "Surgical Mask Box (50 pcs)",
        "price": 446,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p160",
        "name": "N95 Mask Pack",
        "price": 445,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p161",
        "name": "KN95 Mask Pack",
        "price": 428,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p162",
        "name": "Face Shield",
        "price": 139,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p163",
        "name": "Disposable Apron Pack",
        "price": 426,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p164",
        "name": "Latex Examination Gloves Box",
        "price": 105,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p165",
        "name": "Nitrile Gloves Box",
        "price": 248,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p166",
        "name": "Urine Collection Bag",
        "price": 279,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p167",
        "name": "Catheter Pack",
        "price": 406,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p168",
        "name": "Colostomy Bag Pack",
        "price": 165,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p169",
        "name": "Urinal Bottle (Male)",
        "price": 68,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p170",
        "name": "Bed Pan",
        "price": 419,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "HOME HEALTHCARE EQUIPMENT",
    "image": "/images/pharmacy/pharmacy_first_aid_1773350552887.png",
    "products": [
      {
        "id": "p171",
        "name": "Wheelchair (Foldable)",
        "price": 386,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p172",
        "name": "Walking Stick / Cane",
        "price": 225,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p173",
        "name": "Elbow Crutches Pair",
        "price": 288,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p174",
        "name": "Walker / Zimmer Frame",
        "price": 159,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p175",
        "name": "Cervical Pillow",
        "price": 366,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p176",
        "name": "Orthopaedic Seat Cushion",
        "price": 285,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p177",
        "name": "Air Bed / Mattress (Medical)",
        "price": 108,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p178",
        "name": "Commode Chair",
        "price": 299,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p179",
        "name": "Hospital Bed Table",
        "price": 346,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p180",
        "name": "Stethoscope",
        "price": 345,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "AYURVEDIC & HERBAL",
    "image": "/images/pharmacy/pharmacy_supplements_1773350570667.png",
    "products": [
      {
        "id": "p181",
        "name": "Chyawanprash Jar",
        "price": 328,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p182",
        "name": "Triphala Churna Bottle",
        "price": 439,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p183",
        "name": "Giloy Tablet Bottle",
        "price": 326,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p184",
        "name": "Neem Capsule Bottle",
        "price": 405,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p185",
        "name": "Brahmi Tablet Bottle",
        "price": 148,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p186",
        "name": "Shilajit Resin Jar",
        "price": 179,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p187",
        "name": "Arjuna Tablet Bottle",
        "price": 306,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p188",
        "name": "Trikatu Churna Bottle",
        "price": 65,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p189",
        "name": "Dashmool Kwath Bottle",
        "price": 368,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p190",
        "name": "Aloe Vera Juice Bottle",
        "price": 319,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  },
  {
    "name": "HEALTH FOOD & NUTRITION",
    "image": "/images/pharmacy/pharmacy_supplements_1773350570667.png",
    "products": [
      {
        "id": "p191",
        "name": "Protein Bar Box",
        "price": 286,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p192",
        "name": "Glucose Powder Tin",
        "price": 125,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p193",
        "name": "Horlicks Health Drink Jar",
        "price": 188,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p194",
        "name": "Ensure Nutrition Powder Tin",
        "price": 59,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p195",
        "name": "Pediasure Powder Tin",
        "price": 266,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p196",
        "name": "Diabetic Health Drink Powder Tin",
        "price": 185,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p197",
        "name": "Senior Citizen Nutrition Powder Tin",
        "price": 408,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p198",
        "name": "Coconut Water Tetra Pack",
        "price": 199,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p199",
        "name": "Chia Seeds Pouch",
        "price": 246,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      },
      {
        "id": "p200",
        "name": "Flax Seeds Pouch",
        "price": 245,
        "weight": "1 pack",
        "deliveryTime": "15 MINS"
      }
    ]
  }
];

  return (
    <div className="min-h-screen font-sans pb-24" style={{ background: "#FDFBF7" }}>
      <Header />
      
      {/* Pharmacy Header Banner — Pichwai Forest Green */}
      <div className="text-white w-full py-10 px-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #214A36, #0F2C1F)" }}>
         <div className="absolute right-10 bottom-0 opacity-10">
            <Plus className="w-64 h-64 -mb-10 -mr-10" />
         </div>
         <div className="max-w-[1400px] mx-auto relative z-10 flex items-center gap-4">
             <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                 <Plus className="w-10 h-10 text-white stroke-[3]" />
             </div>
             <div>
                 <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Pharmacy &amp; Health Store</h1>
                 <p className="font-medium mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>Medicines, First Aid, Supplements &amp; More — Delivered in 15 Minutes</p>
             </div>
         </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 py-8">
        {categories.map((category, catIdx) => (
            <div key={catIdx} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold leading-tight" style={{ color: "#2A2B2A" }}>{category.name}</h2>
                    <div className="h-[2px] flex-grow ml-4 rounded-full" style={{ background: "#E2DDD0" }}></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {category.products.map(product => (
                    <ProductCard 
                        key={product.id} 
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        weight={product.weight}
                        deliveryTime={product.deliveryTime}
                        image={category.image}
                    />
                  ))}
                </div>
            </div>
        ))}
      </main>
    </div>
  );
}