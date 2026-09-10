import { RecipientRequest } from "../types";

export interface ResolvedReceiverProfile {
  name: string;
  avatarUrl: string | null;
  initials: string;
  roleType: string;
  isVerified: boolean;
  credentialsId: string;
  description: string;
  instagram: string;
  facebook: string;
  email: string;
  phone: string;
  joinedDate: string;
  location: string;
  journeyDays: number;
  subscribersCount: number;
  isCurrentUser: boolean;
}

// Deterministic hash for consistent stats across sessions
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

// Normalize identity strings for robust comparison
export function normalizeIdentity(val?: string): string {
  if (!val) return "";
  return val
    .toLowerCase()
    .trim()
    .replace(/^(you\s*\(|\))/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/0+(\d)/g, "$1");
}

/** Adds a deterministic, display-only street address to short city/state labels. */
export function formatDetailedLocation(location?: string, identity?: string): string {
  const normalizedLocation = location?.trim() || "Sibu, Sabah";
  if (/\bNo\.\s*\d+/i.test(normalizedLocation)) return normalizedLocation;

  const parts = normalizedLocation.split(",").map((part) => part.trim()).filter(Boolean);
  const city = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  const state = parts.length >= 2 ? parts[parts.length - 1] : "Malaysia";
  const postcodes: Record<string, string> = {
    "Sibu": "96000",
    "Kuching": "93100",
    "Shah Alam": "40000",
    "Ipoh": "30000",
    "Johor Bahru": "80000",
    "Kuala Lumpur": "50000",
    "Melaka Tengah": "75000",
    "Kuantan": "25000",
    "George Town": "10000"
  };
  const key = `${identity || "aidstory"}${normalizedLocation}`;
  const streetNumber = 10 + (getHash(key) % 90);

  // A location which already includes a road/address only needs a building number.
  if (/\b(jalan|lorong|persiaran|sek(?:syen)?\b)/i.test(normalizedLocation)) {
    return `No. ${streetNumber}, ${normalizedLocation}`;
  }

  return `No. ${streetNumber}, Jalan ${city} Utama, ${postcodes[city] || "00000"} ${city}, ${state}`;
}

