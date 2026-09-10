import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  type Unsubscribe
} from "firebase/firestore";
import { db, auth } from "./firebase";
import type { RecipientRequest, UserProfile, FeedbackComment, DeliveryPackageItem } from "../types";
import {
  SEED_USERS,
  SEED_DELIVERY_PACKAGES,
  SEED_USER_DONATIONS,
  SEED_COMMUNITY_REQUESTS
} from "../data/seedDatabase";
import {
  MASTER_COMMUNITY_REQUESTS,
  getAllMergedCommunityRequests,
  broadcastCommunityRequestsUpdate
} from "../data/allRequestsCatalog";

// Collection References
export const USERS_COLLECTION = "users";
export const REQUESTS_COLLECTION = "requests";
export const PLEDGES_COLLECTION = "pledges";
export const COMMENTS_COLLECTION = "comments";
export const FEEDBACK_COLLECTION = "feedback_stories";
export const SUBSCRIPTIONS_COLLECTION = "subscriptions";
export const DELIVERY_PACKAGES_COLLECTION = "delivery_packages";
export const USER_DONATIONS_COLLECTION = "user_donations";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function logFirestoreWarning(error: unknown, operationType: OperationType, path: string | null) {
  const isOfflineOrUnavailable =
    error instanceof Error &&
    (error.message.includes("unavailable") ||
      error.message.includes("offline") ||
      error.message.includes("Could not reach Cloud Firestore"));

  if (!isOfflineOrUnavailable) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid || null,
        email: auth.currentUser?.email || null,
        emailVerified: auth.currentUser?.emailVerified || null,
        isAnonymous: auth.currentUser?.isAnonymous || null,
      },
      operationType,
      path,
    };
    console.warn("Firestore Operation Notice:", JSON.stringify(errInfo));
  }
}

/* ==========================================================================
   1. Requests & Community Needs Services
   ========================================================================== */

export interface CloudRequest extends RecipientRequest {
  createdAtTimestamp?: any;
  updatedAtTimestamp?: any;
}

/**
 * Subscribe in real-time to all community needs & requests
 */
export function subscribeToAllRequests(
  callback: (requests: RecipientRequest[]) => void
): Unsubscribe {
  try {
    const reqCol = collection(db, REQUESTS_COLLECTION);
    return onSnapshot(
      reqCol,
      (snapshot) => {
        const items: RecipientRequest[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as RecipientRequest;
          items.push({
            ...data,
            id: docSnap.id
          });
        });
        callback(items);
      },
      (error) => {
        logFirestoreWarning(error, OperationType.LIST, REQUESTS_COLLECTION);
      }
    );
  } catch (err) {
    logFirestoreWarning(err, OperationType.LIST, REQUESTS_COLLECTION);
    return () => {};
  }
}

/**
 * Create or save a request to Cloud Firestore
 */
export async function saveRequestToCloud(request: RecipientRequest): Promise<string> {
  const docId = request.id || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanRequest: RecipientRequest = {
    ...request,
    id: docId,
    updatedAt: new Date().toISOString(),
    createdAt: request.createdAt || new Date().toISOString()
  };
  
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, docId);
    await setDoc(docRef, cleanRequest, { merge: true });
  } catch (err) {
    logFirestoreWarning(err, OperationType.WRITE, `${REQUESTS_COLLECTION}/${docId}`);
  }

  // Update local storage and broadcast to all mounted views (Browse Needs, Your Request, etc.)
  try {
    const current = getAllMergedCommunityRequests();
    const filtered = current.filter((r) => r.id !== docId);
    const updated = [cleanRequest, ...filtered];
    broadcastCommunityRequestsUpdate(updated);
  } catch {}

  return docId;
}

/**
 * Delete a request from Cloud Firestore
 */
export async function deleteRequestFromCloud(requestId: string): Promise<void> {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, requestId);
    await deleteDoc(docRef);
  } catch (err) {
    logFirestoreWarning(err, OperationType.DELETE, `${REQUESTS_COLLECTION}/${requestId}`);
  }

  try {
    const current = getAllMergedCommunityRequests();
    const updated = current.filter((r) => r.id !== requestId);
    broadcastCommunityRequestsUpdate(updated);
  } catch {}
}

/**
 * Update request pledge quantity or status
 */
