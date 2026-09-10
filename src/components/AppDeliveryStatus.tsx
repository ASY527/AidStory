import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  User,
  Search,
  Filter,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calendar,
  Phone,
  Copy,
  Check,
  Edit3,
  FileText,
  AlertCircle,
  Heart,
  QrCode,
  Share2,
  RefreshCw,
  SlidersHorizontal,
  X,
  Plus,
  Send,
  ShieldCheck,
  Boxes,
  Lock,
  UserCheck
} from "lucide-react";
import {
  DeliveryPackageItem,
  DeliveryProgressStage,
  DeliveryMethodType,
  DeliveryTimelineEvent,
  formatCapitalizedTitle,
  RecipientRequest
} from "../types";
import { DEFAULT_NEEDS_REQUESTS } from "./AppNeeds";
import { normalizeIdentity } from "../lib/receiverProfileHelper";
import { getDeliveryProgress } from "../lib/deliveryProgress";
import {
  subscribeToAllDeliveryPackages,
  saveDeliveryPackageToCloud,
  updateRequestInCloud
} from "../lib/cloudService";
import { SEED_DELIVERY_PACKAGES, SEED_COMMUNITY_REQUESTS } from "../data/seedDatabase";

interface AppDeliveryStatusProps {
  navigateToView: (
    view:
      | "home"
      | "comments"
      | "explore"
      | "main_menu"
      | "your_request"
      | "needs"
      | "preparing_donate_box"
      | "delivery_status"
  ) => void;
}

// Initial realistic default deliveries if user opens the page for the first time
const INITIAL_DEFAULT_DONATE_DELIVERIES: DeliveryPackageItem[] = [
  {
    id: "del_donate_1",
    trackingId: "AID-MY-948201",
    type: "donate",
    requestId: "need_saka_1",
    itemTitle: "Wear Saka Long Pants & Warm Clothing",
    category: "Clothing",
    quantity: 2,
    unit: "pairs",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80",
    brand: "Wear Saka",
    color: "Khaki / Cream",
    donorName: "You (Donor)",
    donorEmail: "donor@aidstory.org",
    donorPhone: "+60 12-345 6789",
    donorNote: "Packed with clean waterproof plastic. Sending warmth to the community!",
    receiverName: "Perak Community Relief Center (NGO)",
    receiverLocation: "Ipoh Relief Center, Perak",
    receiverHub: "Ipoh Central Relief Hub",
    receiverPhone: "+60 5-241 8899",
    deliveryMethod: "courier",
    courierProvider: "J&T Cargo Express",
    trackingNumber: "JT6019948201MY",
    scheduledDate: "2026-08-22",
    scheduledTimeSlot: "10:00 - 13:00 (Morning Slot)",
    estimatedDeliveryDate: "2026-08-24",
    currentStage: "prepared_for_pickup",
    stageProgressPercent: 40,
    lastUpdated: "Today, 08:30 AM",
    timeline: [
      {
        id: "evt_1",
        stage: "pledged",
        title: "Donation Pledged & Box Sealed",
        description: "Items added from Donate Box and confirmed for courier dispatch.",
        timestamp: "22 Aug 2026, 08:15 AM",
        updatedBy: "Donor"
      },
      {
        id: "evt_2",
        stage: "prepared_for_pickup",
        title: "Prepared to Pickup by Courier",
        description: "Box labeled with waybill JT6019948201MY. Ready at doorstep/front desk.",
        timestamp: "22 Aug 2026, 08:30 AM",
        updatedBy: "Donor",
        trackingNumber: "JT6019948201MY",
        courierName: "J&T Cargo Express"
      }
    ]
  },
  {
    id: "del_donate_2",
    trackingId: "AID-MY-773190",
    type: "donate",
    requestId: "need_casio_1",
    itemTitle: "Casio Original F94WA 8D Emergency Watch",
    category: "Household",
    quantity: 1,
    unit: "units",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
    brand: "Casio",
    color: "Black",
    donorName: "You (Donor)",
    donorNote: "New battery installed, fully water resistant for emergency flood volunteers.",
    receiverName: "Sibu Hope Volunteer Society (Charity)",
    receiverLocation: "Sibu Volunteer Outpost, Sabah",
    receiverHub: "Sibu Volunteer Relief Outpost",
    receiverPhone: "+60 84-332 100",
    deliveryMethod: "dropoff",
    dropoffHubName: "Ipoh Central Relief Hub (Perak)",
    dropoffHubAddress: "Lot 44, Jalan Raja Musa Aziz, 30000 Ipoh, Perak",
    scheduledDate: "2026-08-22",
    scheduledTimeSlot: "14:00 - 16:30 (Afternoon)",
    estimatedDeliveryDate: "2026-08-22 (Same-day verification)",
    currentStage: "prepared_for_dropoff",
    stageProgressPercent: 50,
    lastUpdated: "Today, 09:10 AM",
    timeline: [
      {
        id: "evt_d1",
        stage: "pledged",
        title: "Pledge Registered for Drop-off",
        description: "Donor scheduled drop-off at Ipoh Central Relief Hub.",
        timestamp: "22 Aug 2026, 09:00 AM",
        updatedBy: "Donor"
      },
      {
        id: "evt_d2",
        stage: "prepared_for_dropoff",
        title: "Prepared to Drop-off at Hub",
        description: "Package organized with barcode slip, ready for drive-through drop-off.",
        timestamp: "22 Aug 2026, 09:10 AM",
        updatedBy: "Donor"
      }
    ]
  },
  {
    id: "del_donate_3",
    trackingId: "AID-MY-621004",
    type: "donate",
    requestId: "need_rice_1",
    itemTitle: "10kg AAA Fragrant White Rice & Cooking Oil",
    category: "Food",
    quantity: 3,
    unit: "bags",
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    brand: "AAA Jasmine",
    donorName: "You (Donor)",
    receiverName: "Selangor Food Aid Network (NGO)",
    receiverLocation: "Shah Alam, Selangor",
    receiverHub: "Eastside Community Aid Locker",
    deliveryMethod: "courier",
    courierProvider: "PosLaju Express",
    trackingNumber: "ER994812301MY",
    scheduledDate: "2026-08-20",
    estimatedDeliveryDate: "2026-08-22",
    currentStage: "delivered_to_charity",
    stageProgressPercent: 100,
    lastUpdated: "21 Aug 2026, 04:45 PM",
    timeline: [
      {
        id: "evt_r1",
        stage: "pledged",
        title: "Donation Pledged",
        description: "Food supplies bundle pledged.",
        timestamp: "20 Aug 2026, 10:00 AM"
      },
      {
        id: "evt_r2",
        stage: "courier_picked_up",
        title: "Courier Already Pickup",
        description: "PosLaju driver collected parcel at dispatch point.",
        timestamp: "20 Aug 2026, 02:30 PM",
        trackingNumber: "ER994812301MY"
      },
      {
        id: "evt_r3",
        stage: "arrived_at_hub",
        title: "Arrived at Regional Hub",
        description: "Processed through Shah Alam Central Distribution Center.",
        timestamp: "21 Aug 2026, 09:15 AM"
      },
      {
        id: "evt_r4",
        stage: "delivered_to_charity",
        title: "Successfully Drop-off & Delivered to Charity",
        description: "Delivered to Selangor Food Aid Network kitchen. Verified by Officer Ahmad.",
        timestamp: "21 Aug 2026, 04:45 PM"
      }
    ]
  }
];

// Initial realistic default incoming deliveries for receivers/NGOs
const INITIAL_DEFAULT_RECEIVE_DELIVERIES: DeliveryPackageItem[] = [
  {
    id: "del_recv_1",
    trackingId: "AID-RCV-381902",
    type: "receive",
    requestId: "req_shelter_1",
    itemTitle: "Baby Diapers (Size M/L) & Gentle Wipes",
    category: "Baby & Children",
    quantity: 50,
    unit: "packs",
    imageUrl:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80",
    donorName: "Sarah Tan & Friends (Subscribed Donor)",
    donorPhone: "+60 16-892 1102",
    donorNote: "Donated 50 packs for infant care relief. Stay strong!",
    receiverName: "Bangsar Infant Care Relief (Charity)",
    receiverLocation: "Bangsar, Kuala Lumpur",
    receiverHub: "Downtown Hope Distribution Depot",
    deliveryMethod: "courier",
    courierProvider: "NinjaVan Logistics",
    trackingNumber: "NVNMY882910401",
    scheduledDate: "2026-08-21",
    estimatedDeliveryDate: "Today, 02:00 PM - 05:00 PM",
    currentStage: "in_transit",
    stageProgressPercent: 75,
    lastUpdated: "Today, 10:15 AM",
    timeline: [
      {
        id: "evt_rc1",
        stage: "prepared_for_pickup",
        title: "Donor Prepared Parcel",
        description: "Donor bundled 50 diaper packs into 2 master cartons.",
        timestamp: "21 Aug 2026, 11:00 AM"
      },
      {
        id: "evt_rc2",
        stage: "courier_picked_up",
        title: "Courier Picked Up (In Transit)",
        description: "NinjaVan courier picked up and dispatched to KL sorting hub.",
        timestamp: "21 Aug 2026, 04:20 PM"
      },
      {
        id: "evt_rc3",
        stage: "in_transit",
        title: "Out for Final Delivery to Shelter",
        description: "Driver en route to Bangsar Infant Care Relief Center.",
        timestamp: "Today, 10:15 AM"
      }
    ]
  },
  {
    id: "del_recv_2",
    trackingId: "AID-RCV-550192",
    type: "receive",
    requestId: "req_blankets_1",
    itemTitle: "Monsoon Emergency Fleece Blankets & Towels",
    category: "Household",
    quantity: 30,
    unit: "sets",
    imageUrl:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80",
    donorName: "Lucas Fernandez (Volunteer Driver)",
    donorNote: "Self drop-off directly to Perak Relief Center.",
    receiverName: "Perak Community Relief Center (NGO)",
    receiverLocation: "Ipoh Relief Center, Perak",
    receiverHub: "Ipoh Central Relief Hub",
    deliveryMethod: "dropoff",
    dropoffHubName: "Ipoh Central Relief Hub (Perak)",
    scheduledDate: "2026-08-22",
    estimatedDeliveryDate: "Today, 03:00 PM",
    currentStage: "prepared_for_dropoff",
    stageProgressPercent: 50,
    lastUpdated: "Today, 09:40 AM",
    timeline: [
      {
        id: "evt_rc_b1",
        stage: "pledged",
        title: "Donation Confirmed by Volunteer",
        description: "Lucas Fernandez pledged 30 blanket sets.",
        timestamp: "22 Aug 2026, 09:00 AM"
      },
      {
        id: "evt_rc_b2",
        stage: "prepared_for_dropoff",
        title: "Donor Prepared to Drop-off at Perak Hub",
        description: "Donor en route to Ipoh Central Relief Hub with goods.",
        timestamp: "22 Aug 2026, 09:40 AM"
      }
    ]
  },
  {
    id: "del_recv_3",
    trackingId: "AID-RCV-119482",
    type: "receive",
    requestId: "req_kibbles_1",
    itemTitle: "Dog's Food & Kibbles (15kg Heavy Bags)",
    category: "Animal",
    quantity: 10,
    unit: "bags",
    imageUrl:
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80",
    donorName: "David Wong (Monthly In-Kind Supporter)",
    receiverName: "Sibu Animal Hope Shelter (NGO)",
    receiverLocation: "Sibu, Sabah",
    receiverHub: "Sibu Volunteer Outpost",
    deliveryMethod: "courier",
    courierProvider: "GDEX Logistics",
    trackingNumber: "GDX-88401920MY",
    scheduledDate: "2026-08-19",
    estimatedDeliveryDate: "2026-08-21",
    currentStage: "delivered_to_charity",
    stageProgressPercent: 100,
    lastUpdated: "21 Aug 2026, 05:15 PM",
    timeline: [
      {
        id: "evt_rc_k1",
        stage: "delivered_to_charity",
        title: "Successfully Received & Stored in Pantry",
        description: "10 heavy kibble bags checked in by Volunteer Jenny at Sibu Shelter.",
        timestamp: "21 Aug 2026, 05:15 PM"
      }
    ]
  }
];

