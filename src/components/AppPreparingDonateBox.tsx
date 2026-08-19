import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Search,
  Bell,
  User,
  Truck,
  Info,
  Minus,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Store,
  Award,
  Package,
  Gift,
  HeartHandshake,
  Calendar,
  Clock,
  MapPin,
  CalendarCheck,
  Building2,
  Sparkles,
  Phone,
  ExternalLink
} from "lucide-react";
import { RequestDetailModal } from "./RequestDetailModal";
import { DEFAULT_NEEDS_REQUESTS } from "./AppNeeds";
import { RecipientRequest } from "../types";

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
  organizerName?: string;
  brand?: string;
  color?: string;
  urgencyLevel?: "high" | "medium" | "low";
  donorNote?: string;
  checked?: boolean;
}

interface AppPreparingDonateBoxProps {
  navigateToView: (view: "home" | "comments" | "explore" | "main_menu" | "your_request" | "needs" | "preparing_donate_box") => void;
}

const INITIAL_STARTER_ITEMS: DonateBoxCartItem[] = [
  {
    id: "cart_item_1",
    requestId: "need_saka_1",
    title: "Wear Saka Long Pants & Warm Clothing",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80",
    location: "Ipoh Relief Center, Perak",
    unit: "pairs",
    quantity: 1,
    maxNeeded: 5,
    organizerName: "Perak Community Relief Center (NGO)",
    brand: "Wear Saka",
    color: "Khaki / Cream",
    urgencyLevel: "high",
    donorNote: "",
    checked: true
  },
  {
    id: "cart_item_2",
    requestId: "need_casio_1",
    title: "Casio Original F94WA 8D Emergency Watch",
    category: "Household",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
    location: "Sibu Volunteer Outpost, Sabah",
    unit: "units",
    quantity: 1,
    maxNeeded: 4,
    organizerName: "Sibu Hope Volunteer Society (Charity)",
    brand: "Casio",
    color: "Black",
    urgencyLevel: "medium",
    donorNote: "",
    checked: true
  }
];

// Helper to format ISO Date (YYYY-MM-DD)
const getFutureDateStr = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
};

// Helper to format readable display date
const formatReadableDate = (dateStr: string, daysToAdd = 0): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Selected date";
    if (daysToAdd !== 0) {
      d.setDate(d.getDate() + daysToAdd);
    }
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
};

const VERIFIED_DROPOFF_HUBS = [
  {
    id: "hub_ipoh",
    name: "Ipoh Central Relief Hub (Perak)",
    address: "Lot 44, Jalan Raja Musa Aziz, 30000 Ipoh, Perak",
    hours: "09:00 - 18:00 (Mon - Sat)",
    contact: "+60 5-241 8899"
  },
  {
    id: "hub_sibu",
    name: "Sibu Volunteer Relief Outpost (Sabah/Sarawak)",
    address: "No. 18, Jalan Wong Nai Siong, 96000 Sibu, Sarawak",
    hours: "08:30 - 17:30 (Daily)",
    contact: "+60 84-332 100"
  },
  {
    id: "hub_hope",
    name: "Downtown Hope Distribution Depot",
    address: "Building B, Community Center, 50450 Kuala Lumpur",
    hours: "09:00 - 20:00 (Daily)",
    contact: "+60 3-7988 2300"
  },
  {
    id: "hub_eastside",
    name: "Eastside Community Aid Locker",
    address: "Jalan Ampang Hilir, 55000 Ampang, Selangor",
    hours: "10:00 - 19:00 (Mon - Fri)",
    contact: "+60 3-4251 6700"
  }
];

// Helper to resolve the authentic requesting NGO/Charity organization name
export const getExactOrganizerForRequest = (requestId?: string, title?: string, existingOrg?: string): string => {
  const genericDefaults = [
    "Hope Community Aid (NGO)",
    "AidStory Verified Hub",
    "Wear Saka Store",
    "Casio Official Store",
    "WeAreCharity1",
    "Community Care Foundation (NGO)"
  ];

  // 1. Check DEFAULT_NEEDS_REQUESTS first
  const found = DEFAULT_NEEDS_REQUESTS.find(
    (r) =>
      (requestId && r.id === requestId) ||
      (title && r.title.toLowerCase().trim() === title.toLowerCase().trim())
  );
  if (found && found.organizerName) {
    return found.organizerName;
  }

  // 2. Check localStorage saved requests
  try {
    const saved = localStorage.getItem("aidstory_recipient_requests");
    if (saved) {
      const parsed: RecipientRequest[] = JSON.parse(saved);
      const matched = parsed.find(
        (r) =>
          (requestId && r.id === requestId) ||
          (title && r.title.toLowerCase().trim() === title.toLowerCase().trim())
      );
      if (matched && matched.organizerName) {
        return matched.organizerName;
      }
    }
  } catch (e) {}

  // 3. Keyword matching to guarantee proper organization attribution
  const lowerTitle = (title || "").toLowerCase();
  if (lowerTitle.includes("dog") || lowerTitle.includes("animal")) {
    return "Sibu Animal Hope Shelter (NGO)";
  }
  if (lowerTitle.includes("pamper") || lowerTitle.includes("diaper") || lowerTitle.includes("baby")) {
    return "Bangsar Infant Care Relief (Charity)";
  }
  if (lowerTitle.includes("storybook") || lowerTitle.includes("book")) {
    return "Sibu Community Kindergarten (NGO)";
  }
  if (lowerTitle.includes("lego") || lowerTitle.includes("toy")) {
    return "Kids Hope Workshop Foundation (NGO)";
  }
  if (lowerTitle.includes("canned") || lowerTitle.includes("food") || lowerTitle.includes("provision")) {
    return "Sibu Relief Food Bank (NGO)";
  }
  if (lowerTitle.includes("rice")) {
    return "Selangor Food Aid Network (NGO)";
  }
  if (lowerTitle.includes("blanket") || lowerTitle.includes("towel") && !lowerTitle.includes("bath")) {
    return "WeAreCharity1 (NGO)";
  }
  if (lowerTitle.includes("jacket") || lowerTitle.includes("sweater")) {
    return "Shah Alam Disaster Relief (Charity)";
  }
  if (lowerTitle.includes("towel") || lowerTitle.includes("cloth")) {
    return "Petaling Community Care (NGO)";
  }
  if (lowerTitle.includes("shoe") || lowerTitle.includes("sneaker")) {
    return "Klang Valley Relief Mission (Charity)";
  }
  if (lowerTitle.includes("sock") || lowerTitle.includes("undershirt")) {
    return "Subang Elderly Care Society (NGO)";
  }
  if (lowerTitle.includes("mattress") || lowerTitle.includes("bed")) {
    return "Shah Alam Emergency Shelter (Charity)";
  }
  if (lowerTitle.includes("kettle") || lowerTitle.includes("stove")) {
    return "Klang Community Kitchen (NGO)";
  }
  if (lowerTitle.includes("linen") || lowerTitle.includes("pillow")) {
    return "Petaling Shelter Initiative (NGO)";
  }
  if (lowerTitle.includes("wheelchair")) {
    return "Penang Elderly Care Foundation (NGO)";
  }
  if (lowerTitle.includes("water") || lowerTitle.includes("bottle")) {
    return "Johor Flood Relief Network (Charity)";
  }
  if (lowerTitle.includes("school") || lowerTitle.includes("stationery")) {
    return "Perak Children Education Aid (NGO)";
  }
  if (lowerTitle.includes("filtration") || lowerTitle.includes("boot")) {
    return "Sarawak Rural Safe Water Mission (NGO)";
  }
  if (lowerTitle.includes("saka") || lowerTitle.includes("pants")) {
    return "Perak Community Relief Center (NGO)";
  }
  if (lowerTitle.includes("casio") || lowerTitle.includes("watch")) {
    return "Sibu Hope Volunteer Society (Charity)";
  }

  if (existingOrg && !genericDefaults.includes(existingOrg)) {
    return existingOrg;
  }

  return "Sibu Animal Hope Shelter (NGO)";
};