export async function updateRequestInCloud(
  requestId: string,
  updates: Partial<RecipientRequest>
): Promise<void> {
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, requestId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    logFirestoreWarning(err, OperationType.UPDATE, `${REQUESTS_COLLECTION}/${requestId}`);
  }

  try {
    const current = getAllMergedCommunityRequests();
    const updated = current.map((r) => {
      if (r.id === requestId) {
        return { ...r, ...updates, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    broadcastCommunityRequestsUpdate(updated);
  } catch {}
}

/**
 * Seed initial catalog requests if cloud database is empty
 */
export async function seedInitialRequestsIfEmpty(defaultRequests?: RecipientRequest[]): Promise<void> {
  const requestsToSeed = (defaultRequests && defaultRequests.length > 0) ? defaultRequests : MASTER_COMMUNITY_REQUESTS;
  try {
    const reqCol = collection(db, REQUESTS_COLLECTION);
    const snap = await getDocs(reqCol);
    if (snap.empty && requestsToSeed.length > 0) {
      const batch = writeBatch(db);
      requestsToSeed.forEach((req) => {
        const ref = doc(db, REQUESTS_COLLECTION, req.id);
        batch.set(ref, {
          ...req,
          createdAt: req.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      await batch.commit();
    }
  } catch (err) {
    logFirestoreWarning(err, OperationType.WRITE, REQUESTS_COLLECTION);
  }
}

/* ==========================================================================
   2. Comments Real-time Services (Per Request)
   ========================================================================== */

export interface CloudComment {
  id: string;
  requestId: string;
  authorId?: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export function subscribeToRequestComments(
  requestId: string,
  callback: (comments: CloudComment[]) => void
): Unsubscribe {
  try {
    const commentsCol = collection(db, COMMENTS_COLLECTION);
    const q = query(commentsCol, where("requestId", "==", requestId));
    
    return onSnapshot(
      q,
      (snapshot) => {
        const list: CloudComment[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<CloudComment, "id">) });
        });
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        callback(list);
      },
      (err) => {
        logFirestoreWarning(err, OperationType.LIST, `${COMMENTS_COLLECTION}?requestId=${requestId}`);
      }
    );
  } catch (err) {
    logFirestoreWarning(err, OperationType.LIST, `${COMMENTS_COLLECTION}?requestId=${requestId}`);
    return () => {};
  }
}

export async function addCommentToCloud(comment: Omit<CloudComment, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
      ...comment,
      createdAt: comment.createdAt || new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    logFirestoreWarning(err, OperationType.CREATE, COMMENTS_COLLECTION);
    return `comment_${Date.now()}`;
  }
}

/* ==========================================================================
   3. Global Feedback & Community Stories ("Words of Hope")
   ========================================================================== */

export function subscribeToFeedbackComments(
  callback: (comments: FeedbackComment[]) => void
): Unsubscribe {
  try {
    const col = collection(db, FEEDBACK_COLLECTION);
    return onSnapshot(
      col,
      (snapshot) => {
        const list: FeedbackComment[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<FeedbackComment, "id">) });
        });
        callback(list);
      },
      (err) => {
        logFirestoreWarning(err, OperationType.LIST, FEEDBACK_COLLECTION);
      }
    );
  } catch (err) {
    logFirestoreWarning(err, OperationType.LIST, FEEDBACK_COLLECTION);
    return () => {};
  }
}

export async function addFeedbackCommentToCloud(comment: Omit<FeedbackComment, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...comment
    });
    return docRef.id;
  } catch (err) {
    logFirestoreWarning(err, OperationType.CREATE, FEEDBACK_COLLECTION);
    return `feedback_${Date.now()}`;
  }
}

/* ==========================================================================
   4. User Accounts & Real-time Profile Services
   ========================================================================== */

export async function saveUserToCloud(user: UserProfile & { password?: string }): Promise<void> {
  const userKey = (user.email || user.username || `user_${Date.now()}`).toLowerCase().trim().replace(/[^a-z0-9@._-]/g, "_");
  try {
    const docRef = doc(db, USERS_COLLECTION, userKey);
    // Passwords are managed by Firebase Authentication and must never be
    // written to Firestore as profile data.
    const { password: _password, ...safeProfile } = user;
    await setDoc(docRef, {
      ...safeProfile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    logFirestoreWarning(err, OperationType.WRITE, `${USERS_COLLECTION}/${userKey}`);
  }
}

export async function getUserFromCloud(emailOrUsername: string): Promise<UserProfile | null> {
  const key = emailOrUsername.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, "_");
  try {
    const docRef = doc(db, USERS_COLLECTION, key);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    logFirestoreWarning(err, OperationType.GET, `${USERS_COLLECTION}/${key}`);
  }
  return null;
}

/* ==========================================================================
   5. Subscriptions Real-time Services
   ========================================================================== */

export function subscribeToUserSubscriptions(
  userKey: string,
  callback: (targets: string[]) => void
): Unsubscribe {
  try {
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, userKey);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          callback(Array.isArray(data.targets) ? data.targets : []);
        } else {
          callback([]);
        }
      },
      (err) => {
        logFirestoreWarning(err, OperationType.GET, `${SUBSCRIPTIONS_COLLECTION}/${userKey}`);
      }
    );
  } catch (err) {
    logFirestoreWarning(err, OperationType.GET, `${SUBSCRIPTIONS_COLLECTION}/${userKey}`);
    return () => {};
  }
}

