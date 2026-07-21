const DRINKS_DATA = [
  {
    id: "coffee",
    name: "Espresso Coffee",
    shortDesc: "Rich roasted Arabica espresso blended with silky fresh milk.",
    tagline: "Bold & Energizing",
    color: "#6F4E37",
    gradient: "linear-gradient(135deg, #4A2E1B 0%, #A0522D 100%)",
    liquidColor: "#5C3A21",
    accentColor: "#D2691E",
    badge: "Event Favorite",
    pricePerCup: 9.50,
    tags: ["Bold Roast", "Arabica", "Smooth Finish"],
    tasteNotes: "Notes of dark chocolate, hazelnut, and deep roasted coffee bean."
  },
  {
    id: "matcha",
    name: "Uji Ceremonial Matcha",
    shortDesc: "Premium Japanese ceremonial matcha whisked to earthy perfection.",
    tagline: "Earthy & Serene",
    color: "#487D38",
    gradient: "linear-gradient(135deg, #2E5A27 0%, #68B04D 100%)",
    liquidColor: "#487D38",
    accentColor: "#7CFC00",
    badge: "Top Seller",
    pricePerCup: 10.50,
    tags: ["100% Uji Grade", "Antioxidant Rich", "Umami"],
    tasteNotes: "Vibrant grassy aroma with rich umami depth and subtle natural sweetness."
  },
  {
    id: "chocolate",
    name: "Belgian Dark Chocolate",
    shortDesc: "Decadent melted 70% Belgian dark chocolate in velvety milk.",
    tagline: "Indulgent & Luxurious",
    color: "#3D2314",
    gradient: "linear-gradient(135deg, #281409 0%, #59311A 100%)",
    liquidColor: "#3B1E10",
    accentColor: "#C0A080",
    badge: "Crowd Pleaser",
    pricePerCup: 9.50,
    tags: ["70% Cocoa", "Silky", "Comforting"],
    tasteNotes: "Deep, bittersweet chocolate body with a velvety cocoa aftertaste."
  },
  {
    id: "red_thai_tea",
    name: "Red Thai Tea",
    shortDesc: "Fragrant spiced amber Thai black tea brewed with sweet milk.",
    tagline: "Aromatic & Sweet",
    color: "#D96B27",
    gradient: "linear-gradient(135deg, #A83B00 0%, #FF8C38 100%)",
    liquidColor: "#C65A19",
    accentColor: "#FFA500",
    badge: "Authentic Flavor",
    pricePerCup: 8.50,
    tags: ["Star Anise & Vanilla", "Golden Amber", "Rich Creaminess"],
    tasteNotes: "Sweet spiced black tea infused with cardamom, star anise, and sweetened milk."
  },
  {
    id: "green_thai_tea",
    name: "Green Thai Tea",
    shortDesc: "Jasmine-infused Thai green tea with rich creamy texture.",
    tagline: "Floral & Refreshing",
    color: "#6B8E23",
    gradient: "linear-gradient(135deg, #3B5E0D 0%, #8FBC8F 100%)",
    liquidColor: "#556B2F",
    accentColor: "#98FB98",
    badge: "Refreshing Pick",
    pricePerCup: 8.50,
    tags: ["Jasmine Aromatics", "Pastel Mint", "Smooth Cream"],
    tasteNotes: "Delicate floral jasmine highlights balanced with creamy sweet milk."
  }
];

const FOAMS_DATA = [
  {
    id: "normal_cream",
    name: "Normal Cream Foam",
    subtitle: "The Classic Touch",
    description: "Light, velvety, and subtly sweet. Our signature whipped dairy cream float that enhances every drink effortlessly.",
    tasteProfile: "Smooth, classic dairy sweetness with a silky melt-in-your-mouth texture.",
    color: "#FFF8DC",
    gradient: "linear-gradient(135deg, #FFFDF0 0%, #F5E6C8 100%)"
  },
  {
    id: "vanilla_cold_foam",
    name: "Vanilla Cold Foam",
    subtitle: "Aromatic & Fluffy (+RM0.20/cup)",
    description: "Cold-whipped non-fat milk infused with natural Madagascar vanilla bean syrup. Pillowy soft and sweet.",
    tasteProfile: "Fragrant vanilla aromas with a cloud-like texture that gently folds into your cold drink.",
    color: "#FFFDD0",
    gradient: "linear-gradient(135deg, #FFFFFA 0%, #FFF3B0 100%)"
  },
  {
    id: "seasalt_cold_foam",
    name: "Seasalt Cold Foam",
    subtitle: "Sweet & Savory (+RM0.20/cup)",
    description: "Creamy foam infused with micro-milled Himalayan pink sea salt. Enhances coffee, matcha, and tea flavor profiles.",
    tasteProfile: "A rich contrast of savory saltiness upfront that melts into lush cream sweetness.",
    color: "#F4F1EA",
    gradient: "linear-gradient(135deg, #FFFFFF 0%, #E2DDD5 100%)"
  },
  {
    id: "cheese_foam",
    name: "Cheese Foam",
    subtitle: "Rich & Tangy Float (+RM0.20/cup)",
    tasteProfile: "Thick, velvety, sweet-and-salty cheese crown inspired by artisanal Asian tea houses.",
    color: "#FFF5C0",
    gradient: "linear-gradient(135deg, #FFF9D6 0%, #FFE680 100%)"
  }
];

const EVENT_PACKAGE_PERKS = [
  "Professional Pop-Up Barista Booth",
  "Dedicated Friendly Baristas"
];