// Known NGO details mapping for authentic community shelters
const KNOWN_ORGANIZATIONS: Record<string, Partial<ResolvedReceiverProfile>> = {
  sibu_animal_hope: {
    name: "Sibu Animal Hope Shelter (NGO)",
    avatarUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=80",
    initials: "SI",
    roleType: "REGISTERED ANIMAL SHELTER & NGO",
    isVerified: true,
    credentialsId: "DISPATCH-SIBU-HOPE-01",
    description: "Organizing genuine local aid drives for community emergency relief, animal rescue, shelter feeding, and healthcare assistance across Sibu.",
    instagram: "sibu_animalhope",
    facebook: "sibu.animalhope.shelter",
    email: "sibu.animalhope@aidstory.org",
    phone: "+60 12-883 9102",
    joinedDate: "March 2024",
    location: "Lorong 4, Pekan Sibu, 96000 Sibu, Sarawak",
    journeyDays: 890,
    subscribersCount: 1265
  },
  wearecharity1: {
    name: "WeAreCharity1 (NGO)",
    avatarUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=300&q=80",
    initials: "WC",
    roleType: "COMMUNITY NIGHT SHELTER DISPATCHER",
    isVerified: true,
    credentialsId: "DISPATCH-WEARECHARITY-01",
    description: "Providing emergency shelter bedding, thermal fleece blankets, dry rations, and healthcare assistance for vulnerable urban occupants.",
    instagram: "wearecharity_official",
    facebook: "wearecharity1.relief",
    email: "wearecharity1@aidstory.org",
    phone: "+60 12-883 9102",
    joinedDate: "March 2024",
    location: "Pekan Sibu, 96000 Sibu, Sabah",
    journeyDays: 890,
    subscribersCount: 1265
  },
  johor_flood: {
    name: "Johor Flood Relief Network (Charity)",
    avatarUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=300&q=80",
    initials: "JF",
    roleType: "EMERGENCY FLOOD RELIEF CHARITY",
    isVerified: true,
    credentialsId: "DISPATCH-JOHOR-RELIEF",
    description: "Rapid-response emergency logistics providing clean drinking water, dry food packs, and evacuation support to flood-affected families.",
    instagram: "johor_floodrelief",
    facebook: "johor.flood.relief",
    email: "contact@johorfloodrelief.org",
    phone: "+60 17-234 5678",
    joinedDate: "January 2024",
    location: "Jalan Tun Abdul Razak, 80000 Johor Bahru, Johor",
    journeyDays: 950,
    subscribersCount: 1540
  },
  sarawak_water: {
    name: "Sarawak Rural Safe Water Mission (NGO)",
    avatarUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=80",
    initials: "SW",
    roleType: "RURAL CLEAN WATER & SANITATION NGO",
    isVerified: true,
    credentialsId: "DISPATCH-SARAWAK-WATER",
    description: "Delivering ceramic gravity water filters, sanitation kits, and safety gear to rural interior communities and river villages.",
    instagram: "sarawak_safewater",
    facebook: "sarawak.safewater",
    email: "ruralwater@sarawakaid.org",
    phone: "+60 19-876 5432",
    joinedDate: "June 2023",
    location: "Jalan Padungan, 93100 Kuching, Sarawak",
    journeyDays: 1140,
    subscribersCount: 1890
  },
  bangsar_infant: {
    name: "Bangsar Infant Care Relief (Charity)",
    avatarUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=300&q=80",
    initials: "BI",
    roleType: "MATERNAL & INFANT CARE CHARITY",
    isVerified: true,
    credentialsId: "DISPATCH-BANGSAR-INFANT",
    description: "Supplying infant formula milk, diaper packs, and newborn hygiene kits to underprivileged mothers and community daycare centers.",
    instagram: "bangsar_infantcare",
    facebook: "bangsar.infant.care",
    email: "care@bangsarinfant.org",
    phone: "+60 13-987 6543",
    joinedDate: "April 2024",
    location: "Jalan Telawi, Bangsar, 59100 Kuala Lumpur",
    journeyDays: 850,
    subscribersCount: 980
  },
  sibu_kindergarten: {
    name: "Sibu Community Kindergarten (NGO)",
    avatarUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80",
    initials: "SK",
    roleType: "CHILD EDUCATION & LITERACY NGO",
    isVerified: true,
    credentialsId: "DISPATCH-SIBU-KINDERGARTEN",
    description: "Fostering early literacy through storybooks, creative learning materials, and education supplies for rural preschool children.",
    instagram: "sibu_kindergarten",
    facebook: "sibu.community.kindergarten",
    email: "edu@sibukindergarten.org",
    phone: "+60 16-778 8990",
    joinedDate: "August 2023",
    location: "Jalan Pedada, 96000 Sibu, Sarawak",
    journeyDays: 1090,
    subscribersCount: 1120
  },
  shah_alam_shelter: {
    name: "Shah Alam Emergency Shelter (Charity)",
    avatarUrl: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=300&q=80",
    initials: "SA",
    roleType: "EMERGENCY SHELTER CHARITY",
    isVerified: true,
    credentialsId: "DISPATCH-SHAH-ALAM",
    description: "Providing comfortable high-density mattresses, bedding kits, and emergency provisions for displaced community center residents.",
    instagram: "shahalam_shelter",
    facebook: "shahalam.emergencyshelter",
    email: "shelter@shahalamrelief.org",
    phone: "+60 12-334 4556",
    joinedDate: "February 2024",
    location: "Seksyen 13, 40100 Shah Alam, Selangor",
    journeyDays: 920,
    subscribersCount: 1340
  },
  sibu_relief_foodbank: {
    name: "Sibu Relief Food Bank (NGO)",
    avatarUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=300&q=80",
    initials: "SR",
    roleType: "COMMUNITY FOOD RELIEF NGO",
    isVerified: true,
    credentialsId: "DISPATCH-SIBU-FOODBANK",
    description: "Distributing balanced non-perishable canned food, pantry essentials, and emergency nourishment packs across Sibu division.",
    instagram: "sibu_foodbank",
    facebook: "sibu.relief.foodbank",
    email: "foodbank@siburelieftrust.org",
    phone: "+60 14-556 6778",
    joinedDate: "May 2023",
    location: "Jalan Bukit Assek, 96000 Sibu, Sarawak",
    journeyDays: 1180,
    subscribersCount: 1470
  }
};

