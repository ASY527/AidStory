import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Search,
  Camera,
  X,
  SlidersHorizontal,
  Share2,
  Package,
  Gift,
  Info,
  CheckCircle2,
  MapPin,
  Clock,
  Heart,
  ChevronRight,
  Maximize2,
  Sparkles,
  ArrowRight,
  Truck,
  Building2,
  Send,
  Upload,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Boxes,
  Check
} from "lucide-react";
import { RecipientRequest, RequestCategory } from "../types";
import { RequestDetailModal } from "./RequestDetailModal";

export interface DonateBoxCartItem {
  id: string;
  requestId: string;
  title: string;
  category: string;
  imageUrl: string;
  location: string;
  unit: string;
  quantity: number;
  maxNeeded: number;
}

interface AppNeedsProps {
  navigateToView: (view: "home" | "comments" | "explore" | "main_menu" | "your_request" | "needs" | "preparing_donate_box") => void;
}

// Initial seed requests that match the exact requests in the AidStory reference image
export const DEFAULT_NEEDS_REQUESTS: RecipientRequest[] = [
  {
    id: "need_1",
    title: "Campaign A - DOG'S FOODS",
    category: "Animal",
    categories: ["Animals", "Emergency", "Foods"],
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
    categories: ["Foods", "Emergency"],
    description: "Cartons of 1.5L mineral water bottles for relief distribution to displaced flood victims.",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80"],
    location: "Johor Bahru, Johor",
    quantity: 40,
    unit: "cartons",
    pledgedQuantity: 28,
    organizerName: "Johor Flood Relief Network (Charity)",
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
    description: "Portable ceramic water gravity filters and safety rubber boots for rural river villages.",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"],
    location: "Kuching, Sarawak",
    quantity: 15,
    unit: "kits",
    pledgedQuantity: 9,
    organizerName: "Sarawak Rural Safe Water Mission (NGO)",
    postedDate: "5 DAYS AGO",
    postedTimestamp: Date.now() - 432000000,
    status: "active",
    urgencyLevel: "emergency"
  },
  {
    id: "need_2",
    title: "BABY PAMPERS",
    category: "Others",
    categories: ["Baby", "Personal Care", "Living Things"],
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
    postedDate: "3 DAYS AGO",
    postedTimestamp: Date.now() - 259200000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_3",
    title: "Campaign B - STORYBOOKS",
    category: "Education",
    categories: ["Books", "Education", "Child"],
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
    distanceText: "5 km away from you",
    description: "Urgent need for comfortable fleece blankets, cotton bedsheets, and bath towels to assist night shelter occupants and nursing home elderly in Sibu, Sabah.",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
    ],
    location: "Sibu, Sabah",
    quantity: 10,
    unit: "pieces",
    pledgedQuantity: 3,
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    urgencyLevel: "medium",
    updates: [
      {
        id: "up_6_1",
        date: "3/5/2026",
        text: "Currently, we receive some calls and messages for these essentials. Thanks for all donor support!",
        author: "WeAreCharity1 (NGO)"
      },
      {
        id: "up_6_2",
        date: "1/5/2026",
        text: "Aid campaign opened for emergency night shelter winter and thermal provisions.",
        author: "WeAreCharity1 (NGO)"
      }
    ],
    comments: [
      {
        id: "comm_6_1",
        userName: "IamDonor1",
        avatarUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=150&q=80",
        comment: "Hope to hear your good news....",
        date: "2h ago"
      },
      {
        id: "comm_6_2",
        userName: "IamDonor2",
        avatarUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=150&q=80",
        comment: "Pledged 2 sets of warm blankets! Will drop them off this Friday.",
        date: "1h ago"
      }
    ]
  },
  {
    id: "need_6b",
    title: "Warm Winter Jackets & Sweaters",
    category: "Clothing",
    categories: ["Clothing", "Textiles"],
    description: "Cold weather jackets, sweaters, and fleece jumpers for displaced flood shelter families.",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"],
    location: "Shah Alam, Selangor",
    quantity: 20,
    unit: "jackets",
    pledgedQuantity: 14,
    organizerName: "Shah Alam Disaster Relief (Charity)",
    postedDate: "1 DAY AGO",
    postedTimestamp: Date.now() - 86400000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_6c",
    title: "Cotton Bath Towels & Face Cloths",
    category: "Clothing",
    categories: ["Clothing", "Textiles"],
    description: "Absorbent large bath towels and soft washcloths for community evacuation center showers.",
    imageUrl: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800&q=80"],
    location: "Petaling Jaya, Selangor",
    quantity: 35,
    unit: "towels",
    pledgedQuantity: 22,
    organizerName: "Petaling Community Care (NGO)",
    postedDate: "2 DAYS AGO",
    postedTimestamp: Date.now() - 172800000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_6d",
    title: "Durable Walking Shoes & Sneakers",
    category: "Clothing",
    categories: ["Clothing", "Shoes"],
    description: "Comfortable non-slip walking shoes and athletic sneakers in sizes 38 to 44 for relief volunteers and residents.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
    location: "Klang, Selangor",
    quantity: 18,
    unit: "pairs",
    pledgedQuantity: 11,
    organizerName: "Klang Valley Relief Mission (Charity)",
    postedDate: "3 DAYS AGO",
    postedTimestamp: Date.now() - 259200000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_6e",
    title: "Thermal Socks & Cotton Undershirts",
    category: "Clothing",
    categories: ["Clothing", "Textiles"],
    description: "Clean new breathable cotton socks (multipacks) and undershirts for nursing home elders.",
    imageUrl: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80"],
    location: "Subang Jaya, Selangor",
    quantity: 50,
    unit: "pairs",
    pledgedQuantity: 30,
    organizerName: "Subang Elderly Care Society (NGO)",
    postedDate: "4 DAYS AGO",
    postedTimestamp: Date.now() - 345600000,
    status: "active",
    urgencyLevel: "standard"
  },
  {
    id: "need_7",
    title: "10kg AAA Fragrant White Rice",
    category: "Food",
    categories: ["Foods", "Living Things"],
    description: "Essential 10kg bags of white rice to support low-income families and single mothers in Klang Valley.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80"],
    location: "Shah Alam, Selangor",
    quantity: 25,
    unit: "bags",
    pledgedQuantity: 18,
    organizerName: "Selangor Food Aid Network (NGO)",
    postedDate: "1 DAY AGO",
    postedTimestamp: Date.now() - 86400000,
    status: "active",
    urgencyLevel: "medium"
  },
  {
    id: "need_household_1",
    title: "Foldable Single Mattresses & Foam Beds",
    category: "Household",
    categories: ["Household", "Furniture", "Living Things"],
    description: "Comfortable high-density foldable foam mattresses and sleeping mats for displaced families in temporary relief center.",
    imageUrl: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80"],
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
  }
];

// Exact badge color styling dictionary matching the AidStory design system
export const BADGE_COLOR_MAP: Record<string, { bg: string; text: string }> = {
  EMERGENCY: { bg: "bg-[#d31818]", text: "text-white" },
  URGENT: { bg: "bg-[#d31818]", text: "text-white" },
  "URGENT NEED": { bg: "bg-[#d31818]", text: "text-white" },
  CRITICAL: { bg: "bg-[#d31818]", text: "text-white" },
  ANIMALS: { bg: "bg-[#0288d1]", text: "text-white" },
  ANIMAL: { bg: "bg-[#0288d1]", text: "text-white" },
  FOODS: { bg: "bg-[#f4511e]", text: "text-white" },
  FOOD: { bg: "bg-[#f4511e]", text: "text-white" },
  BABY: { bg: "bg-[#d81b60]", text: "text-white" },
  "PERSONAL CARE": { bg: "bg-[#00897b]", text: "text-white" },
  "LIVING THINGS": { bg: "bg-[#8e24aa]", text: "text-white" },
  CHILD: { bg: "bg-[#00838f]", text: "text-white" },
  BOOKS: { bg: "bg-[#e65100]", text: "text-white" },
  TOYS: { bg: "bg-[#f57c00]", text: "text-white" },
  MEDICAL: { bg: "bg-[#c62828]", text: "text-white" },
  EDUCATION: { bg: "bg-[#1565c0]", text: "text-white" },
  CLOTHING: { bg: "bg-[#2e7d32]", text: "text-white" },
  SHOES: { bg: "bg-[#37474f]", text: "text-white" },
  TEXTILES: { bg: "bg-[#5e35b1]", text: "text-white" },
  HOUSEHOLD: { bg: "bg-[#00796b]", text: "text-white" },
  FURNITURE: { bg: "bg-[#689f38]", text: "text-white" },
  "DAILY USE": { bg: "bg-[#7cb342]", text: "text-white" },
  "NOT EMERGENCY": { bg: "bg-[#2e7d32]", text: "text-white" },
  "ELDERLY / OKU": { bg: "bg-[#5d4037]", text: "text-white" },
  OTHERS: { bg: "bg-[#455a64]", text: "text-white" }
};

// Helper to extract category badges for a request consistently
export const getBadgesForRequest = (req: RecipientRequest): string[] => {
  if (req.categories && req.categories.length > 0) {
    return req.categories;
  }
  if (req.category) {
    if (req.category === "Emergency") return ["EMERGENCY"];
    if (req.category === "Food") return ["FOODS"];
    if (req.category === "Animal") return ["ANIMALS"];
    if (req.category === "Education") return ["EDUCATION", "BOOKS"];
    if (req.category === "Clothing") return ["CLOTHING", "TEXTILES"];
    if (req.category === "Household") return ["HOUSEHOLD", "FURNITURE"];
    return [req.category.toUpperCase()];
  }
  return ["GENERAL"];
};

// Helper to determine if a request is Emergency / Urgent
export const isEmergencyOrUrgent = (req: RecipientRequest): boolean => {
  const badges = (req.categories || (req.category ? [req.category] : [])).map((b) => b.toUpperCase());
  const tags = (req.tags || []).map((t) => t.toUpperCase());
  const cat = (req.category || "").toUpperCase();
  const urgency = (req.urgencyLevel || "").toLowerCase();

  // Explicit 'Not Emergency' override
  if (tags.some((t) => t.includes("NOT EMERGENCY")) || badges.some((b) => b.includes("NOT EMERGENCY"))) {
    return false;
  }

  // Check for Emergency / Urgent badges or category
  if (
    badges.includes("EMERGENCY") ||
    badges.includes("URGENT") ||
    badges.includes("CRITICAL") ||
    tags.includes("EMERGENCY") ||
    tags.includes("URGENT") ||
    cat === "EMERGENCY" ||
    urgency === "emergency" ||
    urgency === "urgent"
  ) {
    return true;
  }

  return false;
};

// Card color themes: Red for Emergency / Urgent items, Green for Non-Emergency items
export const getCardBgTheme = (req: RecipientRequest): string => {
  if (isEmergencyOrUrgent(req)) {
    // Red / Burgundy for Emergency & Urgent items
    return "bg-[#541221] border-[#7a1b32]/50 hover:border-red-400/50";
  }
  // Green for Non-Emergency items
  return "bg-[#1d4334] border-[#295c47]/50 hover:border-emerald-400/50";
};

// Fallback legacy array if needed
const CARD_BG_THEMES = [
  "bg-[#541221] border-[#7a1b32]/40",
  "bg-[#1d4334] border-[#295c47]/40"
];

interface CategoryBannerData {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  campaignCount: number;
  independentCount: number;
  topItems: { name: string; count: number; max: number; color: string }[];
}

interface StateBannerData {
  id: string;
  name: string;
  imageUrl: string;
  cityTags: string[];
  campaignCount: number;
  independentCount: number;
  topItems: { name: string; count: number; max: number; color: string }[];
}

