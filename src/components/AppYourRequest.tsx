import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Plus,
  Package,
  Calendar,
  Clock,
  MapPin,
  Tag,
  FolderPlus,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Layers,
  Search,
  Trash2,
  Edit3,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Info,
  ShieldCheck,
  Building2,
  RefreshCw,
  FolderCheck,
  Share2,
  Images,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Eye,
  Star,
  PlusCircle
} from "lucide-react";
import { RecipientRequest, AidCampaign, RequestCategory } from "../types";

interface AppYourRequestProps {
  navigateToView: (view: "home" | "comments" | "explore" | "main_menu" | "your_request" | "needs") => void;
}

const STANDARD_CATEGORIES: RequestCategory[] = [
  "Emergency",
  "Food",
  "Animal",
  "Medical",
  "Elderly / OKU",
  "Education",
  "Clothing",
  "Others"
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Emergency: { bg: "bg-rose-950/40", text: "text-rose-300", border: "border-rose-500/40" },
  Food: { bg: "bg-amber-950/40", text: "text-amber-300", border: "border-amber-500/40" },
  Animal: { bg: "bg-emerald-950/40", text: "text-emerald-300", border: "border-emerald-500/40" },
  Medical: { bg: "bg-cyan-950/40", text: "text-cyan-300", border: "border-cyan-500/40" },
  "Elderly / OKU": { bg: "bg-purple-950/40", text: "text-purple-300", border: "border-purple-500/40" },
  Education: { bg: "bg-indigo-950/40", text: "text-indigo-300", border: "border-indigo-500/40" },
  Clothing: { bg: "bg-teal-950/40", text: "text-teal-300", border: "border-teal-500/40" },
  Others: { bg: "bg-stone-800/60", text: "text-stone-300", border: "border-stone-600/40" }
};

const getCategoryBadgeStyle = (catName: string) => {
  if (CATEGORY_COLORS[catName]) {
    return CATEGORY_COLORS[catName];
  }
  return { bg: "bg-amber-950/40", text: "text-amber-200", border: "border-amber-500/40" };
};

const getRequestCategories = (r: RecipientRequest): string[] => {
  if (r.categories && r.categories.length > 0) {
    return r.categories;
  }
  if (r.category) {
    return [r.category];
  }
  return ["Others"];
};

const getRequestImages = (r: RecipientRequest): string[] => {
  if (r.images && r.images.length > 0) {
    return r.images;
  }
  if (r.imageUrl) {
    return [r.imageUrl];
  }
  return ["https://images.unsplash.com/photo-1594824813689-138dca532a76?auto=format&fit=crop&w=600&q=80"];
};