export async function saveSubscriptionsToCloud(
  userKey: string,
  targets: string[]
): Promise<void> {
  try {
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, userKey);
    await setDoc(docRef, { targets, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    logFirestoreWarning(err, OperationType.WRITE, `${SUBSCRIPTIONS_COLLECTION}/${userKey}`);
  }
}

/* ==========================================================================
   6. Pledges Real-time Services
   ========================================================================== */

export interface CloudPledge {
  id?: string;
  requestId: string;
  donorName: string;
  donorContact?: string;
  donorNote?: string;
  quantity: number;
  deliveryMethod?: string;
  status: string;
  createdAt: string;
}

export async function savePledgeToCloud(pledge: CloudPledge): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, PLEDGES_COLLECTION), {
      ...pledge,
      createdAt: pledge.createdAt || new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    logFirestoreWarning(err, OperationType.CREATE, PLEDGES_COLLECTION);
    return `pledge_${Date.now()}`;
  }
}

/* ==========================================================================
   7. Delivery Packages Real-time Services
   ========================================================================== */

/**
 * Save or update a delivery tracking package in Cloud Firestore
 */
export async function saveDeliveryPackageToCloud(pkg: DeliveryPackageItem): Promise<string> {
  const pkgId = pkg.id || `del_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const cleanPkg: DeliveryPackageItem = {
    ...pkg,
    id: pkgId,
    lastUpdated: pkg.lastUpdated || new Date().toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" })
  };

  try {
    const docRef = doc(db, DELIVERY_PACKAGES_COLLECTION, pkgId);
    await setDoc(docRef, cleanPkg, { merge: true });
  } catch (err) {
    logFirestoreWarning(err, OperationType.WRITE, `${DELIVERY_PACKAGES_COLLECTION}/${pkgId}`);
  }
  return pkgId;
}

/**
 * Delete a delivery tracking package
 */
export async function deleteDeliveryPackageFromCloud(pkgId: string): Promise<void> {
  try {
    const docRef = doc(db, DELIVERY_PACKAGES_COLLECTION, pkgId);
    await deleteDoc(docRef);
  } catch (err) {
    logFirestoreWarning(err, OperationType.DELETE, `${DELIVERY_PACKAGES_COLLECTION}/${pkgId}`);
  }
}

/**
 * Subscribe to all delivery packages in Cloud Firestore
 */
export function subscribeToAllDeliveryPackages(
  callback: (packages: DeliveryPackageItem[]) => void
): Unsubscribe {
  try {
    const col = collection(db, DELIVERY_PACKAGES_COLLECTION);
    return onSnapshot(
      col,
      (snapshot) => {
        const list: DeliveryPackageItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<DeliveryPackageItem, "id">) });
        });
        callback(list);
      },
      (err) => {
        logFirestoreWarning(err, OperationType.LIST, DELIVERY_PACKAGES_COLLECTION);
      }
    );
  } catch (err) {
    logFirestoreWarning(err, OperationType.LIST, DELIVERY_PACKAGES_COLLECTION);
    return () => {};
  }
}

/* ==========================================================================
   8. User Donations History Services
   ========================================================================== */

export interface CloudUserDonation {
  id: string;
  userEmail: string;
  title: string;
  category?: string;
  quantity?: string | number;
  date: string;
  status: string;
}

export async function saveUserDonationToCloud(donation: CloudUserDonation): Promise<string> {
  const donId = donation.id || `don_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  try {
    const docRef = doc(db, USER_DONATIONS_COLLECTION, donId);
    await setDoc(docRef, { ...donation, id: donId }, { merge: true });
  } catch (err) {
    logFirestoreWarning(err, OperationType.WRITE, `${USER_DONATIONS_COLLECTION}/${donId}`);
  }
  return donId;
}

