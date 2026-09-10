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
import { RecipientRequest, RequestCategory, formatCapitalizedTitle, formatRequestPostedDate } from "../types";
import { RequestDetailModal } from "./RequestDetailModal";
import {
  subscribeToAllRequests,
  subscribeToAllDeliveryPackages,
  seedInitialRequestsIfEmpty,
  updateRequestInCloud,
  savePledgeToCloud
} from "../lib/cloudService";
import {
  MASTER_COMMUNITY_REQUESTS,
  STABLE_REQUEST_IMAGE_IDS,
  getCharityLocationForRequest,
  getAllMergedCommunityRequests,
  broadcastCommunityRequestsUpdate
} from "../data/allRequestsCatalog";
import { SEED_DELIVERY_PACKAGES } from "../data/seedDatabase";
import { getDeliveryProgress, getStoredDeliveryPackages } from "../lib/deliveryProgress";
import type { DeliveryPackageItem } from "../types";

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
  navigateToView: (view: "home" | "comments" | "explore" | "main_menu" | "your_request" | "needs" | "preparing_donate_box" | "delivery_status") => void;
}

// Master community requests catalog (includes Sister Mary Theresa, Uncle Tan, all registered recipients & community needs)
export const DEFAULT_NEEDS_REQUESTS: RecipientRequest[] = MASTER_COMMUNITY_REQUESTS;