const SAMPLE_PRESET_IMAGES = [
  { label: "Baby Infant Milk", url: "https://images.unsplash.com/photo-1594824813689-138dca532a76?auto=format&fit=crop&w=600&q=80", category: "Food" as RequestCategory },
  { label: "10kg Fragrant Rice", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80", category: "Food" as RequestCategory },
  { label: "Dry Cat & Dog Food", url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80", category: "Animal" as RequestCategory },
  { label: "Adult Wheelchair", url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80", category: "Elderly / OKU" as RequestCategory },
  { label: "Emergency First Aid Kit", url: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80", category: "Emergency" as RequestCategory },
  { label: "Canned Sardines & Beans", url: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80", category: "Food" as RequestCategory },
  { label: "Adult Diapers L/XL", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80", category: "Medical" as RequestCategory },
  { label: "Primary School Backpack", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", category: "Education" as RequestCategory }
];

const INITIAL_REQUESTS: RecipientRequest[] = [
  {
    id: "req_1",
    title: "Enfamil Step 1 Baby Infant Formula (850g)",
    category: "Emergency",
    categories: ["Emergency", "Food"],
    description: "Urgent nutrition needed for 6 displaced infant babies following sudden local flash flood in Perak.",
    imageUrl: "https://images.unsplash.com/photo-1594824813689-138dca532a76?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1594824813689-138dca532a76?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
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
    categories: ["Food"],
    description: "Monthly staple food packs for 45 registered B40 low-income single parent households in Ipoh.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=600&q=80"
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
    categories: ["Animal", "Medical"],
    description: "Supporting 80 rescued community dogs and cats at our local no-kill animal sanctuary.",
    imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80"
    ],
    location: "Hope Paws Shelter, Jalan Gopeng, Perak",
    quantity: 20,
    unit: "bags (15kg)",
    pledgedQuantity: 8,
    postedDate: "08 Aug 2026, 11:00 AM",
    postedTimestamp: Date.now() - 518400000,
    status: "active",
    urgencyLevel: "standard"
  },
  {
    id: "req_4",
    title: "Heavy-Duty Foldable Wheelchair with Brake Locks",
    category: "Elderly / OKU",
    categories: ["Elderly / OKU", "Medical"],
    description: "Required for an elderly mobility-impaired stroke survivor residing in Kampar.",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80"
    ],
    location: "Kampar OKU Welfare Care Office, Perak",
    quantity: 1,
    unit: "unit",
    pledgedQuantity: 1,
    postedDate: "01 Jul 2026, 10:00 AM",
    postedTimestamp: Date.now() - 3800000000,
    status: "fulfilled",
    fulfilledDate: "05 Jul 2026",
    urgencyLevel: "high"
  },
  {
    id: "req_5",
    title: "Primary School Stationery Sets & Uniform Vouchers",
    category: "Education",
    categories: ["Education", "Clothing"],
    description: "School semester opening aid for 25 underprivileged rural students.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    ],
    location: "Balai Komuniti B40, Teluk Intan, Perak",
    quantity: 25,
    unit: "sets",
    pledgedQuantity: 25,
    postedDate: "20 Jun 2026, 04:20 PM",
    postedTimestamp: Date.now() - 4800000000,
    status: "fulfilled",
    fulfilledDate: "27 Jun 2026",
    urgencyLevel: "standard"
  }
];

const INITIAL_CAMPAIGNS: AidCampaign[] = [
  {
    id: "camp_flood_2026",
    title: "Kampar Monsoon Flood Aid Drive",
    description: "Coordinating emergency infant essentials, drinking water, and dry food packs for flood-affected families.",
    category: "Emergency Relief",
    targetDate: "30 Aug 2026",
    createdAt: "12 Aug 2026",
    status: "active",
    requestIds: ["req_1"],
    bannerEmoji: "🌊"
  },
  {
    id: "camp_food_pantry",
    title: "Community Food Pantry Sustenance",
    description: "Ongoing supply replenishment for weekly dry grocery handouts to low-income households.",
    category: "Food Security",
    targetDate: "15 Sep 2026",
    createdAt: "10 Aug 2026",
    status: "active",
    requestIds: ["req_2"],
    bannerEmoji: "🌾"
  }
];

export default function AppYourRequest({ navigateToView }: AppYourRequestProps) {
  const [activeTab, setActiveTab] = useState<"current" | "create" | "campaigns" | "history">("current");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User details
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("aidstory_current_user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  // Requests state
  const [requests, setRequests] = useState<RecipientRequest[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_recipient_requests");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_REQUESTS;
        }
      }
    }
    return INITIAL_REQUESTS;
  });

  // Campaigns state
  const [campaigns, setCampaigns] = useState<AidCampaign[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_recipient_campaigns");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return INITIAL_CAMPAIGNS;
        }
      }
    }
    return INITIAL_CAMPAIGNS;
  });

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aidstory_recipient_requests", JSON.stringify(requests));
    }
  }, [requests]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("aidstory_recipient_campaigns", JSON.stringify(campaigns));
    }
  }, [campaigns]);

  // Form State for Add New Request (Multi-Image Support)
  const [reqTitle, setReqTitle] = useState("");
  const [reqCategories, setReqCategories] = useState<string[]>(["Food"]);
  const [reqCustomCategory, setReqCustomCategory] = useState<string>("");
  const [reqDesc, setReqDesc] = useState("");
  const [reqLocation, setReqLocation] = useState("");
  const [reqQuantity, setReqQuantity] = useState(10);
  const [reqUnit, setReqUnit] = useState("packs");
  const [reqImages, setReqImages] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [reqPostedDateTime, setReqPostedDateTime] = useState("");
  const [reqUrgency, setReqUrgency] = useState<"standard" | "medium" | "high">("medium");
  const [reqSelectedCampaignId, setReqSelectedCampaignId] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Form State for Create / Edit Campaign Modal
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campTitle, setCampTitle] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [campCategory, setCampCategory] = useState("Community Relief");
  const [campTargetDate, setCampTargetDate] = useState("");
  const [campEmoji, setCampEmoji] = useState("📦");
  const [campSelectedReqIds, setCampSelectedReqIds] = useState<string[]>([]);

  // Assign to Campaign Modal State
  const [assignModalReq, setAssignModalReq] = useState<RecipientRequest | null>(null);
  const [selectedTargetCampaignId, setSelectedTargetCampaignId] = useState<string>("");

  // Edit Request Modal State (Multi-Image Support)
  const [editingRequest, setEditingRequest] = useState<RecipientRequest | null>(null);
  const [editReqCategories, setEditReqCategories] = useState<string[]>(["Food"]);
  const [editReqCustomCategory, setEditReqCustomCategory] = useState<string>("");
  const [editReqImages, setEditReqImages] = useState<string[]>([]);
  const [editPrimaryImageIndex, setEditPrimaryImageIndex] = useState<number>(0);
  const [isEditDragOver, setIsEditDragOver] = useState(false);

  // Card Image Active Index for Interactive Browsing
  const [activeCardImageIdx, setActiveCardImageIdx] = useState<Record<string, number>>({});

  // Lightbox Modal State for Full Screen Image Inspection
  const [lightboxData, setLightboxData] = useState<{
    title: string;
    images: string[];
    activeIdx: number;
  } | null>(null);

  // Disband Campaign Target State for Confirmation Modal
  const [disbandCampaignTarget, setDisbandCampaignTarget] = useState<AidCampaign | null>(null);

  // Auto initialize formatted current date and time
  const getCurrentFormattedDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) + ", " + now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  useEffect(() => {
    setReqPostedDateTime(getCurrentFormattedDateTime());
    if (user?.location) {
      const { address, postcode, state, country } = user.location;
      const formatted = [address, postcode, state, country].filter(Boolean).join(", ");
      if (formatted) setReqLocation(formatted);
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Multiple Images Upload handler for New Request Form
  const handleMultipleImageFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImages = fileArray.filter((file) => file.type.startsWith("image/"));
    if (validImages.length === 0) {
      showToast("Please select valid image files (PNG, JPG, WEBP).");
      return;
    }

    validImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setReqImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`Added ${validImages.length} image(s) to requested item.`);
  };

  const handleRemoveReqImage = (indexToRemove: number) => {
    setReqImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (primaryImageIndex >= indexToRemove && primaryImageIndex > 0) {
      setPrimaryImageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
    showToast(`Image #${index + 1} marked as primary cover photo.`);
  };

  const handleClearAllReqImages = () => {
    setReqImages([]);
    setPrimaryImageIndex(0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultipleImageFiles(e.dataTransfer.files);
    }
  };

  // Multiple Images Upload handler for Edit Modal
  const handleEditMultipleImageFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImages = fileArray.filter((file) => file.type.startsWith("image/"));
    if (validImages.length === 0) {
      showToast("Please select valid image files (PNG, JPG, WEBP).");
      return;
    }

    validImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setEditReqImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`Added ${validImages.length} photo(s) to request.`);
  };

  const handleRemoveEditImage = (indexToRemove: number) => {
    setEditReqImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (editPrimaryImageIndex >= indexToRemove && editPrimaryImageIndex > 0) {
      setEditPrimaryImageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // Card Interactive Image Navigation (Prev / Next)
  const handleCardImageNav = (requestId: string, direction: "prev" | "next", totalImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (totalImages <= 1) return;
    setActiveCardImageIdx((prev) => {
      const current = prev[requestId] ?? 0;
      const nextIdx = direction === "next" 
        ? (current + 1) % totalImages 
        : (current - 1 + totalImages) % totalImages;
      return { ...prev, [requestId]: nextIdx };
    });
  };

  // Submit Add New Request
  const handleSubmitNewRequest = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reqTitle.trim()) {
      showToast("Please enter the name of the requested item.");
      return;
    }

    // Process categories & custom category
    const standardSelected = reqCategories.filter((c) => c !== "Others" && STANDARD_CATEGORIES.includes(c as RequestCategory));
    const customTags = reqCustomCategory
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let finalCategories: string[] = [];
    if (standardSelected.length > 0) {
      finalCategories.push(...standardSelected);
    }
    if (reqCategories.includes("Others") || customTags.length > 0) {
      if (customTags.length > 0) {
        finalCategories.push(...customTags);
      } else {
        finalCategories.push("Others");
      }
    }
    finalCategories = Array.from(new Set(finalCategories));
    if (finalCategories.length === 0) {
      finalCategories = ["Food"];
    }

    const primaryCategory = (finalCategories.find((c) => STANDARD_CATEGORIES.includes(c as RequestCategory)) || "Others") as RequestCategory;

    const fallbackImg = SAMPLE_PRESET_IMAGES.find((p) => finalCategories.includes(p.category))?.url ||
      "https://images.unsplash.com/photo-1594824813689-138dca532a76?auto=format&fit=crop&w=600&q=80";

    // Build ordered image list with primary image first
    let finalImageList: string[] = [];
    if (reqImages.length > 0) {
      const primary = reqImages[primaryImageIndex] || reqImages[0];
      const others = reqImages.filter((_, idx) => idx !== primaryImageIndex);
      finalImageList = [primary, ...others];
    } else {
      finalImageList = [fallbackImg];
    }

    const targetCampaign = campaigns.find((c) => c.id === reqSelectedCampaignId);

    const newRequest: RecipientRequest = {
      id: `req_${Date.now()}`,
      title: reqTitle.trim(),
      category: primaryCategory,
      categories: finalCategories,
      customCategory: customTags.join(", ") || undefined,
      description: reqDesc.trim() || "Essential goods needed for community relief support.",
      imageUrl: finalImageList[0],
      images: finalImageList,
      location: reqLocation.trim() || (user?.location ? `${user.location.state || "Perak"}, Malaysia` : "Community Support Hub, Perak"),
      quantity: Number(reqQuantity) || 1,
      unit: reqUnit,
      pledgedQuantity: 0,
      postedDate: reqPostedDateTime || getCurrentFormattedDateTime(),
      postedTimestamp: Date.now(),
      status: "active",
      campaignId: reqSelectedCampaignId || undefined,
      campaignTitle: targetCampaign?.title,
      authorName: user?.username || "Verified Recipient",
      authorType: user?.role || "NGO Representative",
      urgencyLevel: reqUrgency
    };

    // If campaign selected, add request ID to that campaign
    if (reqSelectedCampaignId) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === reqSelectedCampaignId
            ? { ...c, requestIds: [...c.requestIds, newRequest.id] }
            : c
        )
      );
    }

    setRequests((prev) => [newRequest, ...prev]);

    // Reset Form
    setReqTitle("");
    setReqDesc("");
    setReqImages([]);
    setPrimaryImageIndex(0);
    setReqQuantity(10);
    setReqCategories(["Food"]);
    setReqCustomCategory("");
    setReqSelectedCampaignId("");
    setReqPostedDateTime(getCurrentFormattedDateTime());

    showToast(`Request for "${newRequest.title}" with ${finalImageList.length} photo(s) posted successfully!`);
    setActiveTab("current");
  };

  // Mark Request as Fulfilled
  const handleMarkFulfilled = (requestId: string) => {
    const nowStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: "fulfilled", fulfilledDate: nowStr, pledgedQuantity: r.quantity }
          : r
      )
    );
    showToast("Request marked as fulfilled & moved to Past History!");
  };

  // Delete Request
  const handleDeleteRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    // Also remove from any campaigns
    setCampaigns((prev) =>
      prev.map((c) => ({
        ...c,
        requestIds: c.requestIds.filter((id) => id !== requestId)
      }))
    );
    showToast("Request removed.");
  };

  // Re-open / duplicate past request
  const handleReopenRequest = (req: RecipientRequest) => {
    const duplicated: RecipientRequest = {
      ...req,
      id: `req_${Date.now()}`,
      status: "active",
      pledgedQuantity: 0,
      fulfilledDate: undefined,
      postedDate: getCurrentFormattedDateTime(),
      postedTimestamp: Date.now()
    };
    setRequests((prev) => [duplicated, ...prev]);
    showToast(`"${req.title}" re-posted to Active Requests!`);
    setActiveTab("current");
  };

  // Open Create Campaign Modal
  const handleOpenCreateCampaign = () => {
    setEditingCampaignId(null);
    setCampTitle("");
    setCampDesc("");
    setCampCategory("Community Relief");
    setCampTargetDate("");
    setCampEmoji("📦");
    setCampSelectedReqIds([]);
    setIsNewCampaignModalOpen(true);
  };

  // Open Edit Campaign / Manage Items Modal
  const handleOpenEditCampaign = (camp: AidCampaign) => {
    setEditingCampaignId(camp.id);
    setCampTitle(camp.title);
    setCampDesc(camp.description);
    setCampCategory(camp.category);
    setCampEmoji(camp.bannerEmoji || "📦");
    setCampTargetDate(camp.targetDate || "");
    setCampSelectedReqIds([...camp.requestIds]);
    setIsNewCampaignModalOpen(true);
  };

  // Request Disband Campaign (Opens Confirmation Modal)
  const handleRequestDisbandCampaign = (camp: AidCampaign) => {
    setDisbandCampaignTarget(camp);
  };

  // Confirm Disband Campaign
  const handleConfirmDisbandCampaign = () => {
    if (!disbandCampaignTarget) return;
    const campaignId = disbandCampaignTarget.id;
    const campaignTitle = disbandCampaignTarget.title;
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    setRequests((prev) =>
      prev.map((r) => (r.campaignId === campaignId ? { ...r, campaignId: undefined, campaignTitle: undefined } : r))
    );
    setDisbandCampaignTarget(null);
    showToast(`Campaign "${campaignTitle}" disbanded. Requests remain active.`);
  };

  // Disband / Delete Campaign (Direct fallback)
  const handleDeleteCampaign = (campaignId: string, campaignTitle: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    setRequests((prev) =>
      prev.map((r) => (r.campaignId === campaignId ? { ...r, campaignId: undefined, campaignTitle: undefined } : r))
    );
    showToast(`Campaign "${campaignTitle}" disbanded.`);
  };

  // Save Campaign (Create or Update)
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle.trim()) {
      showToast("Please enter a campaign title.");
      return;
    }

    if (editingCampaignId) {
      // UPDATE EXISTING CAMPAIGN
      const targetCampId = editingCampaignId;
      const targetTitle = campTitle.trim();

      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === targetCampId) {
            return {
              ...c,
              title: targetTitle,
              description: campDesc.trim() || "Community collective aid initiative.",
              category: campCategory,
              targetDate: campTargetDate || "Ongoing",
              bannerEmoji: campEmoji || "📦",
              requestIds: campSelectedReqIds
            };
          }
          return c;
        })
      );

      // Update requests association:
      // 1. Items in campSelectedReqIds -> assign to targetCampId & targetTitle
      // 2. Items previously assigned to targetCampId that are now deselected -> unassign
      setRequests((prev) =>
        prev.map((r) => {
          if (campSelectedReqIds.includes(r.id)) {
            return { ...r, campaignId: targetCampId, campaignTitle: targetTitle };
          } else if (r.campaignId === targetCampId) {
            return { ...r, campaignId: undefined, campaignTitle: undefined };
          }
          return r;
        })
      );

      setIsNewCampaignModalOpen(false);
      setEditingCampaignId(null);
      setCampTitle("");
      setCampDesc("");
      setCampSelectedReqIds([]);
      showToast(`Campaign "${targetTitle}" updated successfully!`);
    } else {
      // CREATE NEW CAMPAIGN
      const newCampaignId = `camp_${Date.now()}`;
      const newCamp: AidCampaign = {
        id: newCampaignId,
        title: campTitle.trim(),
        description: campDesc.trim() || "Community collective aid initiative.",
        category: campCategory,
        targetDate: campTargetDate || "Ongoing",
        createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: "active",
        requestIds: campSelectedReqIds,
        bannerEmoji: campEmoji || "📦"
      };

      // Update the selected requests with this campaign's ID and title
      if (campSelectedReqIds.length > 0) {
        setRequests((prev) =>
          prev.map((r) =>
            campSelectedReqIds.includes(r.id)
              ? { ...r, campaignId: newCampaignId, campaignTitle: newCamp.title }
              : r
          )
        );
      }

      setCampaigns((prev) => [newCamp, ...prev]);
      setIsNewCampaignModalOpen(false);
      setEditingCampaignId(null);
      setCampTitle("");
      setCampDesc("");
      setCampSelectedReqIds([]);
      showToast(`Campaign "${newCamp.title}" created with ${campSelectedReqIds.length} requests collected!`);
    }
  };

  // Assign request to campaign
  const handleAssignToCampaign = () => {
    if (!assignModalReq) return;

    if (selectedTargetCampaignId === "none") {
      // Remove from campaign
      setRequests((prev) =>
        prev.map((r) => (r.id === assignModalReq.id ? { ...r, campaignId: undefined, campaignTitle: undefined } : r))
      );
      setCampaigns((prev) =>
        prev.map((c) => ({
          ...c,
          requestIds: c.requestIds.filter((id) => id !== assignModalReq.id)
        }))
      );
      showToast(`Removed "${assignModalReq.title}" from campaign.`);
    } else {
      const camp = campaigns.find((c) => c.id === selectedTargetCampaignId);
      if (camp) {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === assignModalReq.id
              ? { ...r, campaignId: camp.id, campaignTitle: camp.title }
              : r
          )
        );
        setCampaigns((prev) =>
          prev.map((c) => {
            if (c.id === camp.id && !c.requestIds.includes(assignModalReq.id)) {
              return { ...c, requestIds: [...c.requestIds, assignModalReq.id] };
            }
            if (c.id !== camp.id && c.requestIds.includes(assignModalReq.id)) {
              return { ...c, requestIds: c.requestIds.filter((id) => id !== assignModalReq.id) };
            }
            return c;
          })
        );
        showToast(`Assigned "${assignModalReq.title}" to campaign "${camp.title}".`);
      }
    }

    setAssignModalReq(null);
  };

  // Open Edit Request Modal
  const handleOpenEditRequest = (req: RecipientRequest) => {
    setEditingRequest(req);
    const existingCats = getRequestCategories(req);
    setEditReqCategories(existingCats);
    setEditReqCustomCategory(req.customCategory || "");
    const existingImages = getRequestImages(req);
    setEditReqImages(existingImages);
    setEditPrimaryImageIndex(0);
  };

  // Save Edited Request
  const handleSaveEditRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    const standardSelected = editReqCategories.filter((c) => c !== "Others" && STANDARD_CATEGORIES.includes(c as RequestCategory));
    const customTags = editReqCustomCategory
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let finalCategories: string[] = [];
    if (standardSelected.length > 0) {
      finalCategories.push(...standardSelected);
    }
    if (editReqCategories.includes("Others") || customTags.length > 0) {
      if (customTags.length > 0) {
        finalCategories.push(...customTags);
      } else {
        finalCategories.push("Others");
      }
    }
    finalCategories = Array.from(new Set(finalCategories));
    if (finalCategories.length === 0) {
      finalCategories = ["Food"];
    }

    const primaryCategory = (finalCategories.find((c) => STANDARD_CATEGORIES.includes(c as RequestCategory)) || "Others") as RequestCategory;

    const fallbackImg = SAMPLE_PRESET_IMAGES.find((p) => finalCategories.includes(p.category))?.url ||
      "https://images.unsplash.com/photo-1594824813689-138dca532a76?auto=format&fit=crop&w=600&q=80";

    let finalImageList: string[] = [];
    if (editReqImages.length > 0) {
      const primary = editReqImages[editPrimaryImageIndex] || editReqImages[0];
      const others = editReqImages.filter((_, idx) => idx !== editPrimaryImageIndex);
      finalImageList = [primary, ...others];
    } else {
      finalImageList = [editingRequest.imageUrl || fallbackImg];
    }

    const updated: RecipientRequest = {
      ...editingRequest,
      category: primaryCategory,
      categories: finalCategories,
      customCategory: customTags.join(", ") || undefined,
      imageUrl: finalImageList[0],
      images: finalImageList
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setEditingRequest(null);
    showToast(`Request "${updated.title}" updated with ${finalImageList.length} photo(s)!`);
  };

  // Active requests filtering
  const activeRequests = requests.filter((r) => r.status === "active");
  const pastRequests = requests.filter((r) => r.status === "fulfilled");

  const filteredActiveRequests = activeRequests.filter((r) => {
    const rCategories = getRequestCategories(r);
    const matchesCategory =
      categoryFilter === "All" ||
      rCategories.some((cat) => {
        if (categoryFilter === "Others") {
          return cat === "Others" || !STANDARD_CATEGORIES.includes(cat as RequestCategory) || Boolean(r.customCategory);
        }
        return cat.toLowerCase() === categoryFilter.toLowerCase();
      });
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rCategories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#1c1814] text-[#f4efe5] selection:bg-[#82afa6] selection:text-[#1c1814] font-sans pb-16">
      
      {/* TOP NOTIFICATION TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[150] bg-[#82afa6] text-[#1c1814] px-5 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <CheckCircle2 className="w-5 h-5 text-[#1c1814]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#25201a]/95 backdrop-blur-md border-b border-white/10 shadow-lg px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateToView("main_menu")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-[#f4efe5] text-xs font-mono transition-all border border-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Main Menu</span>
            </button>

            <div className="h-5 w-[1px] bg-white/15 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-serif font-bold text-base border border-yellow-400/30">
                🧩
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-serif font-bold text-[#f4efe5] tracking-tight leading-tight">
                  Your Requests
                </h1>
                <p className="text-[11px] font-mono text-[#82afa6] hidden sm:block">
                  Verified Recipient Supply & Campaign Management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Verified Recipient:</span>
              <span>{user?.username || "Authorized"}</span>
            </div>

            <button
              onClick={() => setActiveTab("create")}
              className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-[#2c221a] px-4 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post Request</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        
        {/* HERO / OVERVIEW BANNER */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#332b23] via-[#29221b] to-[#1f1a15] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl mb-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#82afa6]/20 border border-[#82afa6]/40 text-[#82afa6] text-[11px] font-mono px-3 py-1 rounded-full font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMMUNITY RECIPIENT PORTAL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#f4efe5] font-semibold">
                Manage Supply Requests & Campaigns
              </h2>
              <p className="text-xs sm:text-sm text-[#f4efe5]/75 leading-relaxed">
                As a verified recipient or community partner, post essential item needs directly to our transparent matching network. Bundle multiple requests into organized campaigns to boost donor outreach.
              </p>
            </div>

            {/* Quick Metrics Summary */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-black/35 p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-yellow-400 block">
                  {activeRequests.length}
                </span>
                <span className="text-[10px] font-mono text-[#f4efe5]/60 uppercase">Active Needs</span>
              </div>

              <div className="bg-black/35 p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#82afa6] block">
                  {campaigns.length}
                </span>
                <span className="text-[10px] font-mono text-[#f4efe5]/60 uppercase">Campaigns</span>
              </div>

              <div className="bg-black/35 p-3.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400 block">
                  {pastRequests.length}
                </span>
                <span className="text-[10px] font-mono text-[#f4efe5]/60 uppercase">Fulfilled</span>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-white/10 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("current")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer ${
              activeTab === "current"
                ? "bg-yellow-400 text-[#2c221a] shadow-lg shadow-yellow-400/20"
                : "bg-white/5 text-[#f4efe5]/70 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Currently Posted Requests</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "current" ? "bg-[#2c221a]/20 text-[#2c221a]" : "bg-white/10 text-[#f4efe5]"
              }`}
            >
              {activeRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer ${
              activeTab === "create"
                ? "bg-[#82afa6] text-[#1c1814] shadow-lg shadow-[#82afa6]/20"
                : "bg-white/5 text-[#f4efe5]/70 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Request</span>
          </button>

          <button
            onClick={() => setActiveTab("campaigns")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer ${
              activeTab === "campaigns"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-white/5 text-[#f4efe5]/70 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Collect as Campaign</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "campaigns" ? "bg-white/20 text-white" : "bg-white/10 text-[#f4efe5]"
              }`}
            >
              {campaigns.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-white/5 text-[#f4efe5]/70 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            <FolderCheck className="w-4 h-4" />
            <span>Past Request History</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === "history" ? "bg-white/20 text-white" : "bg-white/10 text-[#f4efe5]"
              }`}
            >
              {pastRequests.length}
            </span>
          </button>
        </div>

        {/* TAB 1: CURRENTLY POSTED REQUESTS */}
        {activeTab === "current" && (
          <div className="space-y-6">
            
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#25201a] p-4 rounded-2xl border border-white/10 shadow-md">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
                {["All", "Emergency", "Food", "Animal", "Medical", "Elderly / OKU", "Education", "Clothing", "Others"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-yellow-400 text-[#2c221a] font-bold shadow"
                        : "bg-black/30 text-[#f4efe5]/70 hover:bg-black/50 border border-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#f4efe5]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item, location..."
                  className="w-full bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-[#f4efe5] placeholder-[#f4efe5]/40 focus:outline-none focus:border-yellow-400 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#f4efe5]/40 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Requests Cards Grid */}
            {filteredActiveRequests.length === 0 ? (
              <div className="p-12 text-center bg-[#25201a]/60 rounded-3xl border border-white/10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-3xl">
                  📦
                </div>
                <h3 className="text-xl font-serif text-[#f4efe5]">No Active Requests Found</h3>
                <p className="text-xs text-[#f4efe5]/60 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== "All"
                    ? "Try adjusting your search query or category filters."
                    : "You haven't posted any active requests yet. Create your first request to connect with local donors!"}
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-6 py-2.5 bg-yellow-400 text-[#2c221a] font-bold rounded-full text-xs shadow hover:bg-yellow-300 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Post a New Request</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActiveRequests.map((req) => {
                  const catStyle = CATEGORY_COLORS[req.category] || CATEGORY_COLORS.Others;
                  const progressPct = Math.min(100, Math.round((req.pledgedQuantity / req.quantity) * 100));
                  const reqImgList = getRequestImages(req);
                  const currentImgIdx = (activeCardImageIdx[req.id] ?? 0) % reqImgList.length;
                  const activeImgUrl = reqImgList[currentImgIdx] || req.imageUrl;

                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-[#26201a] rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-yellow-400/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Image & Category Header with Multi-Image Navigation */}
                        <div className="relative h-52 w-full bg-black/40 overflow-hidden select-none">
                          <img
                            src={activeImgUrl}
                            alt={req.title}
                            onClick={() => setLightboxData({ title: req.title, images: reqImgList, activeIdx: currentImgIdx })}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#26201a] via-transparent to-black/40 pointer-events-none" />

                          {/* Top-Left: Category Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[65%] z-10">
                            {getRequestCategories(req).map((catName) => {
                              const badgeStyle = getCategoryBadgeStyle(catName);
                              return (
                                <span
                                  key={catName}
                                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} shadow backdrop-blur-sm truncate max-w-[120px]`}
                                >
                                  {catName}
                                </span>
                              );
                            })}
                            {req.urgencyLevel === "high" && (
                              <span className="bg-rose-500 text-white text-[9px] font-mono px-2 py-0.5 rounded-full font-bold animate-pulse">
                                URGENT
                              </span>
                            )}
                          </div>

                          {/* Top-Right: Photo Count & Lightbox Trigger */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                            {reqImgList.length > 1 && (
                              <div className="bg-black/75 backdrop-blur-md text-yellow-300 border border-yellow-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                                <Images className="w-3 h-3" />
                                <span>{currentImgIdx + 1}/{reqImgList.length}</span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxData({ title: req.title, images: reqImgList, activeIdx: currentImgIdx });
                              }}
                              title="View Full Resolution Photos"
                              className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white border border-white/20 backdrop-blur-sm transition-colors cursor-pointer"
                            >
                              <Maximize2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Interactive Prev/Next Navigation Controls for Multi-Images */}
                          {reqImgList.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => handleCardImageNav(req.id, "prev", reqImgList.length, e)}
                                title="Previous Photo"
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 opacity-80 hover:opacity-100 hover:scale-110 transition-all z-10 cursor-pointer backdrop-blur-sm shadow-lg"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleCardImageNav(req.id, "next", reqImgList.length, e)}
                                title="Next Photo"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 opacity-80 hover:opacity-100 hover:scale-110 transition-all z-10 cursor-pointer backdrop-blur-sm shadow-lg"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Bottom Strip: Dots indicator & Quantity Pill */}
                          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                            {/* Dots indicator */}
                            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10 pointer-events-auto">
                              {reqImgList.map((_, dotIdx) => (
                                <button
                                  key={dotIdx}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCardImageIdx((prev) => ({ ...prev, [req.id]: dotIdx }));
                                  }}
                                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                    dotIdx === currentImgIdx
                                      ? "w-4 bg-yellow-400"
                                      : "w-1.5 bg-white/40 hover:bg-white/70"
                                  }`}
                                  title={`View Photo ${dotIdx + 1}`}
                                />
                              ))}
                            </div>

                            {/* Quantity Pill */}
                            <div className="bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15 text-xs font-mono font-bold text-yellow-400 shadow">
                              {req.quantity} {req.unit} Needed
                            </div>
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-5 space-y-3">
                          <h3 className="font-serif font-bold text-lg text-[#f4efe5] leading-snug line-clamp-2">
                            {req.title}
                          </h3>

                          <p className="text-xs text-[#f4efe5]/75 leading-relaxed line-clamp-3">
                            {req.description}
                          </p>

                          {/* Progress bar */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between items-center text-[11px] font-mono">
                              <span className="text-[#f4efe5]/60">Donor Pledges:</span>
                              <span className="font-bold text-[#82afa6]">
                                {req.pledgedQuantity} / {req.quantity} {req.unit} ({progressPct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-emerald-400 rounded-full transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Meta: Location & Date */}
                          <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] font-mono text-[#f4efe5]/60">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#82afa6] shrink-0" />
                              <span className="truncate">{req.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-yellow-400/80 shrink-0" />
                              <span>Posted: {req.postedDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-4 bg-black/30 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setAssignModalReq(req);
                              setSelectedTargetCampaignId(req.campaignId || "none");
                            }}
                            title="Group into Campaign"
                            className="p-2 rounded-xl bg-white/5 hover:bg-purple-900/40 text-purple-300 border border-purple-500/20 text-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">Campaign</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditRequest(req)}
                            title="Edit Details"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#f4efe5]/70 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            title="Delete Request"
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-900/30 text-rose-300 border border-rose-500/20 text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleMarkFulfilled(req.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Fulfilled</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADD NEW REQUEST FORM */}
        {activeTab === "create" && (
          <div className="max-w-3xl mx-auto bg-[#26201a] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
            
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs mb-1">
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>NEW RECIPIENT SUPPLY LISTING</span>
              </div>
              <h3 className="text-2xl font-serif text-[#f4efe5] font-bold">
                Post What You Need
              </h3>
              <p className="text-xs text-[#f4efe5]/70 mt-1">
                Provide accurate details and photos to help donors quickly match and deliver exactly what is needed.
              </p>
            </div>

            <form onSubmit={handleSubmitNewRequest} className="space-y-6">
              
              {/* 1. MULTI-PHOTO UPLOAD SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-yellow-400 uppercase tracking-wider">
                    1. Upload Picture(s) of Requested Item *
                  </label>
                  {reqImages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-emerald-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{reqImages.length} photo(s) attached</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearAllReqImages}
                        className="text-[10px] font-mono text-rose-300 hover:text-rose-200 underline cursor-pointer"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Zone & Gallery */}
                {reqImages.length === 0 ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all ${
                      isDragOver
                        ? "border-yellow-400 bg-yellow-400/10 scale-[1.01]"
                        : "border-white/20 hover:border-yellow-400/50 bg-black/30"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto text-yellow-400">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm text-[#f4efe5] font-medium">
                          Drag and drop item image(s) here, or{" "}
                          <label className="text-yellow-400 hover:underline font-bold cursor-pointer inline-flex items-center gap-1">
                            browse files
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleMultipleImageFiles(e.target.files);
                                  e.target.value = "";
                                }
                              }}
                            />
                          </label>
                        </p>
                        <p className="text-xs font-mono text-[#f4efe5]/50 mt-1.5">
                          Upload 1 or more photos (PNG, JPG, WEBP). Select multiple files at once.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5">
                    {/* Active Primary Cover Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="relative h-48 md:h-52 w-full rounded-2xl overflow-hidden border-2 border-yellow-400/80 shadow-2xl bg-black/60">
                        <img
                          src={reqImages[primaryImageIndex] || reqImages[0]}
                          alt="Primary Preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-yellow-400 text-[#2c221a] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Primary Cover Photo</span>
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-[#f4efe5] text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/20">
                          Photo #{primaryImageIndex + 1}
                        </div>
                      </div>

                      {/* Photo details & Add More prompt */}
                      <div className="md:col-span-2 space-y-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-serif font-bold text-[#f4efe5]">
                            Manage Uploaded Photos ({reqImages.length})
                          </h4>
                          <p className="text-xs text-[#f4efe5]/70">
                            Click any thumbnail below to preview or set it as the primary cover photo donors see first. You can upload additional photos anytime.
                          </p>
                        </div>

                        {/* Add More Photos Button */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <label className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#f4efe5] border border-white/20 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow">
                            <PlusCircle className="w-4 h-4 text-yellow-400" />
                            <span>Add More Photos</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleMultipleImageFiles(e.target.files);
                                  e.target.value = "";
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnails Gallery Grid */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-mono text-[#f4efe5]/60 uppercase">
                        All Attached Images ({reqImages.length}):
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                        {reqImages.map((imgUrl, imgIdx) => {
                          const isPrimary = imgIdx === primaryImageIndex;
                          return (
                            <div
                              key={imgIdx}
                              onClick={() => setPrimaryImageIndex(imgIdx)}
                              className={`group relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                isPrimary
                                  ? "border-yellow-400 ring-2 ring-yellow-400/50 scale-105 shadow-lg"
                                  : "border-white/15 hover:border-white/50 opacity-85 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Item ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              
                              {/* Index badge */}
                              <span className="absolute top-1 left-1 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                                #{imgIdx + 1}
                              </span>

                              {/* Star indicator for primary */}
                              {isPrimary && (
                                <span className="absolute top-1 right-1 bg-yellow-400 text-black p-0.5 rounded-full shadow">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                </span>
                              )}

                              {/* Hover actions */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                                {!isPrimary && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSetPrimaryImage(imgIdx);
                                    }}
                                    title="Set as Cover"
                                    className="p-1 rounded-full bg-yellow-400 text-black hover:scale-110 transition-transform"
                                  >
                                    <Star className="w-3 h-3 fill-current" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveReqImage(imgIdx);
                                  }}
                                  title="Delete this image"
                                  className="p-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white hover:scale-110 transition-transform"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Preset Samples to append or use */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-[#f4efe5]/50 block mb-1.5">
                    Or quickly select standard aid supply templates:
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {SAMPLE_PRESET_IMAGES.map((preset, idx) => {
                      const isAlreadyAdded = reqImages.includes(preset.url);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!reqImages.includes(preset.url)) {
                              setReqImages((prev) => [...prev, preset.url]);
                              showToast(`Added "${preset.label}" image.`);
                            }
                            if (!reqTitle) setReqTitle(preset.label);
                            if (!reqCategories.includes(preset.category)) {
                              setReqCategories((prev) => Array.from(new Set([...prev, preset.category])));
                            }
                          }}
                          className={`group relative h-14 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                            isAlreadyAdded
                              ? "border-emerald-400 ring-2 ring-emerald-400/50 scale-105"
                              : "border-white/10 hover:border-white/40 opacity-70 hover:opacity-100"
                          }`}
                          title={`Add ${preset.label}`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-[#f4efe5] p-0.5 truncate text-center">
                            {preset.label.split(" ")[0]}
                          </span>
                          {isAlreadyAdded && (
                            <span className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. TITLE & CATEGORY LABEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title (Name of item) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-mono text-yellow-400 uppercase tracking-wider">
                    2. Title of Request (Item Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    placeholder="e.g. Enfamil Baby Formula Step 1 (850g) / Adult Diapers XL"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-[#f4efe5] placeholder-[#f4efe5]/40 focus:outline-none focus:border-yellow-400 transition-colors"
                  />
                </div>

                {/* Category Label (Multiple Selection & Custom Labels) */}
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-yellow-400 uppercase tracking-wider">
                      3. Label / Category of Request (Multiple Selectable) *
                    </label>
                    <span className="text-[10px] font-mono text-[#f4efe5]/60">
                      {reqCategories.length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STANDARD_CATEGORIES.map((cat) => {
                      const isSelected = reqCategories.includes(cat);
                      const style = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Others;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (reqCategories.length > 1) {
                                setReqCategories(reqCategories.filter((c) => c !== cat));
                              } else {
                                setReqCategories([]);
                              }
                            } else {
                              setReqCategories([...reqCategories, cat]);
                            }
                          }}
                          className={`p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? `${style.bg} ${style.text} ${style.border} ring-2 ring-yellow-400/50 shadow-md`
                              : "bg-black/30 border-white/10 text-[#f4efe5]/60 hover:bg-black/50 hover:text-white"
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-yellow-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom label input if "Others" is selected */}
                  <AnimatePresence>
                    {reqCategories.includes("Others") && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        className="overflow-hidden pt-1"
                      >
                        <div className="bg-stone-900/80 border border-amber-400/40 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5" />
                              <span>Specify Custom Label(s) / Tag(s) *</span>
                            </label>
                            <span className="text-[10px] font-mono text-[#f4efe5]/50">
                              Separate with commas if multiple
                            </span>
                          </div>
                          <input
                            type="text"
                            value={reqCustomCategory}
                            onChange={(e) => setReqCustomCategory(e.target.value)}
                            placeholder="e.g. Baby Formula, Clean Water Filters, Solar Battery, Hygiene Kits"
                            className="w-full bg-black/60 border border-white/20 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] placeholder-[#f4efe5]/40 focus:outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 3. QUANTITY & UNIT */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-mono text-yellow-400 uppercase tracking-wider">
                    4. Quantity Needed *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      required
                      value={reqQuantity}
                      onChange={(e) => setReqQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-32 bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#f4efe5] focus:outline-none focus:border-yellow-400"
                    />
                    <select
                      value={reqUnit}
                      onChange={(e) => setReqUnit(e.target.value)}
                      className="bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#f4efe5] focus:outline-none focus:border-yellow-400 cursor-pointer"
                    >
                      <option value="packs">packs</option>
                      <option value="units">units / items</option>
                      <option value="boxes">boxes</option>
                      <option value="tins">tins / cans</option>
                      <option value="bags (10kg)">bags (10kg)</option>
                      <option value="sets">sets</option>
                      <option value="bottles">bottles</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-yellow-400 uppercase tracking-wider">
                    Urgency Level
                  </label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#f4efe5] focus:outline-none focus:border-yellow-400 cursor-pointer"
                  >
                    <option value="standard">Standard Aid</option>
                    <option value="medium">Important</option>
                    <option value="high">🚨 Critical Emergency</option>
                  </select>
                </div>
              </div>

              {/* 4. DESCRIPTION */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-yellow-400 uppercase tracking-wider">
                  5. Description of Item Needed *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Provide essential details: target family context, specific brand or specifications, dietary restrictions, condition required..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl p-4 text-xs text-[#f4efe5] placeholder-[#f4efe5]/40 focus:outline-none focus:border-yellow-400 leading-relaxed"
                />
              </div>

              {/* 5. POSTED DATE & TIME and LOCATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Posted Date & Time */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-yellow-400 uppercase tracking-wider">
                    6. Posted Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={reqPostedDateTime}
                      onChange={(e) => setReqPostedDateTime(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#f4efe5] font-mono focus:outline-none focus:border-yellow-400"
                    />
                    <Calendar className="w-4 h-4 text-[#82afa6] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] font-mono text-[#f4efe5]/40">
                    Auto-generated timestamp
                  </span>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-mono text-yellow-400 uppercase tracking-wider">
                      7. Dropoff / Pickup Location *
                    </label>
                    {user?.location && (
                      <button
                        type="button"
                        onClick={() => {
                          const { address, postcode, state, country } = user.location;
                          const formatted = [address, postcode, state, country].filter(Boolean).join(", ");
                          if (formatted) setReqLocation(formatted);
                        }}
                        className="text-[10px] font-mono text-[#82afa6] hover:underline"
                      >
                        Use profile location
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={reqLocation}
                      onChange={(e) => setReqLocation(e.target.value)}
                      placeholder="e.g. Kampar Relief Center, Perak"
                      className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#f4efe5] focus:outline-none focus:border-yellow-400"
                    />
                    <MapPin className="w-4 h-4 text-[#82afa6] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* 6. OPTIONAL: CAMPAIGN ASSIGNMENT */}
              {campaigns.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <label className="block text-xs font-mono text-[#82afa6] uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Optional: Collect into Existing Campaign</span>
                  </label>
                  <select
                    value={reqSelectedCampaignId}
                    onChange={(e) => setReqSelectedCampaignId(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6] cursor-pointer"
                  >
                    <option value="">No Campaign (Individual Request)</option>
                    {campaigns.map((camp) => (
                      <option key={camp.id} value={camp.id}>
                        {camp.bannerEmoji || "📦"} {camp.title} ({camp.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab("current")}
                  className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#f4efe5] text-xs font-mono transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-[#2c221a] font-bold text-sm rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Publish Request Now</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: COLLECT AS CAMPAIGN */}
        {activeTab === "campaigns" && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#25201a] p-6 rounded-3xl border border-white/10">
              <div>
                <h3 className="text-xl font-serif text-[#f4efe5] font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span>Collected Request Campaigns</span>
                </h3>
                <p className="text-xs text-[#f4efe5]/70 mt-1">
                  Bundle related supply requests into cohesive community drives to simplify donor outreach.
                </p>
              </div>

              <button
                onClick={handleOpenCreateCampaign}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-full shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Create New Campaign</span>
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-12 text-center bg-[#25201a]/60 rounded-3xl border border-white/10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-3xl">
                  📁
                </div>
                <h4 className="text-lg font-serif text-[#f4efe5]">No Active Campaigns</h4>
                <p className="text-xs text-[#f4efe5]/60 max-w-sm mx-auto">
                  Group your posted item requests into an organized drive such as Flood Relief or Back to School.
                </p>
                <button
                  onClick={handleOpenCreateCampaign}
                  className="px-6 py-2 bg-purple-600 text-white text-xs font-bold rounded-full shadow cursor-pointer"
                >
                  Create Campaign
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {campaigns.map((camp) => {
                  const associatedRequests = requests.filter((r) => camp.requestIds.includes(r.id));
                  const totalNeeded = associatedRequests.reduce((acc, curr) => acc + curr.quantity, 0);
                  const totalPledged = associatedRequests.reduce((acc, curr) => acc + curr.pledgedQuantity, 0);
                  const overallPct = totalNeeded > 0 ? Math.min(100, Math.round((totalPledged / totalNeeded) * 100)) : 0;

                  return (
                    <motion.div
                      key={camp.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#26201a] rounded-3xl border border-purple-500/20 p-6 shadow-xl flex flex-col justify-between space-y-4"
                    >
                      <div>
                        {/* Campaign Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-2xl">
                              {camp.bannerEmoji || "📦"}
                            </div>
                            <div>
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                                {camp.category}
                              </span>
                              <h4 className="text-lg font-serif font-bold text-[#f4efe5] mt-1">
                                {camp.title}
                              </h4>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono text-[#f4efe5]/50">
                            Deadline: {camp.targetDate || "Ongoing"}
                          </span>
                        </div>

                        <p className="text-xs text-[#f4efe5]/75 mt-3 leading-relaxed">
                          {camp.description}
                        </p>

                        {/* Aggregate Progress */}
                        <div className="bg-black/35 p-3.5 rounded-2xl border border-white/5 my-4 space-y-2">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-[#f4efe5]/60">Collected Goal Progress:</span>
                            <span className="font-bold text-yellow-400">
                              {totalPledged} / {totalNeeded} Items ({overallPct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-yellow-400 rounded-full"
                              style={{ width: `${overallPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Bundled Requests Sub-List */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono text-[#f4efe5]/50 uppercase tracking-wider block">
                            Bundled Supply Needs ({associatedRequests.length}):
                          </span>

                          {associatedRequests.length === 0 ? (
                            <p className="text-xs text-[#f4efe5]/40 italic p-3 bg-black/20 rounded-xl">
                              No requests currently assigned. Click below to add items.
                            </p>
                          ) : (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {associatedRequests.map((req) => (
                                <div
                                  key={req.id}
                                  className="flex items-center justify-between p-2.5 bg-black/25 rounded-xl border border-white/5 text-xs"
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <img
                                      src={req.imageUrl}
                                      alt={req.title}
                                      className="w-7 h-7 rounded-lg object-cover shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <span className="font-medium text-[#f4efe5] truncate">{req.title}</span>
                                  </div>
                                  <span className="text-[11px] font-mono text-yellow-400 shrink-0 ml-2">
                                    {req.quantity} {req.unit}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#f4efe5]/40">
                          Created: {camp.createdAt}
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleRequestDisbandCampaign(camp)}
                            title="Disband Campaign"
                            className="text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">Disband</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditCampaign(camp)}
                            className="text-xs font-mono text-purple-300 hover:text-purple-200 underline cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Manage Items</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PAST REQUEST HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="bg-[#25201a] p-6 rounded-3xl border border-white/10">
              <h3 className="text-xl font-serif text-[#f4efe5] font-bold flex items-center gap-2">
                <FolderCheck className="w-5 h-5 text-emerald-400" />
                <span>Fulfilled & Past Request Archive</span>
              </h3>
              <p className="text-xs text-[#f4efe5]/70 mt-1">
                Records of previously completed and fulfilled requests. You can quickly duplicate or re-open requests if needed again.
              </p>
            </div>

            {pastRequests.length === 0 ? (
              <div className="p-12 text-center bg-[#25201a]/60 rounded-3xl border border-white/10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-3xl">
                  📜
                </div>
                <h4 className="text-lg font-serif text-[#f4efe5]">No Past History Yet</h4>
                <p className="text-xs text-[#f4efe5]/60 max-w-sm mx-auto">
                  When active requests are matched and fulfilled by donors, their records and distribution receipts will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pastRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 sm:p-5 rounded-2xl bg-[#26201a] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                        <img
                          src={req.imageUrl}
                          alt={req.title}
                          className="w-full h-full object-cover grayscale"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            ✓ Fulfilled
                          </span>
                          <span className="text-[10px] font-mono text-[#f4efe5]/50">
                            Completed: {req.fulfilledDate || "Recently"}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#f4efe5]">
                          {req.title}
                        </h4>
                        <p className="text-xs text-[#f4efe5]/60 line-clamp-1">
                          {req.quantity} {req.unit} delivered to {req.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => handleReopenRequest(req)}
                        className="px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400 text-yellow-300 hover:text-[#2c221a] rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 border border-yellow-400/30 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-post Request</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* CREATE / EDIT CAMPAIGN MODAL */}
      <AnimatePresence>
        {isNewCampaignModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsNewCampaignModalOpen(false);
                setEditingCampaignId(null);
              }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#2a231d] rounded-3xl border border-purple-500/30 p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-left"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-purple-300">
                  {editingCampaignId ? <Edit3 className="w-5 h-5" /> : <FolderPlus className="w-5 h-5" />}
                  <div>
                    <h3 className="text-xl font-serif text-[#f4efe5] font-bold">
                      {editingCampaignId ? "Manage Campaign & Items" : "Bundle Requests into Campaign"}
                    </h3>
                    <p className="text-[11px] font-mono text-[#f4efe5]/60">
                      {editingCampaignId
                        ? "Update campaign details and adjust bundled supply requests."
                        : "Create a new collective initiative and select active requests to group."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsNewCampaignModalOpen(false);
                    setEditingCampaignId(null);
                  }}
                  className="p-1 rounded-full text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCampaign} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-[10px] font-mono text-purple-300 uppercase">Campaign Title *</label>
                    <input
                      type="text"
                      required
                      value={campTitle}
                      onChange={(e) => setCampTitle(e.target.value)}
                      placeholder="e.g. Kampar Flood Relief Drive 2026"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-purple-300 uppercase">Emoji Icon</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={campEmoji}
                      onChange={(e) => setCampEmoji(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-center text-base text-[#f4efe5] focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-purple-300 uppercase">Category Tag</label>
                    <input
                      type="text"
                      value={campCategory}
                      onChange={(e) => setCampCategory(e.target.value)}
                      placeholder="e.g. Emergency Relief / Food Security"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-purple-300 uppercase">Target Deadline</label>
                    <input
                      type="text"
                      value={campTargetDate}
                      onChange={(e) => setCampTargetDate(e.target.value)}
                      placeholder="e.g. 30 Aug 2026"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-purple-300 uppercase">Campaign Story / Goals</label>
                  <textarea
                    rows={2}
                    value={campDesc}
                    onChange={(e) => setCampDesc(e.target.value)}
                    placeholder="Briefly describe what this collective initiative aims to achieve..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-[#f4efe5] focus:outline-none focus:border-purple-400"
                  />
                </div>

                {/* Multi-select active requests */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono text-purple-300 uppercase block">
                    Select Active Requests to Include in this Campaign ({campSelectedReqIds.length} selected):
                  </label>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {activeRequests.length === 0 ? (
                      <p className="text-xs text-[#f4efe5]/40 italic p-3 bg-black/30 rounded-xl">
                        No active requests available to bundle.
                      </p>
                    ) : (
                      activeRequests.map((req) => {
                        const isChecked = campSelectedReqIds.includes(req.id);
                        return (
                          <label
                            key={req.id}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isChecked
                                ? "bg-purple-950/40 border-purple-500/50 text-[#f4efe5]"
                                : "bg-black/30 border-white/10 text-[#f4efe5]/70 hover:bg-black/50"
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setCampSelectedReqIds(campSelectedReqIds.filter((id) => id !== req.id));
                                  } else {
                                    setCampSelectedReqIds([...campSelectedReqIds, req.id]);
                                  }
                                }}
                                className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                              />
                              <img
                                src={req.imageUrl}
                                alt={req.title}
                                className="w-7 h-7 rounded-lg object-cover shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="truncate">
                                <span className="text-xs font-medium block truncate">{req.title}</span>
                                <span className="text-[9px] font-mono text-purple-300">{req.category}</span>
                              </div>
                            </div>
                            <span className="text-xs font-mono text-yellow-400 shrink-0 ml-2">
                              {req.quantity} {req.unit}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewCampaignModalOpen(false);
                      setEditingCampaignId(null);
                    }}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-full shadow cursor-pointer"
                  >
                    {editingCampaignId ? "Save & Update Campaign" : "Save & Create Campaign"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGN SINGLE REQUEST TO CAMPAIGN MODAL */}
      <AnimatePresence>
        {assignModalReq && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssignModalReq(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#2a231d] rounded-3xl border border-purple-500/30 p-6 shadow-2xl z-10 space-y-4 text-left"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#f4efe5]">
                  Assign to Campaign
                </h3>
                <button onClick={() => setAssignModalReq(null)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#f4efe5]/80">
                Select which campaign to group <strong className="text-yellow-400">"{assignModalReq.title}"</strong> under:
              </p>

              <div className="space-y-2">
                <label
                  onClick={() => setSelectedTargetCampaignId("none")}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTargetCampaignId === "none"
                      ? "bg-purple-950/40 border-purple-500 text-purple-200"
                      : "bg-black/30 border-white/10 text-[#f4efe5]/60 hover:bg-black/50"
                  }`}
                >
                  <span className="text-xs font-mono">No Campaign (Individual Request)</span>
                  {selectedTargetCampaignId === "none" && <Check className="w-4 h-4 text-purple-400" />}
                </label>

                {campaigns.map((c) => {
                  const isSelected = selectedTargetCampaignId === c.id;
                  return (
                    <label
                      key={c.id}
                      onClick={() => setSelectedTargetCampaignId(c.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-950/40 border-purple-500 text-purple-200"
                          : "bg-black/30 border-white/10 text-[#f4efe5]/70 hover:bg-black/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{c.bannerEmoji || "📦"}</span>
                        <span className="text-xs font-bold truncate">{c.title}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAssignModalReq(null)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignToCampaign}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-full shadow cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT REQUEST DETAILS MODAL */}
      <AnimatePresence>
        {editingRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingRequest(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#2a231d] rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl z-10 space-y-4 text-left"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#f4efe5]">
                  Edit Request Details
                </h3>
                <button onClick={() => setEditingRequest(null)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditRequest} className="space-y-3.5 text-xs max-h-[75vh] overflow-y-auto pr-1">
                <div>
                  <label className="font-mono text-[#f4efe5]/60 uppercase text-[10px]">Item Title *</label>
                  <input
                    type="text"
                    required
                    value={editingRequest.title}
                    onChange={(e) => setEditingRequest({ ...editingRequest, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] mt-1 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Multi-category tags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-yellow-400 uppercase text-[10px] tracking-wider">
                      Categories / Labels (Multiple Selectable) *
                    </label>
                    <span className="text-[10px] font-mono text-[#f4efe5]/50">
                      {editReqCategories.length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {STANDARD_CATEGORIES.map((cat) => {
                      const isSelected = editReqCategories.includes(cat);
                      const style = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Others;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (editReqCategories.length > 1) {
                                setEditReqCategories(editReqCategories.filter((c) => c !== cat));
                              } else {
                                setEditReqCategories([]);
                              }
                            } else {
                              setEditReqCategories([...editReqCategories, cat]);
                            }
                          }}
                          className={`p-2 rounded-lg border text-[11px] font-mono font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? `${style.bg} ${style.text} ${style.border} ring-1 ring-yellow-400/50 shadow`
                              : "bg-black/30 border-white/10 text-[#f4efe5]/60 hover:bg-black/50 hover:text-white"
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check className="w-3 h-3 text-yellow-400 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom tag input for Edit Modal */}
                  <AnimatePresence>
                    {editReqCategories.includes("Others") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-1"
                      >
                        <div className="bg-stone-900/90 border border-amber-400/40 rounded-xl p-3 space-y-1.5">
                          <label className="text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
                            <Tag className="w-3 h-3" />
                            <span>Custom Label(s) (comma-separated)</span>
                          </label>
                          <input
                            type="text"
                            value={editReqCustomCategory}
                            onChange={(e) => setEditReqCustomCategory(e.target.value)}
                            placeholder="e.g. Baby Formula, Clean Water Filters, Diapers"
                            className="w-full bg-black/60 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-[#f4efe5] placeholder-[#f4efe5]/40 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* MULTI-IMAGE MANAGEMENT IN EDIT MODAL */}
                <div className="space-y-2.5 pt-1 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-yellow-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5" />
                      <span>Item Photos ({editReqImages.length})</span>
                    </label>
                    <label className="text-[10px] font-mono text-yellow-300 hover:underline cursor-pointer flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      <span>Add Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleEditMultipleImageFiles(e.target.files);
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                  </div>

                  {editReqImages.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {editReqImages.map((imgUrl, idx) => {
                          const isPrimary = idx === editPrimaryImageIndex;
                          return (
                            <div
                              key={idx}
                              onClick={() => setEditPrimaryImageIndex(idx)}
                              className={`group relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                isPrimary
                                  ? "border-yellow-400 ring-2 ring-yellow-400/40 scale-105 shadow"
                                  : "border-white/10 hover:border-white/40 opacity-80 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Edit Photo ${idx + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <span className="absolute top-0.5 left-0.5 bg-black/80 text-[8px] font-mono text-white px-1 rounded">
                                #{idx + 1}
                              </span>
                              {isPrimary && (
                                <span className="absolute top-0.5 right-0.5 bg-yellow-400 text-black p-0.5 rounded-full">
                                  <Star className="w-2 h-2 fill-current" />
                                </span>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {!isPrimary && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditPrimaryImageIndex(idx);
                                    }}
                                    title="Set Cover"
                                    className="p-1 rounded-full bg-yellow-400 text-black"
                                  >
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveEditImage(idx);
                                  }}
                                  title="Remove"
                                  className="p-1 rounded-full bg-rose-600 text-white"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[10px] font-mono text-[#f4efe5]/50">
                        Click a thumbnail to set as primary cover photo, or upload additional photos.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 text-center border border-dashed border-white/20 rounded-xl bg-black/20">
                      <p className="text-[11px] text-[#f4efe5]/60">No photos attached to this request.</p>
                      <label className="text-xs text-yellow-400 font-bold hover:underline cursor-pointer inline-block mt-1">
                        + Browse and attach photos
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleEditMultipleImageFiles(e.target.files);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {/* Presets in Edit Modal */}
                  <div className="pt-1">
                    <span className="text-[9px] font-mono text-[#f4efe5]/40 block mb-1">
                      Quick Add Common Aid Images:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {SAMPLE_PRESET_IMAGES.slice(0, 4).map((p, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            if (!editReqImages.includes(p.url)) {
                              setEditReqImages((prev) => [...prev, p.url]);
                            }
                          }}
                          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-[10px] font-mono text-[#f4efe5]/70 border border-white/10 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5 text-yellow-400" />
                          <span>{p.label.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[#f4efe5]/60 uppercase text-[10px]">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editingRequest.quantity}
                      onChange={(e) => setEditingRequest({ ...editingRequest, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[#f4efe5]/60 uppercase text-[10px]">Unit</label>
                    <input
                      type="text"
                      value={editingRequest.unit}
                      onChange={(e) => setEditingRequest({ ...editingRequest, unit: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[#f4efe5]/60 uppercase text-[10px]">Location</label>
                  <input
                    type="text"
                    value={editingRequest.location}
                    onChange={(e) => setEditingRequest({ ...editingRequest, location: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] mt-1"
                  />
                </div>

                <div>
                  <label className="font-mono text-[#f4efe5]/60 uppercase text-[10px]">Description</label>
                  <textarea
                    rows={3}
                    value={editingRequest.description}
                    onChange={(e) => setEditingRequest({ ...editingRequest, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-[#f4efe5] mt-1"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingRequest(null)}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-[#2c221a] font-bold text-xs rounded-full shadow cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DISBAND CAMPAIGN CONFIRMATION MODAL */}
      <AnimatePresence>
        {disbandCampaignTarget && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDisbandCampaignTarget(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#28211b] rounded-3xl border border-rose-500/40 p-6 sm:p-7 shadow-2xl z-10 space-y-5 text-left"
            >
              <div className="flex items-center gap-3 text-rose-400 border-b border-white/10 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#f4efe5]">
                    Disband Campaign?
                  </h3>
                  <p className="text-[11px] font-mono text-[#f4efe5]/60">
                    Safe un-grouping of active items
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#f4efe5]/80">
                <p>
                  Are you sure you want to disband <strong className="text-yellow-400">"{disbandCampaignTarget.title}"</strong>?
                </p>
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Your individual supply requests will NOT be deleted.</span>
                  </div>
                  <p className="text-[#f4efe5]/60">
                    All {disbandCampaignTarget.requestIds.length} bundled requests will simply be unlinked and remain active in your Currently Posted Requests tab.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDisbandCampaignTarget(null)}
                  className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-[#f4efe5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDisbandCampaign}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Disband Campaign</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN PHOTO LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxData && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxData(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#1a1512] rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
                <div className="flex items-center gap-2 truncate max-w-[80%]">
                  <Images className="w-5 h-5 text-yellow-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-serif font-bold text-[#f4efe5] truncate">
                      {lightboxData.title}
                    </h4>
                    <p className="text-[10px] font-mono text-yellow-400/80">
                      Photo {lightboxData.activeIdx + 1} of {lightboxData.images.length}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxData(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Image Stage */}
              <div className="relative flex-1 min-h-[300px] sm:min-h-[440px] my-3 rounded-2xl overflow-hidden bg-black/80 flex items-center justify-center">
                <img
                  src={lightboxData.images[lightboxData.activeIdx]}
                  alt={`${lightboxData.title} - ${lightboxData.activeIdx + 1}`}
                  className="max-h-[60vh] max-w-full object-contain mx-auto shadow-2xl"
                  referrerPolicy="no-referrer"
                />

                {/* Prev / Next controls */}
                {lightboxData.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxData((prev) => {
                          if (!prev) return null;
                          const nextIdx = (prev.activeIdx - 1 + prev.images.length) % prev.images.length;
                          return { ...prev, activeIdx: nextIdx };
                        });
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxData((prev) => {
                          if (!prev) return null;
                          const nextIdx = (prev.activeIdx + 1) % prev.images.length;
                          return { ...prev, activeIdx: nextIdx };
                        });
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Thumbnails Strip */}
              {lightboxData.images.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 border-t border-white/10 pt-3">
                  {lightboxData.images.map((imgUrl, thumbIdx) => {
                    const isCurrent = thumbIdx === lightboxData.activeIdx;
                    return (
                      <button
                        key={thumbIdx}
                        type="button"
                        onClick={() => setLightboxData((prev) => prev ? { ...prev, activeIdx: thumbIdx } : null)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          isCurrent
                            ? "border-yellow-400 ring-2 ring-yellow-400/50 scale-105"
                            : "border-white/20 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${thumbIdx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-white">
                          #{thumbIdx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