// Helper to check if a delivery package was requested / posted by the active recipient / organization
export function isPackageRequestedByRecipient(
  pkg: DeliveryPackageItem,
  activeOrgName: string,
  currentUser: any
): boolean {
  if (pkg.type !== "receive") return true;
  if (!currentUser) return false;

  const normTargetOrg = normalizeIdentity(activeOrgName || "");
  const normPkgReceiver = normalizeIdentity(pkg.receiverName || "");
  const currentCharityNorm = normalizeIdentity(currentUser?.charityName || currentUser?.organizationName || "");
  const currentUsernameNorm = normalizeIdentity(currentUser?.username || "");
  const currentUserEmail = (currentUser?.email || "").toLowerCase().trim();
  const pkgEmail = ((pkg as any).receiverEmail || "").toLowerCase().trim();
  const isAdmin = currentUserEmail === "aidstoryadmin@gmail.com" || currentUsernameNorm === "admin" || currentUser?.role === "admin";

  if (isAdmin) return true;

  // 1. Gather all requests posted by this user (from SEED_COMMUNITY_REQUESTS, localStorage, etc.)
  const allUserRequests: any[] = [];

  // From seed database
  (SEED_COMMUNITY_REQUESTS || []).forEach((r) => {
    const authorEmail = (r.authorEmail || r.createdByUserEmail || "").toLowerCase().trim();
    const authorNorm = normalizeIdentity(r.authorName || r.createdByUsername || "");
    const orgNorm = normalizeIdentity(r.organizerName || (r as any).organization || "");

    const isMatch =
      (currentUserEmail && authorEmail && currentUserEmail === authorEmail) ||
      (currentUsernameNorm && authorNorm && (authorNorm === currentUsernameNorm || authorNorm.includes(currentUsernameNorm))) ||
      (currentCharityNorm && orgNorm && (orgNorm === currentCharityNorm || orgNorm.includes(currentCharityNorm) || currentCharityNorm.includes(orgNorm)));

    if (isMatch) {
      allUserRequests.push(r);
    }
  });

  // From localStorage
  if (typeof window !== "undefined") {
    try {
      const keys = ["aidstory_user_requests", "aidstory_recipient_requests", "aidstory_all_needs"];
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            list.forEach((r: any) => {
              const authorEmail = (r.authorEmail || r.createdByUserEmail || "").toLowerCase().trim();
              const authorNorm = normalizeIdentity(r.authorName || r.createdByUsername || "");
              const orgNorm = normalizeIdentity(r.organizerName || r.organization || "");

              const isMatch =
                (currentUserEmail && authorEmail && currentUserEmail === authorEmail) ||
                (currentUsernameNorm && authorNorm && (authorNorm === currentUsernameNorm || authorNorm.includes(currentUsernameNorm))) ||
                (currentCharityNorm && orgNorm && (orgNorm === currentCharityNorm || orgNorm.includes(currentCharityNorm) || currentCharityNorm.includes(orgNorm)));

              if (isMatch && !allUserRequests.some((existing) => existing.id === r.id)) {
                allUserRequests.push(r);
              }
            });
          }
        }
      }
    } catch (e) {}
  }

  // If the user has NEVER posted any request (currently or past), they cannot receive incoming packages
  if (allUserRequests.length === 0) {
    return false;
  }

  // 2. Check if the package's requestId or itemTitle matches one of the user's posted requests
  const matchingRequest = allUserRequests.find((r) => {
    if (pkg.requestId && r.id === pkg.requestId) return true;
    if (r.title && pkg.itemTitle && normalizeIdentity(r.title) === normalizeIdentity(pkg.itemTitle)) return true;
    return false;
  });

  // Must have a corresponding posted request to receive items
  if (matchingRequest) {
    return true;
  }

  // Fallback: direct name/email match on package receiver if charity/username explicitly aligns with package
  const directReceiverMatch =
    (normTargetOrg && normPkgReceiver && (normTargetOrg === normPkgReceiver || normTargetOrg.includes(normPkgReceiver) || normPkgReceiver.includes(normTargetOrg))) ||
    (currentCharityNorm && normPkgReceiver && (currentCharityNorm === normPkgReceiver || normPkgReceiver.includes(currentCharityNorm))) ||
    (currentUserEmail && pkgEmail && currentUserEmail === pkgEmail);

  if (directReceiverMatch) {
    return true;
  }

  return false;
}

const getCurrentUserEmail = (currentUser: any): string =>
  (currentUser?.email || "").toLowerCase().trim();

const getLinkedRequestOwnerEmail = (pkg: DeliveryPackageItem): string => {
  const directOwner = pkg.requesterEmail || pkg.receiverEmail;
  if (directOwner) return directOwner.toLowerCase().trim();

  const requestLists: RecipientRequest[][] = [DEFAULT_NEEDS_REQUESTS, SEED_COMMUNITY_REQUESTS];
  if (typeof window !== "undefined") {
    for (const key of ["aidstory_all_needs", "aidstory_recipient_requests"]) {
      try {
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(saved)) requestLists.push(saved as RecipientRequest[]);
      } catch (e) {}
    }
  }

  for (const requests of requestLists) {
    const request = requests.find((r) => r.id === pkg.requestId);
    const owner = request?.authorEmail || request?.createdByUserEmail;
    if (owner) return owner.toLowerCase().trim();
  }
  return "";
};

// The request owner controls the item image. Resolve it at display time so
// existing delivery records also reflect any image uploaded for the request.
const getLinkedRequestImageUrl = (pkg: DeliveryPackageItem): string | undefined => {
  const requestLists: RecipientRequest[][] = [DEFAULT_NEEDS_REQUESTS, SEED_COMMUNITY_REQUESTS];
  if (typeof window !== "undefined") {
    for (const key of ["aidstory_all_needs", "aidstory_recipient_requests"]) {
      try {
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(saved)) requestLists.push(saved as RecipientRequest[]);
      } catch (e) {}
    }
  }

  for (const requests of requestLists) {
    const request = requests.find((record) => record.id === pkg.requestId);
    const uploadedImage = request?.images?.[0] || request?.imageUrl;
    if (uploadedImage) return uploadedImage;
  }

  return pkg.imageUrl;
};

// Older saved packages did not store the direct-drop-off flag. Comparing the
// saved destination with the requesting charity keeps those records on the
// direct charity workflow too.
const isDirectCharityDropoff = (pkg: DeliveryPackageItem) =>
  pkg.deliveryMethod === "dropoff" &&
  (pkg.isDirectCharityDropoff === true ||
    (Boolean(pkg.dropoffHubName) && pkg.dropoffHubName === pkg.receiverName));

const getStageOrder = (pkg: DeliveryPackageItem, stage: DeliveryProgressStage) => {
  const directCharityDropoff = isDirectCharityDropoff(pkg);

  if (stage === "pledged") return 0;
  if (stage === "received_by_beneficiary") return directCharityDropoff ? 4 : 5;
  if (stage === "delivered_to_charity") return directCharityDropoff ? 3 : 4;
  if (stage === "arrived_at_hub") return directCharityDropoff ? 2 : 3;
  if (stage === "in_transit") return 2;
  if (stage === "courier_picked_up") return 2;
  if (stage === "prepared_for_pickup" || stage === "prepared_for_dropoff") return 1;
  return 0;
};

const canAdvanceToStage = (pkg: DeliveryPackageItem, nextStage: DeliveryProgressStage) =>
  getStageOrder(pkg, nextStage) === getStageOrder(pkg, pkg.currentStage) + 1;

