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
  pledgedQuantity: number;
  postedDate: string;
  postedTimestamp: number;
  status: "active" | "fulfilled" | "cancelled";
  fulfilledDate?: string;
  campaignId?: string;
  campaignTitle?: string;
  authorName?: string;
  authorType?: string;
  urgencyLevel?: "emergency" | "urgent" | "high" | "medium" | "standard";
  brand?: string;
  color?: string;
  tags?: string[];
  updates?: RequestUpdate[];
  comments?: RequestComment[];
  organizerName?: string;
  organizerAvatar?: string;
  distanceText?: string;
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
}
