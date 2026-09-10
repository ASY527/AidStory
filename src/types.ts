export type ModalType = "explore" | "donate_exactly" | "transparency" | "community_growth" | "success" | "comments" | null;

export interface FeedbackComment {
  id: string;
  name: string;
  email: string;
  comment: string;
  date: string;
}

export type RequestCategory = 
  | "Emergency" 
  | "Food" 
  | "Animal" 
  | "Medical" 
  | "Elderly / OKU" 
  | "Education" 
  | "Clothing" 
  | "Household"
  | "Others";

export interface RequestUpdate {
  id: string;
  date: string;
  text: string;
  author?: string;
}

export interface RequestComment {
  id: string;
  userName: string;
  avatarUrl?: string;
  comment: string;
  date?: string;
}

export interface RecipientRequest {
  id: string;
  title: string;
  category: RequestCategory;
  categories?: string[];
  customCategory?: string;
  description: string;
  imageUrl: string;
  images?: string[];
  location: string;
  quantity: number;
  unit: string;
  /** Units the recipient has explicitly confirmed as received. */
  receivedQuantity?: number;
  /** Pledged units still being dispatched or awaiting recipient confirmation. */
  inTransitQuantity?: number;
  pledgedQuantity: number;
  postedDate: string;
  postedTimestamp: number;
  status: "active" | "fulfilled" | "cancelled";
  fulfilledDate?: string;
  campaignId?: string;
  campaignTitle?: string;
  authorName?: string;
  authorEmail?: string;
  authorId?: string;
  authorType?: string;
  createdByUserEmail?: string;
  createdByUsername?: string;
  // New requests use Standard, Important, or Emergency. Legacy values are
  // retained temporarily so existing saved requests can still be displayed.
  urgencyLevel?: "emergency" | "important" | "standard" | "urgent" | "high" | "medium" | "low";
  brand?: string;
  color?: string;
  tags?: string[];
  updates?: RequestUpdate[];
  comments?: RequestComment[];
  organizerName?: string;
  organizerAvatar?: string;
  distanceText?: string;
  createdAt?: string;
  updatedAt?: string;
  isCampaign?: boolean;
}

/** Formats every request's posted date as `dd/mm/yyyy hh:mm AM/PM`. */
export function formatRequestPostedDate(postedDate?: string, postedTimestamp?: number): string {
  const format = (date: Date) => {
    const datePart = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    return `${datePart} ${timePart}`;
  };

  const value = postedDate?.trim();
  if (value) {
    // ISO dates are parsed manually so date-only values do not shift with UTC.
    const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2})(?::\d{2})?)?$/);
    if (iso) {
      const [, year, month, day, hour = "0", minute = "0"] = iso;
      return format(new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
    }

    const namedMonth = value.match(
      /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})(?:,?\s+(\d{1,2}):(\d{2})\s*(AM|PM)?)?$/i
    );
    if (namedMonth) {
      const [, day, monthName, year, hour = "0", minute = "0", meridiem] = namedMonth;
      const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(
        monthName.slice(0, 3).toLowerCase()
      );
      if (month >= 0) {
        let parsedHour = Number(hour);
        if (meridiem?.toUpperCase() === "PM" && parsedHour < 12) parsedHour += 12;
        if (meridiem?.toUpperCase() === "AM" && parsedHour === 12) parsedHour = 0;
        return format(new Date(Number(year), month, Number(day), parsedHour, Number(minute)));
      }
    }
  }

  if (postedTimestamp && Number.isFinite(postedTimestamp)) {
    return format(new Date(postedTimestamp));
  }

  return "--/--/---- --:--";
}

