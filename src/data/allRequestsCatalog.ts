import { RecipientRequest, formatCapitalizedTitle } from "../types";
import { formatDetailedLocation, resolveReceiverProfile } from "../lib/receiverProfileHelper";

const FOLDABLE_MATTRESS_IMAGE = "https://www.dunlopillo.com.my/image/cache/data/theme/products/Aqua-Junior-Foldable-Mattress/Aqua-Junior-Foldable-Mattress-1-580x580_0.jpg";

const ENFALAC_STEP_1_IMAGE = "https://cdn1.sgliteasset.com/yongfong/images/product/product-3414122/HH3sgFfM64f7047c3ec10_1693910140.jpg";
const SPRITZER_WATER_CARTON_IMAGE = "https://www.salaammarketmy.com/product-images/a1cc1cb0482d83c301e75c461bd817c18df6ddbf.png";
const EMERGENCY_WATER_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_kBEf4Znx8Lt23O9VPAtUzkbPrIaqgLXnZnYP0s4GO2B9Qfv-nGU3dcRh&s=10";

// These requests previously relied on unavailable external photo URLs. Keep the
// images in the app bundle so their request cards always have a dependable image.
export const STABLE_REQUEST_IMAGE_IDS = new Set(["need_water_1", "need_9", "req_1", "need_household_1"]);

/** Keeps the requested-item address identical to its charity profile address. */
export function getCharityLocationForRequest(request: RecipientRequest): string {
  const charity = resolveReceiverProfile(request, null);
  return formatDetailedLocation(charity.location, charity.name);
}

