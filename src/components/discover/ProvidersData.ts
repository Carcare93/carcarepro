
// Sample service providers data for the Discover page
export const providers = [
  {
    id: "1",
    name: "AutoCare Express",
    image: "https://images.unsplash.com/photo-1632823469850-2f77dd9c7c93?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.8,
    reviewCount: 324,
    location: {
      address: "123 Main Street",
      city: "Downtown",
      state: "CA",
      zipCode: "90001",
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    specialties: ["Oil Change", "Brakes", "Tires"],
    services: ["Oil Change", "Brake Repair", "Tire Replacement", "Wheel Alignment"],
    availability: ["Today", "Tomorrow", "Wednesday"],
    pricing: {
      "Oil Change": "$49.99",
      "Brake Inspection": "Free",
      "Brake Pad Replacement": "$180.00",
      "Tire Rotation": "$25.00"
    },
    verified: true,
    available_today: true,
  },
  {
    id: "2",
    name: "Premier Auto Service",
    image: "https://images.unsplash.com/photo-1629384997254-86acaa07dbaa?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.9,
    reviewCount: 187,
    location: {
      address: "456 West Avenue",
      city: "West End",
      state: "CA",
      zipCode: "90002",
      coordinates: { lat: 34.0548, lng: -118.3552 }
    },
    specialties: ["Diagnostics", "Engine Repair", "Electrical"],
    services: ["Engine Diagnostics", "Engine Repair", "Electrical System Repair", "Battery Replacement"],
    availability: ["Tomorrow", "Thursday", "Friday"],
    pricing: {
      "Check Engine Light Diagnosis": "$89.99",
      "Battery Replacement": "$149.99",
      "Alternator Replacement": "$350.00",
      "Starter Replacement": "$275.00"
    },
    verified: true,
    available_today: false,
  },
  {
    id: "3",
    name: "TireWorld Plus",
    image: "https://images.unsplash.com/photo-1486127635871-6aa255f6de7d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.7,
    reviewCount: 256,
    location: {
      address: "789 South Boulevard",
      city: "South Side",
      state: "CA",
      zipCode: "90003",
      coordinates: { lat: 34.0185, lng: -118.2695 }
    },
    specialties: ["Tire Replacement", "Alignment", "Rotation"],
    services: ["Tire Sales", "Tire Installation", "Wheel Alignment", "Tire Pressure Monitoring"],
    availability: ["Today", "Tomorrow", "Friday"],
    pricing: {
      "Tire Installation (per tire)": "$20.00",
      "Wheel Alignment": "$89.99",
      "Tire Rotation": "$29.99",
      "Tire Pressure Monitoring System Service": "$49.99"
    },
    verified: false,
    available_today: true,
  },
  {
    id: "4",
    name: "Eastside Mechanics",
    image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.6,
    reviewCount: 142,
    location: {
      address: "101 East Street",
      city: "East Village",
      state: "CA",
      zipCode: "90004",
      coordinates: { lat: 34.0611, lng: -118.1968 }
    },
    specialties: ["Full Service", "Inspection", "AC Repair"],
    services: ["AC Repair", "State Inspection", "Full Service", "Suspension Repair"],
    availability: ["Today", "Thursday", "Friday"],
    pricing: {
      "AC System Check": "$59.99",
      "AC Recharge": "$119.99",
      "State Inspection": "$39.99",
      "Suspension Inspection": "$49.99"
    },
    verified: true,
    available_today: true,
  },
  {
    id: "5",
    name: "North Star Auto",
    image: "https://images.unsplash.com/photo-1518295751675-2d9e4b583597?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.5,
    reviewCount: 98,
    location: {
      address: "222 North Road",
      city: "North District",
      state: "CA",
      zipCode: "90005",
      coordinates: { lat: 34.0937, lng: -118.2378 }
    },
    specialties: ["Oil Change", "Transmission", "Cooling System"],
    services: ["Oil Change", "Transmission Service", "Cooling System Flush", "Radiator Replacement"],
    availability: ["Tomorrow", "Wednesday", "Thursday"],
    pricing: {
      "Synthetic Oil Change": "$69.99",
      "Transmission Fluid Change": "$149.99",
      "Cooling System Flush": "$109.99",
      "Radiator Inspection": "$29.99"
    },
    verified: true,
    available_today: false,
  },
  {
    id: "6",
    name: "City Central Repairs",
    image: "https://images.unsplash.com/photo-1507171945151-491b640082a7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600",
    rating: 4.4,
    reviewCount: 211,
    location: {
      address: "333 Center Plaza",
      city: "City Center",
      state: "CA",
      zipCode: "90006",
      coordinates: { lat: 34.0407, lng: -118.2468 }
    },
    specialties: ["Brakes", "Suspension", "Steering"],
    services: ["Brake Service", "Suspension Repair", "Steering System", "Wheel Balancing"],
    availability: ["Today", "Wednesday", "Friday"],
    pricing: {
      "Brake Pad Replacement (Front)": "$169.99",
      "Brake Fluid Flush": "$89.99",
      "Strut Replacement": "$350.00/pair",
      "Wheel Balancing": "$49.99"
    },
    verified: false,
    available_today: true,
  }
];
