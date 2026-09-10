import seedData from "./seedDatabase.json";
import type { DeliveryPackageItem, RecipientRequest } from "../types";

export interface SeedUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "donor" | "recipient" | "admin";
  charityName?: string;
  contact: string;
  isVerified: boolean;
  joinedDate: string;
  bio: string;
  avatarUrl: string;
  donationsCompleted: number;
  location: {
    address: string;
    postcode: string;
    state: string;
    district: string;
    country: string;
  };
  verificationBadges?: string[];
}

export interface SeedUserDonation {
  id: string;
  userEmail: string;
  title: string;
  category: string;
  quantity: string;
  date: string;
  status: string;
}

export interface SeedDatabaseStructure {
  version: string;
  generatedDate: string;
  description: string;
  users: SeedUser[];
  deliveryPackages: DeliveryPackageItem[];
  userDonations: SeedUserDonation[];
  communityRequests: RecipientRequest[];
}

export const SEED_DATABASE: SeedDatabaseStructure = seedData as unknown as SeedDatabaseStructure;

export const SEED_USERS: SeedUser[] = SEED_DATABASE.users;
export const SEED_DELIVERY_PACKAGES: DeliveryPackageItem[] = SEED_DATABASE.deliveryPackages;
export const SEED_USER_DONATIONS: SeedUserDonation[] = SEED_DATABASE.userDonations;
export const SEED_COMMUNITY_REQUESTS: RecipientRequest[] = SEED_DATABASE.communityRequests;

/**
 * Helper to retrieve seed user by email
 */
export function getSeedUserByEmail(email: string): SeedUser | undefined {
  if (!email) return undefined;
  return SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Helper to get delivery packages for a specific user email
 */
export function getSeedPackagesForUser(email: string): DeliveryPackageItem[] {
  if (!email) return [];
  const lower = email.toLowerCase();
  return SEED_DELIVERY_PACKAGES.filter(
    (p) =>
      (p.donorEmail && p.donorEmail.toLowerCase() === lower) ||
      (p.receiverName && p.receiverName.toLowerCase().includes(lower))
  );
}

/**
 * Helper to get donations made for a specific user email
 */
export function getSeedDonationsForUser(email: string): SeedUserDonation[] {
  if (!email) return [];
  const lower = email.toLowerCase();
  return SEED_USER_DONATIONS.filter((d) => d.userEmail.toLowerCase() === lower);
}