export const MASTER_COMMUNITY_REQUESTS: RecipientRequest[] = [
  // 1. Sister Mary Theresa / St. Jude Orphanage (Melaka Tengah, Melaka)
  {
    id: "need_milk_1",
    title: "Milk Powder for Toddlers (1-3 Years)",
    category: "Food",
    categories: ["Food", "Medical", "Emergency", "Foods", "Living Things"],
    tags: ["Infant Care", "Urgent Nutrition", "Toddler Health", "Baby Food"],
    brand: "Dumex Dugro / Enfagrow / Dutch Lady",
    color: "Any",
    description: "Nutritional growth milk formula needed for 18 toddlers sheltered at St. Jude Orphanage.",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Melaka Tengah, Melaka",
    quantity: 30,
    unit: "tins",
    pledgedQuantity: 22,
    postedDate: "2026-08-18",
    postedTimestamp: 1755504000000,
    status: "active",
    urgencyLevel: "high",
    authorName: "Sister Mary Theresa",
    authorEmail: "sister.mary@hoperefuge.org",
    organizerName: "St. Jude Orphanage & Children's Sanctuary",
    organizerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    createdByUserEmail: "sister.mary@hoperefuge.org",
    createdByUsername: "Sister Mary Theresa"
  },
  {
    id: "need_stationery_1",
    title: "Complete Primary School Stationery & Art Kits",
    category: "Education",
    categories: ["Education", "Child", "Books", "Living Things"],
    tags: ["School Supplies", "Stationery", "Art Kits", "Children"],
    brand: "Faber-Castell / Stabilo / Any",
    color: "Multi-colour",
    description: "Colour pencils, exercise books, pencils, erasers, and school rulers for 50 orphaned children starting new academic term.",
    imageUrl: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Melaka Tengah, Melaka",
    quantity: 50,
    unit: "sets",
    pledgedQuantity: 40,
    postedDate: "2026-08-17",
    postedTimestamp: 1755417600000,
    status: "active",
    urgencyLevel: "standard",
    authorName: "Sister Mary Theresa",
    authorEmail: "sister.mary@hoperefuge.org",
    organizerName: "St. Jude Orphanage & Children's Sanctuary",
    organizerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    createdByUserEmail: "sister.mary@hoperefuge.org",
    createdByUsername: "Sister Mary Theresa"
  },

  // 2. Uncle Tan Ah Hock / Ipoh Soup Kitchen (Ipoh, Perak)
  {
    id: "need_rice_1",
    title: "10kg AAA Fragrant White Rice & Cooking Oil (5kg)",
    category: "Food",
    categories: ["Food", "Emergency", "Foods", "Living Things"],
    tags: ["Daily Use", "Staple Food", "Pantry Restock"],
    brand: "AAA Jasmine / Jati",
    color: "Any",
    description: "Essential monthly food ration packets for 80 low-income B40 families and elderly folks at Ipoh Soup Kitchen.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Ipoh, Perak",
    quantity: 80,
    unit: "bags",
    pledgedQuantity: 45,
    postedDate: "2026-08-15",
    postedTimestamp: 1755244800000,
    status: "active",
    urgencyLevel: "urgent",
    authorName: "Uncle Tan Ah Hock",
    authorEmail: "tan.ahhock@ipohfoodbank.org",
    organizerName: "Ipoh Community Soup Kitchen & Food Hub",
    organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    createdByUserEmail: "tan.ahhock@ipohfoodbank.org",
    createdByUsername: "Uncle Tan Ah Hock"
  },

  // 3. Fatimah Zahra / Kuantan Shelter (Kuantan, Pahang)
  {
    id: "need_firstaid_1",
    title: "Emergency Trauma First Aid Kits & Sterile Gauze",
    category: "Medical",
    categories: ["Medical", "Emergency", "Living Things"],
    tags: ["Monsoon Relief", "First Aid", "Disaster Relief"],
    brand: "Any brand",
    color: "Red",
    description: "Rapid response first-aid sets containing sterile bandages, burn gel, antiseptics, and pulse oximeters for flood evacuation center.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"],
    location: "Kuantan, Pahang",
    quantity: 50,
    unit: "kits",
    pledgedQuantity: 30,
    postedDate: "2026-08-20",
    postedTimestamp: 1755676800000,
    status: "active",
    urgencyLevel: "emergency",
    authorName: "Fatimah Zahra",
    authorEmail: "fatimah.zahra@kuantanrelief.org",
    organizerName: "Kuantan Evacuation & Flood Shelter",
    organizerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    createdByUserEmail: "fatimah.zahra@kuantanrelief.org",
    createdByUsername: "Fatimah Zahra"
  },
  {
    id: "need_water_1",
    title: "Emergency Clean Drinking Water (1.5L x 12 Bottles)",
    category: "Food",
    categories: ["Food", "Emergency", "Foods", "Living Things"],
    tags: ["Monsoon Relief", "Clean Water", "Emergency"],
    brand: "Spritzer / Cactus / Any",
    color: "Any",
    description: "Safe bottled drinking water cartons for displaced families where municipal supply was disrupted by heavy rains.",
    imageUrl: EMERGENCY_WATER_IMAGE,
    images: [EMERGENCY_WATER_IMAGE],
    location: "Kuantan, Pahang",
    quantity: 100,
    unit: "cartons",
    pledgedQuantity: 100,
    postedDate: "2026-08-21",
    postedTimestamp: 1755763200000,
    status: "fulfilled",
    fulfilledDate: "2026-08-24",
    urgencyLevel: "emergency",
    authorName: "Fatimah Zahra",
    authorEmail: "fatimah.zahra@kuantanrelief.org",
    organizerName: "Kuantan Evacuation & Flood Shelter",
    organizerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    createdByUserEmail: "fatimah.zahra@kuantanrelief.org",
    createdByUsername: "Fatimah Zahra"
  },

  // 4. Rajesh Kumar / Penang Care (George Town, Penang)
  {
    id: "need_petfood_1",
    title: "Nutritious Dog & Cat Dry Kibbles (15kg)",
    category: "Animal",
    categories: ["Animal", "Animals", "Food", "Living Things"],
    tags: ["Animal Care", "Daily Use"],
    brand: "Royal Canin / Pedigree / Any",
    color: "Any",
    description: "Dry kibbles and canned meat for 60 rescued street animals recovering in shelter quarantine.",
    imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80"],
    location: "George Town, Penang",
    quantity: 40,
    unit: "bags",
    pledgedQuantity: 20,
    postedDate: "2026-08-14",
    postedTimestamp: 1755158400000,
    status: "active",
    urgencyLevel: "medium",
    authorName: "Rajesh Kumar",
    authorEmail: "rajesh.kumar@penangcare.org",
    organizerName: "Penang Disaster Response Network",
    organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    createdByUserEmail: "rajesh.kumar@penangcare.org",
    createdByUsername: "Rajesh Kumar"
  },

  // 5. David Chong / Borneo Aid (Kota Kinabalu, Sabah)
  {
    id: "need_tablet_1",
    title: "Refurbished Educational Android Tablets (10-inch)",
    category: "Education",
    categories: ["Education", "Child", "Living Things"],
    tags: ["School Supplies", "Digital Learning"],
    brand: "Lenovo Tab M10 / Samsung / Any",
    color: "Black",
    description: "Tablets loaded with offline digital learning tools for indigenous primary students in rural Sabah.",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"],
    location: "Kota Kinabalu, Sabah",
    quantity: 15,
    unit: "units",
    pledgedQuantity: 10,
    postedDate: "2026-08-19",
    postedTimestamp: 1755590400000,
    status: "active",
    urgencyLevel: "standard",
    authorName: "David Chong",
    authorEmail: "david.chong@borneoaid.org.my",
    organizerName: "Borneo Indigenous Community Aid",
    organizerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    createdByUserEmail: "david.chong@borneoaid.org.my",
    createdByUsername: "David Chong"
  },

  // 6. Campaign & Community Needs Catalog Items
  {
    id: "need_1",
    title: "Campaign A - Dog's Foods",
    category: "Animal",
    categories: ["Animals", "Emergency", "Foods", "Living Things"],
    tags: ["Animal Rescue", "Daily Use"],
    description: "Urgent dry kibbles and canned meat required for 45 rescued shelter dogs following monsoon shelter flooding.",
    imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Sibu, Sabah",
    quantity: 10,
    unit: "bags",
    pledgedQuantity: 6,
    organizerName: "Sibu Animal Hope Shelter (NGO)",
    organizerAvatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=80",
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    campaignTitle: "Campaign A",
    urgencyLevel: "emergency"
  },
  {
    id: "need_9",
    title: "Clean Drinking Water Cartons",
    category: "Food",
    categories: ["Foods", "Emergency", "Living Things"],
    tags: ["Disaster Relief", "Monsoon Relief"],
    description: "Cartons of 1.5L mineral water bottles for relief distribution to displaced flood victims.",
    imageUrl: SPRITZER_WATER_CARTON_IMAGE,
    images: [SPRITZER_WATER_CARTON_IMAGE],
    location: "Johor Bahru, Johor",
    quantity: 40,
    unit: "cartons",
    pledgedQuantity: 28,
    organizerName: "Johor Flood Relief Network (Charity)",
    organizerAvatar: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=300&q=80",
    postedDate: "4 DAYS AGO",
    postedTimestamp: Date.now() - 345600000,
    status: "active",
    urgencyLevel: "emergency"
  },
  {
    id: "need_11",
    title: "Water Filtration Kits & Boots",
    category: "Emergency",
    categories: ["Living Things", "Emergency", "Shoes"],
    tags: ["Rural Aid", "Safe Water"],
    description: "Portable ceramic water gravity filters and safety rubber boots for rural river villages.",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"],
    location: "Kuching, Sarawak",
    quantity: 15,
    unit: "kits",
    pledgedQuantity: 9,
    organizerName: "Sarawak Rural Safe Water Mission (NGO)",
    organizerAvatar: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=80",
    postedDate: "5 DAYS AGO",
    postedTimestamp: Date.now() - 432000000,
    status: "active",
    urgencyLevel: "emergency"
  },
  {
    id: "need_2",
    title: "Baby Pampers",
    category: "Others",
    categories: ["Baby", "Personal Care", "Living Things"],
    tags: ["Infant Care", "Daily Use"],
    brand: "Drypers / Huggies",
    description: "Diapers size M and L for 13 infant families in local community daycare centers.",
    imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Bangsar, KL",
    quantity: 13,
    unit: "packs",
    pledgedQuantity: 10,
    organizerName: "Bangsar Infant Care Relief (Charity)",
    organizerAvatar: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=300&q=80",
    postedDate: "3 DAYS AGO",
    postedTimestamp: Date.now() - 259200000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_3",
    title: "Campaign B - Storybooks",
    category: "Education",
    categories: ["Books", "Education", "Child"],
    tags: ["School Supplies", "Education"],
    description: "Illustrated moral storybooks and early reading sets for community kindergarten learning library.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Sibu, Sabah",
    quantity: 10,
    unit: "sets",
    pledgedQuantity: 6,
    organizerName: "Sibu Community Kindergarten (NGO)",
    organizerAvatar: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80",
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    campaignTitle: "Campaign B",
    urgencyLevel: "medium"
  },
  {
    id: "need_4",
    title: "Campaign A - Lego for Kids",
    category: "Others",
    categories: ["Toys", "Child", "Education"],
    tags: ["Education", "Children"],
    description: "Creative building brick kits and classic Lego blocks for children trauma relief workshops.",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Sibu, Sabah",
    quantity: 10,
    unit: "boxes",
    pledgedQuantity: 5,
    organizerName: "Kids Hope Workshop Foundation (NGO)",
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    campaignTitle: "Campaign A",
    urgencyLevel: "standard"
  },
  {
    id: "need_5",
    title: "Canned Food & Provisions",
    category: "Food",
    categories: ["Foods", "Living Things"],
    tags: ["Daily Use", "Pantry Restock"],
    description: "Assorted canned soups, baked beans, tomato puree, and canned fish for family meal packs.",
    imageUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Sibu, Sabah",
    quantity: 10,
    unit: "cans",
    pledgedQuantity: 6,
    organizerName: "Sibu Relief Food Bank (NGO)",
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_6",
    title: "Blankets & Towel Request",
    category: "Clothing",
    categories: ["Clothing", "Textiles", "Household"],
    tags: ["Household", "Daily Use", "Not Emergency"],
    brand: "Any brand",
    color: "Any",
    organizerName: "WeAreCharity1 (NGO)",
    organizerAvatar: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=150&q=80",
    description: "Urgent need for comfortable fleece blankets, cotton bedsheets, and bath towels to assist night shelter occupants and nursing home elderly in Sibu, Sabah.",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Sibu, Sabah",
    quantity: 10,
    unit: "pieces",
    pledgedQuantity: 3,
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_household_1",
    title: "Foldable Single Mattresses & Foam Beds",
    category: "Household",
    categories: ["Household", "Furniture", "Living Things"],
    tags: ["Household", "Shelter Support"],
    description: "Comfortable high-density foldable foam mattresses and sleeping mats for displaced families in temporary relief center.",
    imageUrl: FOLDABLE_MATTRESS_IMAGE,
    images: [FOLDABLE_MATTRESS_IMAGE],
    location: "Shah Alam, Selangor",
    quantity: 15,
    unit: "mattresses",
    pledgedQuantity: 9,
    organizerName: "Shah Alam Emergency Shelter (Charity)",
    postedDate: "1 DAY AGO",
    postedTimestamp: Date.now() - 86400000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_household_2",
    title: "Electric Kettles & Cooking Stoves",
    category: "Household",
    categories: ["Household", "Living Things"],
    tags: ["Household", "Daily Use"],
    description: "Rapid-boil stainless steel electric water kettles and portable single-burner induction hotplates for community kitchen.",
    imageUrl: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80"],
    location: "Klang, Selangor",
    quantity: 12,
    unit: "units",
    pledgedQuantity: 7,
    organizerName: "Klang Community Kitchen (NGO)",
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_household_3",
    title: "Bed Linens & Supportive Pillows",
    category: "Household",
    categories: ["Household", "Furniture"],
    tags: ["Household", "Daily Use"],
    description: "Washable fitted bedsheet sets, pillowcases, and hypoallergenic soft sleeping pillows for community shelter beds.",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"],
    location: "Petaling Jaya, Selangor",
    quantity: 25,
    unit: "sets",
    pledgedQuantity: 16,
    organizerName: "Petaling Shelter Initiative (NGO)",
    postedDate: "3 DAYS AGO",
    postedTimestamp: Date.now() - 259200000,
    status: "active",
    urgencyLevel: "standard"
  },
  {
    id: "need_8",
    title: "Wheelchairs for Elderly Shelter",
    category: "Medical",
    categories: ["Medical", "Elderly / OKU"],
    tags: ["Elderly Care", "Medical Equipment"],
    description: "Foldable lightweight mobility wheelchairs for senior citizens recovering from stroke.",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"],
    location: "George Town, Penang",
    quantity: 5,
    unit: "units",
    pledgedQuantity: 3,
    organizerName: "Penang Elderly Care Foundation (NGO)",
    postedDate: "3 DAYS AGO",
    postedTimestamp: Date.now() - 259200000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_10",
    title: "School Bags & Stationery Packs",
    category: "Education",
    categories: ["Education", "Child", "Books"],
    tags: ["School Supplies", "Education"],
    description: "Durable backpacks, pencils, color sets, and exercise books for primary school students.",
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80"],
    location: "Ipoh, Perak",
    quantity: 30,
    unit: "sets",
    pledgedQuantity: 20,
    organizerName: "Perak Children Education Aid (NGO)",
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    urgencyLevel: "medium"
  },

  // 7. Admin / Reference Seed Requests (Kampar & Gopeng & Teluk Intan)
  {
    id: "req_1",
    title: "Enfamil Step 1 Baby Infant Formula (850g)",
    category: "Emergency",
    categories: ["Emergency", "Food", "Living Things"],
    tags: ["Infant Care", "Urgent Nutrition"],
    description: "Urgent nutrition needed for 6 displaced infant babies following sudden local flash flood in Perak.",
    imageUrl: ENFALAC_STEP_1_IMAGE,
    images: [
      ENFALAC_STEP_1_IMAGE
    ],
    location: "Kampar Relief Evacuation Center, Perak",
    quantity: 30,
    unit: "tins",
    pledgedQuantity: 18,
    postedDate: "12 Aug 2026, 09:30 AM",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    campaignId: "camp_flood_2026",
    campaignTitle: "Kampar Monsoon Flood Aid Drive",
    urgencyLevel: "high"
  },
  {
    id: "req_2",
    title: "10kg AAA Fragrant White Rice & Cooking Oil (5kg)",
    category: "Food",
    categories: ["Food", "Daily Use"],
    tags: ["Daily Use", "Staple Food"],
    description: "Monthly staple food packs for 45 registered B40 low-income single parent households in Ipoh.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Persatuan Kebajikan Kasih Perak Hub, Ipoh",
    quantity: 45,
    unit: "packs",
    pledgedQuantity: 30,
    postedDate: "10 Aug 2026, 02:15 PM",
    postedTimestamp: Date.now() - 345600000,
    status: "active",
    campaignId: "camp_food_pantry",
    campaignTitle: "Community Food Pantry Sustenance",
    urgencyLevel: "medium"
  },
  {
    id: "req_3",
    title: "Stray Animal Dry Kibbles & Wound Antiseptic Spray",
    category: "Animal",
    categories: ["Animal", "Medical", "Living Things"],
    tags: ["Animal Rescue", "Medical Care"],
    description: "Supporting 80 rescued community dogs and cats at our local no-kill animal sanctuary.",
    imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Hope Paws Shelter, Jalan Gopeng, Perak",
    quantity: 20,
    unit: "bags (15kg)",
    pledgedQuantity: 8,
    postedDate: "08 Aug 2026, 11:00 AM",
    postedTimestamp: Date.now() - 518400000,
    status: "active",
    urgencyLevel: "standard"
  }
];