const CATEGORY_BANNER_LIST: CategoryBannerData[] = [
  {
    id: "clothing",
    title: "CLOTHING,\nFOOTWEAR & TEXTILES",
    imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&auto=format&fit=crop&q=80",
    tags: ["CLOTHING", "TEXTILES", "BLANKETS", "SHOES", "FOOTWEAR", "JACKETS", "TOWELS", "SOCKS", "SWEATERS"],
    campaignCount: 7,
    independentCount: 10,
    topItems: [
      { name: "Winter Jackets", count: 78, max: 80, color: "#3b82f6" },
      { name: "Bath Towels", count: 60, max: 80, color: "#a78bfa" },
      { name: "Walking Shoes", count: 45, max: 80, color: "#fba94b" },
      { name: "Thermal Blankets", count: 35, max: 80, color: "#fde047" },
      { name: "Cotton Socks", count: 20, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "education",
    title: "EDUCATION\n& OFFICE SUPPLIES",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&auto=format&fit=crop&q=80",
    tags: ["BOOKS", "TOYS", "EDUCATION", "STORYBOOKS", "LEGO", "CHILD"],
    campaignCount: 4,
    independentCount: 6,
    topItems: [
      { name: "Storybooks", count: 65, max: 80, color: "#3b82f6" },
      { name: "Lego sets", count: 52, max: 80, color: "#a78bfa" },
      { name: "Notebooks", count: 40, max: 80, color: "#fba94b" },
      { name: "Stationery", count: 28, max: 80, color: "#fde047" },
      { name: "School bags", count: 14, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "food",
    title: "FOOD & NUTRITION",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80",
    tags: ["FOODS", "CANNED FOOD", "RICE", "DOG'S FOODS", "FOOD"],
    campaignCount: 5,
    independentCount: 8,
    topItems: [
      { name: "Tinned Food", count: 78, max: 80, color: "#3b82f6" },
      { name: "White Rice", count: 58, max: 80, color: "#a78bfa" },
      { name: "Dog's Foods", count: 44, max: 80, color: "#fba94b" },
      { name: "Cooking Oil", count: 32, max: 80, color: "#fde047" },
      { name: "Dry Milk", count: 12, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "personal_care",
    title: "PERSONAL CARE\n& HYGIENE",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&auto=format&fit=crop&q=80",
    tags: ["BABY", "PAMPERS", "MEDICAL", "HYGIENE", "PERSONAL CARE"],
    campaignCount: 3,
    independentCount: 9,
    topItems: [
      { name: "Baby Pampers", count: 72, max: 80, color: "#3b82f6" },
      { name: "Wet Wipes", count: 50, max: 80, color: "#a78bfa" },
      { name: "Antiseptic", count: 38, max: 80, color: "#fba94b" },
      { name: "Bath Soap", count: 24, max: 80, color: "#fde047" },
      { name: "Sanitary Pads", count: 15, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "household",
    title: "HOUSEHOLD GOODS\n& FURNITURE",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80",
    tags: ["FURNITURE", "HOUSEHOLD", "MATTRESSES", "KETTLES", "BED LINENS", "PILLOWS"],
    campaignCount: 2,
    independentCount: 7,
    topItems: [
      { name: "Blankets", count: 68, max: 80, color: "#3b82f6" },
      { name: "Mattresses", count: 48, max: 80, color: "#a78bfa" },
      { name: "Kettles", count: 34, max: 80, color: "#fba94b" },
      { name: "Bed Linens", count: 22, max: 80, color: "#fde047" },
      { name: "Pillows", count: 12, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "others",
    title: "OTHERS",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop&q=80",
    tags: ["OTHERS", "OTHER", "MEDICAL", "ELDERLY / OKU", "ANIMALS", "ANIMAL", "EMERGENCY", "LIVING THINGS", "GENERAL", "COMMUNITY", "WHEELCHAIR", "FILTER"],
    campaignCount: 3,
    independentCount: 6,
    topItems: [
      { name: "Wheelchairs", count: 70, max: 80, color: "#3b82f6" },
      { name: "Water Filtration", count: 52, max: 80, color: "#a78bfa" },
      { name: "Animal Food", count: 44, max: 80, color: "#fba94b" },
      { name: "Medical Kits", count: 32, max: 80, color: "#fde047" },
      { name: "Specialized Aid", count: 18, max: 80, color: "#fb7185" },
    ],
  },
];

const MALAYSIA_STATES_BANNER_LIST: StateBannerData[] = [
  {
    id: "selangor",
    name: "SELANGOR",
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Selangor", "Petaling Jaya", "Shah Alam", "Klang", "Subang", "Rawang", "Gombak", "Ampang", "Kajang", "Puchong", "Cyberjaya", "Sepang", "Banting"],
    campaignCount: 8,
    independentCount: 14,
    topItems: [
      { name: "White Rice", count: 75, max: 80, color: "#3b82f6" },
      { name: "Baby Pampers", count: 62, max: 80, color: "#a78bfa" },
      { name: "Tinned Food", count: 48, max: 80, color: "#fba94b" },
      { name: "Blankets", count: 35, max: 80, color: "#fde047" },
      { name: "Cooking Oil", count: 18, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "kuala_lumpur",
    name: "KUALA LUMPUR",
    imageUrl: "https://images.unsplash.com/photo-1541417904950-b855846fe074?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Kuala Lumpur", "KL", "Bangsar", "Cheras", "Bukit Bintang", "Kepong", "Setapak", "Sentul", "Titiwangsa"],
    campaignCount: 9,
    independentCount: 16,
    topItems: [
      { name: "Hot Meals", count: 78, max: 80, color: "#3b82f6" },
      { name: "Storybooks", count: 58, max: 80, color: "#a78bfa" },
      { name: "Diapers", count: 46, max: 80, color: "#fba94b" },
      { name: "Sanitary Pads", count: 32, max: 80, color: "#fde047" },
      { name: "Dry Milk", count: 20, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "penang",
    name: "PENANG\n(PULAU PINANG)",
    imageUrl: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Penang", "Pulau Pinang", "George Town", "Butterworth", "Bayan Lepas", "Seberang Perai", "Bukit Mertajam"],
    campaignCount: 6,
    independentCount: 11,
    topItems: [
      { name: "Wheelchairs", count: 70, max: 80, color: "#3b82f6" },
      { name: "Adult Diapers", count: 55, max: 80, color: "#a78bfa" },
      { name: "Canned Food", count: 42, max: 80, color: "#fba94b" },
      { name: "Towels", count: 28, max: 80, color: "#fde047" },
      { name: "Walking Shoes", count: 14, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "johor",
    name: "JOHOR",
    imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Johor", "Johor Bahru", "JB", "Muar", "Batu Pahat", "Kluang", "Kulai", "Segamat", "Pontian", "Kota Tinggi", "Mersing", "Pasir Gudang"],
    campaignCount: 7,
    independentCount: 12,
    topItems: [
      { name: "Rice Packs", count: 72, max: 80, color: "#3b82f6" },
      { name: "Bottled Water", count: 56, max: 80, color: "#a78bfa" },
      { name: "Mattresses", count: 44, max: 80, color: "#fba94b" },
      { name: "First Aid Kits", count: 30, max: 80, color: "#fde047" },
      { name: "Dog Food", count: 16, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "perak",
    name: "PERAK",
    imageUrl: "https://images.unsplash.com/photo-1628178129486-1d16723223ec?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Perak", "Ipoh", "Taiping", "Teluk Intan", "Manjung", "Kuala Kangsar", "Kampar", "Sitiawan", "Batu Gajah", "Lumut", "Tapah"],
    campaignCount: 5,
    independentCount: 9,
    topItems: [
      { name: "Rice Bags", count: 68, max: 80, color: "#3b82f6" },
      { name: "Fleece Blankets", count: 50, max: 80, color: "#a78bfa" },
      { name: "School Stationery", count: 38, max: 80, color: "#fba94b" },
      { name: "Tinned Fish", count: 26, max: 80, color: "#fde047" },
      { name: "Socks", count: 12, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "sabah",
    name: "SABAH",
    imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Sabah", "Kota Kinabalu", "Sandakan", "Tawau", "Lahad Datu", "Keningau", "Semporna", "Kundasang", "Ranau", "Penampang", "Sibu, Sabah"],
    campaignCount: 8,
    independentCount: 15,
    topItems: [
      { name: "Storybooks", count: 76, max: 80, color: "#3b82f6" },
      { name: "Lego Kits", count: 64, max: 80, color: "#a78bfa" },
      { name: "Solar Lamps", count: 48, max: 80, color: "#fba94b" },
      { name: "School Uniforms", count: 34, max: 80, color: "#fde047" },
      { name: "Canned Food", count: 22, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "sarawak",
    name: "SARAWAK",
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Sarawak", "Kuching", "Miri", "Sibu", "Bintulu", "Samarahan", "Sri Aman", "Sarikei", "Limbang", "Kapit", "Mukah"],
    campaignCount: 7,
    independentCount: 13,
    topItems: [
      { name: "Raincoats & Boots", count: 74, max: 80, color: "#3b82f6" },
      { name: "Children Books", count: 59, max: 80, color: "#a78bfa" },
      { name: "Rice Packs", count: 45, max: 80, color: "#fba94b" },
      { name: "Water Filters", count: 32, max: 80, color: "#fde047" },
      { name: "Bed Linens", count: 18, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "pahang",
    name: "PAHANG",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Pahang", "Kuantan", "Temerloh", "Bentong", "Cameron Highlands", "Raub", "Jerantut", "Pekan", "Bera", "Lipis", "Rompin"],
    campaignCount: 6,
    independentCount: 10,
    topItems: [
      { name: "Warm Sweaters", count: 70, max: 80, color: "#3b82f6" },
      { name: "Flood Relief Bags", count: 54, max: 80, color: "#a78bfa" },
      { name: "Drinking Water", count: 42, max: 80, color: "#fba94b" },
      { name: "Emergency Kits", count: 28, max: 80, color: "#fde047" },
      { name: "Tarpaulins", count: 14, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "kedah",
    name: "KEDAH",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Kedah", "Alor Setar", "Sungai Petani", "Kulim", "Langkawi", "Kubang Pasu", "Baling", "Yan", "Pendang", "Sik"],
    campaignCount: 4,
    independentCount: 8,
    topItems: [
      { name: "School Stationery", count: 66, max: 80, color: "#3b82f6" },
      { name: "White Rice", count: 52, max: 80, color: "#a78bfa" },
      { name: "Infant Formulas", count: 40, max: 80, color: "#fba94b" },
      { name: "Sanitary Wipes", count: 26, max: 80, color: "#fde047" },
      { name: "Cooking Oil", count: 15, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "kelantan",
    name: "KELANTAN",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Kelantan", "Kota Bharu", "Pasir Mas", "Tumpat", "Bachok", "Tanah Merah", "Machang", "Gua Musang", "Kuala Krai", "Jeli"],
    campaignCount: 5,
    independentCount: 9,
    topItems: [
      { name: "Clean Bottled Water", count: 77, max: 80, color: "#3b82f6" },
      { name: "Dry Food Rations", count: 60, max: 80, color: "#a78bfa" },
      { name: "Mats & Blankets", count: 46, max: 80, color: "#fba94b" },
      { name: "Hygiene Packs", count: 32, max: 80, color: "#fde047" },
      { name: "Flashlights", count: 18, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "terengganu",
    name: "TERENGGANU",
    imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Terengganu", "Kuala Terengganu", "Kemaman", "Dungun", "Besut", "Marang", "Hulu Terengganu", "Setiu", "Redang"],
    campaignCount: 4,
    independentCount: 7,
    topItems: [
      { name: "Flood Essentials", count: 71, max: 80, color: "#3b82f6" },
      { name: "Canned Sardines", count: 53, max: 80, color: "#a78bfa" },
      { name: "Mosquito Nets", count: 39, max: 80, color: "#fba94b" },
      { name: "Towels & Soaps", count: 25, max: 80, color: "#fde047" },
      { name: "Rubber Slippers", count: 14, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "melaka",
    name: "MELAKA\n(MALACCA)",
    imageUrl: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Melaka", "Malacca", "Alor Gajah", "Jasin", "Ayer Keroh", "Bandar Hilir", "Batu Berendam"],
    campaignCount: 3,
    independentCount: 6,
    topItems: [
      { name: "Elderly Care Kits", count: 65, max: 80, color: "#3b82f6" },
      { name: "Non-Perishable Food", count: 49, max: 80, color: "#a78bfa" },
      { name: "Walking Canes", count: 36, max: 80, color: "#fba94b" },
      { name: "Reading Glasses", count: 24, max: 80, color: "#fde047" },
      { name: "Bed Sheets", count: 12, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "negeri_sembilan",
    name: "NEGERI SEMBILAN",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Negeri Sembilan", "Seremban", "Port Dickson", "Nilai", "Jempol", "Tampin", "Kuala Pilah", "Rembau", "Jelebu"],
    campaignCount: 4,
    independentCount: 7,
    topItems: [
      { name: "Bags of Rice", count: 67, max: 80, color: "#3b82f6" },
      { name: "School Bags", count: 51, max: 80, color: "#a78bfa" },
      { name: "Disinfectants", count: 37, max: 80, color: "#fba94b" },
      { name: "Baby Milk Powder", count: 23, max: 80, color: "#fde047" },
      { name: "Towels", count: 12, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "perlis",
    name: "PERLIS",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Perlis", "Kangar", "Arau", "Kuala Perlis", "Padang Besar"],
    campaignCount: 2,
    independentCount: 5,
    topItems: [
      { name: "Agricultural Goods", count: 60, max: 80, color: "#3b82f6" },
      { name: "Canned Rations", count: 45, max: 80, color: "#a78bfa" },
      { name: "Thermal Blankets", count: 33, max: 80, color: "#fba94b" },
      { name: "Children Shoes", count: 21, max: 80, color: "#fde047" },
      { name: "Stationery", count: 10, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "putrajaya",
    name: "W.P. PUTRAJAYA\n& LABUAN",
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=900&auto=format&fit=crop&q=80",
    cityTags: ["Putrajaya", "Labuan", "Federal Territory"],
    campaignCount: 3,
    independentCount: 5,
    topItems: [
      { name: "Community Library Books", count: 64, max: 80, color: "#3b82f6" },
      { name: "Eco Packaging", count: 48, max: 80, color: "#a78bfa" },
      { name: "Baby Diapers", count: 36, max: 80, color: "#fba94b" },
      { name: "Art Supplies", count: 22, max: 80, color: "#fde047" },
      { name: "Snack Packs", count: 11, max: 80, color: "#fb7185" },
    ],
  },
];

interface PriorityBannerData {
  id: string;
  name: string;
  subtitle?: string;
  imageUrl: string;
  categoryType: "ORDER_BY" | "URGENCY" | "STATUS";
  criteria: "HIGH_URGENCY" | "EMERGENCY" | "LATEST" | "OLDEST" | "MOST_FULFILLED" | "LEAST_FULFILLED" | "ACTIVE" | "FULFILLED";
  description: string;
  campaignCount: number;
  independentCount: number;
  topItems: { name: string; count: number; max: number; color: string }[];
}

const PRIORITY_BANNER_LIST: PriorityBannerData[] = [
  {
    id: "least_fulfilled",
    name: "ORDER BY: LEAST FULFILLED\n(GREATEST DEFICIT FIRST)",
    subtitle: "Sort: 0% → 100% (Choose One)",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80",
    categoryType: "ORDER_BY",
    criteria: "LEAST_FULFILLED",
    description: "Orders requests starting with the highest unmet need and lowest pledged percentage.",
    campaignCount: 5,
    independentCount: 12,
    topItems: [
      { name: "Single Mattresses", count: 74, max: 80, color: "#f43f5e" },
      { name: "Electric Kettles", count: 56, max: 80, color: "#fb7185" },
      { name: "Walking Shoes", count: 42, max: 80, color: "#fda4af" },
      { name: "School Bags", count: 30, max: 80, color: "#fecdd3" },
      { name: "Hygiene Soap", count: 16, max: 80, color: "#ffe4e6" },
    ],
  },
  {
    id: "most_fulfilled",
    name: "ORDER BY: MOST FULFILLED\n(ALMOST REACHED FIRST)",
    subtitle: "Sort: 100% → 0% (Choose One)",
    imageUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=900&auto=format&fit=crop&q=80",
    categoryType: "ORDER_BY",
    criteria: "MOST_FULFILLED",
    description: "Orders requests closest to completion at 60% to 90% progress needing a final push.",
    campaignCount: 5,
    independentCount: 9,
    topItems: [
      { name: "White Rice Bags", count: 76, max: 80, color: "#10b981" },
      { name: "Canned Soups", count: 60, max: 80, color: "#34d399" },
      { name: "Children Storybooks", count: 46, max: 80, color: "#6ee7b7" },
      { name: "Adult Diapers", count: 32, max: 80, color: "#a7f3d0" },
      { name: "Thermal Blankets", count: 19, max: 80, color: "#d1fae5" },
    ],
  },
  {
    id: "latest",
    name: "ORDER BY: LATEST POSTED\n(NEWEST FIRST)",
    subtitle: "Sort: Newest → Older (Choose One)",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&auto=format&fit=crop&q=80",
    categoryType: "ORDER_BY",
    criteria: "LATEST",
    description: "Orders requests by newest submission timestamp in the last 24 to 72 hours.",
    campaignCount: 7,
    independentCount: 14,
    topItems: [
      { name: "Fragrant Rice 10kg", count: 75, max: 80, color: "#3b82f6" },
      { name: "Foam Mattresses", count: 58, max: 80, color: "#a78bfa" },
      { name: "Cooking Stoves", count: 44, max: 80, color: "#fba94b" },
      { name: "Winter Sweaters", count: 30, max: 80, color: "#fde047" },
      { name: "Bath Towels", count: 18, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "oldest",
    name: "ORDER BY: OLDEST PENDING\n(LONGEST WAITING FIRST)",
    subtitle: "Sort: Older → Newest (Choose One)",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&auto=format&fit=crop&q=80",
    categoryType: "ORDER_BY",
    criteria: "OLDEST",
    description: "Orders requests that have remained open longest and urgently need donor closure.",
    campaignCount: 3,
    independentCount: 7,
    topItems: [
      { name: "Wheelchairs", count: 70, max: 80, color: "#3b82f6" },
      { name: "Solar Lamps", count: 52, max: 80, color: "#a78bfa" },
      { name: "School Stationery", count: 40, max: 80, color: "#fba94b" },
      { name: "Bed Linens", count: 28, max: 80, color: "#fde047" },
      { name: "Tinned Fish", count: 15, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "high_urgency",
    name: "HIGH URGENCY\n& CRITICAL",
    subtitle: "Urgency Level Filter",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&auto=format&fit=crop&q=80",
    categoryType: "URGENCY",
    criteria: "HIGH_URGENCY",
    description: "Urgent needs requiring swift delivery to prevent disruption to vulnerable centers.",
    campaignCount: 6,
    independentCount: 11,
    topItems: [
      { name: "Emergency Rice", count: 78, max: 80, color: "#ef4444" },
      { name: "First Aid Kits", count: 64, max: 80, color: "#f97316" },
      { name: "Baby Diapers", count: 52, max: 80, color: "#facc15" },
      { name: "Disinfectants", count: 36, max: 80, color: "#3b82f6" },
      { name: "Adult Diapers", count: 24, max: 80, color: "#a855f7" },
    ],
  },
  {
    id: "emergency",
    name: "DISASTER &\nEMERGENCY RELIEF",
    subtitle: "Emergency Level Filter",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=900&auto=format&fit=crop&q=80",
    categoryType: "URGENCY",
    criteria: "EMERGENCY",
    description: "Crisis response gear, rescue provisions, water filters, and emergency food.",
    campaignCount: 4,
    independentCount: 8,
    topItems: [
      { name: "Water Filtration", count: 80, max: 80, color: "#ef4444" },
      { name: "Rubber Boots", count: 62, max: 80, color: "#f97316" },
      { name: "Dry Rations", count: 48, max: 80, color: "#facc15" },
      { name: "Power Banks", count: 34, max: 80, color: "#3b82f6" },
      { name: "Rescue Blankets", count: 20, max: 80, color: "#a855f7" },
    ],
  },
  {
    id: "active_only",
    name: "ACTIVE OPEN\nNEEDS",
    subtitle: "Status Filter",
    imageUrl: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=900&auto=format&fit=crop&q=80",
    categoryType: "STATUS",
    criteria: "ACTIVE",
    description: "All live requests ready for immediate community delivery and courier drop-offs.",
    campaignCount: 8,
    independentCount: 16,
    topItems: [
      { name: "Food Provisions", count: 78, max: 80, color: "#3b82f6" },
      { name: "Personal Hygiene", count: 62, max: 80, color: "#a78bfa" },
      { name: "Household Furniture", count: 48, max: 80, color: "#fba94b" },
      { name: "Medical Equipment", count: 34, max: 80, color: "#fde047" },
      { name: "Warm Clothing", count: 20, max: 80, color: "#fb7185" },
    ],
  },
  {
    id: "fulfilled_completed",
    name: "COMPLETED &\nFULFILLED NEEDS",
    subtitle: "Status Filter",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&auto=format&fit=crop&q=80",
    categoryType: "STATUS",
    criteria: "FULFILLED",
    description: "Archived needs that have achieved 100% pledges through generous donors.",
    campaignCount: 4,
    independentCount: 6,
    topItems: [
      { name: "Flood Blankets", count: 75, max: 80, color: "#10b981" },
      { name: "Rice Rations", count: 58, max: 80, color: "#34d399" },
      { name: "Baby Care Packs", count: 45, max: 80, color: "#6ee7b7" },
      { name: "School Backpacks", count: 30, max: 80, color: "#a7f3d0" },
      { name: "Pet Kibbles", count: 18, max: 80, color: "#d1fae5" },
    ],
  },
];

export default function AppNeeds({ navigateToView }: AppNeedsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [selectedCategoryBannerIds, setSelectedCategoryBannerIds] = useState<string[]>([]);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("ALL");
  const [selectedLocationBannerIds, setSelectedLocationBannerIds] = useState<string[]>([]);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("ALL");
  const [selectedPriorityBannerIds, setSelectedPriorityBannerIds] = useState<string[]>([]);
  const [filterViewMode, setFilterViewMode] = useState<"overview" | "categories" | "location" | "priority">("overview");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(true);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [activeTooltipCardId, setActiveTooltipCardId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected request for full detail modal (image style, updates, community chat)
  const [selectedDetailRequest, setSelectedDetailRequest] = useState<RecipientRequest | null>(null);

  // Selected request for Support / Pledge Modal
  const [selectedSupportReq, setSelectedSupportReq] = useState<RecipientRequest | null>(null);
  const [pledgeQuantityInput, setPledgeQuantityInput] = useState<number>(1);
  const [donorNameInput, setDonorNameInput] = useState("");
  const [donorContactInput, setDonorContactInput] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "dropoff" | "volunteer">("courier");
  const [donorNoteInput, setDonorNoteInput] = useState("");
  const [isPledgeSubmitting, setIsPledgeSubmitting] = useState(false);

  // Image Lightbox View
  const [lightboxImage, setLightboxImage] = useState<{ title: string; url: string } | null>(null);

  // Active Image Index per card for multi-image browsing
  const [cardImageIndex, setCardImageIndex] = useState<Record<string, number>>({});

  // Donate Box (Shopee-like cart for collecting donation items)
  const [donateBoxItems, setDonateBoxItems] = useState<DonateBoxCartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aidstory_donate_box_cart");
        if (saved) return JSON.parse(saved);
      } catch (err) {}
    }
    return [];
  });
  const [isDonateBoxOpen, setIsDonateBoxOpen] = useState(false);
  const [donateBoxDeliveryMethod, setDonateBoxDeliveryMethod] = useState<"courier" | "dropoff" | "volunteer">("courier");
  const [donateBoxDonorNote, setDonateBoxDonorNote] = useState("");
  const [donateBoxDonorName, setDonateBoxDonorName] = useState("");
  const [donateBoxDonorPhone, setDonateBoxDonorPhone] = useState("");
  const [isDonateBoxCheckingOut, setIsDonateBoxCheckingOut] = useState(false);

  // Sync donate box to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(donateBoxItems));
    }
  }, [donateBoxItems]);

  const handleNavigateToDonateBoxPage = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "preparing-donate-box";
    }
    navigateToView("preparing_donate_box");
  };

  const handleAddToDonateBox = (req: RecipientRequest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const remainingNeed = Math.max(1, req.quantity - req.pledgedQuantity);
    
    setDonateBoxItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.requestId === req.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].quantity;
        const nextQty = Math.min(remainingNeed, currentQty + 1);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: nextQty,
          maxNeeded: remainingNeed
        };
        showToast(`Updated "${req.title}" in Donate Box (${nextQty} ${req.unit}) 📦`);
        return updated;
      } else {
        const newItem: any = {
          id: `box_item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          requestId: req.id,
          title: req.title,
          category: req.category,
          imageUrl: req.imageUrl,
          location: req.location,
          unit: req.unit,
          quantity: 1,
          maxNeeded: remainingNeed,
          organizerName: req.organizerName || req.authorName || "Hope Community Aid (NGO)",
          brand: req.brand || "Any brand",
          color: req.color || "Any",
          originalPrice: 240000,
          unitPrice: 195000,
          urgencyDiscount: req.urgencyLevel === "high" ? 25 : 10,
          checked: true,
          donorNote: ""
        };
        showToast(`Collected "${req.title}" into Donate Box! 📦`);
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateDonateBoxQuantity = (itemId: string, newQty: number) => {
    setDonateBoxItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const clamped = Math.max(1, Math.min(item.maxNeeded, newQty));
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const handleRemoveFromDonateBox = (itemId: string) => {
    setDonateBoxItems((prev) => {
      const removed = prev.find((item) => item.id === itemId);
      const filtered = prev.filter((item) => item.id !== itemId);
      if (removed) {
        showToast(`Removed "${removed.title}" from Donate Box`);
      }
      return filtered;
    });
  };

  const handleClearDonateBox = () => {
    setDonateBoxItems([]);
    showToast("Donate Box cleared");
  };

  const handleDonateBoxCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (donateBoxItems.length === 0) return;

    setIsDonateBoxCheckingOut(true);

    setTimeout(() => {
      // Update allRequests pledges
      const updatedRequests = allRequests.map((r) => {
        const cartItem = donateBoxItems.find((item) => item.requestId === r.id);
        if (cartItem) {
          const nextPledged = Math.min(r.quantity, r.pledgedQuantity + cartItem.quantity);
          const nextStatus = nextPledged >= r.quantity ? "fulfilled" : r.status;
          return {
            ...r,
            pledgedQuantity: nextPledged,
            status: nextStatus as any
          };
        }
        return r;
      });

      setAllRequests(updatedRequests);
      localStorage.setItem("aidstory_recipient_requests", JSON.stringify(updatedRequests));

      // Add to user pledged items & completed donations
      const savedPledgesJSON = localStorage.getItem("aidstory_user_pledged_items") || "[]";
      try {
        const savedPledges: string[] = JSON.parse(savedPledgesJSON);
        donateBoxItems.forEach((item) => {
          if (!savedPledges.includes(item.title)) {
            savedPledges.push(item.title);
          }
        });
        localStorage.setItem("aidstory_user_pledged_items", JSON.stringify(savedPledges));
      } catch (err) {}

      const savedCompletedJSON = localStorage.getItem("aidstory_completed_donations") || "[]";
      try {
        const savedCompleted: any[] = JSON.parse(savedCompletedJSON);
        donateBoxItems.forEach((item) => {
          savedCompleted.push({
            id: `donate-box-${Date.now()}-${item.id}`,
            type: "donate_box_cart",
            title: item.title,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            date: new Date().toISOString(),
            status: "completed"
          });
        });
        localStorage.setItem("aidstory_completed_donations", JSON.stringify(savedCompleted));
      } catch (err) {}

      const totalItemsCount = donateBoxItems.reduce((acc, curr) => acc + curr.quantity, 0);
      setDonateBoxItems([]);
      setIsDonateBoxCheckingOut(false);
      setIsDonateBoxOpen(false);
      showToast(`🎉 Success! ${totalItemsCount} donation item(s) dispatched from your Donate Box!`);
    }, 700);
  };

  // Load all requests (merging default requests with any user-created requests in localStorage)
  const [allRequests, setAllRequests] = useState<RecipientRequest[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_recipient_requests");
      if (saved) {
        try {
          const parsed: RecipientRequest[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Keep user-created custom requests and merge default items with fresh category/urgency metadata
            const defaultIdMap = new Map(DEFAULT_NEEDS_REQUESTS.map((d) => [d.id, d]));
            const mergedDefaults = DEFAULT_NEEDS_REQUESTS.map((d) => {
              const existing = parsed.find((p) => p.id === d.id);
              if (existing) {
                return {
                  ...d,
                  pledgedQuantity: existing.pledgedQuantity !== undefined ? existing.pledgedQuantity : d.pledgedQuantity,
                  status: existing.status || d.status,
                  updates: existing.updates || d.updates,
                  comments: existing.comments || d.comments
                };
              }
              return d;
            });
            const customUserRequests = parsed.filter((r) => !defaultIdMap.has(r.id));
            return [...mergedDefaults, ...customUserRequests];
          }
        } catch (e) {
          // Fallback to default
        }
      }
    }
    return DEFAULT_NEEDS_REQUESTS;
  });

  // Save requests back to localStorage on updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aidstory_recipient_requests", JSON.stringify(allRequests));
    }
  }, [allRequests]);

  // Helper toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper to determine which Category Banners a request belongs to
  const getRequestCategoryBannerIds = (req: RecipientRequest): string[] => {
    const badges = getBadgesForRequest(req).map((b) => b.toUpperCase());
    const cat = (req.category || "").toUpperCase();
    const title = (req.title || "").toUpperCase();

    const standard5Banners = CATEGORY_BANNER_LIST.filter((c) => c.id !== "others");
    const matchedStandardIds: string[] = [];

    for (const banner of standard5Banners) {
      const isMatch = banner.tags.some(
        (t) => badges.includes(t) || cat === t || title.includes(t)
      );
      if (isMatch) {
        matchedStandardIds.push(banner.id);
      }
    }

    // If it matched any of the 5 standard categories, return those
    if (matchedStandardIds.length > 0) {
      return matchedStandardIds;
    }

    // Otherwise, if it does not belong to any of the 5 categories, it is strictly 'others'
    return ["others"];
  };

  // Get distinct locations for filter
  const locationsList = Array.from(
    new Set(allRequests.map((r) => r.location.trim()).filter(Boolean))
  );

  // Filter requests based on search query, category, location
  const filteredRequests = allRequests.filter((req) => {
    // Only show active or open requests
    if (req.status === "cancelled") return false;

    // Search query filter (matches label/tags, campaign name, keyword of item, title, description, category, organizer, location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = req.title.toLowerCase().includes(q);
      const matchDesc = req.description.toLowerCase().includes(q);
      const matchLoc = req.location.toLowerCase().includes(q);
      const matchCamp = (req.campaignTitle || "").toLowerCase().includes(q);
      const badges = getBadgesForRequest(req).map((b) => b.toLowerCase());
      const matchBadges = badges.some((b) => b.includes(q));
      const matchTags = (req.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchCats = (req.categories || [req.category]).some((c) =>
        c.toLowerCase().includes(q)
      );
      const matchOrganizer = (req.organizerName || req.authorName || "").toLowerCase().includes(q);
      const matchBrand = (req.brand || "").toLowerCase().includes(q);
      const matchUnit = (req.unit || "").toLowerCase().includes(q);

      // Handle common singular/plural matching (e.g. food <-> foods, book <-> books)
      const qStem = q.endsWith("s") ? q.slice(0, -1) : q;
      const matchStemmed = qStem.length >= 3 && (
        req.title.toLowerCase().includes(qStem) ||
        badges.some((b) => b.includes(qStem)) ||
        (req.tags || []).some((t) => t.toLowerCase().includes(qStem)) ||
        (req.categories || []).some((c) => c.toLowerCase().includes(qStem))
      );

      if (
        !matchTitle &&
        !matchDesc &&
        !matchLoc &&
        !matchCamp &&
        !matchCats &&
        !matchBadges &&
        !matchTags &&
        !matchOrganizer &&
        !matchBrand &&
        !matchUnit &&
        !matchStemmed
      ) {
        return false;
      }
    }

    // Category Banner Filter (from Categories visual photo view - supports multi-selection)
    if (selectedCategoryBannerIds.length > 0) {
      const itemCategoryBannerIds = getRequestCategoryBannerIds(req);
      const matchesSelected = selectedCategoryBannerIds.some((bannerId) =>
        itemCategoryBannerIds.includes(bannerId)
      );
      if (!matchesSelected) {
        return false;
      }
    }

    // Location Banner Filter (from Malaysia States visual photo view - supports multi-selection)
    if (selectedLocationBannerIds.length > 0) {
      const activeStateBanners = MALAYSIA_STATES_BANNER_LIST.filter((s) =>
        selectedLocationBannerIds.includes(s.id)
      );
      const locLower = req.location.toLowerCase();
      const matchesAnyState = activeStateBanners.some((stateBanner) =>
        stateBanner.cityTags.some((tag) => locLower.includes(tag.toLowerCase()))
      );
      if (!matchesAnyState) {
        return false;
      }
    }

    // Priority & Status Banner Filter (from Priority & Status visual photo banner view)
    if (selectedPriorityBannerIds.length > 0) {
      const activePriorityBanners = PRIORITY_BANNER_LIST.filter((p) =>
        selectedPriorityBannerIds.includes(p.id)
      );

      // Separate filter criteria (urgency & status) from pure ordering criteria
      const filteringBanners = activePriorityBanners.filter((b) => b.categoryType !== "ORDER_BY");

      if (filteringBanners.length > 0) {
        const badges = getBadgesForRequest(req).map((b) => b.toUpperCase());
        const urgency = (req.urgencyLevel || req.urgency || "MEDIUM").toUpperCase();
        const status = (req.status || "ACTIVE").toUpperCase();
        const totalQty = req.quantity || 1;
        const pledgedQty = req.pledgedQuantity || 0;
        const fulfillmentRatio = pledgedQty / totalQty;

        const matchesAnyFilter = filteringBanners.some((banner) => {
          switch (banner.criteria) {
            case "HIGH_URGENCY":
              return urgency === "HIGH" || badges.includes("HIGH") || urgency === "EMERGENCY" || badges.includes("EMERGENCY");
            case "EMERGENCY":
              return urgency === "EMERGENCY" || badges.includes("EMERGENCY") || badges.includes("DISASTER") || req.category === "Emergency";
            case "ACTIVE":
              return status === "ACTIVE" || status === "OPEN" || status === "IN-PROGRESS";
            case "FULFILLED":
              return status === "FULFILLED" || fulfillmentRatio >= 1;
            default:
              return true;
          }
        });

        if (!matchesAnyFilter) {
          return false;
        }
      }
    }

    // Sub-Category filter chips
    if (selectedCategoryFilter !== "ALL") {
      const badges = getBadgesForRequest(req).map((b) => b.toUpperCase());
      const cat = req.category.toUpperCase();
      if (!badges.includes(selectedCategoryFilter) && cat !== selectedCategoryFilter) {
        return false;
      }
    }

    // Location filter
    if (selectedLocationFilter !== "ALL") {
      if (!req.location.toLowerCase().includes(selectedLocationFilter.toLowerCase())) {
        return false;
      }
    }

    // Quick priority filter chips
    if (selectedPriorityFilter !== "ALL") {
      const urgency = (req.urgencyLevel || req.urgency || "MEDIUM").toUpperCase();
      const status = (req.status || "OPEN").toUpperCase();
      if (selectedPriorityFilter === "EMERGENCY" && urgency !== "EMERGENCY" && !getBadgesForRequest(req).includes("EMERGENCY")) {
        return false;
      } else if (selectedPriorityFilter === "HIGH" && urgency !== "HIGH") {
        return false;
      } else if (selectedPriorityFilter === "STANDARD" && urgency !== "LOW" && urgency !== "MEDIUM" && urgency !== "STANDARD") {
        return false;
      } else if (selectedPriorityFilter === "FULFILLED" && status !== "FULFILLED") {
        return false;
      } else if (selectedPriorityFilter === "ACTIVE" && status !== "OPEN" && status !== "IN-PROGRESS" && status !== "ACTIVE") {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // 1. By default, Emergency / Urgent requests are placed in front of non-emergency requests
    const aIsEmergency = isEmergencyOrUrgent(a) ? 1 : 0;
    const bIsEmergency = isEmergencyOrUrgent(b) ? 1 : 0;
    if (aIsEmergency !== bIsEmergency) {
      return bIsEmergency - aIsEmergency; // Emergency items (1) come before non-emergency (0)
    }

    // 2. Banner ordering options (when explicitly chosen)
    const hasLatest = selectedPriorityBannerIds.includes("latest");
    const hasOldest = selectedPriorityBannerIds.includes("oldest");
    const hasMostFulfilled = selectedPriorityBannerIds.includes("most_fulfilled");
    const hasLeastFulfilled = selectedPriorityBannerIds.includes("least_fulfilled");

    if (hasLatest && !hasOldest) {
      const timeA = a.postedTimestamp || 0;
      const timeB = b.postedTimestamp || 0;
      return timeB - timeA;
    }
    if (hasOldest && !hasLatest) {
      const timeA = a.postedTimestamp || 0;
      const timeB = b.postedTimestamp || 0;
      return timeA - timeB;
    }
    if (hasMostFulfilled && !hasLeastFulfilled) {
      const ratioA = (a.pledgedQuantity || 0) / (a.quantity || 1);
      const ratioB = (b.pledgedQuantity || 0) / (b.quantity || 1);
      return ratioB - ratioA;
    }
    if (hasLeastFulfilled && !hasMostFulfilled) {
      const ratioA = (a.pledgedQuantity || 0) / (a.quantity || 1);
      const ratioB = (b.pledgedQuantity || 0) / (b.quantity || 1);
      return ratioA - ratioB;
    }
    // Default secondary sort: newest first
    return (b.postedTimestamp || 0) - (a.postedTimestamp || 0);
  });

  // Calculate Progress Segments
  const getProgressData = (req: RecipientRequest) => {
    const total = req.quantity || 1;
    // Calculate done and in-transit
    // "done": completed verified units (approx 20%-50% of pledged)
    const pledged = req.pledgedQuantity || 0;
    const done = Math.min(pledged, Math.max(0, Math.floor(pledged * 0.4)));
    const inTransit = Math.max(0, pledged - done);
    const needed = Math.max(0, total - (done + inTransit));

    const donePct = Math.min(100, Math.round((done / total) * 100));
    const inTransitPct = Math.min(100 - donePct, Math.round((inTransit / total) * 100));
    const neededPct = Math.max(0, 100 - donePct - inTransitPct);

    return {
      total,
      done,
      inTransit,
      needed,
      donePct,
      inTransitPct,
      neededPct,
      ratioText: `${pledged} / ${total}`
    };
  };

  // Handle Share button click
  const handleShareRequest = (req: RecipientRequest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#needs?req=${req.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast(`Link for "${req.title}" copied to clipboard!`);
    } else {
      showToast(`Link ready to share: ${shareUrl}`);
    }
  };

  // Open Support Modal for a Request
  const handleOpenSupportModal = (req: RecipientRequest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedSupportReq(req);
    const progress = getProgressData(req);
    const remaining = Math.max(1, req.quantity - req.pledgedQuantity);
    setPledgeQuantityInput(Math.min(remaining, 1));
    
    // Auto-fill logged-in user if available
    const storedUser = localStorage.getItem("aidstory_current_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.username) setDonorNameInput(u.username);
        if (u.contact) setDonorContactInput(u.contact);
      } catch (err) {
        // ignore
      }
    }
  };

  // Submit Support Pledge
  const handleConfirmPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupportReq) return;

    if (pledgeQuantityInput <= 0) {
      showToast("Please enter a valid quantity to pledge.");
      return;
    }

    setIsPledgeSubmitting(true);

    setTimeout(() => {
      const updatedRequests = allRequests.map((r) => {
        if (r.id === selectedSupportReq.id) {
          const nextPledged = Math.min(r.quantity, r.pledgedQuantity + pledgeQuantityInput);
          const nextStatus = nextPledged >= r.quantity ? "fulfilled" : r.status;
          return {
            ...r,
            pledgedQuantity: nextPledged,
            status: nextStatus as any
          };
        }
        return r;
      });

      setAllRequests(updatedRequests);
      localStorage.setItem("aidstory_recipient_requests", JSON.stringify(updatedRequests));

      // Also record in user pledged items & completed donations for profile tracking
      const savedPledgesJSON = localStorage.getItem("aidstory_user_pledged_items") || "[]";
      try {
        const savedPledges: string[] = JSON.parse(savedPledgesJSON);
        if (!savedPledges.includes(selectedSupportReq.title)) {
          savedPledges.push(selectedSupportReq.title);
          localStorage.setItem("aidstory_user_pledged_items", JSON.stringify(savedPledges));
        }
      } catch (err) {
        // ignore
      }

      // Record completed donation entry
      const savedCompletedJSON = localStorage.getItem("aidstory_completed_donations") || "[]";
      try {
        const savedCompleted: any[] = JSON.parse(savedCompletedJSON);
        savedCompleted.push({
          id: `pledge-${Date.now()}`,
          type: "support_need",
          title: selectedSupportReq.title,
          category: selectedSupportReq.category,
          quantity: pledgeQuantityInput,
          unit: selectedSupportReq.unit,
          date: new Date().toISOString(),
          status: "completed"
        });
        localStorage.setItem("aidstory_completed_donations", JSON.stringify(savedCompleted));
      } catch (err) {
        // ignore
      }

      setIsPledgeSubmitting(false);
      const supportedTitle = selectedSupportReq.title;
      setSelectedSupportReq(null);
      showToast(`Thank you! Your pledge of ${pledgeQuantityInput} ${selectedSupportReq.unit} for "${supportedTitle}" has been confirmed.`);
    }, 600);
  };

  // Cycle card image
  const handleNextCardImage = (reqId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIndex((prev) => ({
      ...prev,
      [reqId]: ((prev[reqId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevCardImage = (reqId: string, totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIndex((prev) => ({
      ...prev,
      [reqId]: ((prev[reqId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="min-h-screen bg-[#231b15] text-[#f4efe5] selection:bg-yellow-400 selection:text-black font-sans pb-20 overflow-x-hidden">
      
      {/* Toast Notification Bar */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-yellow-400 text-[#2c221a] font-mono text-xs sm:text-sm font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-white/40"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER BAR */}
      <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* < Back Button */}
          <button
            onClick={() => {
              if (filterViewMode !== "overview") {
                setFilterViewMode("overview");
                setIsFilterDrawerOpen(true);
              } else {
                navigateToView("main_menu");
              }
            }}
            className="flex items-center gap-1.5 text-base sm:text-lg font-serif italic text-[#f4efe5] hover:text-yellow-400 transition-colors cursor-pointer group py-1.5 px-2 rounded-xl"
            title={filterViewMode !== "overview" ? "Back to Filter Overview (Categories, Location, Priority & Status)" : "Return to Main Menu"}
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          {/* Center Pill Banner (Dynamic for Categories view vs Overview) */}
          <div className="flex-1 max-w-xl mx-auto bg-[#ded6cd] text-[#2c221a] rounded-full py-1.5 px-2.5 sm:px-4 flex items-center justify-between shadow-md border border-[#c9c0b6]">
            
            {/* Filter Toggle / Back to Filter Selection Button */}
            <button
              onClick={() => {
                if (filterViewMode !== "overview") {
                  setFilterViewMode("overview");
                  setIsFilterDrawerOpen(true);
                } else {
                  setIsFilterDrawerOpen((prev) => !prev);
                }
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-transparent border-2 border-[#2c221a] flex items-center justify-center text-[#2c221a] hover:bg-black/10 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              title={
                filterViewMode !== "overview"
                  ? "Back to choose Categories / Location / Priority & Status"
                  : isFilterDrawerOpen
                  ? "Collapse Filter"
                  : "Open Filter"
              }
            >
              {isFilterDrawerOpen ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#2c221a]" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.4" />
                  <line x1="6.5" y1="12" x2="17.5" y2="12" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                </svg>
              ) : (
                <SlidersHorizontal className="w-4 h-4" />
              )}
            </button>

            {/* Title: Categories, Location, Priority or LightUpHopes */}
            <span className="font-serif italic font-medium text-xl sm:text-2xl tracking-wide text-[#2c221a] text-center flex-1 select-none px-2">
              {filterViewMode === "categories"
                ? "Categories"
                : filterViewMode === "location"
                ? "Location"
                : filterViewMode === "priority"
                ? "Priority & Status"
                : "LightUpHopes"}
            </span>

            {/* Right Action: Clear All pill button in Categories/Location/Priority mode, or Needs Count in Overview */}
            {filterViewMode === "categories" || filterViewMode === "location" || filterViewMode === "priority" ? (
              <button
                type="button"
                onClick={() => {
                  if (filterViewMode === "categories") {
                    setSelectedCategoryBannerIds([]);
                    setSelectedCategoryFilter("ALL");
                    showToast("Category filters reset - showing all needs");
                  } else if (filterViewMode === "location") {
                    setSelectedLocationBannerIds([]);
                    setSelectedLocationFilter("ALL");
                    showToast("Location filters reset - showing all Malaysian states");
                  } else {
                    setSelectedPriorityBannerIds([]);
                    setSelectedPriorityFilter("ALL");
                    showToast("Priority & status filters reset - showing all needs");
                  }
                  setSearchQuery("");
                }}
                className="bg-[#847b71] hover:bg-[#726960] active:scale-95 text-white font-sans font-bold text-xs sm:text-sm py-1.5 px-4 sm:px-6 rounded-full transition-all cursor-pointer shadow-sm shrink-0 select-none"
              >
                Clear All
              </button>
            ) : (
              <span className="text-[11px] font-mono text-[#2c221a]/70 font-semibold hidden sm:inline-block px-1">
                {filteredRequests.length} Needs
              </span>
            )}
          </div>

          {/* Right Action: Search Function */}
          <div className="relative flex items-center justify-end">
            <div
              className={`relative flex items-center transition-all duration-300 ${
                isSearchFocused || searchQuery.trim()
                  ? "w-44 sm:w-60 md:w-72"
                  : "w-36 sm:w-48 md:w-56"
              }`}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    // Slight delay to allow clicking suggestions
                    setTimeout(() => setIsSearchFocused(false), 220);
                  }}
                  placeholder="Search food, books, tags..."
                  className="w-full bg-[#847b71] hover:bg-[#726960] focus:bg-[#524941] text-white placeholder-white/70 font-sans text-xs sm:text-sm py-1.5 pl-8 sm:pl-9 pr-7 sm:pr-8 rounded-full border border-white/20 focus:border-yellow-400 focus:outline-none shadow-md transition-all duration-200"
                />
                
                {/* Search Icon */}
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 pointer-events-none" />

                {/* Clear (X) Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              {/* Quick Search Suggestions Dropdown on Focus */}
              <AnimatePresence>
                {isSearchFocused && !searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-[#241c16] border border-[#4a3b30] rounded-2xl p-3 shadow-2xl z-50 text-left"
                  >
                    <div className="text-[10px] font-mono font-bold text-yellow-400/90 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Quick Searches</span>
                      <span className="text-[9px] text-white/40 lowercase">Click to search</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Food",
                        "Storybooks",
                        "Baby Pampers",
                        "Campaign A",
                        "Animals",
                        "Emergency",
                        "Clothing",
                        "Sibu"
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery(tag);
                            setIsSearchFocused(false);
                          }}
                          className="text-[11px] font-sans font-medium bg-white/10 hover:bg-yellow-400 hover:text-black text-[#f4efe5] px-2.5 py-1 rounded-full transition-all cursor-pointer border border-white/10"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* FILTER DRAWER */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -15, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-5xl mx-auto px-4 pt-2 pb-4 overflow-hidden"
          >
            {/* VIEW MODE: PRIORITY & STATUS (Urgency & Status with identical photo banner layout and stats cards, supporting multi-selection) */}
            {filterViewMode === "priority" ? (
              <div className="bg-[#241c16] rounded-3xl border border-[#3e2e23] p-4 sm:p-6 shadow-2xl space-y-5">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                  
                  {/* LEFT COLUMN: Top Requested Items in Selected Priority/Status & Stats Cards */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    
                    {/* Top Card: Items Mostly Requested in Selected Urgency/Status criteria */}
                    {(() => {
                      const selectedBanners = PRIORITY_BANNER_LIST.filter((p) =>
                        selectedPriorityBannerIds.includes(p.id)
                      );
                      const effectiveBanners =
                        selectedBanners.length > 0 ? selectedBanners : PRIORITY_BANNER_LIST;

                      // Aggregate top requested items across selected priority banners
                      const itemMap = new Map<string, { count: number; color: string }>();
                      effectiveBanners.forEach((p) => {
                        p.topItems.forEach((it) => {
                          const existing = itemMap.get(it.name);
                          if (existing) {
                            existing.count += it.count;
                          } else {
                            itemMap.set(it.name, { count: it.count, color: it.color });
                          }
                        });
                      });

                      const sortedTopItems = Array.from(itemMap.entries())
                        .map(([name, data]) => ({ name, count: data.count, color: data.color }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5);

                      const maxVal = Math.max(...sortedTopItems.map((i) => i.count), 20);
                      const scaleMax = maxVal <= 80 ? 80 : Math.ceil(maxVal / 20) * 20;

                      // Header Title
                      let headerText = "Items Mostly Requested across All Urgency Levels";
                      if (selectedBanners.length === 1) {
                        headerText = `Items in ${selectedBanners[0].name.replace(/\n/g, " ")}`;
                      } else if (selectedBanners.length === 2) {
                        const s1 = selectedBanners[0].name.split("\n")[0];
                        const s2 = selectedBanners[1].name.split("\n")[0];
                        headerText = `Items in ${s1} & ${s2}`;
                      } else if (selectedBanners.length > 2) {
                        headerText = `Items in ${selectedBanners.length} Selected Priority Tiers`;
                      }

                      return (
                        <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-4 sm:p-5 shadow-lg flex-1 flex flex-col justify-between">
                          
                          {/* Header Box */}
                          <div className="bg-[#3a2f26] border border-[#4d3e33] rounded-xl py-2 px-3 text-center text-white font-bold text-xs sm:text-sm tracking-wide shadow-inner mb-4">
                            {headerText}
                          </div>

                          {/* Horizontal Bar Chart */}
                          <div className="space-y-3 my-auto">
                            {sortedTopItems.map((item) => {
                              const pct = Math.min(100, Math.round((item.count / scaleMax) * 100));
                              return (
                                <div key={item.name} className="flex items-center gap-2">
                                  {/* Item Label */}
                                  <span className="w-24 sm:w-28 text-right text-xs sm:text-[13px] text-white/90 font-sans font-medium pr-1 shrink-0 truncate">
                                    {item.name}
                                  </span>

                                  {/* Horizontal Bar Track & Fill */}
                                  <div className="flex-1 bg-black/30 rounded-r-md h-5 sm:h-6 relative overflow-hidden flex items-center">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.6, ease: "easeOut" }}
                                      className="h-full rounded-r-md shadow-sm"
                                      style={{ backgroundColor: item.color }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Chart Scale Axis */}
                          <div className="pt-3 mt-2 border-t border-white/10">
                            <div className="flex justify-between items-center pl-24 sm:pl-28 pr-1 text-[11px] text-white/60 font-mono">
                              <span>0</span>
                              <span>{Math.round(scaleMax * 0.25)}</span>
                              <span>{Math.round(scaleMax * 0.5)}</span>
                              <span>{Math.round(scaleMax * 0.75)}</span>
                              <span>{scaleMax}</span>
                            </div>
                          </div>

                        </div>
                      );
                    })()}

                    {/* Bottom Two Statistics Cards */}
                    {(() => {
                      const selectedBanners = PRIORITY_BANNER_LIST.filter((p) =>
                        selectedPriorityBannerIds.includes(p.id)
                      );
                      const filteringBanners = selectedBanners.filter((b) => b.categoryType !== "ORDER_BY");

                      const matchingRequests = allRequests.filter((req) => {
                        if (req.status === "cancelled") return false;
                        if (filteringBanners.length === 0) return true;

                        const badges = getBadgesForRequest(req).map((b) => b.toUpperCase());
                        const urgency = (req.urgencyLevel || req.urgency || "MEDIUM").toUpperCase();
                        const status = (req.status || "ACTIVE").toUpperCase();
                        const totalQty = req.quantity || 1;
                        const pledgedQty = req.pledgedQuantity || 0;
                        const fulfillmentRatio = pledgedQty / totalQty;

                        return filteringBanners.some((banner) => {
                          switch (banner.criteria) {
                            case "HIGH_URGENCY":
                              return urgency === "HIGH" || badges.includes("HIGH") || urgency === "EMERGENCY" || badges.includes("EMERGENCY");
                            case "EMERGENCY":
                              return urgency === "EMERGENCY" || badges.includes("EMERGENCY") || badges.includes("DISASTER") || req.category === "Emergency";
                            case "ACTIVE":
                              return status === "ACTIVE" || status === "OPEN" || status === "IN-PROGRESS";
                            case "FULFILLED":
                              return status === "FULFILLED" || fulfillmentRatio >= 1;
                            default:
                              return true;
                          }
                        });
                      });

                      const totalCampaign = matchingRequests.filter((r) => Boolean(r.campaignTitle || r.campaignId)).length;
                      const totalIndependent = matchingRequests.length - totalCampaign;

                      return (
                        <div className="grid grid-cols-2 gap-3.5">
                          {/* Left: Campaign Requests */}
                          <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-3 text-center shadow-md flex flex-col items-center justify-center min-h-[82px]">
                            <span className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight">
                              {totalCampaign}
                            </span>
                            <span className="font-serif italic text-xs sm:text-sm text-white/90 mt-0.5">
                              Campaign Requests
                            </span>
                          </div>

                          {/* Right: Independent Requests */}
                          <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-3 text-center shadow-md flex flex-col items-center justify-center min-h-[82px]">
                            <span className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight">
                              {totalIndependent}
                            </span>
                            <span className="font-serif italic text-xs sm:text-sm text-white/90 mt-0.5">
                              Independent Requests
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* RIGHT COLUMN: Priority, Status & Ordering Pill Segmented Filters */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                    {/* Header bar with Active status & Reset */}
                    <div className="flex items-center justify-between pb-1 text-xs font-mono text-white/70">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        {selectedPriorityBannerIds.length > 0
                          ? `${selectedPriorityBannerIds.length} filter${selectedPriorityBannerIds.length > 1 ? "s" : ""} & ordering active`
                          : "Default view (Click switches below to filter or order)"}
                      </span>
                      {selectedPriorityBannerIds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPriorityBannerIds([]);
                            showToast("Reset all priority, status and order options");
                          }}
                          className="text-[11px] text-yellow-300/90 hover:text-yellow-200 underline cursor-pointer transition-colors"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1">
                      {/* Filter 1: Order by Fulfillment (Exact match to uploaded screenshot) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                          <span>Order by Fulfillment</span>
                          <span className="text-white/40 text-[10px]">Choose one</span>
                        </div>

                        {/* Pill Switcher Container (matching uploaded image) */}
                        <div className="bg-[#bcb6ab] p-1 rounded-full flex items-center shadow-inner border border-[#968e81]/60 w-full transition-all">
                          {/* Least Fulfilled */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("least_fulfilled");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "least_fulfilled")
                                );
                                showToast("Cleared Least Fulfilled order");
                              } else {
                                const next = [
                                  ...selectedPriorityBannerIds.filter(
                                    (id) => id !== "most_fulfilled" && id !== "least_fulfilled"
                                  ),
                                  "least_fulfilled",
                                ];
                                setSelectedPriorityBannerIds(next);
                                showToast("Ordered by: Least Fulfilled (Greatest deficit first)");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-center transition-all duration-300 font-serif italic text-base sm:text-lg md:text-xl select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("least_fulfilled")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Least Fulfilled
                          </button>

                          {/* Most Fulfilled */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("most_fulfilled");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "most_fulfilled")
                                );
                                showToast("Cleared Most Fulfilled order");
                              } else {
                                const next = [
                                  ...selectedPriorityBannerIds.filter(
                                    (id) => id !== "most_fulfilled" && id !== "least_fulfilled"
                                  ),
                                  "most_fulfilled",
                                ];
                                setSelectedPriorityBannerIds(next);
                                showToast("Ordered by: Most Fulfilled (Almost reached first)");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-center transition-all duration-300 font-serif italic text-base sm:text-lg md:text-xl select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("most_fulfilled")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Most Fulfilled
                          </button>
                        </div>
                      </div>

                      {/* Filter 2: Order by Time / Date */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                          <span>Order by Date Posted</span>
                          <span className="text-white/40 text-[10px]">Choose one</span>
                        </div>

                        <div className="bg-[#bcb6ab] p-1 rounded-full flex items-center shadow-inner border border-[#968e81]/60 w-full transition-all">
                          {/* Latest */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("latest");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "latest")
                                );
                                showToast("Cleared Latest filter");
                              } else {
                                const next = [
                                  ...selectedPriorityBannerIds.filter(
                                    (id) => id !== "latest" && id !== "oldest"
                                  ),
                                  "latest",
                                ];
                                setSelectedPriorityBannerIds(next);
                                showToast("Ordered by: Latest Posted (Newest first)");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-center transition-all duration-300 font-serif italic text-base sm:text-lg md:text-xl select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("latest")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Latest Posted
                          </button>

                          {/* Oldest */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("oldest");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "oldest")
                                );
                                showToast("Cleared Oldest filter");
                              } else {
                                const next = [
                                  ...selectedPriorityBannerIds.filter(
                                    (id) => id !== "latest" && id !== "oldest"
                                  ),
                                  "oldest",
                                ];
                                setSelectedPriorityBannerIds(next);
                                showToast("Ordered by: Oldest Pending (Longest waiting first)");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-center transition-all duration-300 font-serif italic text-base sm:text-lg md:text-xl select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("oldest")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Oldest Pending
                          </button>
                        </div>
                      </div>

                      {/* Filter 3: Filter by Urgency Level */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-rose-300 font-semibold">
                          <span>Filter by Urgency Level</span>
                          <span className="text-white/40 text-[10px]">Toggle filter</span>
                        </div>

                        <div className="bg-[#bcb6ab] p-1 rounded-full flex items-center shadow-inner border border-[#968e81]/60 w-full transition-all">
                          {/* High Urgency */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("high_urgency");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "high_urgency")
                                );
                                showToast("Deselected High Urgency filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "high_urgency",
                                ]);
                                showToast("Filtered by High Urgency & Critical");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-full text-center transition-all duration-300 font-serif italic text-sm sm:text-base md:text-lg select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("high_urgency")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            High Urgency & Critical
                          </button>

                          {/* Emergency */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("emergency");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "emergency")
                                );
                                showToast("Deselected Emergency Relief filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "emergency",
                                ]);
                                showToast("Filtered by Disaster & Emergency Relief");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-full text-center transition-all duration-300 font-serif italic text-sm sm:text-base md:text-lg select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("emergency")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Emergency Relief
                          </button>
                        </div>
                      </div>

                      {/* Filter 4: Filter by Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                          <span>Filter by Status</span>
                          <span className="text-white/40 text-[10px]">Toggle filter</span>
                        </div>

                        <div className="bg-[#bcb6ab] p-1 rounded-full flex items-center shadow-inner border border-[#968e81]/60 w-full transition-all">
                          {/* Active Only */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("active_only");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "active_only")
                                );
                                showToast("Deselected Active Open Needs filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "active_only",
                                ]);
                                showToast("Filtered by Active Open Needs");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-full text-center transition-all duration-300 font-serif italic text-sm sm:text-base md:text-lg select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("active_only")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Active Open Needs
                          </button>

                          {/* Fulfilled Completed */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("fulfilled_completed");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "fulfilled_completed")
                                );
                                showToast("Deselected Completed Needs filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "fulfilled_completed",
                                ]);
                                showToast("Filtered by Completed & Fulfilled Needs");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-full text-center transition-all duration-300 font-serif italic text-sm sm:text-base md:text-lg select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("fulfilled_completed")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Fulfilled Needs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Switcher: Quick Link back to Filter Overview */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono text-white/60">
                  <span>
                    Showing{" "}
                    <strong className="text-yellow-400">{filteredRequests.length}</strong> matching needs
                  </span>
                  <button
                    onClick={() => setFilterViewMode("overview")}
                    className="text-[#f4efe5]/80 hover:text-yellow-400 underline cursor-pointer transition-colors"
                  >
                    View All Filter Types (Categories & Location) &rarr;
                  </button>
                </div>

              </div>
            ) : filterViewMode === "location" ? (
              <div className="bg-[#241c16] rounded-3xl border border-[#3e2e23] p-4 sm:p-6 shadow-2xl space-y-5">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                  
                  {/* LEFT COLUMN: Top Requested Items in Selected State(s) & Stats Cards */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    
                    {/* Top Card: Items Mostly Requested in Selected States */}
                    {(() => {
                      const selectedStates = MALAYSIA_STATES_BANNER_LIST.filter((s) =>
                        selectedLocationBannerIds.includes(s.id)
                      );
                      const effectiveStates =
                        selectedStates.length > 0 ? selectedStates : MALAYSIA_STATES_BANNER_LIST;

                      // Aggregate top requested items across selected states
                      const itemMap = new Map<string, { count: number; color: string }>();
                      effectiveStates.forEach((st) => {
                        st.topItems.forEach((it) => {
                          const existing = itemMap.get(it.name);
                          if (existing) {
                            existing.count += it.count;
                          } else {
                            itemMap.set(it.name, { count: it.count, color: it.color });
                          }
                        });
                      });

                      const sortedTopItems = Array.from(itemMap.entries())
                        .map(([name, data]) => ({ name, count: data.count, color: data.color }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5);

                      const maxVal = Math.max(...sortedTopItems.map((i) => i.count), 20);
                      const scaleMax = maxVal <= 80 ? 80 : Math.ceil(maxVal / 20) * 20;

                      // Header Title
                      let headerText = "Items Mostly Requested in Malaysia (All States)";
                      if (selectedStates.length === 1) {
                        headerText = `Items Mostly Requested in ${selectedStates[0].name.replace("\n", " ")}`;
                      } else if (selectedStates.length === 2) {
                        const s1 = selectedStates[0].name.split("\n")[0];
                        const s2 = selectedStates[1].name.split("\n")[0];
                        headerText = `Items Mostly Requested in ${s1} & ${s2}`;
                      } else if (selectedStates.length > 2) {
                        headerText = `Items Mostly Requested in ${selectedStates.length} Selected States`;
                      }

                      return (
                        <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-4 sm:p-5 shadow-lg flex-1 flex flex-col justify-between">
                          
                          {/* Header Box */}
                          <div className="bg-[#3a2f26] border border-[#4d3e33] rounded-xl py-2 px-3 text-center text-white font-bold text-xs sm:text-sm tracking-wide shadow-inner mb-4">
                            {headerText}
                          </div>

                          {/* Horizontal Bar Chart */}
                          <div className="space-y-3 my-auto">
                            {sortedTopItems.map((item) => {
                              const pct = Math.min(100, Math.round((item.count / scaleMax) * 100));
                              return (
                                <div key={item.name} className="flex items-center gap-2">
                                  {/* Item Label */}
                                  <span className="w-24 sm:w-28 text-right text-xs sm:text-[13px] text-white/90 font-sans font-medium pr-1 shrink-0 truncate">
                                    {item.name}
                                  </span>

                                  {/* Horizontal Bar Track & Fill */}
                                  <div className="flex-1 bg-black/30 rounded-r-md h-5 sm:h-6 relative overflow-hidden flex items-center">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.6, ease: "easeOut" }}
                                      className="h-full rounded-r-md shadow-sm"
                                      style={{ backgroundColor: item.color }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Chart Scale Axis */}
                          <div className="pt-3 mt-2 border-t border-white/10">
                            <div className="flex justify-between items-center pl-24 sm:pl-28 pr-1 text-[11px] text-white/60 font-mono">
                              <span>0</span>
                              <span>{Math.round(scaleMax * 0.25)}</span>
                              <span>{Math.round(scaleMax * 0.5)}</span>
                              <span>{Math.round(scaleMax * 0.75)}</span>
                              <span>{scaleMax}</span>
                            </div>
                          </div>

                        </div>
                      );
                    })()}

                    {/* Bottom Two Statistics Cards */}
                    {(() => {
                      const selectedStates = MALAYSIA_STATES_BANNER_LIST.filter((s) =>
                        selectedLocationBannerIds.includes(s.id)
                      );
                      const effectiveStates =
                        selectedStates.length > 0 ? selectedStates : MALAYSIA_STATES_BANNER_LIST;

                      const totalCampaign = effectiveStates.reduce((acc, s) => acc + s.campaignCount, 0);
                      const totalIndependent = effectiveStates.reduce((acc, s) => acc + s.independentCount, 0);

                      return (
                        <div className="grid grid-cols-2 gap-3.5">
                          {/* Left: Campaign Requests */}
                          <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-3 text-center shadow-md flex flex-col items-center justify-center min-h-[82px]">
                            <span className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight">
                              {totalCampaign}
                            </span>
                            <span className="font-serif italic text-xs sm:text-sm text-white/90 mt-0.5">
                              Campaign Requests
                            </span>
                          </div>

                          {/* Right: Independent Requests */}
                          <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-3 text-center shadow-md flex flex-col items-center justify-center min-h-[82px]">
                            <span className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight">
                              {totalIndependent}
                            </span>
                            <span className="font-serif italic text-xs sm:text-sm text-white/90 mt-0.5">
                              Independent Requests
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* RIGHT COLUMN: Malaysian States Photo Banners (Multi-selection enabled) */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 text-xs font-mono text-white/70">
                      <span>
                        {selectedLocationBannerIds.length > 0
                          ? `${selectedLocationBannerIds.length} of ${MALAYSIA_STATES_BANNER_LIST.length} states selected`
                          : "Showing all states (Click to filter multiple)"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedLocationBannerIds.length === MALAYSIA_STATES_BANNER_LIST.length) {
                              setSelectedLocationBannerIds([]);
                              showToast("Deselected all states");
                            } else {
                              setSelectedLocationBannerIds(MALAYSIA_STATES_BANNER_LIST.map((s) => s.id));
                              showToast("Selected all Malaysian states");
                            }
                          }}
                          className="text-[11px] text-yellow-300/80 hover:text-yellow-300 underline cursor-pointer transition-colors"
                        >
                          {selectedLocationBannerIds.length === MALAYSIA_STATES_BANNER_LIST.length
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-2 space-y-2.5">
                      {MALAYSIA_STATES_BANNER_LIST.map((state) => {
                        const isSelected = selectedLocationBannerIds.includes(state.id);

                        return (
                          <div
                            key={state.id}
                            onClick={() => {
                              if (isSelected) {
                                const next = selectedLocationBannerIds.filter((id) => id !== state.id);
                                setSelectedLocationBannerIds(next);
                                showToast(
                                  next.length === 0
                                    ? `Deselected ${state.name.replace(/\n/g, " ")} (Showing all states)`
                                    : `Deselected ${state.name.replace(/\n/g, " ")} (${next.length} selected)`
                                );
                              } else {
                                const next = [...selectedLocationBannerIds, state.id];
                                setSelectedLocationBannerIds(next);
                                showToast(
                                  `Added ${state.name.replace(/\n/g, " ")} (${next.length} states selected)`
                                );
                              }
                            }}
                            className={`rounded-xl transition-all duration-300 cursor-pointer select-none ${
                              isSelected
                                ? "p-[2.5px] bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#06b6d4] shadow-lg shadow-purple-950/50 scale-[1.01]"
                                : "p-[2.5px] bg-transparent border border-[#3e2e23] hover:border-white/40 hover:scale-[1.005]"
                            }`}
                          >
                            <div className="relative h-12 sm:h-14 md:h-[58px] rounded-[10px] overflow-hidden flex items-center px-4 sm:px-6 group">
                              {/* Background Photo of State Landmark */}
                              <img
                                src={state.imageUrl}
                                alt={state.name}
                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />

                              {/* Dark gradient overlay for strong text contrast */}
                              <div
                                className={`absolute inset-0 transition-opacity ${
                                  isSelected
                                    ? "bg-gradient-to-r from-black/80 via-black/50 to-black/25"
                                    : "bg-gradient-to-r from-black/85 via-black/60 to-black/35 group-hover:from-black/75"
                                }`}
                              />

                              {/* State Title & Selected Indicator */}
                              <div className="relative z-10 flex items-center justify-between w-full">
                                <div className="flex items-center gap-2.5">
                                  {/* Checkbox indicator */}
                                  <div
                                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                      isSelected
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 border-pink-300 text-white shadow-sm"
                                        : "border-white/40 bg-black/40 group-hover:border-white/70"
                                    }`}
                                  >
                                    {isSelected && (
                                      <svg
                                        className="w-3 h-3 stroke-current stroke-2 fill-none"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </div>

                                  <span className="font-sans font-black text-white text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wider leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] whitespace-pre-line">
                                    {state.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Bottom Switcher: Quick Link back to Filter Overview */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono text-white/60">
                  <span>
                    Showing{" "}
                    <strong className="text-yellow-400">{filteredRequests.length}</strong> matching needs in Malaysia
                  </span>
                  <button
                    onClick={() => setFilterViewMode("overview")}
                    className="text-[#f4efe5]/80 hover:text-yellow-400 underline cursor-pointer transition-colors"
                  >
                    View All Filter Types (Categories & Urgency) &rarr;
                  </button>
                </div>

              </div>
            ) : filterViewMode === "categories" ? (
              <div className="bg-[#241c16] rounded-3xl border border-[#3e2e23] p-4 sm:p-6 shadow-2xl space-y-5">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                  
                  {/* LEFT COLUMN: Top Requested Items Chart & Stats Cards */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    
                    {/* Top Card: Items Mostly Requested in Selected Categories */}
                    {(() => {
                      const selectedCategories = CATEGORY_BANNER_LIST.filter((c) =>
                        selectedCategoryBannerIds.includes(c.id)
                      );
                      const effectiveCategories =
                        selectedCategories.length > 0 ? selectedCategories : CATEGORY_BANNER_LIST;

                      // Aggregate top requested items across selected categories
                      const itemMap = new Map<string, { count: number; color: string }>();
                      effectiveCategories.forEach((cat) => {
                        cat.topItems.forEach((it) => {
                          const existing = itemMap.get(it.name);
                          if (existing) {
                            existing.count += it.count;
                          } else {
                            itemMap.set(it.name, { count: it.count, color: it.color });
                          }
                        });
                      });

                      const sortedTopItems = Array.from(itemMap.entries())
                        .map(([name, data]) => ({ name, count: data.count, color: data.color }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5);

                      const maxVal = Math.max(...sortedTopItems.map((i) => i.count), 20);
                      const scaleMax = maxVal <= 80 ? 80 : Math.ceil(maxVal / 20) * 20;

                      // Header Title
                      let headerText = "Items Mostly Requested across All Categories";
                      if (selectedCategories.length === 1) {
                        headerText = `Items Mostly Requested in ${selectedCategories[0].title.replace(/\n/g, " ")}`;
                      } else if (selectedCategories.length === 2) {
                        const c1 = selectedCategories[0].title.split("\n")[0];
                        const c2 = selectedCategories[1].title.split("\n")[0];
                        headerText = `Items Mostly Requested in ${c1} & ${c2}`;
                      } else if (selectedCategories.length > 2) {
                        headerText = `Items Mostly Requested in ${selectedCategories.length} Selected Categories`;
                      }

                      return (
                        <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-4 sm:p-5 shadow-lg flex-1 flex flex-col justify-between">
                          
                          {/* Header Box */}
                          <div className="bg-[#3a2f26] border border-[#4d3e33] rounded-xl py-2 px-3 text-center text-white font-bold text-xs sm:text-sm tracking-wide shadow-inner mb-4">
                            {headerText}
                          </div>

                          {/* Horizontal Bar Chart */}
                          <div className="space-y-3 my-auto">
                            {sortedTopItems.map((item) => {
                              const pct = Math.min(100, Math.round((item.count / scaleMax) * 100));
                              return (
                                <div key={item.name} className="flex items-center gap-2">
                                  {/* Item Label */}
                                  <span className="w-24 sm:w-28 text-right text-xs sm:text-[13px] text-white/90 font-sans font-medium pr-1 shrink-0 truncate">
                                    {item.name}
                                  </span>

                                  {/* Horizontal Bar Track & Fill */}
                                  <div className="flex-1 bg-black/30 rounded-r-md h-5 sm:h-6 relative overflow-hidden flex items-center">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.6, ease: "easeOut" }}
                                      className="h-full rounded-r-md shadow-sm"
                                      style={{ backgroundColor: item.color }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Chart Scale Axis */}
                          <div className="pt-3 mt-2 border-t border-white/10">
                            <div className="flex justify-between items-center pl-24 sm:pl-28 pr-1 text-[11px] text-white/60 font-mono">
                              <span>0</span>
                              <span>{Math.round(scaleMax * 0.25)}</span>
                              <span>{Math.round(scaleMax * 0.5)}</span>
                              <span>{Math.round(scaleMax * 0.75)}</span>
                              <span>{scaleMax}</span>
                            </div>
                          </div>

                        </div>
                      );
                    })()}

                    {/* Bottom Two Statistics Cards */}
                    {(() => {
                      const selectedCategories = CATEGORY_BANNER_LIST.filter((c) =>
                        selectedCategoryBannerIds.includes(c.id)
                      );
                      const effectiveCategories =
                        selectedCategories.length > 0 ? selectedCategories : CATEGORY_BANNER_LIST;

                      const matchingForStats = allRequests.filter((r) => {
                        if (r.status === "cancelled") return false;
                        const reqCats = getRequestCategoryBannerIds(r);
                        return effectiveCategories.some((c) => reqCats.includes(c.id));
                      });

                      const totalCampaign = matchingForStats.filter((r) => Boolean(r.campaignTitle || r.campaignId)).length;
                      const totalIndependent = matchingForStats.length - totalCampaign;

                      return (
                        <div className="grid grid-cols-2 gap-3.5">
                          {/* Left: Campaign Requests */}
                          <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-3 text-center shadow-md flex flex-col items-center justify-center min-h-[82px]">
                            <span className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight">
                              {totalCampaign}
                            </span>
                            <span className="font-serif italic text-xs sm:text-sm text-white/90 mt-0.5">
                              Campaign Requests
                            </span>
                          </div>

                          {/* Right: Independent Requests */}
                          <div className="bg-[#2a211a] rounded-2xl border border-[#433428] p-3 text-center shadow-md flex flex-col items-center justify-center min-h-[82px]">
                            <span className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight">
                              {totalIndependent}
                            </span>
                            <span className="font-serif italic text-xs sm:text-sm text-white/90 mt-0.5">
                              Independent Requests
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* RIGHT COLUMN: Category Photo Banners (Multi-selection enabled) */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 text-xs font-mono text-white/70">
                      <span>
                        {selectedCategoryBannerIds.length > 0
                          ? `${selectedCategoryBannerIds.length} of ${CATEGORY_BANNER_LIST.length} categories selected`
                          : "Showing all categories (Click to filter multiple)"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedCategoryBannerIds.length === CATEGORY_BANNER_LIST.length) {
                              setSelectedCategoryBannerIds([]);
                              showToast("Deselected all categories");
                            } else {
                              setSelectedCategoryBannerIds(CATEGORY_BANNER_LIST.map((c) => c.id));
                              showToast("Selected all categories");
                            }
                          }}
                          className="text-[11px] text-yellow-300/80 hover:text-yellow-300 underline cursor-pointer transition-colors"
                        >
                          {selectedCategoryBannerIds.length === CATEGORY_BANNER_LIST.length
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-2 space-y-2.5">
                      {CATEGORY_BANNER_LIST.map((cat) => {
                        const isSelected = selectedCategoryBannerIds.includes(cat.id);

                        return (
                          <div
                            key={cat.id}
                            onClick={() => {
                              if (isSelected) {
                                const next = selectedCategoryBannerIds.filter((id) => id !== cat.id);
                                setSelectedCategoryBannerIds(next);
                                showToast(
                                  next.length === 0
                                    ? `Deselected ${cat.title.replace(/\n/g, " ")} (Showing all categories)`
                                    : `Deselected ${cat.title.replace(/\n/g, " ")} (${next.length} selected)`
                                );
                              } else {
                                const next = [...selectedCategoryBannerIds, cat.id];
                                setSelectedCategoryBannerIds(next);
                                showToast(
                                  `Added ${cat.title.replace(/\n/g, " ")} (${next.length} categories selected)`
                                );
                              }
                            }}
                            className={`rounded-xl transition-all duration-300 cursor-pointer select-none ${
                              isSelected
                                ? "p-[2.5px] bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#06b6d4] shadow-lg shadow-purple-950/50 scale-[1.01]"
                                : "p-[2.5px] bg-transparent border border-[#3e2e23] hover:border-white/40 hover:scale-[1.005]"
                            }`}
                          >
                            <div className="relative h-12 sm:h-14 md:h-[58px] rounded-[10px] overflow-hidden flex items-center px-4 sm:px-6 group">
                              {/* Background Photo */}
                              <img
                                src={cat.imageUrl}
                                alt={cat.title}
                                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />

                              {/* Dark gradient overlay for strong text contrast */}
                              <div
                                className={`absolute inset-0 transition-opacity ${
                                  isSelected
                                    ? "bg-gradient-to-r from-black/80 via-black/50 to-black/25"
                                    : "bg-gradient-to-r from-black/85 via-black/60 to-black/35 group-hover:from-black/75"
                                }`}
                              />

                              {/* Category Title & Selected Indicator */}
                              <div className="relative z-10 flex items-center justify-between w-full">
                                <div className="flex items-center gap-2.5">
                                  {/* Checkbox indicator */}
                                  <div
                                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                      isSelected
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 border-pink-300 text-white shadow-sm"
                                        : "border-white/40 bg-black/40 group-hover:border-white/70"
                                    }`}
                                  >
                                    {isSelected && (
                                      <svg
                                        className="w-3 h-3 stroke-current stroke-2 fill-none"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </div>

                                  <span className="font-sans font-black text-white text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-wider leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] whitespace-pre-line">
                                    {cat.title}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Bottom Switcher: Quick Link back to Filter Overview */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono text-white/60">
                  <span>
                    Showing{" "}
                    <strong className="text-yellow-400">{filteredRequests.length}</strong> matching needs
                  </span>
                  <button
                    onClick={() => setFilterViewMode("overview")}
                    className="text-[#f4efe5]/80 hover:text-yellow-400 underline cursor-pointer transition-colors"
                  >
                    View All Filter Types (Location & Urgency) &rarr;
                  </button>
                </div>

              </div>
            ) : (
              /* VIEW MODE: OVERVIEW (~ Filter By ~ with Venn diagram, Map, Arrow) */
              <div className="bg-[#2a221b] rounded-3xl border border-[#483a2f] p-5 sm:p-8 shadow-2xl space-y-6">
                
                {/* ~ Filter By ~ Title */}
                <h3 className="font-serif italic text-2xl sm:text-3xl text-[#f4efe5] text-center font-normal tracking-wide select-none">
                  ~ Filter By ~
                </h3>

                {/* 3 Illustrated Filter Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 items-end max-w-3xl mx-auto pt-1 pb-2">
                  
                  {/* 1. CATEGORIES COLUMN */}
                  <div className="flex flex-col items-center justify-end space-y-4">
                    {/* Venn Diagram 3 overlapping translucent circles illustration */}
                    <div
                      onClick={() => setFilterViewMode("categories")}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200"
                      title="Filter by Categories"
                    >
                      <svg
                        viewBox="0 0 160 140"
                        className="w-28 h-24 sm:w-32 sm:h-28 mx-auto filter drop-shadow"
                        fill="none"
                      >
                        {/* Top Circle - Soft Cyan Blue */}
                        <circle cx="80" cy="46" r="32" fill="#90caf9" fillOpacity="0.8" />
                        {/* Bottom Left Circle - Soft Lavender */}
                        <circle cx="62" cy="80" r="32" fill="#d1c4e9" fillOpacity="0.8" />
                        {/* Bottom Right Circle - Soft Amber Peach */}
                        <circle cx="98" cy="80" r="32" fill="#ffe082" fillOpacity="0.8" />

                        {/* Blended Shaded Overlaps */}
                        <path
                          d="M 62 48 A 32 32 0 0 1 80 78 A 32 32 0 0 1 50 68 Z"
                          fill="#37474f"
                          fillOpacity="0.35"
                        />
                        <path
                          d="M 98 48 A 32 32 0 0 0 80 78 A 32 32 0 0 0 110 68 Z"
                          fill="#37474f"
                          fillOpacity="0.35"
                        />
                        <path
                          d="M 80 60 A 32 32 0 0 1 80 100 A 32 32 0 0 1 80 60 Z"
                          fill="#37474f"
                          fillOpacity="0.35"
                        />
                        <circle cx="80" cy="68" r="14" fill="#263238" fillOpacity="0.45" />
                      </svg>
                    </div>

                    {/* Categories Pill Button */}
                    <button
                      type="button"
                      onClick={() => setFilterViewMode("categories")}
                      className={`w-full max-w-[200px] py-2.5 px-6 rounded-full font-serif italic text-lg sm:text-xl font-medium transition-all duration-300 cursor-pointer shadow-md text-center select-none ${
                        filterViewMode === "categories"
                          ? "bg-[#352a21] hover:bg-[#ff5722] hover:text-white text-[#f4efe5] border border-[#5a4638] hover:border-orange-400/40 hover:shadow-orange-950/50 hover:scale-105"
                          : "bg-[#352a21] hover:bg-[#ff5722] hover:text-white text-[#f4efe5] border border-[#5a4638] hover:border-orange-400/40 hover:shadow-orange-950/50 hover:scale-105"
                      }`}
                    >
                      Categories
                    </button>
                  </div>

                  {/* 2. LOCATION COLUMN */}
                  <div className="flex flex-col items-center justify-end space-y-4">
                    {/* Folded 3D Map with Red Pin Illustration */}
                    <div
                      onClick={() => setFilterViewMode("location")}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200"
                      title="Filter by Location"
                    >
                      <svg
                        viewBox="0 0 180 140"
                        className="w-32 h-24 sm:w-36 sm:h-28 mx-auto filter drop-shadow-md"
                        fill="none"
                      >
                        {/* Facet 1: Left fold */}
                        <polygon points="18,54 62,36 62,108 18,126" fill="#8bc34a" />
                        <polygon points="18,78 62,60 62,108 18,126" fill="#4fc3f7" />
                        <polygon points="18,96 62,78 62,108 18,126" fill="#039be5" />

                        {/* Facet 2: Center fold */}
                        <polygon points="62,36 116,66 116,138 62,108" fill="#aed581" />
                        <polygon points="62,60 116,90 116,138 62,108" fill="#fff59d" />

                        {/* Facet 3: Right fold */}
                        <polygon points="116,66 162,38 162,110 116,138" fill="#9ccc65" />
                        <polygon points="116,90 162,62 162,110 116,138" fill="#bcaaa4" />

                        {/* Map Pin ground shadow */}
                        <ellipse cx="90" cy="98" rx="8" ry="3.5" fill="rgba(0,0,0,0.35)" />

                        {/* Classic Red Pin Pointer */}
                        <path
                          d="M 90 20 C 76.5 20 65.5 31 65.5 44.5 C 65.5 62 90 98 90 98 C 90 98 114.5 62 114.5 44.5 C 114.5 31 103.5 20 90 20 Z"
                          fill="#e53935"
                        />
                        <circle cx="90" cy="44.5" r="9" fill="#b71c1c" />
                      </svg>
                    </div>

                    {/* Location Pill Button */}
                    <button
                      type="button"
                      onClick={() => setFilterViewMode("location")}
                      className="w-full max-w-[200px] py-2.5 px-6 rounded-full font-serif italic text-lg sm:text-xl font-medium transition-all duration-300 cursor-pointer shadow-md text-center select-none bg-[#352a21] hover:bg-[#ff5722] hover:text-white text-[#f4efe5] border border-[#5a4638] hover:border-orange-400/40 hover:shadow-orange-950/50 hover:scale-105"
                    >
                      Location
                    </button>
                  </div>

                  {/* 3. PRIORITY & STATUS COLUMN */}
                  <div className="flex flex-col items-center justify-end space-y-4">
                    {/* Hand-drawn upward golden arrow with star & rays */}
                    <div
                      onClick={() => setFilterViewMode("priority")}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200"
                      title="Filter by Priority & Status"
                    >
                      <svg
                        viewBox="0 0 140 140"
                        className="w-24 h-24 sm:w-28 sm:h-28 mx-auto filter drop-shadow-md"
                        fill="none"
                      >
                        {/* Star Sparkle / Action rays */}
                        <line x1="70" y1="4" x2="70" y2="10" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="52" y1="12" x2="57" y2="17" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="88" y1="12" x2="83" y2="17" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="45" y1="28" x2="52" y2="28" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="95" y1="28" x2="88" y2="28" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Golden Star on Tip */}
                        <polygon
                          points="70,14 74,25 86,25 76,33 80,44 70,36 60,44 64,33 54,25 66,25"
                          fill="#fdd835"
                          stroke="#1c1917"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />

                        {/* Upward Arrow */}
                        <path
                          d="M 70 38 L 102 78 L 86 78 L 86 122 C 86 126 83 129 79 129 L 61 129 C 57 129 54 126 54 122 L 54 78 L 38 78 Z"
                          fill="#fdd835"
                          stroke="#1c1917"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />

                        {/* Inner highlight line */}
                        <path
                          d="M 68 48 L 88 74 L 78 74 L 78 120"
                          stroke="#fff9c4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity="0.8"
                        />
                      </svg>
                    </div>

                    {/* Priority & Status Pill Button */}
                    <button
                      type="button"
                      onClick={() => setFilterViewMode("priority")}
                      className="w-full max-w-[200px] py-2.5 px-4 rounded-full font-serif italic text-lg sm:text-xl font-medium transition-all duration-300 cursor-pointer shadow-md text-center select-none whitespace-nowrap bg-[#352a21] hover:bg-[#ff5722] hover:text-white text-[#f4efe5] border border-[#5a4638] hover:border-orange-400/40 hover:shadow-orange-950/50 hover:scale-105"
                    >
                      Priority & Status
                    </button>
                  </div>

                </div>

                {/* Sub-Filters for Location & Priority */}
                {filterViewMode === "location" && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
                        Select Region / City:
                      </span>
                      {selectedLocationFilter !== "ALL" && (
                        <button
                          onClick={() => setSelectedLocationFilter("ALL")}
                          className="text-[11px] font-mono text-white/70 hover:text-white underline cursor-pointer"
                        >
                          Show all locations
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedLocationFilter("ALL")}
                        className={`text-xs font-mono px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                          selectedLocationFilter === "ALL"
                            ? "bg-[#ff5722] text-white font-bold shadow-md"
                            : "bg-white/10 text-white/80 hover:bg-white/20"
                        }`}
                      >
                        All Regions
                      </button>
                      {locationsList.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setSelectedLocationFilter(loc)}
                          className={`text-xs font-mono px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                            selectedLocationFilter === loc
                              ? "bg-[#ff5722] text-white font-bold shadow-md scale-105"
                              : "bg-white/10 text-white/80 hover:bg-white/20"
                          }`}
                        >
                          📍 {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filterViewMode === "priority" && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
                        Filter by Urgency & Status:
                      </span>
                      {selectedPriorityFilter !== "ALL" && (
                        <button
                          onClick={() => setSelectedPriorityFilter("ALL")}
                          className="text-[11px] font-mono text-white/70 hover:text-white underline cursor-pointer"
                        >
                          Reset priority filter
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "ALL", label: "All Priorities" },
                        { id: "EMERGENCY", label: "🚨 Emergency Only" },
                        { id: "HIGH", label: "⚡ High Urgency" },
                        { id: "STANDARD", label: "📦 Standard" },
                        { id: "ACTIVE", label: "🟢 Active Needs" },
                        { id: "FULFILLED", label: "✅ Fulfilled" },
                      ].map((item) => {
                        const isSelected = selectedPriorityFilter === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setSelectedPriorityFilter(item.id)}
                            className={`text-xs font-mono font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#ff5722] text-white shadow-md scale-105"
                                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION SUBTITLE: All Requests: Suggested For You (Personalized Recommendations) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3 mb-6">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-2xl sm:text-3xl font-serif italic text-[#f4efe5] font-semibold tracking-tight">
              {searchQuery.trim() ? `Search: "${searchQuery}"` : "All Requests:"}
            </h2>
            <span className="text-xs sm:text-sm text-[#f4efe5]/70 font-sans">
              {searchQuery.trim()
                ? "Matching title, campaign name, labels, and item keywords"
                : "Suggested For You (Personalized Recommendations)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-1 text-xs font-mono bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 px-2.5 py-1 rounded-full border border-yellow-400/30 cursor-pointer transition-all"
              >
                <span>Clear search</span>
                <X className="w-3 h-3" />
              </button>
            )}
            <span className="text-xs font-mono text-yellow-400 font-bold bg-black/40 px-3 py-1 rounded-full border border-yellow-400/20">
              Showing {filteredRequests.length} {filteredRequests.length === 1 ? "Need" : "Needs"}
            </span>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#2c221a]/60 rounded-3xl border border-white/10 max-w-lg mx-auto my-8">
            <Package className="w-14 h-14 text-yellow-400/60 mx-auto mb-3" />
            <h3 className="text-xl font-serif italic text-white font-bold mb-1">No matching requests found</h3>
            <p className="text-xs text-[#f4efe5]/70 mb-4">
              Try adjusting your search keywords or resetting the category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategoryBannerIds([]);
                setSelectedLocationBannerIds([]);
                setSelectedPriorityBannerIds([]);
                setSelectedCategoryFilter("ALL");
                setSelectedLocationFilter("ALL");
                setSelectedPriorityFilter("ALL");
                showToast("All filters have been reset");
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* 3-COLUMN REQUEST CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredRequests.map((req, index) => {
              const bgTheme = getCardBgTheme(req);
              const badges = getBadgesForRequest(req);
              const progress = getProgressData(req);
              const cardImages = req.images && req.images.length > 0 ? req.images : [req.imageUrl];
              const activeImgIdx = (cardImageIndex[req.id] || 0) % cardImages.length;
              const currentImgUrl = cardImages[activeImgIdx] || req.imageUrl;
              const isTooltipVisible = activeTooltipCardId === req.id;

              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => setSelectedDetailRequest(req)}
                  className={`group rounded-[2rem] p-4 sm:p-5 shadow-2xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.015] hover:shadow-yellow-400/10 cursor-pointer ${bgTheme}`}
                >
                  <div className="space-y-3.5">
                    
                    {/* 1. ITEM PHOTO CONTAINER */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetailRequest(req);
                      }}
                      className="relative rounded-2xl bg-white/95 overflow-hidden h-52 sm:h-56 flex items-center justify-center p-2 shadow-inner group/img cursor-pointer"
                    >
                      <img
                        src={currentImgUrl}
                        alt={req.title}
                        className="w-full h-full object-contain sm:object-cover rounded-xl transition-transform duration-500 group-hover/img:scale-105"
                        referrerPolicy="no-referrer"
                      />

                      {/* Multi-image carousel controls */}
                      {cardImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevCardImage(req.id, cardImages.length, e);
                            }}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow"
                            title="Previous Photo"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextCardImage(req.id, cardImages.length, e);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow"
                            title="Next Photo"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Dots */}
                          <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1">
                            {cardImages.map((_, dotIdx) => (
                              <span
                                key={dotIdx}
                                className={`h-1.5 rounded-full transition-all ${
                                  dotIdx === activeImgIdx ? "w-3.5 bg-black" : "w-1.5 bg-black/30"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {/* View Details / Lightbox trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDetailRequest(req);
                        }}
                        className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black text-white text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shadow"
                        title="View Full Details"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </div>

                    {/* 2. TITLE: Bold Italic Serif Heading */}
                    <h3 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetailRequest(req);
                      }}
                      className="text-xl sm:text-2xl font-serif italic font-bold tracking-tight text-white line-clamp-1 hover:text-yellow-300 transition-colors cursor-pointer"
                    >
                      {req.title}
                    </h3>

                    {/* 3. CATEGORY BADGES */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {badges.map((badgeName, bIdx) => {
                        const upper = badgeName.toUpperCase();
                        const colorConf = BADGE_COLOR_MAP[upper] || { bg: "bg-[#455a64]", text: "text-white" };
                        return (
                          <span
                            key={bIdx}
                            className={`${colorConf.bg} ${colorConf.text} text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm`}
                          >
                            {badgeName}
                          </span>
                        );
                      })}
                    </div>

                    {/* 4. TIMESTAMP & LOCATION */}
                    <div className="flex items-end justify-between pt-1">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono uppercase text-white/70 font-bold tracking-wider block">
                          LOCATION
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-white">
                          <MapPin className="w-3.5 h-3.5 text-white/80 shrink-0" />
                          <span className="truncate max-w-[170px]">{req.location}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider font-semibold block">
                          {req.postedDate || "2 DAYS AGO"}
                        </span>
                      </div>
                    </div>

                    {/* 5. CAMPAIGN PROGRESS BAR & STATS */}
                    <div className="space-y-1.5 pt-1 relative">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono uppercase text-white/70 font-bold tracking-wider">
                          CAMPAIGN PROGRESS
                        </span>
                        <div
                          onClick={() => setActiveTooltipCardId(isTooltipVisible ? null : req.id)}
                          className="flex items-center gap-1 text-white font-mono text-xs font-bold cursor-pointer hover:text-yellow-300 transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>{progress.ratioText}</span>
                        </div>
                      </div>

                      {/* Interactive Segmented Progress Bar */}
                      <div
                        onMouseEnter={() => setActiveTooltipCardId(req.id)}
                        onMouseLeave={() => setActiveTooltipCardId(null)}
                        onClick={() => setActiveTooltipCardId(isTooltipVisible ? null : req.id)}
                        className="relative h-3 w-full bg-white rounded-full overflow-hidden flex cursor-pointer shadow-inner"
                      >
                        {/* Segment 1: Done (Lime Green) */}
                        <div
                          style={{ width: `${progress.donePct}%` }}
                          className="h-full bg-[#bef264] transition-all duration-500"
                        />
                        {/* Segment 2: In Transit / Pledged (Yellow) */}
                        <div
                          style={{ width: `${progress.inTransitPct}%` }}
                          className="h-full bg-[#fef08a] transition-all duration-500"
                        />
                        {/* Segment 3: Needed / Remaining (White) */}
                        <div
                          style={{ width: `${progress.neededPct}%` }}
                          className="h-full bg-white transition-all duration-500"
                        />
                      </div>

                      {/* Tooltip speech bubble pointing to progress bar */}
                      <AnimatePresence>
                        {isTooltipVisible && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 bg-[#fef08a] text-[#2c221a] text-[11px] font-mono font-bold px-3 py-1 rounded-xl shadow-2xl pointer-events-none whitespace-nowrap border border-yellow-500/40"
                          >
                            <span>
                              {progress.done}/{progress.total} done... {progress.inTransit}/{progress.total} in transit
                            </span>
                            {/* Down arrow triangle */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#fef08a]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* 6. BOTTOM ACTION FOOTER BAR */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                    
                    {/* Left Icons: Share & Donate Box (Shopee-like cart collection) */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleShareRequest(req, e)}
                        className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
                        title="Share this Request"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleAddToDonateBox(req, e)}
                        className={`p-2 rounded-full transition-all cursor-pointer relative ${
                          donateBoxItems.some((item) => item.requestId === req.id)
                            ? "text-yellow-300 bg-white/20 ring-1 ring-yellow-300/60 shadow"
                            : "text-white/80 hover:text-white hover:bg-white/15"
                        }`}
                        title="Collect into Donate Box list"
                      >
                        <Package className="w-5 h-5" />
                        {donateBoxItems.some((item) => item.requestId === req.id) && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Right CTA: SUPPORT NOW Button (Vibrant gradient/cyan) */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenSupportModal(req, e)}
                      className="bg-gradient-to-r from-[#60a5fa] via-[#38bdf8] to-[#22d3ee] hover:brightness-110 text-[#0f172a] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>SUPPORT NOW</span>
                    </button>

                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </main>

      {/* SUPPORT & PLEDGE MODAL */}
      <AnimatePresence>
        {selectedSupportReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSupportReq(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#261e18] rounded-3xl border border-white/20 p-6 sm:p-7 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
                    <span>Pledge In-Kind Support</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-white">
                    {selectedSupportReq.title}
                  </h3>
                  <p className="text-xs text-[#f4efe5]/70 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Location: {selectedSupportReq.location}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSupportReq(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Request Info Snapshot */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                <img
                  src={selectedSupportReq.imageUrl}
                  alt={selectedSupportReq.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/20"
                />
                <div className="space-y-1 text-xs">
                  <p className="text-[#f4efe5]/90 line-clamp-2">{selectedSupportReq.description}</p>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-yellow-400">
                    <span>Target: {selectedSupportReq.quantity} {selectedSupportReq.unit}</span>
                    <span>•</span>
                    <span>Remaining: {Math.max(0, selectedSupportReq.quantity - selectedSupportReq.pledgedQuantity)} {selectedSupportReq.unit}</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleConfirmPledge} className="space-y-4">
                
                {/* Quantity Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-yellow-400 font-bold">
                    Quantity you want to pledge ({selectedSupportReq.unit}):
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPledgeQuantityInput((prev) => Math.max(1, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={Math.max(1, selectedSupportReq.quantity - selectedSupportReq.pledgedQuantity)}
                      value={pledgeQuantityInput}
                      onChange={(e) => setPledgeQuantityInput(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-lg text-white outline-none focus:border-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPledgeQuantityInput((prev) =>
                          Math.min(
                            Math.max(1, selectedSupportReq.quantity - selectedSupportReq.pledgedQuantity),
                            prev + 1
                          )
                        )
                      }
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-yellow-400 font-bold">
                    Fulfillment Method:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "courier", label: "Courier / Post", icon: Truck },
                      { id: "dropoff", label: "Drop-off Hub", icon: Building2 },
                      { id: "volunteer", label: "Direct Handover", icon: Heart }
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSel = deliveryMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setDeliveryMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            isSel
                              ? "border-yellow-400 bg-yellow-400/20 text-yellow-300 font-bold shadow"
                              : "border-white/10 bg-white/5 text-[#f4efe5]/70 hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[11px] font-mono leading-tight">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Donor Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#f4efe5]/60 mb-1">
                      Your Name / Organization:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Tan / Care Club"
                      value={donorNameInput}
                      onChange={(e) => setDonorNameInput(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#f4efe5]/60 mb-1">
                      Phone / WhatsApp Contact:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +60 12-3456789"
                      value={donorContactInput}
                      onChange={(e) => setDonorContactInput(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                {/* Message to Requester */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#f4efe5]/60 mb-1">
                    Encouraging Note or Packing Remark (Optional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Glad to help! Sending brand new packs via courier tomorrow."
                    value={donorNoteInput}
                    onChange={(e) => setDonorNoteInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-yellow-400 resize-none"
                  />
                </div>

                {/* Submit Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSupportReq(null)}
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPledgeSubmitting}
                    className="px-6 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isPledgeSubmitting ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm Pledge ({pledgeQuantityInput} {selectedSupportReq.unit})</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CAMERA / VISUAL PHOTO SEARCH MODAL */}
      <AnimatePresence>
        {isCameraModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCameraModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#28201a] rounded-3xl border border-white/20 p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-serif italic font-bold text-lg text-white">Visual Aid Search</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(false)}
                  className="p-1 rounded-full text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="border-2 border-dashed border-white/20 hover:border-yellow-400 rounded-2xl p-6 text-center space-y-3 bg-black/30 transition-colors">
                <Upload className="w-10 h-10 text-yellow-400/80 mx-auto" />
                <div>
                  <p className="text-xs text-white font-medium">Upload or snap a photo of the item</p>
                  <p className="text-[10px] font-mono text-white/50 mt-1">
                    Matches foods, diapers, medicines, books & supplies instantly
                  </p>
                </div>
                <label className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-all shadow">
                  Select Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const fileName = e.target.files[0].name.toLowerCase();
                        setIsCameraModalOpen(false);
                        if (fileName.includes("dog") || fileName.includes("pet")) {
                          setSearchQuery("dog");
                          showToast("Matching pet & animal supply requests...");
                        } else if (fileName.includes("baby") || fileName.includes("diaper") || fileName.includes("pamper")) {
                          setSearchQuery("pamper");
                          showToast("Matching infant & baby supply requests...");
                        } else if (fileName.includes("book") || fileName.includes("lego") || fileName.includes("toy")) {
                          setSearchQuery("child");
                          showToast("Matching educational & child requests...");
                        } else {
                          setSearchQuery("food");
                          showToast("Photo analyzed! Showing closest matching aid requests.");
                        }
                      }
                    }}
                  />
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING DONATE BOX LAUNCHER BUTTON */}
      <AnimatePresence>
        {donateBoxItems.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigateToDonateBoxPage}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-3 px-5 rounded-full shadow-2xl flex items-center gap-3 border-2 border-white/40 cursor-pointer group"
            title="Open Donate Box Page"
          >
            <div className="relative">
              <Package className="w-6 h-6 text-black" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow">
                {donateBoxItems.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
            </div>
            <div className="text-left">
              <span className="block text-xs uppercase tracking-wider font-extrabold font-mono">Donate Box List</span>
              <span className="block text-[10px] text-black/80 font-medium font-sans">
                {donateBoxItems.length} item{donateBoxItems.length > 1 ? "s" : ""} collected • Click to view page
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* DONATE BOX (SHOPEE-LIKE CART) MODAL / DRAWER */}
      <AnimatePresence>
        {isDonateBoxOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 md:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDonateBoxOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-[#28201a] rounded-3xl border border-white/20 shadow-2xl z-10 flex flex-col overflow-hidden text-[#f4efe5]"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif italic font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                      Donate Box List
                      <span className="text-xs font-mono font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full not-italic">
                        {donateBoxItems.length} Items
                      </span>
                    </h2>
                    <p className="text-[11px] font-mono text-white/60">
                      Collect items to send in one batch (like a shopping cart)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDonateBoxOpen(false)}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                {donateBoxItems.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif italic text-base sm:text-lg text-white/90">
                      Your Donate Box is empty
                    </h3>
                    <p className="text-xs text-white/60 max-w-sm mx-auto font-sans leading-relaxed">
                      Click the <Package className="w-4 h-4 inline text-yellow-400 mx-1" /> Donate Box icon on any need card to collect items into your list for bulk donation dispatch.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsDonateBoxOpen(false)}
                      className="mt-2 px-5 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider font-mono transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow"
                    >
                      Browse Community Needs
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {donateBoxItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-black/30 border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-yellow-400/40 transition-colors"
                      >
                        {/* Item Thumbnail */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 border border-white/10"
                          referrerPolicy="no-referrer"
                        />

                        {/* Item Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded-full text-yellow-300 font-bold">
                              {item.category}
                            </span>
                            <span className="text-[10px] font-mono text-white/50 flex items-center gap-0.5 truncate">
                              <MapPin className="w-3 h-3 shrink-0" />
                              {item.location}
                            </span>
                          </div>

                          <h4 className="font-serif italic font-bold text-xs sm:text-sm text-white truncate">
                            {item.title}
                          </h4>

                          <p className="text-[10px] font-mono text-white/60">
                            Unit: <span className="text-white font-semibold">{item.unit}</span> (Max needed: {item.maxNeeded})
                          </p>

                          {/* Quantity Counter Control */}
                          <div className="flex items-center gap-2 pt-1">
                            <div className="flex items-center bg-black/50 border border-white/20 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleUpdateDonateBoxQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="px-2 py-1 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 py-1 text-xs font-mono font-bold text-yellow-400 min-w-[28px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateDonateBoxQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.maxNeeded}
                                className="px-2 py-1 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-[11px] font-sans text-white/80">
                              {item.quantity} {item.unit}
                            </span>
                          </div>
                        </div>

                        {/* Remove Action Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveFromDonateBox(item.id)}
                          className="p-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                          title="Remove from Donate Box"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Delivery & Dispatch Preferences */}
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-4 space-y-3 mt-4">
                      <h4 className="text-xs font-mono uppercase text-yellow-400 font-bold tracking-wider">
                        Fulfillment & Dispatch Options
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setDonateBoxDeliveryMethod("courier")}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            donateBoxDeliveryMethod === "courier"
                              ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
                              : "bg-black/30 border-white/10 text-white/70 hover:border-white/30"
                          }`}
                        >
                          <Truck className="w-4 h-4 shrink-0" />
                          <div className="text-xs">
                            <span className="block font-bold">Courier / Mail</span>
                            <span className="text-[9px] opacity-70">Send by parcel</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDonateBoxDeliveryMethod("dropoff")}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            donateBoxDeliveryMethod === "dropoff"
                              ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
                              : "bg-black/30 border-white/10 text-white/70 hover:border-white/30"
                          }`}
                        >
                          <Building2 className="w-4 h-4 shrink-0" />
                          <div className="text-xs">
                            <span className="block font-bold">Relief Hub</span>
                            <span className="text-[9px] opacity-70">Drop off locally</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDonateBoxDeliveryMethod("volunteer")}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            donateBoxDeliveryMethod === "volunteer"
                              ? "bg-yellow-400/20 border-yellow-400 text-yellow-300"
                              : "bg-black/30 border-white/10 text-white/70 hover:border-white/30"
                          }`}
                        >
                          <Heart className="w-4 h-4 shrink-0" />
                          <div className="text-xs">
                            <span className="block font-bold">Handover</span>
                            <span className="text-[9px] opacity-70">In-person hand</span>
                          </div>
                        </button>
                      </div>

                      {/* Optional Note */}
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                          Delivery Note / Remark (Optional):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Dispatched via J&T Express tomorrow morning, packaged with care."
                          value={donateBoxDonorNote}
                          onChange={(e) => setDonateBoxDonorNote(e.target.value)}
                          className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Checkout Actions */}
              {donateBoxItems.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-white/10 bg-black/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-white/60 block">Total Pledged Units</span>
                      <span className="text-base sm:text-lg font-mono font-bold text-yellow-400">
                        {donateBoxItems.reduce((acc, curr) => acc + curr.quantity, 0)} Units across {donateBoxItems.length} Needs
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearDonateBox}
                      className="text-xs font-mono text-red-400/80 hover:text-red-300 underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsDonateBoxOpen(false)}
                      className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors cursor-pointer"
                    >
                      Continue Browsing
                    </button>

                    <button
                      type="button"
                      disabled={isDonateBoxCheckingOut}
                      onClick={handleDonateBoxCheckout}
                      className="px-6 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase tracking-wider font-mono shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      {isDonateBoxCheckingOut ? (
                        <span>Processing Dispatch...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-black" />
                          <span>Pledge & Dispatch All</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN PHOTO LIGHTBOX */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[85vh] bg-black/90 rounded-3xl p-4 border border-white/20 shadow-2xl z-10 flex flex-col items-center"
            >
              <div className="w-full flex justify-between items-center pb-3 border-b border-white/10">
                <span className="font-serif italic font-bold text-sm text-white">{lightboxImage.title}</span>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="p-1 rounded-full text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[70vh] object-contain rounded-2xl my-3 shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL REQUEST DETAIL MODAL (Matching screenshot archetype) */}
      <RequestDetailModal
        request={selectedDetailRequest}
        isOpen={Boolean(selectedDetailRequest)}
        onClose={() => setSelectedDetailRequest(null)}
        onAddToDonateBox={(req) => handleAddToDonateBox(req)}
        onSupportNow={(req) => handleOpenSupportModal(req)}
        isInDonateBox={Boolean(
          selectedDetailRequest && donateBoxItems.some((item) => item.requestId === selectedDetailRequest.id)
        )}
        onShare={(req) => handleShareRequest(req)}
        onOpenDonateBoxPage={() => handleNavigateToDonateBoxPage()}
      />

    </div>
  );
}
