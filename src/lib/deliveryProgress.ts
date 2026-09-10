import type { DeliveryPackageItem, RecipientRequest } from "../types";

export interface DeliveryProgress {
  done: number;
  inTransit: number;
  pledged: number;
}

/**
 * Delivery packages are the single source of truth for request progress. 
 * A package is green only after the receiving charity has confirmed it; 
 * every other linked package remains yellow until that confirmation happens.
 */
export function getDeliveryProgress(
  request: Pick<RecipientRequest, "id" | "quantity">,
  packages: DeliveryPackageItem[]
): DeliveryProgress {
  const target = Math.max(0, Number(request.quantity) || 0);
  const linkedPackages = packages.filter((pkg) => pkg.requestId === request.id);

  const confirmed = linkedPackages.reduce(
    (total, pkg) =>
      total + (pkg.currentStage === "received_by_beneficiary" ? Math.max(0, Number(pkg.quantity) || 0) : 0), 0
  );
  const unconfirmed = linkedPackages.reduce(
    (total, pkg) =>
      total + (pkg.currentStage !== "received_by_beneficiary" ? Math.max(0, Number(pkg.quantity) || 0) : 0), 0
  );

  const done = Math.min(target, confirmed);
  const inTransit = Math.min(Math.max(0, target - done), unconfirmed);

  return { done, inTransit, pledged: done + inTransit };
}

export function getStoredDeliveryPackages(fallback: DeliveryPackageItem[] = []): DeliveryPackageItem[] {
  if (typeof window === "undefined") return fallback;

  try {
    const saved = JSON.parse(localStorage.getItem("aidstory_delivery_packages") || "[]");
    if (Array.isArray(saved) && saved.length > 0) return saved as DeliveryPackageItem[];
  } catch (error) {
    // Use the supplied seed records if browser storage has not been initialized.
  }

  return fallback;
}