/**
 * Loads all community requests combining:
 * 1. The central master request catalog
 * 2. Any stored user requests across all user storage keys
 * 3. Any cached requests in global localStorage
 */
export function getAllMergedCommunityRequests(): RecipientRequest[] {
  if (typeof window === "undefined") {
    return MASTER_COMMUNITY_REQUESTS;
  }

  const map = new Map<string, RecipientRequest>();

  // 1. Put all master requests into map
  MASTER_COMMUNITY_REQUESTS.forEach((req) => {
    map.set(req.id, {
      ...req,
      title: formatCapitalizedTitle(req.title),
      campaignTitle: req.campaignTitle ? formatCapitalizedTitle(req.campaignTitle) : undefined
    });
  });

  // 2. Scan all localStorage keys for any user posted requests
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("aidstory_user_requests") ||
          key === "aidstory_all_needs" ||
          key === "aidstory_recipient_requests")
      ) {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              parsed.forEach((item: RecipientRequest) => {
                if (item && item.id) {
                  const existing = map.get(item.id);
                  if (existing) {
                    map.set(item.id, {
                      ...existing,
                      ...item,
                      // Catalogue-owned images take precedence so cached data cannot
                      // restore an outdated request image for these records.
                      imageUrl: STABLE_REQUEST_IMAGE_IDS.has(item.id) ? existing.imageUrl : item.imageUrl,
                      images: STABLE_REQUEST_IMAGE_IDS.has(item.id) ? existing.images : item.images,
                      title: formatCapitalizedTitle(item.title || existing.title),
                      campaignTitle: item.campaignTitle
                        ? formatCapitalizedTitle(item.campaignTitle)
                        : existing.campaignTitle
                        ? formatCapitalizedTitle(existing.campaignTitle)
                        : undefined
                    });
                  } else {
                    map.set(item.id, {
                      ...item,
                      title: formatCapitalizedTitle(item.title),
                      campaignTitle: item.campaignTitle
                        ? formatCapitalizedTitle(item.campaignTitle)
                        : undefined
                    });
                  }
                }
              });
            }
          } catch {}
        }
      }
    }
  } catch {}

  return Array.from(map.values()).map((request) => ({
    ...request,
    location: getCharityLocationForRequest(request)
  }));
}

/**
 * Saves and notifies all parts of the application that requests have changed
 */
export function broadcastCommunityRequestsUpdate(updatedList?: RecipientRequest[]) {
  if (typeof window === "undefined") return;

  try {
    const listToSave = updatedList || getAllMergedCommunityRequests();
    localStorage.setItem("aidstory_all_needs", JSON.stringify(listToSave));
    localStorage.setItem("aidstory_recipient_requests", JSON.stringify(listToSave));

    window.dispatchEvent(
      new CustomEvent("aidstory_requests_updated", {
        detail: { count: listToSave.length, timestamp: Date.now() }
      })
    );
  } catch (err) {
    console.warn("Broadcast community requests update failed:", err);
  }
}