export interface UserProfile {
  id?: string;
  username: string;
  email: string;
  charityName?: string;
  role?: "donor" | "recipient" | "admin";
  isVerified?: boolean;
  avatarUrl?: string;
  state?: string;
  district?: string;
  phone?: string;
  bio?: string;
  donationsCompleted?: number;
  verificationBadges?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AidCampaign {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate?: string;
  createdAt: string;
  status: "active" | "completed";
  requestIds: string[];
  bannerEmoji?: string;
  authorName?: string;
  authorEmail?: string;
  createdByUserEmail?: string;
  createdByUsername?: string;
}

export type DeliveryMethodType = "courier" | "dropoff" | "volunteer" | "direct";

export type DeliveryProgressStage = 
  | "pledged" 
  | "prepared_for_pickup" 
  | "courier_picked_up" 
  | "prepared_for_dropoff" 
  | "in_transit" 
  | "arrived_at_hub" 
  | "out_for_delivery" 
  | "delivered_to_charity" 
  | "received_by_beneficiary";

export interface DeliveryTimelineEvent {
  id: string;
  stage: DeliveryProgressStage;
  title: string;
  description: string;
  timestamp: string;
  updatedBy?: string;
  trackingNumber?: string;
  courierName?: string;
  proofPhotoUrl?: string;
  notes?: string;
}

export interface DeliveryPackageItem {
  id: string;
  trackingId: string;
  type: "donate" | "receive"; // Outgoing donation vs incoming receiver item
  requestId?: string;
  itemTitle: string;
  category: string;
  quantity: number;
  unit: string;
  imageUrl?: string;
  brand?: string;
  color?: string;
  
  // Donor details
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  donorNote?: string;
  
  // Receiver details
  receiverName: string;
  /** Email of the user who created the linked aid request. */
  requesterEmail?: string;
  /** Kept for compatibility with older delivery records. */
  receiverEmail?: string;
  receiverLocation: string;
  receiverHub?: string;
  receiverPhone?: string;
  receiverAvatar?: string;
  
  // Logistics
  deliveryMethod: DeliveryMethodType;
  courierProvider?: string;
  trackingNumber?: string;
  scheduledDate: string;
  scheduledTimeSlot?: string;
  dropoffHubName?: string;
  dropoffHubAddress?: string;
  /** True when the donor hands the parcel directly to the requesting charity. */
  isDirectCharityDropoff?: boolean;
  estimatedDeliveryDate?: string;
  
  // Progress
  currentStage: DeliveryProgressStage;
  stageProgressPercent: number; // 0 - 100
  lastUpdated: string;
  timeline: DeliveryTimelineEvent[];
}

/**
 * Automatically standardizes titles so that the first letter of each word is capitalized.
 * E.g.: "Campaign A - DOG'S FOODS" -> "Campaign A - Dog's Foods"
 * "BABY PAMPERS" -> "Baby Pampers"
 * "baby pampers" -> "Baby Pampers"
 * "clean drinking water (1.5L)" -> "Clean Drinking Water (1.5L)"
 * "10kg AAA Fragrant White Rice & Cooking Oil (5kg)" -> "10kg AAA Fragrant White Rice & Cooking Oil (5kg)"
 * "Campaign B - STORYBOOKS" -> "Campaign B - Storybooks"
 */
export const formatCapitalizedTitle = (input: string): string => {
  if (!input) return "";

  return input
    .split(/(\s+|[-_/()[\]{}"',&:+])/g)
    .map((token) => {
      if (!token || /^(\s+|[-_/()[\]{}"',&:+]+)$/.test(token)) {
        return token;
      }

      // Preserve known acronyms
      const upper = token.toUpperCase();
      const knownAcronyms = ["OKU", "NGO", "AAA", "B40", "SOS", "VIP", "QR", "IC", "ID", "UK", "US", "USA", "KL", "JB"];
      if (knownAcronyms.includes(upper)) {
        return upper;
      }

      // If token starts with digits (e.g. 10kg, 1.5L, 850g, 500ml), preserve
      if (/^\d/.test(token)) {
        return token;
      }

      // Handle words with apostrophes like DOG'S -> Dog's or DON'T -> Don't
      if (token.includes("'")) {
        const parts = token.split("'");
        return parts
          .map((p, idx) => {
            if (!p) return "";
            if (idx === 1 && p.toLowerCase() === "s") return "s";
            return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
          })
          .join("'");
      }

      // If word is all uppercase (e.g. "FOODS", "PAMPERS", "STORYBOOKS") or all lowercase ("baby", "pampers")
      if (token === token.toUpperCase() || token === token.toLowerCase()) {
        return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
      }

      // Mixed-case, ensure first character is capital
      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join("");
};