// Helper to ensure high-resolution, working thumbnail images
export const getValidItemImageUrl = (url?: string, title?: string): string => {
  const t = (title || "").toLowerCase();
  if (t.includes("pamper") || t.includes("baby") || t.includes("diaper")) {
    return "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80";
  }
  if (t.includes("dog") || t.includes("animal")) {
    return "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80";
  }
  if (t.includes("lego") || t.includes("toy")) {
    return "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80";
  }
  if (t.includes("storybook") || t.includes("book")) {
    return "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80";
  }
  if (!url || url.includes("photo-1594824813689") || url.trim() === "") {
    return "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?auto=format&fit=crop&w=400&q=80";
  }
  return url;
};

export default function AppPreparingDonateBox({ navigateToView }: AppPreparingDonateBoxProps) {
  const [currentUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aidstory_current_user");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return { name: "Nadine", email: "nadine@aidstory.org" };
  });

  const [cartItems, setCartItems] = useState<DonateBoxCartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aidstory_donate_box_cart");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item: any) => {
              const exactOrg = getExactOrganizerForRequest(item.requestId, item.title, item.organizerName);
              const validImg = getValidItemImageUrl(item.imageUrl, item.title);

              return {
                ...item,
                checked: item.checked !== undefined ? item.checked : true,
                organizerName: exactOrg,
                imageUrl: validImg,
                unit: item.unit || "units",
                quantity: item.quantity || 1,
                maxNeeded: item.maxNeeded || 10
              };
            });
          }
        }
      } catch (e) {}
    }
    return INITIAL_STARTER_ITEMS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchCategory, setSelectedSearchCategory] = useState("All Categories");

  const [editingNoteItem, setEditingNoteItem] = useState<DonateBoxCartItem | null>(null);
  const [noteInputText, setNoteInputText] = useState("");

  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [comboTargetStore, setComboTargetStore] = useState("");

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "dropoff" | "volunteer">("courier");

  // FORM STATES FOR FULFILLMENT & SCHEDULING
  const [pickupDate, setPickupDate] = useState<string>(() => getFutureDateStr(1));
  const [pickupTimeSlot, setPickupTimeSlot] = useState<string>("09:00 - 12:00 (Morning Slot)");
  const [pickupAddress, setPickupAddress] = useState<string>("12, Jalan Sultan Iskandar, 30000 Ipoh, Perak");
  const [pickupPhone, setPickupPhone] = useState<string>("+60 12-3456789");

  const [dropoffDate, setDropoffDate] = useState<string>(() => getFutureDateStr(1));
  const [dropoffTimeSlot, setDropoffTimeSlot] = useState<string>("10:00 - 14:00 (Morning / Midday)");
  const [dropoffHubId, setDropoffHubId] = useState<string>("hub_ipoh");

  const [volunteerDate, setVolunteerDate] = useState<string>(() => getFutureDateStr(1));
  const [volunteerTimeSlot, setVolunteerTimeSlot] = useState<string>("14:00 - 17:00 (Afternoon Slot)");
  const [scheduleNotes, setScheduleNotes] = useState<string>("");

  // Modal for Viewing Item Details
  const [selectedDetailRequest, setSelectedDetailRequest] = useState<RecipientRequest | null>(null);

  const selectedDropoffHub =
    VERIFIED_DROPOFF_HUBS.find((h) => h.id === dropoffHubId) || VERIFIED_DROPOFF_HUBS[0];

  const handleOpenItemDetail = (item: DonateBoxCartItem) => {
    let allRequests: RecipientRequest[] = [];
    try {
      const saved = localStorage.getItem("aidstory_recipient_requests");
      if (saved) {
        allRequests = JSON.parse(saved);
      }
    } catch (e) {}

    if (!allRequests || allRequests.length === 0) {
      allRequests = DEFAULT_NEEDS_REQUESTS;
    }

    // Match by request ID or title
    let found = allRequests.find(
      (r) =>
        r.id === item.requestId ||
        r.title.toLowerCase().trim() === item.title.toLowerCase().trim()
    );

    if (!found) {
      found = DEFAULT_NEEDS_REQUESTS.find(
        (r) =>
          r.id === item.requestId ||
          r.title.toLowerCase().trim() === item.title.toLowerCase().trim()
      );
    }

    if (!found) {
      found = {
        id: item.requestId || item.id,
        title: item.title,
        category: (item.category as any) || "Household",
        categories: [item.category || "Relief"],
        description: `Essential ${item.title} urgently required for distribution to local shelters and community families in ${item.location}.`,
        imageUrl: item.imageUrl,
        images: [item.imageUrl],
        location: item.location,
        quantity: item.maxNeeded || 10,
        unit: item.unit || "units",
        pledgedQuantity: item.quantity || 1,
        postedDate: "2 DAYS AGO",
        postedTimestamp: Date.now() - 172800000,
        status: "active",
        urgencyLevel: (item.urgencyLevel as any) || "high",
        brand: item.brand || "Standard",
        color: item.color || "Any",
        organizerName: item.organizerName || "Hope Community Aid (NGO)",
        updates: [
          {
            id: "up_donate_1",
            date: "3/5/2026",
            text: "Currently receiving pledges for these essential relief supplies. Thank you for your support!",
            author: item.organizerName || "Relief Coordinator"
          }
        ],
        comments: [
          {
            id: "comm_donate_1",
            userName: "IamDonor1",
            avatarUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=150&q=80",
            comment: "Hope to hear good news. Prepared a care box for this campaign!",
            date: "2h ago"
          }
        ]
      };
    }

    setSelectedDetailRequest(found);
  };

  const saveCart = (items: DonateBoxCartItem[]) => {
    const normalized = items.map((i) => ({
      ...i,
      organizerName: getExactOrganizerForRequest(i.requestId, i.title, i.organizerName),
      imageUrl: getValidItemImageUrl(i.imageUrl, i.title)
    }));
    setCartItems(normalized);
    try {
      localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(normalized));
    } catch (e) {}
  };

  useEffect(() => {
    // Initial sync to ensure any existing legacy stored items get immediately upgraded
    try {
      const saved = localStorage.getItem("aidstory_donate_box_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const upgraded = parsed.map((item: any) => ({
            ...item,
            checked: item.checked !== undefined ? item.checked : true,
            organizerName: getExactOrganizerForRequest(item.requestId, item.title, item.organizerName),
            imageUrl: getValidItemImageUrl(item.imageUrl, item.title),
            unit: item.unit || "units",
            quantity: item.quantity || 1,
            maxNeeded: item.maxNeeded || 10
          }));
          setCartItems(upgraded);
          localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(upgraded));
        }
      }
    } catch (e) {}

    const handleStorage = () => {
      try {
        const saved = localStorage.getItem("aidstory_donate_box_cart");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const upgraded = parsed.map((item: any) => ({
              ...item,
              checked: item.checked !== undefined ? item.checked : true,
              organizerName: getExactOrganizerForRequest(item.requestId, item.title, item.organizerName),
              imageUrl: getValidItemImageUrl(item.imageUrl, item.title),
              unit: item.unit || "units",
              quantity: item.quantity || 1,
              maxNeeded: item.maxNeeded || 10
            }));
            setCartItems(upgraded);
          }
        }
      } catch (e) {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filteredCartItems = cartItems.filter((item) => {
    const matchesCategory =
      selectedSearchCategory === "All Categories" ||
      item.category.toLowerCase().includes(selectedSearchCategory.toLowerCase());

    if (!searchQuery.trim()) return matchesCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      item.title.toLowerCase().includes(q) ||
      (item.organizerName && item.organizerName.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q) ||
      (item.location && item.location.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  const groupedStores = filteredCartItems.reduce((acc, item) => {
    const store = getExactOrganizerForRequest(item.requestId, item.title, item.organizerName);
    if (!acc[store]) {
      acc[store] = [];
    }
    acc[store].push(item);
    return acc;
  }, {} as Record<string, DonateBoxCartItem[]>);

  const allChecked = cartItems.length > 0 && cartItems.every((item) => item.checked);
  const checkedItems = cartItems.filter((item) => item.checked);

  const handleToggleSelectAll = () => {
    const nextState = !allChecked;
    const updated = cartItems.map((item) => ({ ...item, checked: nextState }));
    saveCart(updated);
  };

  const handleToggleStoreSelect = (storeName: string) => {
    const storeItems = groupedStores[storeName] || [];
    const areAllStoreItemsChecked = storeItems.every((item) => item.checked);
    const nextState = !areAllStoreItemsChecked;

    const updated = cartItems.map((item) => {
      const itemOrg = getExactOrganizerForRequest(item.requestId, item.title, item.organizerName);
      if (itemOrg === storeName) {
        return { ...item, checked: nextState };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleToggleItemCheck = (itemId: string) => {
    const updated = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === itemId) {
        const clamped = Math.max(1, Math.min(item.maxNeeded || 99, newQty));
        return { ...item, quantity: clamped };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveItem = (itemId: string) => {
    const updated = cartItems.filter((item) => item.id !== itemId);
    saveCart(updated);
  };

  const handleOpenNoteModal = (item: DonateBoxCartItem) => {
    setEditingNoteItem(item);
    setNoteInputText(item.donorNote || "");
  };

  const handleSaveNote = () => {
    if (!editingNoteItem) return;
    const updated = cartItems.map((item) => {
      if (item.id === editingNoteItem.id) {
        return { ...item, donorNote: noteInputText.trim() };
      }
      return item;
    });
    saveCart(updated);
    setEditingNoteItem(null);
  };

  const totalUnits = checkedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCategories = new Set(checkedItems.map((item) => item.category)).size;
  const totalLocations = new Set(checkedItems.map((item) => item.location)).size;

  const handlePerformCheckout = () => {
    if (checkedItems.length === 0) return;
    setIsCheckingOut(true);

    setTimeout(() => {
      try {
        const savedRequestsJSON = localStorage.getItem("aidstory_recipient_requests");
        if (savedRequestsJSON) {
          const requests = JSON.parse(savedRequestsJSON);
          const updated = requests.map((r: any) => {
            const matchedCartItem = checkedItems.find((ci) => ci.requestId === r.id);
            if (matchedCartItem) {
              const nextPledged = Math.min(r.quantity, (r.pledgedQuantity || 0) + matchedCartItem.quantity);
              const nextStatus = nextPledged >= r.quantity ? "fulfilled" : r.status;
              return { ...r, pledgedQuantity: nextPledged, status: nextStatus };
            }
            return r;
          });
          localStorage.setItem("aidstory_recipient_requests", JSON.stringify(updated));
        }
      } catch (err) {}

      try {
        const savedPledgesJSON = localStorage.getItem("aidstory_user_pledged_items") || "[]";
        const savedPledges: string[] = JSON.parse(savedPledgesJSON);
        checkedItems.forEach((item) => {
          if (!savedPledges.includes(item.title)) {
            savedPledges.push(item.title);
          }
        });
        localStorage.setItem("aidstory_user_pledged_items", JSON.stringify(savedPledges));
      } catch (err) {}

      try {
        const savedCompletedJSON = localStorage.getItem("aidstory_completed_donations") || "[]";
        const savedCompleted: any[] = JSON.parse(savedCompletedJSON);
        checkedItems.forEach((item) => {
          savedCompleted.push({
            id: `donate-box-${Date.now()}-${item.id}`,
            type: "donate_box_cart",
            title: item.title,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            date: new Date().toISOString(),
            status: "completed",
            deliveryMethod,
            scheduleDetails: {
              method: deliveryMethod,
              date: deliveryMethod === "courier" ? pickupDate : deliveryMethod === "dropoff" ? dropoffDate : volunteerDate,
              timeSlot: deliveryMethod === "courier" ? pickupTimeSlot : deliveryMethod === "dropoff" ? dropoffTimeSlot : volunteerTimeSlot,
              hub: deliveryMethod === "dropoff" ? selectedDropoffHub.name : "Perak Regional Hub",
              estimatedDelivery:
                deliveryMethod === "dropoff"
                  ? formatReadableDate(dropoffDate, 0)
                  : formatReadableDate(pickupDate, 2)
            }
          });
        });
        localStorage.setItem("aidstory_completed_donations", JSON.stringify(savedCompleted));
      } catch (err) {}

      const remainingUnchecked = cartItems.filter((item) => !item.checked);
      saveCart(remainingUnchecked);

      setIsCheckingOut(false);
      setIsCheckoutSuccess(true);
    }, 700);
  };

  const handleAddComboItem = (storeName: string) => {
    const comboItem: DonateBoxCartItem = {
      id: `combo_${Date.now()}`,
      requestId: `combo_req_${Date.now()}`,
      title: `Matching Relief Kit Item for ${storeName}`,
      category: "Household",
      imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80",
      location: "Perak Distribution Hub",
      unit: "packs",
      quantity: 1,
      maxNeeded: 5,
      organizerName: storeName,
      brand: "Relief Essentials",
      color: "Standard",
      urgencyLevel: "medium",
      donorNote: "",
      checked: true
    };
    saveCart([...cartItems, comboItem]);
    setIsComboModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#201812] text-[#f5efe6] font-sans antialiased pb-24 selection:bg-[#785d47] selection:text-white">
      
      {/* 1. TOP BRAND NAV BAR (ELEGANT WARM ESPRESSO BROWN) */}
      <header className="bg-[#18120d] text-[#f5efe6] border-b border-[#36271e] sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Page Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateToView("needs")}
              className="flex items-center gap-2 text-[#e8dcc8] hover:text-white transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#3e2e23] border border-[#5c4637] text-[#f5efe6] flex items-center justify-center shadow-md group-hover:bg-[#4f3c2f] transition-all">
                <ShoppingBag className="w-5 h-5 text-[#d4b292]" />
              </div>
              <span className="font-serif italic font-extrabold text-xl sm:text-2xl text-[#f5efe6] tracking-tight">
                AidStory
              </span>
            </button>
            <div className="h-6 w-px bg-[#3e2e23] hidden sm:block" />
            <span className="text-sm sm:text-base font-serif italic text-[#c8b7a6] hidden sm:inline font-medium">
              Preparing your donate box
            </span>
          </div>

          {/* Search Box with category selector */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative flex items-center border border-[#443328] bg-[#120d09] rounded-xl overflow-hidden shadow-inner focus-within:border-[#a8896c] transition-colors">
              <select
                value={selectedSearchCategory}
                onChange={(e) => setSelectedSearchCategory(e.target.value)}
                className="bg-[#1c140f] border-r border-[#36271e] text-xs px-3 py-2 text-[#c8b7a6] focus:outline-none hidden md:block cursor-pointer font-medium"
              >
                <option value="All Categories">All Categories</option>
                <option value="Clothing">Clothing & Textiles</option>
                <option value="Food">Food & Groceries</option>
                <option value="Household">Household & Daily Use</option>
                <option value="Medical">Medical Essentials</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items in your Donate Box..."
                className="w-full text-xs px-3.5 py-2 text-[#f5efe6] placeholder:text-[#786455] bg-transparent focus:outline-none"
              />

              <button
                type="button"
                className="bg-[#3e2e23] hover:bg-[#4f3c2f] text-[#d4b292] hover:text-white px-4 py-2 transition-colors cursor-pointer flex items-center justify-center shrink-0 border-l border-[#36271e]"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Action Icons (Notification, Donate Box, Avatar, Back) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Notification Bell */}
            <div className="relative cursor-pointer p-1 text-[#c8b7a6] hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8c6b4f] text-white text-[9px] font-bold flex items-center justify-center font-mono shadow">
                {checkedItems.length}
              </span>
            </div>

            {/* Donate Box Icon with badge */}
            <div className="relative cursor-pointer p-1 text-[#c8b7a6] hover:text-white transition-colors" title="Donate Box Items">
              <Package className="w-5 h-5 text-[#d4b292]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4b292] text-[#1a120b] text-[9px] font-extrabold flex items-center justify-center font-mono shadow">
                {checkedItems.length}
              </span>
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#3e2e23] text-[#d4b292] font-serif font-bold flex items-center justify-center text-xs overflow-hidden border border-[#5c4637] shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-serif italic text-[#e8dcc8] hidden lg:inline">
                {currentUser?.name || "Nadine"}
              </span>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigateToView("needs")}
              className="px-3 py-1.5 rounded-xl text-[#c8b7a6] hover:text-white bg-[#281e17] hover:bg-[#382b21] transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-medium border border-[#3e2e23]"
              title="Return to Browse Needs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN BODY CONTENT */}
      <main className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
        
        {/* CHECKOUT SUCCESS BANNER */}
        {isCheckoutSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-[#2b211a] border border-[#5c4637] rounded-2xl p-5 text-[#f5efe6] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#4a3a2d] border border-[#6b5443] text-[#d4b292] flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#f5efe6]">
                  Donation Package Dispatched Successfully!
                </h4>
                <p className="text-xs text-[#c8b7a6] mt-0.5">
                  Scheduled for {deliveryMethod === "courier" ? `Courier Pick-up on ${formatReadableDate(pickupDate)}` : deliveryMethod === "dropoff" ? `Direct Drop-off at ${selectedDropoffHub.name} on ${formatReadableDate(dropoffDate)}` : `Volunteer Pick-up on ${formatReadableDate(volunteerDate)}`}. Tracking ID: <span className="font-mono font-bold text-[#d4b292]">AID-MY-{Date.now().toString().slice(-6)}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigateToView("needs")}
                className="px-4 py-2 bg-[#5c4637] hover:bg-[#705644] text-[#f5efe6] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Browse More Needs
              </button>
              <button
                type="button"
                onClick={() => setIsCheckoutSuccess(false)}
                className="px-3.5 py-2 bg-[#1c140f] text-[#c8b7a6] hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#3e2e23]"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ==================================================== */}
          {/* LEFT COLUMN: Main Cart Items List (7-8 Cols) */}
          {/* ==================================================== */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Title & Free Logistics Banner */}
            <div className="space-y-3">
              
              {/* Mobile Title */}
              <div className="flex items-center justify-between sm:hidden">
                <h1 className="text-xl font-serif font-bold text-[#f5efe6]">Preparing your donate box</h1>
                <span className="text-xs text-[#c8b7a6]">{cartItems.length} items</span>
              </div>

              {/* Free Volunteer Courier & Logistics Banner (Warm Espresso Velvet Tone) */}
              <div className="bg-[#2b211a] border border-[#443328] text-[#e8dcc8] px-4 py-3 rounded-2xl flex items-center justify-between text-xs shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#4a392e] text-[#d4b292] flex items-center justify-center shrink-0 shadow-xs border border-[#5e493b]">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-[#f5efe6]">
                    Free volunteer courier pick-up & direct relief shelter dispatch included
                  </span>
                </div>
                <Info className="w-4 h-4 text-[#a8896c] shrink-0 cursor-pointer hover:opacity-80" />
              </div>

              {/* Select All Checkbox Bar */}
              <div className="bg-[#291f18] p-4 rounded-2xl border border-[#3e2e23] shadow-md flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 text-[#a8896c] accent-[#a8896c] rounded cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-[#f5efe6]">
                    Select All Items ({cartItems.length})
                  </span>
                </label>

                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => saveCart([])}
                    className="text-xs text-[#a8896c] hover:text-[#d4b292] transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Clear Box</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cart Items Grouped by Store / Relief Hub */}
            {Object.keys(groupedStores).length > 0 ? (
              (Object.entries(groupedStores) as [string, DonateBoxCartItem[]][]).map(([storeName, items]) => {
                const isStoreAllChecked = items.every((i) => i.checked);

                return (
                  <div
                    key={storeName}
                    className="bg-[#291f18] rounded-2xl border border-[#3e2e23] shadow-lg overflow-hidden"
                  >
                    {/* Requesting NGO / Charity Header Row */}
                    <div className="p-3.5 sm:p-4 bg-[#231a13] border-b border-[#36271e] flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isStoreAllChecked}
                          onChange={() => handleToggleStoreSelect(storeName)}
                          className="w-4 h-4 text-[#a8896c] accent-[#a8896c] rounded cursor-pointer"
                        />
                        <div className="flex items-center gap-2 font-serif font-bold text-xs sm:text-sm text-[#f5efe6]">
                          <HeartHandshake className="w-4 h-4 text-[#d4b292]" />
                          <span>{storeName}</span>
                          {/* Verified NGO Badge */}
                          <span
                            className="w-4 h-4 rounded-full bg-[#4a392e] text-[#d4b292] border border-[#6b5443] flex items-center justify-center text-[9px] shadow-xs"
                            title="Verified NGO / Charity"
                          >
                            <Award className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </label>

                      <span className="text-[11px] text-[#a8896c] font-medium hidden sm:inline">
                        Verified Requesting NGO / Charity
                      </span>
                    </div>

                    {/* Combo Add-on Bar */}
                    <div className="bg-[#1f1711] px-4 py-2.5 border-b border-[#36271e] flex items-center justify-between text-xs text-[#d4b292]">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="bg-[#443327] text-[#e8dcc8] text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide font-mono border border-[#594334]">
                          BUNDLE
                        </span>
                        <span className="text-[#c8b7a6]">Add matching relief essentials to this care package</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setComboTargetStore(storeName);
                          setIsComboModalOpen(true);
                        }}
                        className="font-bold text-[#d4b292] hover:text-white hover:underline cursor-pointer flex items-center gap-0.5 transition-colors"
                      >
                        + Add Item
                      </button>
                    </div>

                    {/* Product Rows */}
                    <div className="divide-y divide-[#36271e]">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#201812]/50 transition-colors"
                        >
                          {/* Checkbox, Thumbnail & Title */}
                          <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={Boolean(item.checked)}
                              onChange={() => handleToggleItemCheck(item.id)}
                              className="w-4 h-4 text-[#a8896c] accent-[#a8896c] rounded cursor-pointer mt-1 sm:mt-0"
                            />

                            {/* Product Thumbnail (Clickable) */}
                            <div
                              onClick={() => handleOpenItemDetail(item)}
                              className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#18120d] border border-[#443328] shrink-0 shadow-md cursor-pointer hover:border-[#d4b292] hover:scale-102 transition-all relative group/thumb"
                              title="Click to view details of item requested"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover/thumb:brightness-110 transition-all"
                              />
                            </div>

                            {/* Title, Category & Location */}
                            <div className="space-y-1 min-w-0">
                              <button
                                type="button"
                                onClick={() => handleOpenItemDetail(item)}
                                className="text-left text-xs sm:text-sm font-serif font-bold text-[#f5efe6] hover:text-[#d4b292] line-clamp-2 leading-snug cursor-pointer transition-colors group flex items-center gap-1.5"
                                title="Click to view details of item requested"
                              >
                                <span>{item.title}</span>
                                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-[#d4b292] shrink-0 transition-opacity" />
                              </button>

                              {/* Badges */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-[#382a20] text-[#d4b292] border border-[#523e30] text-[10px] font-bold px-2 py-0.5 rounded-md font-sans">
                                  {item.category}
                                </span>
                                {item.brand && (
                                  <span className="text-[11px] text-[#c8b7a6] font-medium">
                                    Brand: {item.brand}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="text-[11px] text-[#8e7b6d]">
                                    • {item.color}
                                  </span>
                                )}
                              </div>

                              {/* Location / Destination */}
                              <div className="text-xs text-[#c8b7a6]">
                                Destination: <span className="text-[#f5efe6] font-semibold">{item.location}</span>
                              </div>

                              {/* Donor Note preview */}
                              {item.donorNote && (
                                <p className="text-[11px] text-[#e8dcc8] bg-[#33261c] px-2.5 py-1 rounded-md border border-[#4a392c] line-clamp-1 italic">
                                  "{item.donorNote}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Stepper, Edit Note & Trash Actions */}
                          <div className="flex items-center justify-between sm:justify-end gap-3.5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#36271e]">
                            
                            {/* Quantity Stepper: [ - ] [ 1 ] [ + ] */}
                            <div className="flex items-center border border-[#4a392e] rounded-xl overflow-hidden bg-[#18120d] shadow-sm">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="px-2.5 py-1.5 text-[#d4b292] hover:bg-[#2b2018] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 py-1.5 text-xs font-bold text-[#f5efe6] font-mono min-w-[34px] text-center bg-[#231a13]">
                                {item.quantity} {item.unit}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.maxNeeded}
                                className="px-2.5 py-1.5 text-[#d4b292] hover:bg-[#2b2018] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Edit Note & Delete */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenNoteModal(item)}
                                className="p-2 text-[#c8b7a6] hover:text-[#d4b292] hover:bg-[#36271e] rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#4a392e]"
                                title="Add/Edit Dedication Note"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 text-[#c8b7a6] hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
                                title="Remove from Donate Box"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty Box State */
              <div className="bg-[#291f18] p-12 rounded-2xl border border-[#3e2e23] text-center space-y-4 shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-[#382a20] text-[#d4b292] flex items-center justify-center mx-auto border border-[#523e30] shadow-md">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif font-bold text-[#f5efe6]">Your Donate Box is Empty</h3>
                  <p className="text-xs text-[#c8b7a6] max-w-sm mx-auto leading-relaxed">
                    Collect urgent relief requests from Malaysian community shelters to prepare your care package.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateToView("needs")}
                  className="px-6 py-2.5 bg-[#4a3a2d] hover:bg-[#5e4a3b] text-[#f5efe6] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md inline-flex items-center gap-2 border border-[#6b5443]"
                >
                  <Package className="w-4 h-4 text-[#d4b292]" />
                  Explore Community Needs
                </button>
              </div>
            )}

          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: Summary & Fulfillment Scheduling Form (5 Cols) */}
          {/* ==================================================== */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            
            {/* MAIN CARD: Aid Package Summary & Fulfillment Form */}
            <div className="bg-[#291f18] p-5 sm:p-6 rounded-2xl border border-[#3e2e23] shadow-xl space-y-5">
              
              {/* Header Title */}
              <div className="text-sm font-serif font-bold text-[#f5efe6] flex items-center justify-between border-b border-[#36271e] pb-3.5">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#d4b292]" />
                  <span>Donation Package Summary</span>
                </div>
                <span className="text-[10px] font-mono bg-[#3a2c22] text-[#d4b292] px-2 py-0.5 rounded border border-[#523e30]">
                  {checkedItems.length} Pledged
                </span>
              </div>

              {/* Summary Stats Matrix */}
              <div className="space-y-2 text-xs">
                {/* Selected Products */}
                <div className="flex items-center justify-between text-[#c8b7a6]">
                  <span>Selected Items</span>
                  <span className="font-bold text-[#f5efe6]">{checkedItems.length} Products</span>
                </div>

                {/* Total Units */}
                <div className="flex items-center justify-between text-[#c8b7a6]">
                  <span>Total Quantity</span>
                  <span className="font-bold text-[#f5efe6]">{totalUnits} Units</span>
                </div>

                {/* Categories */}
                <div className="flex items-center justify-between text-[#c8b7a6]">
                  <span>Categories Covered</span>
                  <span className="font-bold text-[#f5efe6]">{totalCategories} Types</span>
                </div>

                {/* Distribution Hubs */}
                <div className="flex items-center justify-between text-[#c8b7a6]">
                  <span>Shelter Locations</span>
                  <span className="font-bold text-[#f5efe6]">{totalLocations} Centers</span>
                </div>

                <div className="border-t border-[#36271e] pt-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f5efe6]">Logistics Fee</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#d4b292] font-mono uppercase tracking-wider">
                      FREE (Subsidized)
                    </span>
                    <div className="text-[10px] text-[#a8896c]">
                      100% Volunteer Dispatch
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* FULFILLMENT METHOD SELECTOR */}
              {/* ---------------------------------------------------- */}
              <div className="space-y-2.5 pt-2 border-t border-[#36271e]">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold text-[#a8896c] uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3 h-3 text-[#d4b292]" />
                    <span>Fulfillment Method</span>
                  </label>
                  <span className="text-[10px] text-[#c8b7a6]">Select preferred handover</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("courier")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      deliveryMethod === "courier"
                        ? "border-[#d4b292] bg-[#3e2e23] text-[#f5efe6] shadow-sm ring-1 ring-[#d4b292]/40"
                        : "border-[#3e2e23] bg-[#1c140f] text-[#c8b7a6] hover:border-[#523e30]"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 text-[#d4b292]" />
                    <span>Courier Pick-up</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("dropoff")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      deliveryMethod === "dropoff"
                        ? "border-[#d4b292] bg-[#3e2e23] text-[#f5efe6] shadow-sm ring-1 ring-[#d4b292]/40"
                        : "border-[#3e2e23] bg-[#1c140f] text-[#c8b7a6] hover:border-[#523e30]"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#d4b292]" />
                    <span>Direct Drop-off</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("volunteer")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      deliveryMethod === "volunteer"
                        ? "border-[#d4b292] bg-[#3e2e23] text-[#f5efe6] shadow-sm ring-1 ring-[#d4b292]/40"
                        : "border-[#3e2e23] bg-[#1c140f] text-[#c8b7a6] hover:border-[#523e30]"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-[#d4b292]" />
                    <span>Volunteer Team</span>
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* DYNAMIC FULFILLMENT & SCHEDULING FORM */}
              {/* ---------------------------------------------------- */}
              <div className="bg-[#1c140f] border border-[#3e2e23] rounded-2xl p-4 space-y-4">
                
                {/* CASE 1: COURIER PICK-UP FORM */}
                {deliveryMethod === "courier" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3.5"
                  >
                    <div className="flex items-center justify-between border-b border-[#36271e] pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#f5efe6]">
                        <Calendar className="w-3.5 h-3.5 text-[#d4b292]" />
                        <span>Schedule Pick-up Date & Time</span>
                      </div>
                      <span className="text-[10px] text-[#a8896c] font-mono">Doorstep Courier</span>
                    </div>

                    {/* Pick-up Date */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6] flex items-center justify-between">
                        <span>Available Pick-up Date</span>
                        <span className="text-[10px] text-[#d4b292] font-mono">{formatReadableDate(pickupDate)}</span>
                      </label>

                      <div className="relative">
                        <input
                          type="date"
                          value={pickupDate}
                          min={getFutureDateStr(0)}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-2 text-xs text-[#f5efe6] focus:border-[#d4b292] focus:outline-none transition-colors cursor-pointer"
                        />
                      </div>

                      {/* Quick Date Presets */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setPickupDate(getFutureDateStr(1))}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            pickupDate === getFutureDateStr(1)
                              ? "bg-[#3e2e23] border-[#d4b292] text-[#f5efe6]"
                              : "bg-[#18120d] border-[#36271e] text-[#a8896c] hover:text-[#f5efe6]"
                          }`}
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => setPickupDate(getFutureDateStr(2))}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            pickupDate === getFutureDateStr(2)
                              ? "bg-[#3e2e23] border-[#d4b292] text-[#f5efe6]"
                              : "bg-[#18120d] border-[#36271e] text-[#a8896c] hover:text-[#f5efe6]"
                          }`}
                        >
                          In 2 Days
                        </button>
                        <button
                          type="button"
                          onClick={() => setPickupDate(getFutureDateStr(3))}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            pickupDate === getFutureDateStr(3)
                              ? "bg-[#3e2e23] border-[#d4b292] text-[#f5efe6]"
                              : "bg-[#18120d] border-[#36271e] text-[#a8896c] hover:text-[#f5efe6]"
                          }`}
                        >
                          In 3 Days
                        </button>
                      </div>
                    </div>

                    {/* Pick-up Time Slot */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6] flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#d4b292]" />
                        <span>Pick-up Time Window</span>
                      </label>
                      <select
                        value={pickupTimeSlot}
                        onChange={(e) => setPickupTimeSlot(e.target.value)}
                        className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-2 text-xs text-[#f5efe6] focus:border-[#d4b292] focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="09:00 - 12:00 (Morning Slot)">09:00 - 12:00 (Morning Slot)</option>
                        <option value="13:00 - 16:30 (Afternoon Slot)">13:00 - 16:30 (Afternoon Slot)</option>
                        <option value="17:00 - 20:00 (Evening Slot)">17:00 - 20:00 (Evening Slot)</option>
                        <option value="Anytime (Courier Auto-Dispatch)">Anytime (Courier Auto-Dispatch)</option>
                      </select>
                    </div>

                    {/* Pick-up Address */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6] flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#d4b292]" />
                          <span>Collection Address</span>
                        </span>
                        <span className="text-[9px] text-[#a8896c]">GPS Verified</span>
                      </label>
                      <input
                        type="text"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        placeholder="Enter full address for courier collection"
                        className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-2 text-xs text-[#f5efe6] placeholder:text-[#6e5847] focus:border-[#d4b292] focus:outline-none"
                      />
                    </div>

                    {/* Donor Contact */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#d4b292]" />
                        <span>Driver Contact Number</span>
                      </label>
                      <input
                        type="text"
                        value={pickupPhone}
                        onChange={(e) => setPickupPhone(e.target.value)}
                        className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-1.5 text-xs text-[#f5efe6] placeholder:text-[#6e5847] focus:border-[#d4b292] focus:outline-none"
                      />
                    </div>

                    {/* ESTIMATE DELIVERED DATE BANNER */}
                    <div className="bg-[#241a13] border border-[#4a392c] rounded-xl p-3 flex items-start gap-2.5">
                      <CalendarCheck className="w-4 h-4 text-[#d4b292] shrink-0 mt-0.5" />
                      <div className="text-[11px] space-y-0.5">
                        <div className="text-[#a8896c] font-medium">Estimated Arrival at Relief Center:</div>
                        <div className="font-bold text-[#f5efe6] text-xs">
                          {formatReadableDate(pickupDate, 2)} (Within 48h of Pick-up)
                        </div>
                        <p className="text-[10px] text-[#8e7b6d]">
                          Direct transit to Perak & Sabah community sorting depots.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* CASE 2: DIRECT DROP-OFF FORM (USER SPECIFIC REQUEST) */}
                {deliveryMethod === "dropoff" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3.5"
                  >
                    <div className="flex items-center justify-between border-b border-[#36271e] pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#f5efe6]">
                        <Building2 className="w-3.5 h-3.5 text-[#d4b292]" />
                        <span>Direct Drop-off Center & Schedule</span>
                      </div>
                      <span className="text-[10px] text-[#d4b292] bg-[#3a2c22] px-1.5 py-0.5 rounded font-mono">
                        Direct Handover
                      </span>
                    </div>

                    {/* Center Location Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6] flex items-center justify-between">
                        <span>Select Verified Drop-off Center</span>
                        <span className="text-[9px] text-[#a8896c]">Open Daily</span>
                      </label>
                      <select
                        value={dropoffHubId}
                        onChange={(e) => setDropoffHubId(e.target.value)}
                        className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-2 text-xs text-[#f5efe6] focus:border-[#d4b292] focus:outline-none transition-colors cursor-pointer font-medium"
                      >
                        {VERIFIED_DROPOFF_HUBS.map((hub) => (
                          <option key={hub.id} value={hub.id}>
                            {hub.name}
                          </option>
                        ))}
                      </select>

                      {/* Selected Hub Info Box */}
                      <div className="bg-[#150f0b] p-2.5 rounded-xl border border-[#36271e] text-[10px] text-[#c8b7a6] space-y-1">
                        <div className="flex items-center gap-1 text-[#f5efe6] font-medium">
                          <MapPin className="w-3 h-3 text-[#d4b292] shrink-0" />
                          <span>{selectedDropoffHub.address}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#8e7b6d] pl-4">
                          <span>Hours: {selectedDropoffHub.hours}</span>
                          <span>Tel: {selectedDropoffHub.contact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Drop-off Date */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6] flex items-center justify-between">
                        <span>Choose Planned Drop-off Date</span>
                        <span className="text-[10px] text-[#d4b292] font-mono">{formatReadableDate(dropoffDate)}</span>
                      </label>

                      <input
                        type="date"
                        value={dropoffDate}
                        min={getFutureDateStr(0)}
                        onChange={(e) => setDropoffDate(e.target.value)}
                        className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-2 text-xs text-[#f5efe6] focus:border-[#d4b292] focus:outline-none transition-colors cursor-pointer"
                      />

                      {/* Quick Drop-off Date Chips */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setDropoffDate(getFutureDateStr(0))}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            dropoffDate === getFutureDateStr(0)
                              ? "bg-[#3e2e23] border-[#d4b292] text-[#f5efe6]"
                              : "bg-[#18120d] border-[#36271e] text-[#a8896c] hover:text-[#f5efe6]"
                          }`}
                        >
                          Today (Express)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDropoffDate(getFutureDateStr(1))}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            dropoffDate === getFutureDateStr(1)
                              ? "bg-[#3e2e23] border-[#d4b292] text-[#f5efe6]"
                              : "bg-[#18120d] border-[#36271e] text-[#a8896c] hover:text-[#f5efe6]"
                          }`}
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => setDropoffDate(getFutureDateStr(2))}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                            dropoffDate === getFutureDateStr(2)
                              ? "bg-[#3e2e23] border-[#d4b292] text-[#f5efe6]"
                              : "bg-[#18120d] border-[#36271e] text-[#a8896c] hover:text-[#f5efe6]"
                          }`}
                        >
                          This Weekend
                        </button>
                      </div>
                    </div>

                    {/* Planned Drop-off Time */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6] flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#d4b292]" />
                        <span>Planned Drop-off Time Window</span>
                      </label>
                      <select
                        value={dropoffTimeSlot}
                        onChange={(e) => setDropoffTimeSlot(e.target.value)}
                        className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-2 text-xs text-[#f5efe6] focus:border-[#d4b292] focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="09:00 - 12:00 (Morning Drop-off)">09:00 - 12:00 (Morning Drop-off)</option>
                        <option value="13:00 - 16:30 (Afternoon Drop-off)">13:00 - 16:30 (Afternoon Drop-off)</option>
                        <option value="17:00 - 19:30 (Evening Drop-off)">17:00 - 19:30 (Evening Drop-off)</option>
                      </select>
                    </div>

                    {/* PROMINENT ESTIMATE DELIVERED DATE FOR DIRECT DROP-OFF */}
                    <div className="bg-[#2a1e15] border border-[#594334] rounded-xl p-3.5 space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-serif font-bold text-[#d4b292] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#d4b292]" />
                          <span>Estimated Delivered Date:</span>
                        </span>
                        <span className="font-mono font-extrabold text-[#f5efe6] bg-[#3e2e23] px-2 py-0.5 rounded border border-[#5e493b]">
                          {formatReadableDate(dropoffDate, 0)}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#c8b7a6] leading-relaxed">
                        Direct drop-offs undergo immediate barcode verification and are marked as delivered into the shelter inventory on the <strong className="text-[#f5efe6]">same day ({formatReadableDate(dropoffDate)})</strong>.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* CASE 3: VOLUNTEER TEAM FORM */}
                {deliveryMethod === "volunteer" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3.5"
                  >
                    <div className="flex items-center justify-between border-b border-[#36271e] pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#f5efe6]">
                        <User className="w-3.5 h-3.5 text-[#d4b292]" />
                        <span>Volunteer Handover Appointment</span>
                      </div>
                      <span className="text-[10px] text-[#d4b292] bg-[#3a2c22] px-1.5 py-0.5 rounded font-mono">
                        Hand-to-Hand
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6]">
                        Volunteer Meeting Date
                      </label>
                      <input
                        type="date"
                        value={volunteerDate}
                        min={getFutureDateStr(0)}
                        onChange={(e) => setVolunteerDate(e.target.value)}
                        className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-2 text-xs text-[#f5efe6] focus:border-[#d4b292] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-[#c8b7a6]">
                        Preferred Meeting Time Window
                      </label>
                      <select
                        value={volunteerTimeSlot}
                        onChange={(e) => setVolunteerTimeSlot(e.target.value)}
                        className="w-full bg-[#120d09] border border-[#443328] rounded-xl px-3 py-2 text-xs text-[#f5efe6] focus:border-[#d4b292] focus:outline-none"
                      >
                        <option value="10:00 - 13:00 (Morning Session)">10:00 - 13:00 (Morning Session)</option>
                        <option value="14:00 - 17:00 (Afternoon Slot)">14:00 - 17:00 (Afternoon Slot)</option>
                        <option value="18:00 - 20:00 (Evening Post-Work)">18:00 - 20:00 (Evening Post-Work)</option>
                      </select>
                    </div>

                    {/* ESTIMATE DELIVERED DATE BANNER */}
                    <div className="bg-[#241a13] border border-[#4a392c] rounded-xl p-3 flex items-start gap-2.5">
                      <CalendarCheck className="w-4 h-4 text-[#d4b292] shrink-0 mt-0.5" />
                      <div className="text-[11px] space-y-0.5">
                        <div className="text-[#a8896c] font-medium">Estimated Delivery to Shelter:</div>
                        <div className="font-bold text-[#f5efe6] text-xs">
                          {formatReadableDate(volunteerDate, 1)} (Next Day Distribution)
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Additional Logistics / Gate Access Notes */}
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] font-medium text-[#8e7b6d]">
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                    placeholder="E.g. Call upon arrival, leave at guardhouse..."
                    className="w-full bg-[#120d09] border border-[#36271e] rounded-xl px-3 py-1.5 text-xs text-[#f5efe6] placeholder:text-[#635043] focus:border-[#d4b292] focus:outline-none"
                  />
                </div>

              </div>

              {/* Elegant Warm Brown Primary Button */}
              <button
                type="button"
                onClick={handlePerformCheckout}
                disabled={checkedItems.length === 0 || isCheckingOut}
                className="w-full py-3.5 bg-[#4a3a2d] hover:bg-[#5e4a3b] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-[#f5efe6] font-serif font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 border border-[#6b5443]"
              >
                <Package className="w-4 h-4 text-[#d4b292]" />
                <span>{isCheckingOut ? "Scheduling Dispatch..." : "Confirm & Send Donate Box"}</span>
              </button>

            </div>

          </div>

        </div>

      </main>

      {/* ==================================================== */}
      {/* MODAL: Edit Dedication Note */}
      {/* ==================================================== */}
      <AnimatePresence>
        {editingNoteItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#291f18] rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 text-left border border-[#443328]"
            >
              <div className="flex items-center justify-between border-b border-[#36271e] pb-3">
                <h4 className="font-serif font-bold text-sm text-[#f5efe6]">Add Donor Dedication Note</h4>
                <button
                  onClick={() => setEditingNoteItem(null)}
                  className="text-[#a8896c] hover:text-[#f5efe6] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-[#c8b7a6]">
                Writing message for: <span className="font-bold text-[#f5efe6]">{editingNoteItem.title}</span>
              </div>

              <textarea
                rows={3}
                value={noteInputText}
                onChange={(e) => setNoteInputText(e.target.value)}
                placeholder="E.g. Sending warmth from our family to yours! Stay strong."
                className="w-full text-xs p-3.5 border border-[#443328] rounded-xl focus:border-[#d4b292] focus:outline-none bg-[#1c140f] text-[#f5efe6] placeholder:text-[#6e5847]"
              />

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNoteItem(null)}
                  className="px-3.5 py-2 text-xs text-[#c8b7a6] hover:text-white bg-[#201812] hover:bg-[#2c2018] rounded-xl cursor-pointer font-medium border border-[#3e2e23]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-4 py-2 text-xs font-serif font-bold bg-[#4a3a2d] text-[#f5efe6] rounded-xl hover:bg-[#5e4a3b] cursor-pointer shadow-md border border-[#6b5443]"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL: Bundle Relief Item Selector */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isComboModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#291f18] rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 text-left border border-[#443328]"
            >
              <div className="flex items-center justify-between border-b border-[#36271e] pb-3">
                <h4 className="font-serif font-bold text-sm text-[#f5efe6] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#d4b292]" />
                  Add Relief Essentials Bundle ({comboTargetStore})
                </h4>
                <button
                  onClick={() => setIsComboModalOpen(false)}
                  className="text-[#a8896c] hover:text-[#f5efe6] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#c8b7a6] leading-relaxed">
                Adding matching essential supplies will combine with your care box for free single-dispatch distribution to community shelters.
              </p>

              <div className="p-3.5 bg-[#1c140f] rounded-xl border border-[#3e2e23] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=150&q=80"
                  alt="Relief Essentials"
                  className="w-12 h-12 rounded-lg object-cover border border-[#4a392e]"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-serif font-bold text-[#f5efe6] truncate">Thermal Fleece Quilt & Towel Set</h5>
                  <div className="text-xs text-[#a8896c]">1 Pack • Essential Relief</div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComboModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-[#c8b7a6] hover:text-white bg-[#201812] hover:bg-[#2c2018] rounded-xl cursor-pointer font-medium border border-[#3e2e23]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddComboItem(comboTargetStore)}
                  className="px-4 py-2 text-xs font-serif font-bold bg-[#4a3a2d] text-[#f5efe6] rounded-xl hover:bg-[#5e4a3b] cursor-pointer shadow-md border border-[#6b5443]"
                >
                  + Add to Donate Box
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL: Details of the Item Requested */}
      {/* ==================================================== */}
      <RequestDetailModal
        request={selectedDetailRequest}
        isOpen={Boolean(selectedDetailRequest)}
        onClose={() => setSelectedDetailRequest(null)}
        onAddToDonateBox={(req) => {
          const existing = cartItems.find((i) => i.requestId === req.id || i.title === req.title);
          if (existing) {
            handleUpdateQuantity(existing.id, Math.min(existing.maxNeeded, existing.quantity + 1));
          }
        }}
        onSupportNow={(req) => {
          const existing = cartItems.find((i) => i.requestId === req.id || i.title === req.title);
          if (existing) {
            const updated = cartItems.map((i) => (i.id === existing.id ? { ...i, checked: true } : i));
            saveCart(updated);
          }
          setSelectedDetailRequest(null);
        }}
        isInDonateBox={true}
        onOpenDonateBoxPage={() => setSelectedDetailRequest(null)}
      />

    </div>
  );
}