// Exact badge color styling dictionary matching the AidStory design system
export const BADGE_COLOR_MAP: Record<string, { bg: string; text: string }> = {
  CAMPAIGN: { bg: "bg-[#7c3aed]", text: "text-white" },
  INDIVIDUAL: { bg: "bg-[#0284c7]", text: "text-white" },
  ORGANIZATION: { bg: "bg-[#0f766e]", text: "text-white" },
  COMMUNITY: { bg: "bg-[#059669]", text: "text-white" },
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

// Helper to determine if a request belongs to a Campaign or is an Individual request
export const isCampaignRequest = (req: RecipientRequest): boolean => {
  if (req.campaignId && req.campaignId.trim() !== "") return true;
  if (req.campaignTitle && req.campaignTitle.trim() !== "") return true;
  if (req.title && req.title.toUpperCase().includes("CAMPAIGN")) return true;
  if (req.authorType === "campaign" || req.authorType === "organization") return true;
  if ((req.tags || []).some((t) => t.toUpperCase() === "CAMPAIGN")) return true;
  if ((req.categories || []).some((c) => c.toUpperCase() === "CAMPAIGN")) return true;
  return false;
};

// Helper to get the request type label ("CAMPAIGN" or "INDIVIDUAL")
export const getRequestTypeLabel = (req: RecipientRequest): "CAMPAIGN" | "INDIVIDUAL" => {
  return isCampaignRequest(req) ? "CAMPAIGN" : "INDIVIDUAL";
};

// Helper to extract category badges for a request consistently
export const getBadgesForRequest = (req: RecipientRequest): string[] => {
  const typeBadge = getRequestTypeLabel(req);
  let baseBadges: string[] = [];

  if (req.categories && req.categories.length > 0) {
    baseBadges = [...req.categories];
  } else if (req.category) {
    if (req.category === "Emergency") baseBadges = ["EMERGENCY"];
    else if (req.category === "Food") baseBadges = ["FOODS"];
    else if (req.category === "Animal") baseBadges = ["ANIMALS"];
    else if (req.category === "Education") baseBadges = ["EDUCATION", "BOOKS"];
    else if (req.category === "Clothing") baseBadges = ["CLOTHING", "TEXTILES"];
    else if (req.category === "Household") baseBadges = ["HOUSEHOLD", "FURNITURE"];
    else baseBadges = [req.category.toUpperCase()];
  } else {
    baseBadges = ["GENERAL"];
  }

  // Ensure typeBadge is first, avoiding duplicates
  const filtered = baseBadges.filter(
    (b) => b.toUpperCase() !== "CAMPAIGN" && b.toUpperCase() !== "INDIVIDUAL"
  );
  return [typeBadge, ...filtered];
};

export type RequestPriority = "emergency" | "important" | "standard";

// Converts legacy saved values while ensuring all new requests follow the
// three-level priority model: Emergency, Important, and Standard.
export const getRequestPriority = (req: RecipientRequest): RequestPriority => {
  switch ((req.urgencyLevel || "important").toLowerCase()) {
    case "emergency":
    case "high":
      return "emergency";
    case "standard":
    case "low":
      return "standard";
    case "important":
    case "medium":
    case "urgent":
    default:
      return "important";
  }
};

// Only Emergency requests receive the highest display and sorting priority.
export const isEmergencyRequest = (req: RecipientRequest): boolean =>
  getRequestPriority(req) === "emergency";

// Card color themes: Red for Emergency items, Green for Important and Standard items
export const getCardBgTheme = (req: RecipientRequest): string => {
  if (isEmergencyRequest(req)) {
    // Red / Burgundy for Emergency items
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

// Helper to extract a friendly, concise item name from a recipient request
export const getCleanItemName = (req: RecipientRequest): string => {
  let t = (req.title || "").trim();
  // Strip "Campaign A - " or "Campaign B - " prefixes
  t = t.replace(/^Campaign\s+[A-Za-z0-9]+\s*[-–—:]\s*/i, "").trim();
  // If title is all uppercase, capitalize properly
  if (t === t.toUpperCase() && t.length > 3) {
    t = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
  }
  // Trim very long names for concise bar display
  if (t.length > 20) {
    t = t.slice(0, 18) + "...";
  }
  return t;
};

// Vibrant color palette for top requested items chart bars
const CHART_BAR_COLORS = ["#a78bfa", "#3b82f6", "#fba94b", "#fde047", "#fb7185", "#34d399", "#38bdf8"];

// Helper to compute top requested items dynamically from any list of active requests
export const getTopRequestedItems = (requests: RecipientRequest[]) => {
  if (!requests || requests.length === 0) {
    return {
      topItems: [
        { name: "Storybooks", count: 0, color: "#a78bfa" },
        { name: "White Rice", count: 0, color: "#3b82f6" },
        { name: "Baby Diapers", count: 0, color: "#fba94b" },
        { name: "Warm Blankets", count: 0, color: "#fde047" },
        { name: "Medical Aid", count: 0, color: "#fb7185" },
      ],
      scaleMax: 20
    };
  }

  const map = new Map<string, number>();
  requests.forEach((req) => {
    const name = getCleanItemName(req);
    const qty = Math.max(1, req.quantity || 1);
    map.set(name, (map.get(name) || 0) + qty);
  });

  const sorted = Array.from(map.entries())
    .map(([name, count], idx) => ({
      name,
      count,
      color: CHART_BAR_COLORS[idx % CHART_BAR_COLORS.length]
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxVal = Math.max(...sorted.map((i) => i.count), 10);
  const scaleMax = maxVal <= 20 ? 20 : Math.ceil(maxVal / 10) * 10;

  return { topItems: sorted, scaleMax };
};

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
  categoryType: "ORDER_BY" | "URGENCY" | "CAMPAIGN";
  criteria: "STANDARD_AID" | "IMPORTANT_NEED" | "EMERGENCY_NEED" | "LATEST" | "OLDEST" | "MOST_FULFILLED" | "LEAST_FULFILLED" | "CAMPAIGN" | "NON_CAMPAIGN";
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
    name: "ORDER BY: OLDEST POSTED\n(OLDEST FIRST)",
    subtitle: "Sort: Oldest → Newest (Choose One)",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900&auto=format&fit=crop&q=80",
    categoryType: "ORDER_BY",
    criteria: "OLDEST",
    description: "Orders requests that have been posted the longest and are waiting for fulfillment.",
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
    id: "standard_aid",
    name: "STANDARD AID\n(NON-CRITICAL SUPPLIES)",
    subtitle: "Urgency Level: Standard Aid",
    imageUrl: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=900&auto=format&fit=crop&q=80",
    categoryType: "URGENCY",
    criteria: "STANDARD_AID",
    description: "Standard community support supplies, study materials, and general living assistance.",
    campaignCount: 4,
    independentCount: 9,
    topItems: [
      { name: "School Backpacks", count: 68, max: 80, color: "#10b981" },
      { name: "Story Books", count: 54, max: 80, color: "#34d399" },
      { name: "Cotton Towels", count: 42, max: 80, color: "#6ee7b7" },
      { name: "Stationery Sets", count: 32, max: 80, color: "#a7f3d0" },
      { name: "Coloring Pencils", count: 18, max: 80, color: "#d1fae5" },
    ],
  },
  {
    id: "important_need",
    name: "IMPORTANT NEED\n(REQUIRED WITHIN WEEK)",
    subtitle: "Urgency Level: Important Need",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&auto=format&fit=crop&q=80",
    categoryType: "URGENCY",
    criteria: "IMPORTANT_NEED",
    description: "Essential provisions and household equipment required within the week.",
    campaignCount: 6,
    independentCount: 11,
    topItems: [
      { name: "Rice & Cooking Oil", count: 76, max: 80, color: "#fba94b" },
      { name: "Adult Diapers", count: 60, max: 80, color: "#facc15" },
      { name: "Mattresses", count: 46, max: 80, color: "#fb923c" },
      { name: "Electric Kettles", count: 34, max: 80, color: "#fdba74" },
      { name: "Baby Formula", count: 22, max: 80, color: "#fed7aa" },
    ],
  },
  {
    id: "emergency_need",
    name: "EMERGENCY NEED\n(IMMEDIATE 24-48H)",
    subtitle: "Urgency Level: Emergency Need",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=900&auto=format&fit=crop&q=80",
    categoryType: "URGENCY",
    criteria: "EMERGENCY_NEED",
    description: "Immediate disaster relief supplies, life-saving items, and emergency packs within 24-48h.",
    campaignCount: 4,
    independentCount: 8,
    topItems: [
      { name: "Clean Water Filters", count: 80, max: 80, color: "#ef4444" },
      { name: "First Aid Kits", count: 64, max: 80, color: "#f97316" },
      { name: "Emergency Rations", count: 52, max: 80, color: "#f87171" },
      { name: "Rescue Blankets", count: 36, max: 80, color: "#fca5a5" },
      { name: "Power Banks", count: 24, max: 80, color: "#fecaca" },
    ],
  },
  {
    id: "campaign",
    name: "CAMPAIGN\nREQUESTS",
    subtitle: "Organized Campaigns",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop&q=80",
    categoryType: "CAMPAIGN",
    criteria: "CAMPAIGN",
    description: "Needs published under organized charity and community campaigns.",
    campaignCount: 8,
    independentCount: 0,
    topItems: [
      { name: "Bulk Rice Packs", count: 75, max: 80, color: "#06b6d4" },
      { name: "Care Kits", count: 60, max: 80, color: "#22d3ee" },
      { name: "School Essentials", count: 48, max: 80, color: "#67e8f9" },
      { name: "Elderly Provisions", count: 30, max: 80, color: "#a5f3fc" },
      { name: "Hygiene Bundles", count: 18, max: 80, color: "#cffafe" },
    ],
  },
  {
    id: "non_campaign",
    name: "NON-CAMPAIGN\n(INDEPENDENT) REQUESTS",
    subtitle: "Independent Requests",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=80",
    categoryType: "CAMPAIGN",
    criteria: "NON_CAMPAIGN",
    description: "Direct community requests submitted independently by families and individuals.",
    campaignCount: 0,
    independentCount: 16,
    topItems: [
      { name: "Groceries", count: 78, max: 80, color: "#8b5cf6" },
      { name: "Baby Diapers", count: 58, max: 80, color: "#a78bfa" },
      { name: "Study Tables", count: 42, max: 80, color: "#c4b5fd" },
      { name: "Wheelchairs", count: 32, max: 80, color: "#ddd6fe" },
      { name: "Clothing Sets", count: 20, max: 80, color: "#ede9fe" },
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

  // Load all requests (merging default catalog needs with any user-created requests across all accounts)
  const [allRequests, setAllRequests] = useState<RecipientRequest[]>(() => {
    return getAllMergedCommunityRequests();
  });
  const [deliveryPackages, setDeliveryPackages] = useState<DeliveryPackageItem[]>(() =>
    getStoredDeliveryPackages(SEED_DELIVERY_PACKAGES)
  );

  // Listen for request additions/updates from "Your Request" or other tabs in real-time
  useEffect(() => {
    const handleCatalogUpdate = () => {
      const freshRequests = getAllMergedCommunityRequests();
      setAllRequests(freshRequests);
    };

    window.addEventListener("aidstory_requests_updated", handleCatalogUpdate);
    window.addEventListener("storage", handleCatalogUpdate);

    return () => {
      window.removeEventListener("aidstory_requests_updated", handleCatalogUpdate);
      window.removeEventListener("storage", handleCatalogUpdate);
    };
  }, []);

  // Keep Browse Needs in step with the delivery records used by Delivery Status.
  useEffect(() => {
    const unsubscribe = subscribeToAllDeliveryPackages((cloudPackages) => {
      if (cloudPackages && cloudPackages.length > 0) {
        setDeliveryPackages((current) => {
          const packageMap = new Map(current.map((pkg) => [pkg.id, pkg]));
          cloudPackages.forEach((pkg) => packageMap.set(pkg.id, pkg));
          return Array.from(packageMap.values());
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Store the same derived totals on the in-memory requests so all controls
  // (remaining quantity, sorting, and progress labels) use delivery truth too.
  useEffect(() => {
    setAllRequests((current) =>
      current.map((request) => {
        const progress = getDeliveryProgress(request, deliveryPackages);
        if (
          request.pledgedQuantity === progress.pledged &&
          request.receivedQuantity === progress.done &&
          request.inTransitQuantity === progress.inTransit
        ) {
          return request;
        }

        return {
          ...request,
          pledgedQuantity: progress.pledged,
          receivedQuantity: progress.done,
          inTransitQuantity: progress.inTransit
        };
      })
    );
  }, [deliveryPackages]);

  // Save requests back to global catalog in localStorage on updates
  useEffect(() => {
    if (typeof window !== "undefined" && allRequests.length > 0) {
      localStorage.setItem("aidstory_all_needs", JSON.stringify(allRequests));
    }
  }, [allRequests]);

  // Real-time Cloud Firestore synchronization across all devices
  useEffect(() => {
    seedInitialRequestsIfEmpty(MASTER_COMMUNITY_REQUESTS);

    const unsubscribe = subscribeToAllRequests((cloudRequests) => {
      if (cloudRequests && cloudRequests.length > 0) {
        // Merge cloud requests with local catalog items
        const local = getAllMergedCommunityRequests();
        const reqMap = new Map<string, RecipientRequest>();

        local.forEach((r) => reqMap.set(r.id, r));
        cloudRequests.forEach((cr) => {
          const existing = reqMap.get(cr.id);
          reqMap.set(cr.id, {
            ...existing,
            ...cr,
            // Prefer bundled catalogue pictures for the requests whose old remote
            // photos were removed, even when Firestore still contains the old URL.
            imageUrl: STABLE_REQUEST_IMAGE_IDS.has(cr.id) ? existing?.imageUrl ?? cr.imageUrl : cr.imageUrl,
            images: STABLE_REQUEST_IMAGE_IDS.has(cr.id) ? existing?.images ?? cr.images : cr.images,
            title: formatCapitalizedTitle(cr.title),
            campaignTitle: cr.campaignTitle
              ? formatCapitalizedTitle(cr.campaignTitle)
              : existing?.campaignTitle
              ? formatCapitalizedTitle(existing.campaignTitle)
              : undefined
          });
        });

        const mergedList = Array.from(reqMap.values()).map((request) => ({
          ...request,
          location: getCharityLocationForRequest(request)
        }));
        setAllRequests(mergedList);
        try {
          localStorage.setItem("aidstory_all_needs", JSON.stringify(mergedList));
          localStorage.setItem("aidstory_recipient_requests", JSON.stringify(mergedList));
        } catch (e) {}
      }
    });

    return () => unsubscribe();
  }, []);

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
      const existingIndex = prev.findIndex(
        (item) => item.requestId === req.id
      );
      if (existingIndex > -1) {
        // Toggle OFF: Delete/Remove from cart
        const filtered = prev.filter(
          (item) => item.requestId !== req.id
        );
        try {
          localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(filtered));
        } catch (err) {}
        showToast(`Removed "${req.title}" from Donate Box 📦`);
        return filtered;
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
        const updated = [...prev, newItem];
        try {
          localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(updated));
        } catch (err) {}
        showToast(`Collected "${req.title}" into Donate Box! 📦`);
        return updated;
      }
    });
  };

  // Handle "SUPPORT NOW" -> Navigates to Donate Box list and ticks ONLY the selected item
  const handleSupportNowAndNavigate = (req: RecipientRequest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // 1. Close any open detail or support modals
    setSelectedDetailRequest(null);
    setSelectedSupportReq(null);

    // 2. Read existing cart from localStorage or state
    let currentCart: any[] = [];
    try {
      const saved = localStorage.getItem("aidstory_donate_box_cart");
      if (saved) {
        currentCart = JSON.parse(saved);
      }
    } catch (err) {}

    if (!Array.isArray(currentCart) || currentCart.length === 0) {
      currentCart = [...donateBoxItems];
    }

    const remainingNeed = Math.max(1, req.quantity - (req.pledgedQuantity || 0));

    // 3. Find if item already exists in cart
    const existingIndex = currentCart.findIndex(
      (item) => item.requestId === req.id
    );

    let updatedCart: any[] = [];

    if (existingIndex > -1) {
      // Uncheck all items EXCEPT this selected item (tick only the selected)
      updatedCart = currentCart.map((item, idx) => ({
        ...item,
        checked: idx === existingIndex
      }));
    } else {
      // Uncheck all existing items
      const uncheckedExisting = currentCart.map((item) => ({
        ...item,
        checked: false
      }));

      // Create new selected item with checked: true
      const newItem = {
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

      updatedCart = [newItem, ...uncheckedExisting];
    }

    // 4. Save to localStorage and update state
    setDonateBoxItems(updatedCart);
    try {
      localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(updatedCart));
    } catch (err) {}

    showToast(`Selected "${req.title}" in your Donate Box list 📦`);

    // 5. Navigate to Donate Box List ("preparing_donate_box")
    handleNavigateToDonateBoxPage();
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
      try {
        localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(filtered));
      } catch (err) {}
      return filtered;
    });
  };

  const handleRemoveRequestFromDonateBox = (req: RecipientRequest) => {
    setDonateBoxItems((prev) => {
      const filtered = prev.filter(
        (item) => item.requestId !== req.id
      );
      try {
        localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(filtered));
      } catch (err) {}
      showToast(`Removed "${req.title}" from Donate Box 📦`);
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
        const currentUser = JSON.parse(localStorage.getItem("aidstory_current_user") || "null");
        const savedCompleted: any[] = JSON.parse(savedCompletedJSON);
        donateBoxItems.forEach((item) => {
          savedCompleted.push({
            id: `donate-box-${Date.now()}-${item.id}`,
            type: "donate_box_cart",
            userEmail: currentUser?.email || "anonymous@aidstory.org",
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

      // Sync each updated request to Cloud Firestore
      donateBoxItems.forEach((item) => {
        const matching = allRequests.find((r) => r.id === item.requestId);
        if (matching) {
          const nextPledged = Math.min(matching.quantity, (matching.pledgedQuantity || 0) + item.quantity);
          const nextStatus = nextPledged >= matching.quantity ? "fulfilled" : matching.status;
          updateRequestInCloud(item.requestId, {
            pledgedQuantity: nextPledged,
            status: nextStatus as any
          }).catch((err) => console.warn("Cloud pledge update failed:", err));

          savePledgeToCloud({
            requestId: item.requestId,
            donorName: donateBoxDonorName.trim() || "Anonymous Community Donor",
            donorContact: donateBoxDonorPhone.trim() || "",
            donorNote: donateBoxDonorNote.trim() || "",
            quantity: item.quantity,
            deliveryMethod: donateBoxDeliveryMethod,
            status: "Delivered",
            createdAt: new Date().toISOString()
          }).catch((err) => console.warn("Cloud save pledge failed:", err));
        }
      });

      const totalItemsCount = donateBoxItems.reduce((acc, curr) => acc + curr.quantity, 0);
      setDonateBoxItems([]);
      setIsDonateBoxCheckingOut(false);
      setIsDonateBoxOpen(false);
      showToast(`🎉 Success! ${totalItemsCount} donation item(s) dispatched from your Donate Box!`);
    }, 700);
  };

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

    // Priority & Campaign Banner Filter (from Filter Drawer options)
    if (selectedPriorityBannerIds.length > 0) {
      const activePriorityBanners = PRIORITY_BANNER_LIST.filter((p) =>
        selectedPriorityBannerIds.includes(p.id)
      );

      // Separate filter criteria (urgency & campaign) from pure ordering criteria
      const filteringBanners = activePriorityBanners.filter((b) => b.categoryType !== "ORDER_BY");

      if (filteringBanners.length > 0) {
        const priority = getRequestPriority(req);
        const isCamp = isCampaignRequest(req);

        const urgencyBanners = filteringBanners.filter((b) => b.categoryType === "URGENCY");
        const campaignBanners = filteringBanners.filter((b) => b.categoryType === "CAMPAIGN");

        // Check Urgency match
        if (urgencyBanners.length > 0) {
          const matchesUrgency = urgencyBanners.some((b) => {
            if (b.criteria === "STANDARD_AID") {
              return priority === "standard";
            }
            if (b.criteria === "IMPORTANT_NEED") {
              return priority === "important";
            }
            if (b.criteria === "EMERGENCY_NEED") {
              return priority === "emergency";
            }
            return true;
          });
          if (!matchesUrgency) {
            return false;
          }
        }

        // Check Campaign match
        if (campaignBanners.length > 0) {
          const matchesCampaign = campaignBanners.some((b) => {
            if (b.criteria === "CAMPAIGN") return isCamp;
            if (b.criteria === "NON_CAMPAIGN") return !isCamp;
            return true;
          });
          if (!matchesCampaign) {
            return false;
          }
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
      const priority = getRequestPriority(req);
      if (selectedPriorityFilter === "EMERGENCY" && priority !== "emergency") {
        return false;
      } else if (selectedPriorityFilter === "IMPORTANT" && priority !== "important") {
        return false;
      } else if (selectedPriorityFilter === "STANDARD" && priority !== "standard") {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Banner ordering options (when explicitly chosen, direct ordering takes precedence)
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

    // Default: Emergency, Important, then Standard requests.
    const priorityOrder = { emergency: 3, important: 2, standard: 1 };
    const aPriority = priorityOrder[getRequestPriority(a)];
    const bPriority = priorityOrder[getRequestPriority(b)];
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    // Default secondary sort: newest first
    return (b.postedTimestamp || 0) - (a.postedTimestamp || 0);
  });

  // Calculate Progress Segments
  const getProgressData = (req: RecipientRequest) => {
    const total = req.quantity || 1;
    const { pledged, done, inTransit } = getDeliveryProgress(req, deliveryPackages);
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
        const currentUser = JSON.parse(localStorage.getItem("aidstory_current_user") || "null");
        const savedCompleted: any[] = JSON.parse(savedCompletedJSON);
        savedCompleted.push({
          id: `pledge-${Date.now()}`,
          type: "support_need",
          userEmail: currentUser?.email || "anonymous@aidstory.org",
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

      // Sync updated request and save pledge record to Cloud Firestore
      const nextPledged = Math.min(selectedSupportReq.quantity, (selectedSupportReq.pledgedQuantity || 0) + pledgeQuantityInput);
      const nextStatus = nextPledged >= selectedSupportReq.quantity ? "fulfilled" : selectedSupportReq.status;
      updateRequestInCloud(selectedSupportReq.id, {
        pledgedQuantity: nextPledged,
        status: nextStatus as any
      }).catch((err) => console.warn("Cloud request update failed:", err));

      savePledgeToCloud({
        requestId: selectedSupportReq.id,
        donorName: donorNameInput.trim() || "Anonymous Community Donor",
        donorContact: donorContactInput.trim() || "",
        donorNote: donorNoteInput.trim() || "",
        quantity: pledgeQuantityInput,
        deliveryMethod: "Drop-off / Direct Delivery",
        status: "Pledged",
        createdAt: new Date().toISOString()
      }).catch((err) => console.warn("Cloud save pledge failed:", err));

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
                    
                    {/* Top Card: Items Mostly Requested in Selected Urgency/Campaign criteria */}
                    {(() => {
                      const selectedBanners = PRIORITY_BANNER_LIST.filter((p) =>
                        selectedPriorityBannerIds.includes(p.id)
                      );
                      const filteringBanners = selectedBanners.filter((b) => b.categoryType !== "ORDER_BY");

                      const matchingRequests = allRequests.filter((req) => {
                        if (req.status === "cancelled") return false;
                        if (filteringBanners.length === 0) return true;

                        const priority = getRequestPriority(req);
                        const isCamp = isCampaignRequest(req);

                        const urgencyBanners = filteringBanners.filter((b) => b.categoryType === "URGENCY");
                        const campaignBanners = filteringBanners.filter((b) => b.categoryType === "CAMPAIGN");

                        if (urgencyBanners.length > 0) {
                          const matchesUrgency = urgencyBanners.some((b) => {
                            if (b.criteria === "STANDARD_AID") {
                              return priority === "standard";
                            }
                            if (b.criteria === "IMPORTANT_NEED") {
                              return priority === "important";
                            }
                            if (b.criteria === "EMERGENCY_NEED") {
                              return priority === "emergency";
                            }
                            return true;
                          });
                          if (!matchesUrgency) return false;
                        }

                        if (campaignBanners.length > 0) {
                          const matchesCampaign = campaignBanners.some((b) => {
                            if (b.criteria === "CAMPAIGN") return isCamp;
                            if (b.criteria === "NON_CAMPAIGN") return !isCamp;
                            return true;
                          });
                          if (!matchesCampaign) return false;
                        }

                        return true;
                      });

                      const { topItems: sortedTopItems, scaleMax } = getTopRequestedItems(matchingRequests);

                      // Header Title
                      let headerText = "Items Mostly Requested across All Urgency Levels";
                      if (selectedBanners.length === 1) {
                        headerText = `Items in ${selectedBanners[0].name.replace(/\n/g, " ")}`;
                      } else if (selectedBanners.length === 2) {
                        const s1 = selectedBanners[0].name.split("\n")[0];
                        const s2 = selectedBanners[1].name.split("\n")[0];
                        headerText = `Items in ${s1} & ${s2}`;
                      } else if (selectedBanners.length > 2 && selectedBanners.length < PRIORITY_BANNER_LIST.length) {
                        headerText = `Items in ${selectedBanners.length} Selected Filters`;
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

                        const priority = getRequestPriority(req);
                        const isCamp = isCampaignRequest(req);

                        const urgencyBanners = filteringBanners.filter((b) => b.categoryType === "URGENCY");
                        const campaignBanners = filteringBanners.filter((b) => b.categoryType === "CAMPAIGN");

                        if (urgencyBanners.length > 0) {
                          const matchesUrgency = urgencyBanners.some((b) => {
                            if (b.criteria === "STANDARD_AID") {
                              return priority === "standard";
                            }
                            if (b.criteria === "IMPORTANT_NEED") {
                              return priority === "important";
                            }
                            if (b.criteria === "EMERGENCY_NEED") {
                              return priority === "emergency";
                            }
                            return true;
                          });
                          if (!matchesUrgency) return false;
                        }

                        if (campaignBanners.length > 0) {
                          const matchesCampaign = campaignBanners.some((b) => {
                            if (b.criteria === "CAMPAIGN") return isCamp;
                            if (b.criteria === "NON_CAMPAIGN") return !isCamp;
                            return true;
                          });
                          if (!matchesCampaign) return false;
                        }

                        return true;
                      });

                      const totalCampaign = matchingRequests.filter((r) => isCampaignRequest(r)).length;
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

                  {/* RIGHT COLUMN: Priority, Urgency & Campaign Pill Segmented Filters */}
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
                            showToast("Reset all priority, campaign and order options");
                          }}
                          className="text-[11px] text-yellow-300/90 hover:text-yellow-200 underline cursor-pointer transition-colors"
                        >
                          Reset to Default
                        </button>
                      )}
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1">
                      {/* Filter 1: Order by Fulfillment */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                          <span>Order by Fulfillment</span>
                          <span className="text-white/40 text-[10px]">Choose one</span>
                        </div>

                        {/* Pill Switcher Container */}
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

                      {/* Filter 2: Order by Date Posted */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                          <span>Order by Date Posted</span>
                          <span className="text-white/40 text-[10px]">Choose one</span>
                        </div>

                        <div className="bg-[#bcb6ab] p-1 rounded-full flex items-center shadow-inner border border-[#968e81]/60 w-full transition-all">
                          {/* Latest Posted */}
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

                          {/* Oldest Posted */}
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
                                showToast("Ordered by: Oldest Posted (Oldest first)");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-full text-center transition-all duration-300 font-serif italic text-base sm:text-lg md:text-xl select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("oldest")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Oldest Posted
                          </button>
                        </div>
                      </div>

                      {/* Filter 3: Filter by Urgency Level (Standard Aid, Important Need, Emergency Need) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-rose-300 font-semibold">
                          <span>Filter by Urgency Level</span>
                          <span className="text-white/40 text-[10px]">Toggle filter</span>
                        </div>

                        <div className="bg-[#bcb6ab] p-1 rounded-full flex items-center shadow-inner border border-[#968e81]/60 w-full transition-all gap-1">
                          {/* Standard Aid */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("standard_aid");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "standard_aid")
                                );
                                showToast("Deselected Standard Aid filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "standard_aid",
                                ]);
                                showToast("Filtered by Standard Aid (Non-critical supplies)");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-full text-center transition-all duration-300 font-serif italic text-xs sm:text-sm md:text-base select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("standard_aid")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Standard Aid
                          </button>

                          {/* Important Need */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("important_need");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "important_need")
                                );
                                showToast("Deselected Important Need filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "important_need",
                                ]);
                                showToast("Filtered by Important Need (Required within week)");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-full text-center transition-all duration-300 font-serif italic text-xs sm:text-sm md:text-base select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("important_need")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Important Need
                          </button>

                          {/* Emergency Need */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("emergency_need");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "emergency_need")
                                );
                                showToast("Deselected Emergency Need filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "emergency_need",
                                ]);
                                showToast("Filtered by Emergency Need (Immediate 24-48h)");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-full text-center transition-all duration-300 font-serif italic text-xs sm:text-sm md:text-base select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("emergency_need")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Emergency Need
                          </button>
                        </div>
                      </div>

                      {/* Filter 4: Filter by Campaign Type */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-2 text-[11px] font-mono uppercase tracking-wider text-teal-300 font-semibold">
                          <span>Filter by Campaign Type</span>
                          <span className="text-white/40 text-[10px]">Toggle filter</span>
                        </div>

                        <div className="bg-[#bcb6ab] p-1 rounded-full flex items-center shadow-inner border border-[#968e81]/60 w-full transition-all">
                          {/* Campaign */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("campaign");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "campaign")
                                );
                                showToast("Deselected Campaign filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "campaign",
                                ]);
                                showToast("Filtered by Campaign Requests");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-full text-center transition-all duration-300 font-serif italic text-sm sm:text-base md:text-lg select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("campaign")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Campaign
                          </button>

                          {/* Non-Campaign */}
                          <button
                            type="button"
                            onClick={() => {
                              const isSelected = selectedPriorityBannerIds.includes("non_campaign");
                              if (isSelected) {
                                setSelectedPriorityBannerIds(
                                  selectedPriorityBannerIds.filter((id) => id !== "non_campaign")
                                );
                                showToast("Deselected Non-Campaign filter");
                              } else {
                                setSelectedPriorityBannerIds([
                                  ...selectedPriorityBannerIds,
                                  "non_campaign",
                                ]);
                                showToast("Filtered by Non-Campaign (Independent) Requests");
                              }
                            }}
                            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-full text-center transition-all duration-300 font-serif italic text-sm sm:text-base md:text-lg select-none cursor-pointer ${
                              selectedPriorityBannerIds.includes("non_campaign")
                                ? "bg-[#faf8f4] text-[#241c16] shadow-md font-medium scale-[1.01]"
                                : "text-[#3e342b] hover:text-[#18120e] bg-transparent"
                            }`}
                          >
                            Non-Campaign
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

                      // Filter matching requests strictly based on the selected state(s)
                      const matchingRequests = allRequests.filter((req) => {
                        if (req.status === "cancelled") return false;
                        if (selectedStates.length === 0 || selectedStates.length === MALAYSIA_STATES_BANNER_LIST.length) {
                          return true;
                        }
                        const locLower = (req.location || "").toLowerCase();
                        return effectiveStates.some((st) =>
                          st.cityTags.some((tag) => locLower.includes(tag.toLowerCase()))
                        );
                      });

                      const { topItems: sortedTopItems, scaleMax } = getTopRequestedItems(matchingRequests);

                      // Header Title
                      let headerText = "Items Mostly Requested in Malaysia (All States)";
                      if (selectedStates.length === 1) {
                        headerText = `Items Mostly Requested in ${selectedStates[0].name.replace(/\n/g, " ")}`;
                      } else if (selectedStates.length === 2) {
                        const s1 = selectedStates[0].name.split("\n")[0];
                        const s2 = selectedStates[1].name.split("\n")[0];
                        headerText = `Items Mostly Requested in ${s1} & ${s2}`;
                      } else if (selectedStates.length > 2 && selectedStates.length < MALAYSIA_STATES_BANNER_LIST.length) {
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

                      // Filter requests matching selected states
                      const matchingRequests = allRequests.filter((req) => {
                        if (req.status === "cancelled") return false;
                        if (selectedStates.length === 0 || selectedStates.length === MALAYSIA_STATES_BANNER_LIST.length) {
                          return true;
                        }
                        const locLower = (req.location || "").toLowerCase();
                        return effectiveStates.some((st) =>
                          st.cityTags.some((tag) => locLower.includes(tag.toLowerCase()))
                        );
                      });

                      const totalCampaign = matchingRequests.filter((r) => isCampaignRequest(r)).length;
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

                      // Filter matching requests strictly based on the selected categories
                      const matchingForStats = allRequests.filter((r) => {
                        if (r.status === "cancelled") return false;
                        if (selectedCategories.length === 0 || selectedCategories.length === CATEGORY_BANNER_LIST.length) {
                          return true;
                        }
                        const reqCats = getRequestCategoryBannerIds(r);
                        return effectiveCategories.some((c) => reqCats.includes(c.id));
                      });

                      const { topItems: sortedTopItems, scaleMax } = getTopRequestedItems(matchingForStats);

                      // Header Title
                      let headerText = "Items Mostly Requested across All Categories";
                      if (selectedCategories.length === 1) {
                        headerText = `Items Mostly Requested in ${selectedCategories[0].title.replace(/\n/g, " ")}`;
                      } else if (selectedCategories.length === 2) {
                        const c1 = selectedCategories[0].title.split("\n")[0];
                        const c2 = selectedCategories[1].title.split("\n")[0];
                        headerText = `Items Mostly Requested in ${c1} & ${c2}`;
                      } else if (selectedCategories.length > 2 && selectedCategories.length < CATEGORY_BANNER_LIST.length) {
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
                        if (selectedCategories.length === 0 || selectedCategories.length === CATEGORY_BANNER_LIST.length) {
                          return true;
                        }
                        const reqCats = getRequestCategoryBannerIds(r);
                        return effectiveCategories.some((c) => reqCats.includes(c.id));
                      });

                      const totalCampaign = matchingForStats.filter((r) => isCampaignRequest(r)).length;
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
                      className="w-full max-w-[200px] py-2.5 px-6 rounded-full font-serif italic text-lg sm:text-xl font-medium transition-all duration-300 cursor-pointer shadow-md text-center select-none bg-[#352a21] hover:bg-[#ff5722] hover:text-white text-[#f4efe5] border border-[#5a4638] hover:border-orange-400/40 hover:shadow-orange-950/50 hover:scale-105"
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

                    {/* Urgency & Order Pill Button */}
                    <button
                      type="button"
                      onClick={() => setFilterViewMode("priority")}
                      className="w-full max-w-[200px] py-2.5 px-4 rounded-full font-serif italic text-lg sm:text-xl font-medium transition-all duration-300 cursor-pointer shadow-md text-center select-none whitespace-nowrap bg-[#352a21] hover:bg-[#ff5722] hover:text-white text-[#f4efe5] border border-[#5a4638] hover:border-orange-400/40 hover:shadow-orange-950/50 hover:scale-105"
                    >
                      Urgency & Order
                    </button>
                  </div>

                </div>

                {/* Sub-Filters for Location & Priority */}
                {(filterViewMode as string) === "location" && (
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

                {(filterViewMode as string) === "priority" && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-bold">
                        Filter by Urgency Level:
                      </span>
                      {selectedPriorityFilter !== "ALL" && (
                        <button
                          onClick={() => setSelectedPriorityFilter("ALL")}
                          className="text-[11px] font-mono text-white/70 hover:text-white underline cursor-pointer"
                        >
                          Reset urgency filter
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "ALL", label: "All Urgency Levels" },
                        { id: "STANDARD", label: "📦 Standard Aid" },
                        { id: "IMPORTANT", label: "⚡ Important Need" },
                        { id: "EMERGENCY", label: "🚨 Emergency Need" },
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

      {/* SECTION SUBTITLE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3 mb-6">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-2xl sm:text-3xl font-serif italic text-[#f4efe5] font-semibold tracking-tight">
              {searchQuery.trim() ? `Search: "${searchQuery}"` : "All Requests:"}
            </h2>
            {searchQuery.trim() && (
              <span className="text-xs sm:text-sm text-[#f4efe5]/70 font-sans">
                Matching title, campaign name, labels, and item keywords
              </span>
            )}
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
                      {formatCapitalizedTitle(req.title)}
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
                          {formatRequestPostedDate(req.postedDate, req.postedTimestamp)}
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
                          donateBoxItems.some(
                            (item) => item.requestId === req.id
                          )
                            ? "text-yellow-300 bg-white/20 ring-1 ring-yellow-300/60 shadow"
                            : "text-white/80 hover:text-white hover:bg-white/15"
                        }`}
                        title={
                          donateBoxItems.some(
                            (item) => item.requestId === req.id
                          )
                            ? "Remove from Donate Box"
                            : "Add to Donate Box"
                        }
                      >
                        <Package className="w-5 h-5" />
                        {donateBoxItems.some(
                          (item) => item.requestId === req.id
                        ) && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow">
                            ✓
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Right CTA: SUPPORT NOW Button (Vibrant gradient/cyan) */}
                    <button
                      type="button"
                      onClick={(e) => handleSupportNowAndNavigate(req, e)}
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
                    {formatCapitalizedTitle(selectedSupportReq.title)}
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
                            {formatCapitalizedTitle(item.title)}
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
                <span className="font-serif italic font-bold text-sm text-white">{formatCapitalizedTitle(lightboxImage.title)}</span>
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
        onRemoveFromDonateBox={(req) => handleRemoveRequestFromDonateBox(req)}
        onSupportNow={(req) => handleSupportNowAndNavigate(req)}
        isInDonateBox={Boolean(
          selectedDetailRequest &&
          donateBoxItems.some(
            (item) => item.requestId === selectedDetailRequest.id
          )
        )}
        onShare={(req) => handleShareRequest(req)}
        onOpenDonateBoxPage={() => handleNavigateToDonateBoxPage()}
      />

    </div>
  );
}