export function resolveReceiverProfile(
  request: RecipientRequest,
  currentUser: any
): ResolvedReceiverProfile {
  const rawOrganizerName = request.organizerName || request.authorName || "Sibu Animal Hope Shelter (NGO)";
  const normOrganizer = normalizeIdentity(rawOrganizerName);
  
  const currentUsernameNorm = normalizeIdentity(currentUser?.username);
  const currentCharityNorm = normalizeIdentity(currentUser?.charityName);
  const currentUserEmail = (currentUser?.email || "").toLowerCase().trim();
  const authorEmail = (request.authorEmail || request.createdByUserEmail || "").toLowerCase().trim();

  // Check if organizer is the logged in user
  const isCurrentUser = Boolean(
    currentUser && (
      (currentUserEmail && authorEmail && currentUserEmail === authorEmail) ||
      (currentUsernameNorm && (
        currentUsernameNorm === normOrganizer ||
        normOrganizer.includes(currentUsernameNorm) ||
        currentUsernameNorm.includes(normOrganizer)
      )) ||
      (currentCharityNorm && (
        currentCharityNorm === normOrganizer ||
        normOrganizer.includes(currentCharityNorm) ||
        currentCharityNorm.includes(normOrganizer)
      ))
    )
  );

  // If it's the current user, construct profile exactly matching "Your Account Profile"
  if (isCurrentUser && currentUser) {
    const username = currentUser.username || "NGO01";
    const joined = currentUser.joinedDate
      ? new Date(currentUser.joinedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "16 Aug 2026";
    
    // Calculate journey days
    const joinedMs = currentUser.joinedDate ? new Date(currentUser.joinedDate).getTime() : Date.now() - 604800000;
    const diffDays = Math.max(1, Math.floor((Date.now() - joinedMs) / (1000 * 60 * 60 * 24)));

    // Extract address
    let fullLocation = "Ipoh Relief Depot, Perak, Malaysia";
    if (currentUser.address) {
      fullLocation = `${currentUser.address}${currentUser.postcode ? ", " + currentUser.postcode : ""}${currentUser.state ? ", " + currentUser.state : ""}`;
    }

    return {
      name: currentUser.charityName || username,
      avatarUrl: currentUser.avatarUrl || currentUser.profilePhoto || null,
      initials: (username || "NG").substring(0, 2).toUpperCase(),
      roleType: currentUser.roleType || "AIDSTORY COMMUNITY DISPATCHER",
      isVerified: true,
      credentialsId: `DISPATCH-${username.toUpperCase()}`,
      description: currentUser.description || "Dedicated to emergency flood relief, transparent in-kind food distribution, and urgent community supply dispatching across regional hubs.",
      instagram: currentUser.instagram || "ngo1_aidstory",
      facebook: currentUser.facebook || "ngo1relief",
      email: currentUser.email || "ngo1@gmail.com",
      phone: currentUser.contact || "+60 33-7894561",
      joinedDate: joined,
      location: fullLocation,
      journeyDays: diffDays,
      subscribersCount: 1265,
      isCurrentUser: true
    };
  }

  // Check if matched in registered users list (aidstory_users)
  if (typeof window !== "undefined") {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("aidstory_users") || "[]");
      const foundUser = storedUsers.find((u: any) => {
        const uNameNorm = normalizeIdentity(u.username);
        const uCharityNorm = normalizeIdentity(u.charityName);
        const uEmail = (u.email || "").toLowerCase().trim();
        return (
          (uEmail && authorEmail && uEmail === authorEmail) ||
          (uNameNorm && (uNameNorm === normOrganizer || normOrganizer.includes(uNameNorm))) ||
          (uCharityNorm && (uCharityNorm === normOrganizer || normOrganizer.includes(uCharityNorm)))
        );
      });

      if (foundUser) {
        const uName = foundUser.username || rawOrganizerName;
        return {
          name: foundUser.charityName || foundUser.username || rawOrganizerName,
          avatarUrl: foundUser.avatarUrl || foundUser.profilePhoto || null,
          initials: (uName || "NG").substring(0, 2).toUpperCase(),
          roleType: foundUser.roleType || "AIDSTORY COMMUNITY DISPATCHER",
          isVerified: true,
          credentialsId: `DISPATCH-${uName.toUpperCase()}`,
          description: foundUser.description || "Organizing transparent in-kind relief aid and essential community supply distribution.",
          instagram: foundUser.instagram || `${uName.toLowerCase()}_aidstory`,
          facebook: foundUser.facebook || `${uName.toLowerCase()}.relief`,
          email: foundUser.email || `${uName.toLowerCase()}@aidstory.org`,
          phone: foundUser.contact || "+60 12-3456789",
          joinedDate: foundUser.joinedDate ? new Date(foundUser.joinedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "March 2024",
          location: foundUser.address ? `${foundUser.address}, ${foundUser.postcode || ""} ${foundUser.state || ""}` : (request.location || "Sibu, Sarawak"),
          journeyDays: 850,
          subscribersCount: 1265,
          isCurrentUser: false
        };
      }
    } catch (e) {}
  }

  // Check Known Organizations dictionary
  for (const [key, orgData] of Object.entries(KNOWN_ORGANIZATIONS)) {
    const keyNorm = normalizeIdentity(key);
    const orgNameNorm = normalizeIdentity(orgData.name);
    if (normOrganizer.includes(keyNorm) || normOrganizer.includes(orgNameNorm) || (orgData.name && orgData.name.toLowerCase() === rawOrganizerName.toLowerCase())) {
      // If request has a direct image avatar, prefer it if valid
      const reqAvatar = request.organizerAvatar && (request.organizerAvatar.startsWith("http") || request.organizerAvatar.startsWith("data:"))
        ? request.organizerAvatar
        : orgData.avatarUrl || null;

      return {
        name: orgData.name || rawOrganizerName,
        avatarUrl: reqAvatar,
        initials: orgData.initials || rawOrganizerName.substring(0, 2).toUpperCase(),
        roleType: orgData.roleType || "VERIFIED AIDSTORY NGO HUB",
        isVerified: true,
        credentialsId: orgData.credentialsId || `DISPATCH-${key.toUpperCase()}`,
        description: orgData.description || "Organizing genuine local aid drives for community emergency relief, animal rescue, and healthcare assistance in Sarawak.",
        instagram: orgData.instagram || "aidstory_community",
        facebook: orgData.facebook || "aidstory.community",
        email: orgData.email || "support@aidstory.org",
        phone: orgData.phone || "+60 12-883 9102",
        joinedDate: orgData.joinedDate || "March 2024",
        location: request.location || orgData.location || "Sibu, Sabah",
        journeyDays: orgData.journeyDays || 890,
        subscribersCount: orgData.subscribersCount || 1265,
        isCurrentUser: false
      };
    }
  }

  // Default fallback for any other receiver / organizer
  const hash = getHash(rawOrganizerName);
  const cleanHandle = rawOrganizerName.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 16);
  const initials = rawOrganizerName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "OR";

  const directReqAvatar = request.organizerAvatar && (request.organizerAvatar.startsWith("http") || request.organizerAvatar.startsWith("data:"))
    ? request.organizerAvatar
    : null;

  return {
    name: rawOrganizerName,
    avatarUrl: directReqAvatar,
    initials: initials,
    roleType: "COMMUNITY AID DISPATCHER",
    isVerified: true,
    credentialsId: `DISPATCH-${cleanHandle.toUpperCase().slice(0, 12)}`,
    description: "Dedicated to local community relief drives, transparent in-kind donation fulfillment, and urgent welfare support.",
    instagram: `${cleanHandle}_aid`,
    facebook: `${cleanHandle}.official`,
    email: request.authorEmail || `${cleanHandle}@aidstory.org`,
    phone: "+60 12-883 9102",
    joinedDate: "March 2024",
    location: request.location || "Sibu, Sabah",
    journeyDays: 600 + (hash % 400),
    subscribersCount: 1100 + (hash % 600),
    isCurrentUser: false
  };
}