export function subscribeToAllUserDonations(
  callback: (donations: CloudUserDonation[]) => void
): Unsubscribe {
  try {
    const col = collection(db, USER_DONATIONS_COLLECTION);
    return onSnapshot(
      col,
      (snapshot) => {
        const list: CloudUserDonation[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<CloudUserDonation, "id">) });
        });
        callback(list);
      },
      (err) => {
        logFirestoreWarning(err, OperationType.LIST, USER_DONATIONS_COLLECTION);
      }
    );
  } catch (err) {
    logFirestoreWarning(err, OperationType.LIST, USER_DONATIONS_COLLECTION);
    return () => {};
  }
}

/* ==========================================================================
   9. Global Database Initialization & Auto-Seeding from Seed File
   ========================================================================== */

/**
 * Subscribe to all registered users in Firestore
 */
export function subscribeToAllUsers(
  callback: (users: any[]) => void
): Unsubscribe {
  try {
    const col = collection(db, USERS_COLLECTION);
    return onSnapshot(
      col,
      (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(list);
      },
      (err) => {
        logFirestoreWarning(err, OperationType.LIST, USERS_COLLECTION);
      }
    );
  } catch (err) {
    logFirestoreWarning(err, OperationType.LIST, USERS_COLLECTION);
    return () => {};
  }
}

/**
 * Initializes and auto-populates the database with the central 15-user dataset
 * if the collections are empty, or synchronizes any missing seed records.
 */
export async function initializeSeedDatabase(forceReset = false): Promise<void> {
  try {
    // 1. Sync Users
    const usersCol = collection(db, USERS_COLLECTION);
    const userSnap = await getDocs(usersCol);
    
    if (userSnap.empty || forceReset) {
      const batch = writeBatch(db);
      SEED_USERS.forEach((u) => {
        const key = u.email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, "_");
        const ref = doc(db, USERS_COLLECTION, key);
        batch.set(ref, {
          ...u,
          updatedAt: new Date().toISOString()
        });
      });
      await batch.commit();
    }

    // 2. Sync Delivery Packages
    const delCol = collection(db, DELIVERY_PACKAGES_COLLECTION);
    const delSnap = await getDocs(delCol);
    if (delSnap.empty || forceReset) {
      const batch = writeBatch(db);
      SEED_DELIVERY_PACKAGES.forEach((p) => {
        const ref = doc(db, DELIVERY_PACKAGES_COLLECTION, p.id);
        batch.set(ref, p);
      });
      await batch.commit();
    }

    // 3. Sync User Donations History
    const donCol = collection(db, USER_DONATIONS_COLLECTION);
    const donSnap = await getDocs(donCol);
    if (donSnap.empty || forceReset) {
      const batch = writeBatch(db);
      SEED_USER_DONATIONS.forEach((d) => {
        const ref = doc(db, USER_DONATIONS_COLLECTION, d.id);
        batch.set(ref, d);
      });
      await batch.commit();
    }

    // 4. Sync Community Requests
    const reqCol = collection(db, REQUESTS_COLLECTION);
    const reqSnap = await getDocs(reqCol);
    if (reqSnap.empty || forceReset) {
      const batch = writeBatch(db);
      MASTER_COMMUNITY_REQUESTS.forEach((r) => {
        const ref = doc(db, REQUESTS_COLLECTION, r.id);
        batch.set(ref, {
          ...r,
          updatedAt: new Date().toISOString(),
          createdAt: r.createdAt || new Date().toISOString()
        });
      });
      await batch.commit();
    }

    // Also populate local storage as offline cache
    if (typeof window !== "undefined") {
      const existingStoredUsers = localStorage.getItem("aidstory_users");
      if (!existingStoredUsers || forceReset) {
        localStorage.setItem("aidstory_users", JSON.stringify(SEED_USERS));
      }
      const existingStoredPackages = localStorage.getItem("aidstory_delivery_packages");
      if (!existingStoredPackages || forceReset) {
        localStorage.setItem("aidstory_delivery_packages", JSON.stringify(SEED_DELIVERY_PACKAGES));
      }
      const mergedNeeds = getAllMergedCommunityRequests();
      localStorage.setItem("aidstory_all_needs", JSON.stringify(mergedNeeds));
      localStorage.setItem("aidstory_recipient_requests", JSON.stringify(mergedNeeds));
      
      const existingStoredDonations = localStorage.getItem("aidstory_completed_donations");
      if (!existingStoredDonations || forceReset) {
        localStorage.setItem("aidstory_completed_donations", JSON.stringify(SEED_USER_DONATIONS));
      }
    }
  } catch (err) {
    logFirestoreWarning(err, OperationType.WRITE, "database_seed");
  }
}