const isPackageDonor = (pkg: DeliveryPackageItem, currentUser: any): boolean => {
  const userEmail = getCurrentUserEmail(currentUser);
  return Boolean(userEmail && pkg.donorEmail && pkg.donorEmail.toLowerCase().trim() === userEmail);
};

const isPackageRequester = (pkg: DeliveryPackageItem, currentUser: any): boolean => {
  const userEmail = getCurrentUserEmail(currentUser);
  return Boolean(userEmail && getLinkedRequestOwnerEmail(pkg) === userEmail);
};

export default function AppDeliveryStatus({ navigateToView }: AppDeliveryStatusProps) {
  // Current logged in user & role detection
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_current_user");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return null;
  });

  // Active Recipient Organization filter for "To Receive's Progress"
  // Default to Bangsar Infant Care Relief (Charity) or user's registered organization
  const [activeReceiverOrg, setActiveReceiverOrg] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedOrg = localStorage.getItem("aidstory_active_receiver_org");
      if (savedOrg) return savedOrg;
      const savedUser = localStorage.getItem("aidstory_current_user");
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.charityName) return u.charityName;
          if (u.role === "organization" && u.username) return u.username;
        } catch (e) {}
      }
    }
    return "Bangsar Infant Care Relief (Charity)";
  });

  // Listen for user updates across windows or profile edits
  useEffect(() => {
    const handleSyncUser = () => {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("aidstory_current_user");
        if (savedUser) {
          try {
            const u = JSON.parse(savedUser);
            setCurrentUser(u);
            if (u.charityName) {
              setActiveReceiverOrg(u.charityName);
            }
          } catch (e) {}
        }
      }
    };
    window.addEventListener("storage", handleSyncUser);
    window.addEventListener("aidstory_user_updated", handleSyncUser);
    return () => {
      window.removeEventListener("storage", handleSyncUser);
      window.removeEventListener("aidstory_user_updated", handleSyncUser);
    };
  }, []);

  // Check if user is also registered as a verified recipient or NGO
  const [isReceiverUser, setIsReceiverUser] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const verified = localStorage.getItem("aidstory_verified_recipient") === "true";
      const savedUser = localStorage.getItem("aidstory_current_user");
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.role === "donor") {
            return false;
          }
          if (
            (u.role === "organization" || u.role === "recipient" || u.role === "admin") &&
            (u.role === "admin" || u.isVerified === true)
          ) {
            return true;
          }
          if (
            (u.roleType && (u.roleType.includes("NGO") || u.roleType.includes("Recipient"))) ||
            u.charityName
          ) {
            return u.isVerified === true;
          }
          // A signed-in user without an approved recipient account is donor-only.
          return false;
        } catch (e) {}
      }
      return verified;
    }
    return false;
  });

  // Demo Role View Mode Toggle:
  // "donor_only": view as donor only (shows "To donate's progress")
  // "dual_role": view as donor AND receiver (shows "To donate's progress" + "To receive's progress")
  const [roleViewMode, setRoleViewMode] = useState<"donor_only" | "dual_role">(() => {
    return isReceiverUser ? "dual_role" : "donor_only";
  });

  // Active progress sub-tab when user is in dual-role (Donor & Receiver)
  const [activeProgressTab, setActiveProgressTab] = useState<"to_donate" | "to_receive">("to_donate");

  // Recipient privileges may change when an administrator approves an
  // application. Keep the delivery tabs aligned with the signed-in account.
  useEffect(() => {
    const canReceive = Boolean(
      currentUser &&
        (currentUser.role === "admin" ||
          ((currentUser.role === "recipient" || currentUser.role === "organization") &&
            currentUser.isVerified === true))
    );
    setIsReceiverUser(canReceive);
    setRoleViewMode(canReceive ? "dual_role" : "donor_only");
    if (!canReceive) setActiveProgressTab("to_donate");
  }, [currentUser]);

  // Packages list state (stored in localStorage for persistence)
  const [packages, setPackages] = useState<DeliveryPackageItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_delivery_packages");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Check if any seed delivery packages are missing and merge them
            const existingIds = new Set(parsed.map((p) => p.id));
            const missingSeeds = (SEED_DELIVERY_PACKAGES || []).filter((p) => !existingIds.has(p.id));
            if (missingSeeds.length > 0) {
              const combined = [...parsed, ...missingSeeds];
              localStorage.setItem("aidstory_delivery_packages", JSON.stringify(combined));
              return combined;
            }
            return parsed;
          }
        } catch (e) {}
      }
    }
    return [...(SEED_DELIVERY_PACKAGES || []), ...INITIAL_DEFAULT_DONATE_DELIVERIES, ...INITIAL_DEFAULT_RECEIVE_DELIVERIES];
  });

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"All" | "In Preparation" | "In Transit" | "Delivered">("All");
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<"All" | "Courier" | "Drop-off" | "Volunteer">("All");

  // Expanded timelines map
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({
    del_donate_1: true,
    del_recv_1: true
  });

  // Toast message
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal states
  const [selectedWaybillPackage, setSelectedWaybillPackage] = useState<DeliveryPackageItem | null>(null);
  const [editingPackage, setEditingPackage] = useState<DeliveryPackageItem | null>(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    pkgId: string;
    newStage: DeliveryProgressStage;
    customTitle?: string;
    customDesc?: string;
  } | null>(null);
  const [customCourierInput, setCustomCourierInput] = useState("");
  const [customTrackingInput, setCustomTrackingInput] = useState("");
  const [customNoteInput, setCustomNoteInput] = useState("");

  // Thank you note modal for receivers
  const [thankYouPackage, setThankYouPackage] = useState<DeliveryPackageItem | null>(null);
  const [thankYouMessage, setThankYouMessage] = useState("");

  // Sync to localStorage and Cloud Firestore
  const savePackages = (newPackages: DeliveryPackageItem[]) => {
    setPackages(newPackages);
    if (typeof window !== "undefined") {
      localStorage.setItem("aidstory_delivery_packages", JSON.stringify(newPackages));
    }
    // Auto-sync each modified package to Cloud Firestore
    newPackages.forEach((pkg) => {
      saveDeliveryPackageToCloud(pkg).catch((err) => {
        console.warn("Could not sync package to cloud:", err);
      });
    });
  };

  // Real-time Cloud Firestore subscription for deliveries
  useEffect(() => {
    const unsub = subscribeToAllDeliveryPackages((cloudPkgs) => {
      if (cloudPkgs && cloudPkgs.length > 0) {
        setPackages((prev) => {
          const map = new Map(cloudPkgs.map((p) => [p.id, p]));
          // Merge with any local offline additions
          prev.forEach((p) => {
            if (!map.has(p.id)) {
              map.set(p.id, p);
            }
          });
          const merged = Array.from(map.values());
          try {
            localStorage.setItem("aidstory_delivery_packages", JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
    });
    return () => unsub();
  }, []);

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => {
      setActionToast(null);
    }, 4000);
  };

  // Copy tracking ID
  const handleCopyTracking = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerToast(`Copied tracking number: ${text}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Toggle timeline collapse
  const toggleTimeline = (pkgId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [pkgId]: !prev[pkgId]
    }));
  };

  // Toggle demo role mode
  const handleToggleRoleMode = (mode: "donor_only" | "dual_role") => {
    setRoleViewMode(mode);
    if (mode === "dual_role") {
      triggerToast("Switched to Dual Role: Viewing 'To donate's progress' and 'To receive's progress'.");
    } else {
      setActiveProgressTab("to_donate");
      triggerToast("Switched to Donor Only: Viewing 'To donate's progress'.");
    }
  };

  // ----------------------------------------------------
  // ACTION HANDLERS FOR DONOR'S PROGRESS UPDATES
  // ----------------------------------------------------
  const handleUpdateStatus = (
    pkgId: string,
    newStage: DeliveryProgressStage,
    customTitle?: string,
    customDesc?: string
  ) => {
    const existingPackage = packages.find((pkg) => pkg.id === pkgId);
    // Receipt confirmation is the final recipient action; donor updates must
    // not overwrite it afterwards.
    if (
      existingPackage?.currentStage === "received_by_beneficiary" &&
      newStage !== "received_by_beneficiary"
    ) {
      return;
    }

    if (!existingPackage || !canAdvanceToStage(existingPackage, newStage)) {
      triggerToast("Complete the current delivery stage before moving to the next one.");
      return;
    }

    setPendingStatusUpdate({ pkgId, newStage, customTitle, customDesc });
  };

  const confirmStatusUpdate = () => {
    if (!pendingStatusUpdate) return;

    const { pkgId, newStage, customTitle, customDesc } = pendingStatusUpdate;
    const existingPackage = packages.find((pkg) => pkg.id === pkgId);

    if (!existingPackage || !canAdvanceToStage(existingPackage, newStage)) {
      setPendingStatusUpdate(null);
      triggerToast("This delivery stage is no longer available. Please refresh and try again.");
      return;
    }

    setPendingStatusUpdate(null);

    const updated = packages.map((pkg) => {
      if (pkg.id !== pkgId) return pkg;

      const directCharityDropoff = isDirectCharityDropoff(pkg);
      let progressPercent = pkg.stageProgressPercent;
      let stageTitle = customTitle || "";
      let stageDesc = customDesc || "";

      switch (newStage) {
        case "prepared_for_pickup":
          progressPercent = 40;
          stageTitle = stageTitle || "Prepared to Pickup by Courier";
          stageDesc =
            stageDesc ||
            `Parcel boxed, sealed with waterproof tape, and labeled with tracking ID #${pkg.trackingNumber || pkg.trackingId}. Awaiting courier pickup driver.`;
          break;
        case "courier_picked_up":
          progressPercent = 65;
          stageTitle = stageTitle || "Courier Already Pickup";
          stageDesc =
            stageDesc ||
            `${pkg.courierProvider || "Courier driver"} has successfully scanned and picked up the donation parcel. Now in regional transit.`;
          break;
        case "prepared_for_dropoff":
          progressPercent = 50;
          stageTitle = stageTitle || (directCharityDropoff ? "Ready to Drop-off at Charity" : "Ready to Drop-off at Hub");
          stageDesc =
            stageDesc ||
            `Donation box packed and ready for drop-off at ${pkg.dropoffHubName || (directCharityDropoff ? pkg.receiverName : "the local drop-off hub")}.`;
          break;
        case "in_transit":
          progressPercent = 75;
          stageTitle = stageTitle || (directCharityDropoff ? "On the Way to Charity" : "On the Way to Hub");
          stageDesc = stageDesc || (directCharityDropoff
            ? `Donor is taking the donation directly to ${pkg.receiverName}.`
            : "Donation is being taken to the selected drop-off hub.");
          break;
        case "arrived_at_hub":
          progressPercent = 85;
          stageTitle = stageTitle || "Arrived at Drop-off Hub";
          stageDesc = stageDesc || `Parcel arrived safely at ${pkg.dropoffHubName || pkg.receiverHub || "the local drop-off hub"} for checking.`;
          break;
        case "delivered_to_charity":
          progressPercent = 100;
          stageTitle = stageTitle || "Successfully Drop-off & Delivered to Charity";
          stageDesc =
            stageDesc ||
            `Donation successfully received, barcode verified, and stored into inventory by ${pkg.receiverName}. Thank you for your generosity!`;
          break;
        case "received_by_beneficiary":
          progressPercent = 100;
          stageTitle = stageTitle || `Received and Verified at ${pkg.receiverName}`;
          stageDesc =
            stageDesc ||
            `The recipient confirmed receipt and verified the item for distribution.`;
          break;
        default:
          progressPercent = 50;
      }

      const newTimelineEvent: DeliveryTimelineEvent = {
        id: `evt_${Date.now()}`,
        stage: newStage,
        title: stageTitle,
        description: stageDesc,
        timestamp: new Date().toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        updatedBy: newStage === "received_by_beneficiary" ? "Recipient" : "Donor",
        trackingNumber: pkg.trackingNumber,
        courierName: pkg.courierProvider
      };

      return {
        ...pkg,
        currentStage: newStage,
        stageProgressPercent: progressPercent,
        lastUpdated: "Just now",
        timeline: [newTimelineEvent, ...pkg.timeline]
      };
    });

    savePackages(updated);

    // Toast feedback
    const updatedPkg = updated.find((p) => p.id === pkgId);
    triggerToast(
      `Updated status for "${updatedPkg?.itemTitle || "Item"}": ${newStage.replace(/_/g, " ").toUpperCase()} ✓`
    );
  };

  // Open Edit Details Modal
  const handleOpenEditModal = (pkg: DeliveryPackageItem) => {
    setEditingPackage(pkg);
    setCustomCourierInput(pkg.courierProvider || "");
    setCustomTrackingInput(pkg.trackingNumber || "");
    setCustomNoteInput(pkg.donorNote || "");
  };

  // Save Custom Edits
  const handleSavePackageEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    const updated = packages.map((pkg) => {
      if (pkg.id !== editingPackage.id) return pkg;
      return {
        ...pkg,
        courierProvider: customCourierInput.trim() || pkg.courierProvider,
        trackingNumber: customTrackingInput.trim() || pkg.trackingNumber,
        donorNote: customNoteInput.trim() || pkg.donorNote,
        lastUpdated: "Just now"
      };
    });

    savePackages(updated);
    setEditingPackage(null);
    triggerToast("Delivery & courier tracking details updated successfully.");
  };

  // Receiver sends thank you note
  const handleSendThankYou = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thankYouPackage) return;
    triggerToast(`Thank-you note dispatched to ${thankYouPackage.donorName}! 💌`);
    setThankYouPackage(null);
    setThankYouMessage("");
  };

  const reconcileRequestDeliveryProgress = (
    requestId: string,
    confirmingPackageId?: string
  ) => {
    if (typeof window === "undefined") 
      return;

    const storageKeys = [
      "aidstory_all_needs",
      "aidstory_recipient_requests",
      "aidstory_user_requests"
    ];
    let request: RecipientRequest | undefined;

    for (const key of storageKeys) {
      try {
        const records = JSON.parse(localStorage.getItem(key) || "[]") as RecipientRequest[];
        request = records.find((record) => record.id === requestId) || request;
      } catch (e) {}
      if (request) break;
    }
    request = request || DEFAULT_NEEDS_REQUESTS.find((record) => record.id === requestId);
    if (!request) return;

    // Delivery records are the source of truth for every progress value. 
    // Apply the pending receipt confirmation while calculating this immediate update.
    const progressPackages = confirmingPackageId
      ? packages.map((item) =>
          item.id === confirmingPackageId
            ? { ...item, currentStage: "received_by_beneficiary" as const }
            : item
        )
      : packages;
    const progress = getDeliveryProgress(request, progressPackages);
    const updates: Partial<RecipientRequest> = {
      pledgedQuantity: progress.pledged,
      receivedQuantity: progress.done,
      inTransitQuantity: progress.inTransit
    };

    if (
      request.pledgedQuantity === progress.pledged &&
      request.receivedQuantity === progress.done &&
      request.inTransitQuantity === progress.inTransit
    ) {
      return;
    }

    // Keep all local request caches in sync immediately, then broadcast the same totals to Firestore for Browse Needs on other devices.
    storageKeys.forEach((key) => {
      try {
        const records = JSON.parse(localStorage.getItem(key) || "[]") as RecipientRequest[];
        if (!Array.isArray(records) || !records.some((record) => record.id === requestId)) return;
        localStorage.setItem(
          key,
          JSON.stringify(records.map((record) => record.id === requestId ? { ...record, ...updates } : record))
        );
      } catch (e) {}
    });
    window.dispatchEvent(new Event("aidstory_requests_updated"));
    updateRequestInCloud(requestId, updates).catch((err) =>
      console.warn("Could not update received quantity:", err)
    );
  };

  // Reconcile every request whenever delivery packages are loaded or changed,
  // removing stale seeded pledge values even for requests that have no shipment.
  useEffect(() => {
    const requestIds = new Set<string>(DEFAULT_NEEDS_REQUESTS.map((request) => request.id));
    packages.forEach((pkg) => {
      if (pkg.requestId) requestIds.add(pkg.requestId);
    });
    ["aidstory_all_needs", "aidstory_recipient_requests", "aidstory_user_requests"].forEach((key) => {
      try {
        const records = JSON.parse(localStorage.getItem(key) || "[]") as RecipientRequest[];
        records.forEach((record) => requestIds.add(record.id));
      } catch (error) {}
    });
    requestIds.forEach((requestId) => reconcileRequestDeliveryProgress(requestId));
  }, [packages]);

  const handleConfirmReceipt = (pkg: DeliveryPackageItem) => {
    // Recipients can confirm only a parcel for one of their own requests, and
    // only after the donor/courier has marked it delivered to the charity.
    if (
      !pkg.requestId ||
      !isPackageRequester(pkg, currentUser) ||
      pkg.currentStage !== "delivered_to_charity"
    ) return;

    handleUpdateStatus(
      pkg.id,
      "received_by_beneficiary",
      `Received and Verified at ${pkg.receiverName}`,
      `Recipient confirmed receipt of ${pkg.quantity} ${pkg.unit} of ${pkg.itemTitle}.`
    );
    reconcileRequestDeliveryProgress(pkg.requestId, pkg.id);
  };

  // Filter packages based on active tab and search criteria
  const isDualRoleActive = roleViewMode === "dual_role";
  const showingDonorPackages = !isDualRoleActive || activeProgressTab === "to_donate";

  const displayedPackages = packages.filter((pkg) => {
    // A shipment is visible only to the account that donated it or created its request.
    // The two tabs show the same shipment from the user's donor or requester role.
    if (showingDonorPackages ? !isPackageDonor(pkg, currentUser) : !isPackageRequester(pkg, currentUser)) {
      return false;
    }

    // 3. Search Query Match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = pkg.itemTitle.toLowerCase().includes(q);
      const matchTracking = (pkg.trackingNumber || "").toLowerCase().includes(q) || pkg.trackingId.toLowerCase().includes(q);
      const matchReceiver = pkg.receiverName.toLowerCase().includes(q);
      const matchDonor = pkg.donorName.toLowerCase().includes(q);
      const matchCategory = pkg.category.toLowerCase().includes(q);
      if (!matchTitle && !matchTracking && !matchReceiver && !matchDonor && !matchCategory) {
        return false;
      }
    }

    // 4. Status Filter Match
    if (selectedStatusFilter === "In Preparation") {
      if (pkg.currentStage !== "pledged" && pkg.currentStage !== "prepared_for_pickup" && pkg.currentStage !== "prepared_for_dropoff") {
        return false;
      }
    } else if (selectedStatusFilter === "In Transit") {
      if (pkg.currentStage !== "courier_picked_up" && pkg.currentStage !== "in_transit" && pkg.currentStage !== "arrived_at_hub") {
        return false;
      }
    } else if (selectedStatusFilter === "Delivered") {
      if (pkg.currentStage !== "delivered_to_charity" && pkg.currentStage !== "received_by_beneficiary") {
        return false;
      }
    }

    // 5. Method Filter Match
    if (selectedMethodFilter === "Courier" && pkg.deliveryMethod !== "courier") return false;
    if (selectedMethodFilter === "Drop-off" && pkg.deliveryMethod !== "dropoff") return false;
    if (selectedMethodFilter === "Volunteer" && pkg.deliveryMethod !== "volunteer" && pkg.deliveryMethod !== "direct") return false;

    return true;
  });

  const donateCount = packages.filter((p) => isPackageDonor(p, currentUser)).length;
  const receiveCount = packages.filter((p) => isPackageRequester(p, currentUser)).length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#1c1510] text-[#f4efe5] font-sans antialiased flex flex-col justify-between selection:bg-[#785d47] selection:text-white">
        <header className="bg-[#140e0a] text-[#f4efe5] border-b border-[#36271e] px-4 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateToView("main_menu")}
            className="flex items-center gap-2 text-[#e8dcc8] hover:text-white transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2e2017] border border-[#523d2e] text-[#d4b292] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#d4b292]" />
            </div>
            <span className="font-serif italic font-extrabold text-xl text-[#f4efe5]">
              AidStory
            </span>
          </button>
          <button
            onClick={() => navigateToView("main_menu")}
            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-xs font-mono text-[#f4efe5] border border-white/10 transition-all cursor-pointer"
          >
            Back to Menu
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[380px] bg-[#423a31] p-8 sm:p-9 rounded-[28px] border border-white/10 shadow-2xl text-center text-[#f4efe5]"
          >
            <div className="relative w-28 h-28 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 32 46 V 32 C 32 21 40 14 50 14 C 60 14 68 21 68 32 V 46"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                <rect
                  x="22"
                  y="42"
                  width="56"
                  height="46"
                  rx="12"
                  fill="#ff8800"
                  stroke="#cc6600"
                  strokeWidth="3.5"
                />
                <circle cx="50" cy="61" r="5" fill="#423a31" />
                <path d="M 48 64 L 46 75 H 54 L 52 64 Z" fill="#423a31" />
              </svg>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-[#f4efe5] font-medium tracking-tight mb-2">
              Locked.
            </h3>
            <p className="text-sm sm:text-base text-[#f4efe5]/85 font-sans mb-6 leading-relaxed">
              login/sign up to unlock
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigateToView("home")}
                className="w-full py-3 bg-[#ff5500] hover:bg-[#ff6600] text-white font-bold text-sm sm:text-base rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Login / Sign Up
              </button>
              <button
                onClick={() => navigateToView("main_menu")}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-[#f4efe5] text-xs font-mono rounded-full transition-all cursor-pointer"
              >
                Return to Main Menu
              </button>
            </div>
          </motion.div>
        </div>

        <footer className="text-center py-4 text-xs font-mono text-white/40">
          AidStory © 2026 • Real-Time Relief Logistics
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1510] text-[#f4efe5] font-sans antialiased pb-28 selection:bg-[#785d47] selection:text-white">
      {/* ==================================================== */}
      {/* 1. TOP BRAND HEADER & LOGISTICS NAVIGATION BAR */}
      {/* ==================================================== */}
      <header className="bg-[#140e0a] text-[#f4efe5] border-b border-[#36271e] sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Breadcrumb Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={() => navigateToView("main_menu")}
              className="flex items-center gap-2 text-[#e8dcc8] hover:text-white transition-colors cursor-pointer group"
              title="Return to Main Menu"
            >
              <div className="w-9 h-9 rounded-xl bg-[#2e2017] border border-[#523d2e] text-[#d4b292] flex items-center justify-center shadow-md group-hover:bg-[#422e21] group-hover:border-[#d4b292] transition-all">
                <Truck className="w-5 h-5 text-[#d4b292]" />
              </div>
              <span className="font-serif italic font-extrabold text-xl sm:text-2xl text-[#f4efe5] tracking-tight">
                AidStory
              </span>
            </button>

            <div className="h-6 w-px bg-[#36271e] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-serif italic text-[#c8b7a6] font-medium">
                Delivery Status
              </span>
              <span className="hidden md:inline-flex items-center gap-1 bg-[#2b1f17] text-[#d4b292] border border-[#4a3628] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Live Dispatch
              </span>
            </div>

            {/* Mobile Home Button */}
            <button
              type="button"
              onClick={() => navigateToView("main_menu")}
              className="sm:hidden p-1.5 rounded-lg bg-[#281e17] text-[#c8b7a6] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Links (Main Menu) */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            {/* Back to Main Menu Button */}
            <button
              type="button"
              onClick={() => navigateToView("main_menu")}
              className="px-3.5 py-1.5 rounded-xl text-[#c8b7a6] hover:text-white bg-[#281e17] hover:bg-[#382b21] transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-medium border border-[#3e2e23]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================== */}
      {/* 2. TOAST NOTIFICATION ALERT */}
      {/* ==================================================== */}
      <AnimatePresence>
        {actionToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-18 left-1/2 transform -translate-x-1/2 z-50 bg-[#2d1f16] border border-[#d4b292]/50 text-[#f4efe5] px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-medium max-w-md w-11/12"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1 truncate">{actionToast}</span>
            <button
              onClick={() => setActionToast(null)}
              className="text-[#a89382] hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 3. MAIN PAGE CONTAINER */}
      {/* ==================================================== */}
      <main className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8 space-y-6">
        
        {/* HERO TITLE & DUAL-ROLE TAB SWITCHER */}
        <div className="bg-[#241a13] border border-[#3e2d21] rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d4b292]">
                  AidStory Real-Time Logistics Center
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#f4efe5]">
                {roleViewMode === "donor_only"
                  ? "To Donate's Progress"
                  : activeProgressTab === "to_donate"
                  ? "To Donate's Progress (Outgoing Aid)"
                  : "To Receive's Progress (Incoming Relief)"}
              </h1>
              <p className="text-xs text-[#c8b7a6] max-w-2xl leading-relaxed">
                {roleViewMode === "donor_only"
                  ? "Track your pledged donation boxes, courier pick-ups, and hub drop-offs. Click the progress buttons to update when you prepare parcels, hand over to couriers, or deliver to charities."
                  : "As a verified community participant, easily oversee both the supplies you are dispatching to shelters and the incoming donations arriving for your relief requests."}
              </p>
            </div>
          </div>

          {/* DUAL-ROLE TABS: "To donate's progress" vs "To receive's progress" */}
          {isDualRoleActive && (
            <div className="border-t border-[#36271e] pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-[#17100b] p-1.5 rounded-2xl border border-[#36271e]">
                {/* TAB 1: To donate's progress */}
                <button
                  type="button"
                  onClick={() => setActiveProgressTab("to_donate")}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                    activeProgressTab === "to_donate"
                      ? "bg-[#d4b292] text-[#1c1510] shadow-md scale-[1.02]"
                      : "text-[#c8b7a6] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>To Donate's Progress</span>
                  <span
                    className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                      activeProgressTab === "to_donate"
                        ? "bg-[#1c1510] text-[#d4b292]"
                        : "bg-[#281e17] text-[#a89382]"
                    }`}
                  >
                    {donateCount}
                  </span>
                </button>

                {/* TAB 2: To receive's progress */}
                <button
                  type="button"
                  onClick={() => setActiveProgressTab("to_receive")}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                    activeProgressTab === "to_receive"
                      ? "bg-[#d4b292] text-[#1c1510] shadow-md scale-[1.02]"
                      : "text-[#c8b7a6] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>To Receive's Progress</span>
                  <span
                    className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                      activeProgressTab === "to_receive"
                        ? "bg-[#1c1510] text-[#d4b292]"
                        : "bg-[#281e17] text-[#a89382]"
                    }`}
                  >
                    {receiveCount}
                  </span>
                </button>
              </div>

              {/* Status Note */}
              <div className="text-[11px] font-mono text-[#a89382] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Recipient / NGO Multi-View Enabled</span>
              </div>
            </div>
          )}

          {/* RECIPIENT PRIVACY & CHARITY CONTEXT BAR (ONLY IN TO RECEIVE TAB) */}
          {isDualRoleActive && activeProgressTab === "to_receive" && (
            <div className="bg-[#17100b] border border-[#3e2c20] rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold uppercase tracking-wider text-[#d4b292] text-[10px]">
                      Active Recipient Portal:
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Owner-Only Dispatch Tracking</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-[#a89382] mt-0.5">
                    Showing only relief shipments linked to requests posted by your signed-in account.
                  </p>
                </div>
              </div>

              {/* Organization Switcher Dropdown */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#2d1e16]">
                <label htmlFor="receiverOrgSelect" className="text-[11px] font-mono text-[#8a7261] shrink-0">
                  Select Recipient:
                </label>
                <select
                  id="receiverOrgSelect"
                  value={activeReceiverOrg}
                  onChange={(e) => {
                    const val = e.target.value;
                    setActiveReceiverOrg(val);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("aidstory_active_receiver_org", val);
                    }
                    triggerToast(`Switched active receiver view to: ${val}`);
                  }}
                  className="bg-[#241a13] border border-[#523e2f] text-xs text-[#f4efe5] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#d4b292] cursor-pointer font-semibold shadow-sm"
                >
                  <option value="Bangsar Infant Care Relief (Charity)">
                    Bangsar Infant Care Relief (Charity)
                  </option>
                  <option value="Perak Community Relief Center (NGO)">
                    Perak Community Relief Center (NGO)
                  </option>
                  <option value="Sibu Animal Hope Shelter (NGO)">
                    Sibu Animal Hope Shelter (NGO)
                  </option>
                  {currentUser?.charityName &&
                    currentUser.charityName !== "Bangsar Infant Care Relief (Charity)" &&
                    currentUser.charityName !== "Perak Community Relief Center (NGO)" &&
                    currentUser.charityName !== "Sibu Animal Hope Shelter (NGO)" && (
                      <option value={currentUser.charityName}>
                        {currentUser.charityName} (Your Charity Profile)
                      </option>
                    )}
                  {currentUser?.username &&
                    currentUser.username !== "Bangsar Infant Care Relief (Charity)" &&
                    currentUser.username !== "Perak Community Relief Center (NGO)" &&
                    currentUser.username !== "Sibu Animal Hope Shelter (NGO)" &&
                    currentUser.username !== currentUser?.charityName && (
                      <option value={currentUser.username}>
                        {currentUser.username} (Your User Account)
                      </option>
                    )}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* 4. SEARCH, FILTER & STATS BAR */}
        {/* ==================================================== */}
        <div className="bg-[#241a13] border border-[#3e2d21] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search input */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item, tracking code, receiver, or hub..."
              className="w-full bg-[#17100b] border border-[#3e2d21] rounded-xl pl-9 pr-4 py-2 text-xs text-[#f4efe5] placeholder:text-[#6e594b] focus:outline-none focus:border-[#d4b292] transition-colors"
            />
            <Search className="w-4 h-4 text-[#8a7261] absolute left-3 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-[#8a7261] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
            <span className="text-[10px] font-mono text-[#8a7261] uppercase mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Status:</span>
            </span>

            {(["All", "In Preparation", "In Transit", "Delivered"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedStatusFilter === status
                    ? "bg-[#3e2d21] text-[#d4b292] font-bold border border-[#d4b292]/40"
                    : "bg-[#17100b] text-[#a89382] hover:text-white border border-[#2d1e16]"
                }`}
              >
                {status}
              </button>
            ))}

            {/* Method Filter Dropdown */}
            <select
              value={selectedMethodFilter}
              onChange={(e: any) => setSelectedMethodFilter(e.target.value)}
              className="bg-[#17100b] border border-[#2d1e16] text-xs text-[#c8b7a6] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#d4b292] cursor-pointer"
            >
              <option value="All">All Delivery Methods</option>
              <option value="Courier">Courier Pickup</option>
              <option value="Drop-off">Hub Drop-off</option>
              <option value="Volunteer">Volunteer Handover</option>
            </select>
          </div>

        </div>

        {/* ==================================================== */}
        {/* 5. DELIVERY PACKAGES LIST */}
        {/* ==================================================== */}
        {displayedPackages.length === 0 ? (
          <div className="bg-[#241a13] border border-dashed border-[#3e2d21] rounded-3xl p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#17100b] border border-[#3e2d21] text-[#d4b292] flex items-center justify-center mx-auto shadow-inner">
              <Package className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-[#f4efe5]">
                {activeProgressTab === "to_receive"
                  ? `No incoming relief deliveries for "${activeReceiverOrg}"`
                  : "No matching deliveries found"}
              </h3>
              <p className="text-xs text-[#a89382] max-w-md mx-auto leading-relaxed">
                {searchQuery || selectedStatusFilter !== "All"
                  ? "Try resetting your search query or filter tags above."
                  : activeProgressTab === "to_donate"
                  ? "You haven't scheduled any donations yet. Browse needs and add items to your Donate Box!"
                  : `Only relief requests posted by "${activeReceiverOrg}" can be tracked in this portal. If a request was posted by another charity (e.g. Bangsar Infant Care Relief), only that charity is authorized to track its delivery.`}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3 flex-wrap">
              {activeProgressTab === "to_receive" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReceiverOrg("Bangsar Infant Care Relief (Charity)");
                      triggerToast("Switched view to Bangsar Infant Care Relief (Charity)");
                    }}
                    className="px-4 py-2 bg-[#2d1f16] hover:bg-[#3d2a1e] text-[#f4efe5] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#443023]"
                  >
                    View Bangsar Infant Care Relief
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToView("your_request")}
                    className="px-4 py-2 bg-[#d4b292] hover:bg-[#e4caa8] text-[#1c1510] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post a New Request</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedStatusFilter("All");
                      setSelectedMethodFilter("All");
                    }}
                    className="px-4 py-2 bg-[#2d1f16] hover:bg-[#3d2a1e] text-[#f4efe5] text-xs font-bold rounded-xl transition-colors cursor-pointer border border-[#443023]"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateToView("needs")}
                    className="px-4 py-2 bg-[#d4b292] hover:bg-[#e4caa8] text-[#1c1510] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    Browse Needs
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {displayedPackages.map((pkg) => {
              const isExpanded = expandedTimelines[pkg.id];
              const isCourier = pkg.deliveryMethod === "courier";
              const isDropoff = pkg.deliveryMethod === "dropoff";
              const isDirectCharity = isDirectCharityDropoff(pkg);
              const isReceiverView = !showingDonorPackages;
              const canPrepare = canAdvanceToStage(
                pkg,
                isCourier ? "prepared_for_pickup" : "prepared_for_dropoff"
              );
              const canMoveToNextStop = canAdvanceToStage(
                pkg,
                isCourier ? "courier_picked_up" : "in_transit"
              );
              const canArriveAtHub = canAdvanceToStage(pkg, "arrived_at_hub");
              const canDeliverToCharity = canAdvanceToStage(pkg, "delivered_to_charity");
              const isDelivered =
                pkg.currentStage === "delivered_to_charity" ||
                pkg.currentStage === "received_by_beneficiary";
              const canConfirmReceipt =
                isReceiverView && pkg.currentStage === "delivered_to_charity";

              return (
                <div
                  key={pkg.id}
                  className="bg-[#241a13] border border-[#3e2d21] hover:border-[#523d2e] rounded-3xl p-5 sm:p-6 shadow-xl transition-all space-y-5 relative overflow-hidden group"
                >
                  {/* TOP HEADER: Title, Category, Delivery Method & Waybill button */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#36271e] pb-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      {/* Item Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#17100b] border border-[#3e2d21] overflow-hidden shrink-0 shadow-md">
                        {getLinkedRequestImageUrl(pkg) ? (
                          <img
                            src={getLinkedRequestImageUrl(pkg)}
                            alt={pkg.itemTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Main Title & Key Specs */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-serif italic font-bold text-[#f4efe5] truncate">
                            {formatCapitalizedTitle(pkg.itemTitle)}
                          </h3>
                          <span className="bg-[#3a2c20] text-[#d4b292] border border-[#523e2f] text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                            {pkg.category}
                          </span>
                          <span className="bg-[#17100b] text-[#f4efe5] border border-[#3e2d21] text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold">
                            {pkg.quantity} {pkg.unit}
                          </span>
                        </div>

                        {/* Sub-info line: Target Recipient / Location */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#a89382]">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-[#d4b292] shrink-0" />
                            <strong className="text-[#f4efe5]">{pkg.receiverName}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#d4b292] shrink-0" />
                            <span>{pkg.receiverLocation}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#d4b292] shrink-0" />
                            <span>Dispatch: {pkg.scheduledDate}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Info: Tracking ID, Courier Details & Waybill Label button */}
                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap lg:justify-end">
                      {/* Method Badge */}
                      <div className="flex items-center gap-1.5 bg-[#17100b] border border-[#36271e] px-3 py-1.5 rounded-xl text-xs font-mono">
                        {isCourier ? (
                          <>
                            <Truck className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[#f4efe5] font-bold">
                              {pkg.courierProvider || "Courier Dispatch"}
                            </span>
                          </>
                        ) : isDropoff ? (
                          <>
                            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[#f4efe5] font-bold">
                              {isDirectCharity ? "Charity Drop-off" : "Hub Drop-off"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[#f4efe5] font-bold">Volunteer Direct</span>
                          </>
                        )}
                      </div>

                      {/* Tracking Number Copy Badge */}
                      {(pkg.trackingNumber || pkg.trackingId) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyTracking(
                              pkg.id,
                              pkg.trackingNumber || pkg.trackingId
                            )
                          }
                          className="flex items-center gap-1.5 bg-[#17100b] hover:bg-[#281c14] border border-[#3e2d21] px-2.5 py-1.5 rounded-xl text-xs font-mono text-[#d4b292] transition-colors cursor-pointer"
                          title="Click to copy tracking number"
                        >
                          <span>{pkg.trackingNumber || pkg.trackingId}</span>
                          {copiedId === pkg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-[#8a7261]" />
                          )}
                        </button>
                      )}

                      {/* Printable Waybill / QR button */}
                      <button
                        type="button"
                        onClick={() => setSelectedWaybillPackage(pkg)}
                        className="p-2 rounded-xl bg-[#2e2017] hover:bg-[#3e2c20] text-[#d4b292] hover:text-white border border-[#4a3628] transition-colors cursor-pointer"
                        title="View & Print Dispatch Waybill / QR Label"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* ==================================================== */}
                  {/* PROGRESS BAR & STAGES TIMELINE PIPELINE */}
                  {/* ==================================================== */}
                  <div className="bg-[#17100b] rounded-2xl p-4 sm:p-5 border border-[#36271e] space-y-4">
                    
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[#8a7261]">CURRENT STATUS:</span>
                        <span className="font-extrabold text-[#d4b292] uppercase bg-[#2b1e16] px-2.5 py-0.5 rounded-lg border border-[#443124]">
                          {pkg.currentStage.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span className="text-[#a89382] font-bold">
                        {pkg.stageProgressPercent}% Complete
                      </span>
                    </div>

                    {/* Progress Track Line */}
                    <div className="relative h-2.5 w-full bg-[#241a13] rounded-full overflow-hidden border border-[#3e2d21]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pkg.stageProgressPercent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full transition-all ${
                          isDelivered
                            ? "bg-gradient-to-r from-amber-400 to-emerald-400"
                            : "bg-gradient-to-r from-amber-600 via-[#d4b292] to-amber-400"
                        }`}
                      />
                    </div>

                    {/* 4-Step Key Visual Nodes */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-mono">
                      {/* Step 1 */}
                      <div
                        className={`space-y-1 ${
                          pkg.stageProgressPercent >= 20
                            ? "text-[#d4b292] font-bold"
                            : "text-[#635043]"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] ${
                            pkg.stageProgressPercent >= 20
                              ? "bg-[#d4b292] text-[#1c1510]"
                              : "bg-[#281e17] text-[#635043]"
                          }`}
                        >
                          1
                        </div>
                        <span className="block truncate">1. Box Pledged</span>
                      </div>

                      {/* Step 2 */}
                      <div
                        className={`space-y-1 ${
                          pkg.stageProgressPercent >= 45
                            ? "text-[#d4b292] font-bold"
                            : "text-[#635043]"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] ${
                            pkg.stageProgressPercent >= 45
                              ? "bg-[#d4b292] text-[#1c1510]"
                              : "bg-[#281e17] text-[#635043]"
                          }`}
                        >
                          2
                        </div>
                        <span className="block truncate">
                          {isCourier ? "2. Ready for Pickup" : "2. Ready to Drop-off"}
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div
                        className={`space-y-1 ${
                          pkg.stageProgressPercent >= 70
                            ? "text-[#d4b292] font-bold"
                            : "text-[#635043]"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] ${
                            pkg.stageProgressPercent >= 70
                              ? "bg-[#d4b292] text-[#1c1510]"
                              : "bg-[#281e17] text-[#635043]"
                          }`}
                        >
                          3
                        </div>
                        <span className="block truncate">
                          {isCourier
                            ? "3. Courier Pickup"
                            : isDirectCharity
                              ? "3. On the Way to Charity"
                              : "3. On the Way to Hub"}
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div
                        className={`space-y-1 ${
                          pkg.stageProgressPercent >= 100
                            ? "text-emerald-400 font-extrabold"
                            : "text-[#635043]"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] ${
                            pkg.stageProgressPercent >= 100
                              ? "bg-emerald-400 text-[#1c1510]"
                              : "bg-[#281e17] text-[#635043]"
                          }`}
                        >
                          ✓
                        </div>
                        <span className="block truncate">4. Drop-off to Charity</span>
                      </div>
                    </div>
                  </div>

                  {/* ==================================================== */}
                  {/* FOR DONORS: INTERACTIVE ACTION BUTTONS (UPDATE PROGRESS) */}
                  {/* FOR RECEIVERS: ONLY COMPLETE DISPATCH HISTORY & AUDIT TRAIL */}
                  {/* ==================================================== */}
                  {showingDonorPackages ? (
                    <div className="bg-[#2a1e16] border border-[#443123] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#d4b292] flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update Delivery Progress Stage:</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#a89382]">
                          Click button to progress
                        </span>
                      </div>

                      {/* DYNAMIC ACTION BUTTONS ACCORDING TO DELIVERY METHOD */}
                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${isDirectCharity ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
                        
                        {/* BUTTON A: Prepared to pickup / drop-off */}
                        {isCourier ? (
                          <button
                            type="button"
                            disabled={!canPrepare}
                            onClick={() =>
                              handleUpdateStatus(
                                pkg.id,
                                "prepared_for_pickup",
                                "Prepared to pickup by courier",
                                "Donor has packed, sealed and prepared the parcel for courier driver collection."
                              )
                            }
                            className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                              pkg.currentStage === "prepared_for_pickup"
                                ? "bg-amber-400 text-black shadow-md"
                                : canPrepare
                                  ? "bg-[#1c140f] hover:bg-[#38281d] text-[#e8dcc8] border border-[#4a3628] cursor-pointer"
                                  : "bg-[#17100b] text-[#635043] border border-[#302219] cursor-not-allowed opacity-60"
                            }`}
                          >
                            <Package className="w-3.5 h-3.5 shrink-0" />
                            <span>Prepared to pickup by courier</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canPrepare}
                            onClick={() =>
                              handleUpdateStatus(
                                pkg.id,
                                "prepared_for_dropoff",
                                isDirectCharity ? "Ready to drop-off at charity" : "Ready to drop-off at hub",
                                isDirectCharity
                                  ? `Donation parcel is packed and ready to take directly to ${pkg.receiverName}.`
                                  : "Donation parcel is packed and ready for drop-off at the selected hub."
                              )
                            }
                            className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                              pkg.currentStage === "prepared_for_dropoff"
                                ? "bg-amber-400 text-black shadow-md"
                                : canPrepare
                                  ? "bg-[#1c140f] hover:bg-[#38281d] text-[#e8dcc8] border border-[#4a3628] cursor-pointer"
                                  : "bg-[#17100b] text-[#635043] border border-[#302219] cursor-not-allowed opacity-60"
                            }`}
                          >
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Prepared to drop-off</span>
                          </button>
                        )}

                        {/* BUTTON B: Courier already pickup / In transit */}
                        {isCourier ? (
                          <button
                            type="button"
                            disabled={!canMoveToNextStop}
                            onClick={() =>
                              handleUpdateStatus(
                                pkg.id,
                                "courier_picked_up",
                                "Courier already pickup",
                                `Courier collected package (Tracking #${pkg.trackingNumber || pkg.trackingId}). Now in transit.`
                              )
                            }
                            className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                              pkg.currentStage === "courier_picked_up"
                                ? "bg-amber-400 text-black shadow-md"
                                : canMoveToNextStop
                                  ? "bg-[#1c140f] hover:bg-[#38281d] text-[#e8dcc8] border border-[#4a3628] cursor-pointer"
                                  : "bg-[#17100b] text-[#635043] border border-[#302219] cursor-not-allowed opacity-60"
                            }`}
                          >
                            <Truck className="w-3.5 h-3.5 shrink-0" />
                            <span>Courier already pickup</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canMoveToNextStop}
                            onClick={() =>
                              handleUpdateStatus(
                                pkg.id,
                                "in_transit",
                                isDirectCharity ? "On the way to charity" : "On the way to hub",
                                isDirectCharity
                                  ? `Donor is taking the donation directly to ${pkg.receiverName}.`
                                  : "Donor is taking the donation to the selected drop-off hub."
                              )
                            }
                            className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                              pkg.currentStage === "in_transit"
                                ? "bg-amber-400 text-black shadow-md"
                                : canMoveToNextStop
                                  ? "bg-[#1c140f] hover:bg-[#38281d] text-[#e8dcc8] border border-[#4a3628] cursor-pointer"
                                  : "bg-[#17100b] text-[#635043] border border-[#302219] cursor-not-allowed opacity-60"
                            }`}
                          >
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{isDirectCharity ? "On the way to charity" : "On the way to hub"}</span>
                          </button>
                        )}

                        {/* A charity handover has no hub or sorting stage. */}
                        {!isDirectCharity && <button
                          type="button"
                          disabled={!canArriveAtHub}
                          onClick={() =>
                            handleUpdateStatus(
                              pkg.id,
                              "arrived_at_hub",
                              "Arrived at drop-off hub",
                              `Items arrived at ${pkg.dropoffHubName || pkg.receiverHub || "the selected drop-off hub"} for checking.`
                            )
                          }
                          className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                            pkg.currentStage === "arrived_at_hub"
                              ? "bg-amber-400 text-black shadow-md"
                              : canArriveAtHub
                                ? "bg-[#1c140f] hover:bg-[#38281d] text-[#e8dcc8] border border-[#4a3628] cursor-pointer"
                                : "bg-[#17100b] text-[#635043] border border-[#302219] cursor-not-allowed opacity-60"
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Arrived at drop-off hub</span>
                        </button>
                        }

                        {/* BUTTON D: Successfully drop-off to charity */}
                        <button
                          type="button"
                          disabled={!canDeliverToCharity}
                          onClick={() =>
                            handleUpdateStatus(
                              pkg.id,
                              "delivered_to_charity",
                              "Successfully drop-off to charity",
                              `Items handed over and confirmed by ${pkg.receiverName}. Verified for immediate community distribution.`
                            )
                          }
                          className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center ${
                            isDelivered
                              ? "bg-emerald-400 text-black shadow-md font-extrabold"
                              : canDeliverToCharity
                                ? "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 cursor-pointer"
                                : "bg-[#17100b] text-[#527260] border border-emerald-950/50 cursor-not-allowed opacity-60"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Successfully drop-off to charity</span>
                        </button>

                      </div>

                      {/* Secondary Actions: Edit info / Toggle Timeline */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#36271e] text-xs flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(pkg)}
                            className="text-[#d4b292] hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Update Courier / Tracking # / Notes</span>
                          </button>
                        </div>

                        {/* Collapsible Timeline Toggle for Donor */}
                        <button
                          type="button"
                          onClick={() => toggleTimeline(pkg.id)}
                          className="text-[#a89382] hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer ml-auto"
                        >
                          <span>{isExpanded ? "Hide Timeline Logs" : "View Timeline Logs"}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#17100b] border border-[#36271e] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#d4b292]">
                          Recipient access
                        </p>
                        <p className="text-xs text-[#a89382] mt-1">
                          Dispatch updates are managed by the donor and courier. You can confirm receipt once the parcel reaches your charity.
                        </p>
                      </div>
                      {canConfirmReceipt ? (
                        <button
                          type="button"
                          onClick={() => handleConfirmReceipt(pkg)}
                          className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#102015] text-xs font-mono font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Received</span>
                        </button>
                      ) : pkg.currentStage === "received_by_beneficiary" ? (
                        <span className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Receipt confirmed</span>
                        </span>
                      ) : null}
                    </div>
                  )}

                  {/* ==================================================== */}
                  {/* COMPLETE DISPATCH HISTORY & AUDIT TRAIL */}
                  {/* Visible always for Receiver, and expandable for Donor */}
                  {/* ==================================================== */}
                  {(isReceiverView || isExpanded) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 sm:p-5 rounded-2xl border ${
                        isReceiverView
                          ? "bg-[#17100b] border-[#36271e] space-y-4"
                          : "pt-3 border-t border-[#36271e] space-y-3 bg-[#17100b]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#36271e] pb-2.5 flex-wrap gap-2">
                        <h5 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#d4b292] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Complete Dispatch History & Audit Trail</span>
                        </h5>

                        {/* Receiver Thank You Note action when delivered */}
                        {isReceiverView && isDelivered && (
                          <button
                            type="button"
                            onClick={() => setThankYouPackage(pkg)}
                            className="px-3 py-1 rounded-lg bg-rose-950/60 text-rose-300 hover:bg-rose-900/70 border border-rose-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow transition-all"
                          >
                            <Heart className="w-3 h-3 text-rose-400 fill-current" />
                            <span>Send Donor Thank-You Note</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-3.5 pl-2 border-l-2 border-[#3e2d21]">
                        {pkg.timeline.map((evt, idx) => (
                          <div key={evt.id || idx} className="relative pl-4 space-y-0.5">
                            {/* Dot indicator */}
                            <div
                              className={`absolute -left-[9px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#241a13] ${
                                idx === 0
                                  ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                                  : "bg-[#4a3628]"
                              }`}
                            />
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-serif font-bold text-[#f4efe5]">
                                {evt.title}
                              </span>
                              <span className="text-[10px] font-mono text-[#8a7261]">
                                {evt.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-[#c8b7a6] leading-relaxed">
                              {evt.description}
                            </p>
                            {evt.trackingNumber && (
                              <span className="inline-block text-[10px] font-mono text-[#d4b292] bg-[#17100b] px-2 py-0.5 rounded border border-[#36271e] mt-1">
                                Ref: {evt.trackingNumber}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ==================================================== */}
      {/* DELIVERY STATUS CONFIRMATION */}
      {/* ==================================================== */}
      <AnimatePresence>
        {pendingStatusUpdate && (() => {
          const pendingPackage = packages.find((pkg) => pkg.id === pendingStatusUpdate.pkgId);
          const stageLabel = pendingStatusUpdate.newStage
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());

          return (
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={() => setPendingStatusUpdate(null)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delivery-confirmation-title"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                onMouseDown={(event) => event.stopPropagation()}
                className="relative w-full max-w-xl rounded-[28px] border border-[#78977f] bg-[#3d5b4d] p-6 text-[#f5f1e8] shadow-2xl sm:p-8"
              >
                <button
                  type="button"
                  onClick={() => setPendingStatusUpdate(null)}
                  aria-label="Close confirmation dialog"
                  className="absolute right-5 top-5 rounded-full p-1.5 text-[#d7e5d2] transition hover:bg-[#294235] hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mb-6 flex items-start gap-3 border-b border-[#688170] pb-4 pr-8">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#9ebd56] bg-[#4a6959] text-[#d5ec7f]">
                    <Truck className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 id="delivery-confirmation-title" className="font-serif text-2xl">
                      Confirm Delivery Update
                    </h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-[#c3d2c1]">
                      Please review the next delivery stage.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-[#4f6d5b] bg-[#263e32] p-4 sm:p-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[#a9c48b]">Donation item</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {pendingPackage?.itemTitle || "Selected donation"}
                    </p>
                  </div>
                  <div className="border-t border-[#405b4b] pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[#a9c48b]">New delivery status</p>
                    <div className="mt-1.5 inline-flex items-center gap-2 rounded-full border border-[#83a36d] bg-[#355344] px-3 py-1.5 text-sm font-bold text-[#e0f08f]">
                      <CheckCircle2 className="h-4 w-4" />
                      {stageLabel}
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#edf1e7]">
                  This action moves the delivery forward. After confirmation, this stage cannot be changed back.
                </p>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setPendingStatusUpdate(null)}
                    className="rounded-xl border border-[#6e8776] bg-[#4a6758] px-5 py-3 text-sm font-semibold text-[#f5f1e8] transition hover:bg-[#547562]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmStatusUpdate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c8df76] px-5 py-3 text-sm font-extrabold text-[#243329] shadow-lg transition hover:bg-[#d8ef8a]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Update
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL 1: PRINTABLE WAYBILL & QR DISPATCH LABEL */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedWaybillPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#241a13] border border-[#523e2f] rounded-3xl p-6 max-w-lg w-full text-[#f4efe5] shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[#36271e] pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#d4b292]" />
                  <h4 className="font-serif italic font-bold text-lg text-[#f4efe5]">
                    AidStory Dispatch Waybill
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedWaybillPackage(null)}
                  className="text-[#a89382] hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              {/* Printable White Waybill Container */}
              <div className="bg-white text-black p-5 rounded-2xl space-y-4 font-sans text-xs shadow-inner">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div>
                    <h5 className="font-serif font-extrabold text-lg tracking-tight">AIDSTORY EXPRESS</h5>
                    <p className="text-[10px] font-mono text-neutral-600">ZERO-WASTE IN-KIND RELIEF DISPATCH</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm bg-neutral-100 px-2 py-1 rounded border border-neutral-300">
                      {selectedWaybillPackage.deliveryMethod.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Tracking Barcode Representation */}
                <div className="text-center py-2 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
                  <div className="font-mono font-extrabold text-base tracking-widest">
                    |||||| | |||||||| |||| | ||||||| ||||
                  </div>
                  <div className="font-mono font-bold text-xs text-neutral-700">
                    {selectedWaybillPackage.trackingNumber || selectedWaybillPackage.trackingId}
                  </div>
                </div>

                {/* Two Column Logistics Routing */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="border border-neutral-300 rounded-xl p-3 space-y-1">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase block font-bold">FROM (DONOR):</span>
                    <strong className="block text-neutral-900">{selectedWaybillPackage.donorName}</strong>
                    <p className="text-[11px] text-neutral-600">Dispatched via AidStory Platform</p>
                  </div>

                  <div className="border border-neutral-300 rounded-xl p-3 space-y-1 bg-amber-50/50">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase block font-bold">SHIP TO (CHARITY):</span>
                    <strong className="block text-neutral-900">{selectedWaybillPackage.receiverName}</strong>
                    <p className="text-[11px] text-neutral-600">{selectedWaybillPackage.receiverLocation}</p>
                    <p className="text-[10px] font-mono text-neutral-500">{selectedWaybillPackage.receiverPhone}</p>
                  </div>
                </div>

                {/* Item Summary */}
                <div className="bg-neutral-100 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between font-bold text-neutral-800">
                    <span>ITEM: {selectedWaybillPackage.itemTitle}</span>
                    <span>QTY: {selectedWaybillPackage.quantity} {selectedWaybillPackage.unit}</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 italic">
                    Note: "{selectedWaybillPackage.donorNote || "Handled with care for community aid."}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedWaybillPackage(null)}
                  className="px-4 py-2 bg-[#2d1f16] text-[#c8b7a6] hover:text-white rounded-xl text-xs font-medium cursor-pointer border border-[#3e2d21]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-5 py-2 bg-[#d4b292] hover:bg-[#e4caa8] text-[#1c1510] font-bold rounded-xl text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Print Packing Waybill</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL 2: UPDATE COURIER & TRACKING DETAILS */}
      {/* ==================================================== */}
      <AnimatePresence>
        {editingPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#241a13] border border-[#523e2f] rounded-3xl p-6 max-w-md w-full text-[#f4efe5] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#36271e] pb-3">
                <h4 className="font-serif italic font-bold text-base text-[#f4efe5]">
                  Update Logistics & Tracking Details
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="text-[#a89382] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePackageEdits} className="space-y-3.5 text-xs text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#a89382] uppercase">Courier Provider</label>
                  <input
                    type="text"
                    value={customCourierInput}
                    onChange={(e) => setCustomCourierInput(e.target.value)}
                    placeholder="e.g. J&T Cargo, PosLaju, NinjaVan, DHL, Lalamove"
                    className="w-full bg-[#17100b] border border-[#3e2d21] rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#d4b292]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#a89382] uppercase">Courier Tracking Number</label>
                  <input
                    type="text"
                    value={customTrackingInput}
                    onChange={(e) => setCustomTrackingInput(e.target.value)}
                    placeholder="e.g. JT6019948201MY"
                    className="w-full bg-[#17100b] border border-[#3e2d21] rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#d4b292]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#a89382] uppercase">Dedication / Handling Note</label>
                  <textarea
                    rows={3}
                    value={customNoteInput}
                    onChange={(e) => setCustomNoteInput(e.target.value)}
                    placeholder="Instructions for driver or shelter reception..."
                    className="w-full bg-[#17100b] border border-[#3e2d21] rounded-xl px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#d4b292]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="px-4 py-2 bg-[#2d1f16] text-[#c8b7a6] hover:text-white rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#d4b292] hover:bg-[#e4caa8] text-[#1c1510] font-bold rounded-xl text-xs cursor-pointer shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* MODAL 3: RECEIVER THANK-YOU NOTE TO DONOR */}
      {/* ==================================================== */}
      <AnimatePresence>
        {thankYouPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#241a13] border border-[#523e2f] rounded-3xl p-6 max-w-md w-full text-[#f4efe5] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#36271e] pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <h4 className="font-serif italic font-bold text-base text-[#f4efe5]">
                    Send Thank-You Note to Donor
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setThankYouPackage(null)}
                  className="text-[#a89382] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#c8b7a6]">
                Writing thank-you note to <strong className="text-[#f4efe5]">{thankYouPackage.donorName}</strong> for receiving <strong>{thankYouPackage.itemTitle}</strong>.
              </p>

              <form onSubmit={handleSendThankYou} className="space-y-3 text-xs text-left">
                <textarea
                  rows={4}
                  required
                  value={thankYouMessage}
                  onChange={(e) => setThankYouMessage(e.target.value)}
                  placeholder="E.g. We have safely unpacked the diapers and distributed them to 12 infant families today. Your generosity brings so much relief!"
                  className="w-full bg-[#17100b] border border-[#3e2d21] rounded-xl px-3.5 py-2.5 text-xs text-[#f4efe5] focus:outline-none focus:border-[#d4b292]"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setThankYouPackage(null)}
                    className="px-4 py-2 bg-[#2d1f16] text-[#c8b7a6] hover:text-white rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold rounded-xl text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Thank-You Note</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
