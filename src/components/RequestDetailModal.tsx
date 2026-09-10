import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Package,
  Heart,
  MapPin,
  Info,
  User,
  Send,
  Check,
  Building2,
  Sparkles
} from "lucide-react";
import { RecipientRequest, RequestUpdate, RequestComment, formatCapitalizedTitle, formatRequestPostedDate } from "../types";
import { getBadgesForRequest, BADGE_COLOR_MAP, isEmergencyRequest } from "./AppNeeds";
import { subscribeToRequestComments, addCommentToCloud } from "../lib/cloudService";
import { ReceiverProfileWindow } from "./ReceiverProfileWindow";
import { resolveReceiverProfile } from "../lib/receiverProfileHelper";
import { SEED_DELIVERY_PACKAGES } from "../data/seedDatabase";
import { getDeliveryProgress, getStoredDeliveryPackages } from "../lib/deliveryProgress";

interface RequestDetailModalProps {
  request: RecipientRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToDonateBox: (req: RecipientRequest) => void;
  onRemoveFromDonateBox?: (req: RecipientRequest) => void;
  onSupportNow: (req: RecipientRequest) => void;
  isInDonateBox: boolean;
  onShare?: (req: RecipientRequest) => void;
  onOpenDonateBoxPage?: () => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  isOpen,
  onClose,
  onAddToDonateBox,
  onRemoveFromDonateBox,
  onSupportNow,
  isInDonateBox,
  onShare,
  onOpenDonateBoxPage
}) => {
  if (!isOpen || !request) return null;

  // Multi-image Carousel State
  const images = request.images && request.images.length > 0 ? request.images : [request.imageUrl];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Side-by-side Receiver Profile Window State
  const [showReceiverProfile, setShowReceiverProfile] = useState(false);

  // Current User Sync for Community Comments & Profile Photo Propagation
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aidstory_current_user");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("aidstory_current_user");
          if (saved) setCurrentUser(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener("aidstory_user_updated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate);
    return () => {
      window.removeEventListener("aidstory_user_updated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, []);

  // Resolved receiver profile matching "Your Account Profile" exactly
  const receiverProfile = resolveReceiverProfile(request, currentUser);

  // Subscribe State
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const subs = localStorage.getItem("aidstory_subscribed_organizers");
      if (subs) {
        try {
          const list = JSON.parse(subs);
          return list.includes(receiverProfile.name) || list.includes(request.organizerName || request.authorName || "");
        } catch (e) {}
      }
    }
    return false;
  });

  // Sync subscribe status across components
  useEffect(() => {
    const handleSyncSubs = () => {
      if (typeof window !== "undefined") {
        try {
          const subs = localStorage.getItem("aidstory_subscribed_organizers");
          if (subs) {
            const list = JSON.parse(subs);
            setIsSubscribed(list.includes(receiverProfile.name) || list.includes(request.organizerName || request.authorName || ""));
          }
        } catch (e) {}
      }
    };
    window.addEventListener("aidstory_subscribers_updated", handleSyncSubs);
    window.addEventListener("storage", handleSyncSubs);
    return () => {
      window.removeEventListener("aidstory_subscribers_updated", handleSyncSubs);
      window.removeEventListener("storage", handleSyncSubs);
    };
  }, [receiverProfile.name, request.organizerName, request.authorName]);

  const handleToggleSubscribe = () => {
    if (receiverProfile.isCurrentUser) return;
    const org = receiverProfile.name;
    setIsSubscribed((prev) => {
      const next = !prev;
      try {
        const subs = localStorage.getItem("aidstory_subscribed_organizers");
        let list: string[] = subs ? JSON.parse(subs) : [];
        if (next) {
          if (!list.includes(org)) list.push(org);
          if (request.organizerName && !list.includes(request.organizerName)) list.push(request.organizerName);
        } else {
          list = list.filter((item) => item !== org && item !== request.organizerName);
        }
        localStorage.setItem("aidstory_subscribed_organizers", JSON.stringify(list));
        window.dispatchEvent(new Event("aidstory_subscribers_updated"));
      } catch (e) {}
      return next;
    });
  };

  // Show only updates and comments that were actually submitted for this request.
  const updates: RequestUpdate[] = request.updates || [];

  const storageKey = `aidstory_req_comments_${request.id}`;
  const [comments, setComments] = useState<RequestComment[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return request.comments || [];
  });

  // Subscribe in real-time to comments for this request
  useEffect(() => {
    if (!request.id) return;
    const unsub = subscribeToRequestComments(request.id, (cloudComments) => {
      if (cloudComments && cloudComments.length > 0) {
        const mapped: RequestComment[] = cloudComments.map((c) => ({
          id: c.id,
          userName: c.authorName,
          avatarUrl: c.authorAvatar || "",
          comment: c.text,
          date: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
        }));
        setComments(mapped);
        try {
          localStorage.setItem(storageKey, JSON.stringify(mapped));
        } catch (e) {}
      }
    });
    return () => unsub();
  }, [request.id]);

  const [newCommentText, setNewCommentText] = useState("");
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);

  // Helper functions for user comment dynamic identity and uploaded avatar
  const isUserComment = (comm: RequestComment) => {
    if (comm.userName.startsWith("You")) return true;
    if (currentUser?.username && comm.userName.toLowerCase() === currentUser.username.toLowerCase()) return true;
    return false;
  };

  const getCommentDisplayName = (comm: RequestComment) => {
    if (isUserComment(comm)) {
      const name = currentUser?.username || "NGO01";
      return `You (${name})`;
    }
    return comm.userName;
  };

  const getCommentAvatar = (comm: RequestComment) => {
    if (isUserComment(comm)) {
      return currentUser?.avatarUrl || currentUser?.profilePhoto || comm.avatarUrl || "";
    }
    return comm.avatarUrl || "";
  };

  const handleSendComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim()) return;

    const currentUserName = currentUser?.username || "NGO01";
    const userAvatar = currentUser?.avatarUrl || currentUser?.profilePhoto || "";

    const newComment: RequestComment = {
      id: `comm_${Date.now()}`,
      userName: `You (${currentUserName})`,
      avatarUrl: userAvatar,
      comment: newCommentText.trim(),
      date: "Just now"
    };

    const updated = [...comments, newComment];
    setComments(updated);
    const sentText = newCommentText.trim();
    setNewCommentText("");
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}

    // Save to Cloud Firestore
    addCommentToCloud({
      requestId: request.id,
      authorName: currentUserName,
      authorEmail: currentUser?.email || "",
      authorAvatar: userAvatar,
      text: sentText,
      createdAt: new Date().toISOString()
    }).catch((err) => console.warn("Cloud comment save failed:", err));
  };

  // Dynamic Progress Calculation matching Needs Card exactly
  const total = request.quantity || 1;
  const { pledged, done, inTransit } = getDeliveryProgress(
    request,
    getStoredDeliveryPackages(SEED_DELIVERY_PACKAGES)
  );
  const needed = Math.max(0, total - (done + inTransit));

  const donePct = Math.min(100, Math.round((done / total) * 100));
  const inTransitPct = Math.min(100 - donePct, Math.round((inTransit / total) * 100));
  const neededPct = Math.max(0, 100 - donePct - inTransitPct);

  const progressRatio = `${pledged} / ${total}`;
  const progressPct = Math.min(100, Math.round((pledged / total) * 100));

  // Category & Urgency Badges (Unified with Request Cards)
  const badges = getBadgesForRequest(request);
  const isEmergency = isEmergencyRequest(request);

  const organizerDisplayName = request.organizerName || request.authorName || "WeAreCharity1";
  const campaignName = request.campaignTitle || (request.campaignId ? "Campaign" : undefined);
  const brandName = request.brand || "Any brand";
  const colourName = request.color || "Any";
  const distance = request.distanceText || "5 km away from you";

  // Identity normalization for comparing usernames/charity names (e.g. NGO01 vs NGO1 vs ngo-01)
  const normalizeId = (val?: string) => {
    if (!val) return "";
    return val
      .toLowerCase()
      .trim()
      .replace(/^(you\s*\(|\))/g, "")
      .replace(/[^a-z0-9]/g, "")
      .replace(/0+(\d)/g, "$1");
  };

  const currentUsernameNorm = normalizeId(currentUser?.username);
  const currentCharityNorm = normalizeId(currentUser?.charityName);
  const currentUserEmail = (currentUser?.email || "").toLowerCase().trim();

  const authorEmail = (request.authorEmail || request.createdByUserEmail || "").toLowerCase().trim();
  const authorNameNorm = normalizeId(request.authorName || request.createdByUsername);
  const organizerNameNorm = normalizeId(request.organizerName);
  const organizerDisplayNorm = normalizeId(organizerDisplayName);

  // Check if organizer is the current logged-in user
  const isOrganizerSameUser = Boolean(
    currentUser && (
      (currentUserEmail && authorEmail && currentUserEmail === authorEmail) ||
      (currentUsernameNorm && (
        currentUsernameNorm === organizerNameNorm ||
        currentUsernameNorm === authorNameNorm ||
        currentUsernameNorm === organizerDisplayNorm ||
        (organizerNameNorm && organizerNameNorm.includes(currentUsernameNorm)) ||
        (organizerNameNorm && currentUsernameNorm.includes(organizerNameNorm)) ||
        (organizerDisplayNorm && organizerDisplayNorm.includes(currentUsernameNorm)) ||
        (organizerDisplayNorm && currentUsernameNorm.includes(organizerDisplayNorm))
      )) ||
      (currentCharityNorm && (
        currentCharityNorm === organizerNameNorm ||
        currentCharityNorm === organizerDisplayNorm ||
        (organizerNameNorm && organizerNameNorm.includes(currentCharityNorm)) ||
        (organizerNameNorm && currentCharityNorm.includes(organizerNameNorm))
      ))
    )
  );

  // Lookup in aidstory_users if available
  const getRegisteredUserPhoto = (nameOrEmail: string) => {
    if (typeof window === "undefined") return null;
    try {
      const users = JSON.parse(localStorage.getItem("aidstory_users") || "[]");
      const norm = normalizeId(nameOrEmail);
      const emailLower = nameOrEmail.toLowerCase().trim();
      const found = users.find((u: any) =>
        (u.email && u.email.toLowerCase().trim() === emailLower) ||
        (u.username && normalizeId(u.username) === norm) ||
        (u.charityName && normalizeId(u.charityName) === norm)
      );
      return found?.avatarUrl || found?.profilePhoto || null;
    } catch (e) {
      return null;
    }
  };

  const userAvatarPhoto = currentUser?.avatarUrl || currentUser?.profilePhoto || "";

  // Resolve organizer avatar image / emoji
  let resolvedOrganizerImage: string | null = null;
  let resolvedOrganizerEmoji: string | null = null;

  if (isOrganizerSameUser) {
    const regSelf = getRegisteredUserPhoto(currentUser?.email || currentUser?.username || "");
    if (userAvatarPhoto) {
      resolvedOrganizerImage = userAvatarPhoto;
    } else if (regSelf) {
      resolvedOrganizerImage = regSelf;
    } else if (
      request.organizerAvatar &&
      (request.organizerAvatar.startsWith("http") ||
        request.organizerAvatar.startsWith("data:") ||
        request.organizerAvatar.startsWith("blob:") ||
        request.organizerAvatar.startsWith("/"))
    ) {
      resolvedOrganizerImage = request.organizerAvatar;
    } else if (request.organizerAvatar) {
      resolvedOrganizerEmoji = request.organizerAvatar;
    }
  } else {
    // Check registered users for photo first to guarantee same user consistency across app
    const regPhoto = getRegisteredUserPhoto(request.organizerName || request.authorName || organizerDisplayName);
    if (
      regPhoto &&
      (regPhoto.startsWith("http") ||
        regPhoto.startsWith("data:") ||
        regPhoto.startsWith("blob:") ||
        regPhoto.startsWith("/"))
    ) {
      resolvedOrganizerImage = regPhoto;
    } else if (
      request.organizerAvatar &&
      (request.organizerAvatar.startsWith("http") ||
        request.organizerAvatar.startsWith("data:") ||
        request.organizerAvatar.startsWith("blob:") ||
        request.organizerAvatar.startsWith("/"))
    ) {
      resolvedOrganizerImage = request.organizerAvatar;
    } else if (request.organizerAvatar) {
      resolvedOrganizerEmoji = request.organizerAvatar;
    }
  }

  return (
    <AnimatePresence>
      <motion.div 
        key={`request-detail-modal-container-${request.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Side-by-Side Flex Container */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 w-full max-w-[1440px] max-h-[94vh] my-auto">
          {/* Modal Container: Request Details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", duration: 0.45 }}
            className={`relative w-full ${
              showReceiverProfile ? "lg:flex-1 lg:max-w-4xl" : "max-w-[1320px]"
            } text-white rounded-2xl md:rounded-3xl border shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden transition-all duration-300 ${
              isEmergency
                ? "bg-[#541221] border-[#7a1b32]/60"
                : "bg-[#1d4334] border-[#295c47]/60"
            }`}
          >
            {/* TOP HEADER BAR */}
            <div className="flex items-center justify-between px-5 sm:px-7 pt-5 pb-3 border-b border-white/10 shrink-0">
              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-bold tracking-tight text-white pr-4">
                {formatCapitalizedTitle(request.title)}
              </h2>

              {/* Right Header Area: Organizer & Subscribe + Close */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                {/* Organizer Badge with Clickable Profile Photo */}
                <div className="flex items-center gap-2 bg-black/25 px-2.5 py-1 rounded-full border border-white/15">
                  <button
                    type="button"
                    onClick={() => setShowReceiverProfile((prev) => !prev)}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#f4efe5] text-[#2c221a] font-serif font-bold text-[10px] sm:text-xs flex items-center justify-center shadow overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-emerald-400 hover:scale-105 active:scale-95 transition-all"
                    title="Click to view receiver profile and details"
                  >
                    {receiverProfile.avatarUrl ? (
                      <img
                        src={receiverProfile.avatarUrl}
                        alt={receiverProfile.name}
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold bg-[#c5dc80] text-[#2c221a]">
                        {receiverProfile.initials}
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReceiverProfile((prev) => !prev)}
                    className="text-xs sm:text-sm font-medium text-white/90 hover:text-emerald-300 truncate max-w-[110px] sm:max-w-[150px] cursor-pointer text-left transition-colors"
                    title="Click to view receiver details"
                  >
                    {receiverProfile.name}
                  </button>

                  {/* Yellow Subscribe Button or You indicator if own request */}
                  {receiverProfile.isCurrentUser ? (
                    <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-amber-200 border border-amber-300/30">
                      You
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleSubscribe}
                      className={`text-[10px] sm:text-xs font-bold font-mono px-3 py-1 rounded-full transition-all cursor-pointer shadow ${
                        isSubscribed
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-[#facc15] hover:bg-[#eab308] text-black active:scale-95"
                      }`}
                    >
                      {isSubscribed ? "subscribed ✓" : "subscribe"}
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

          {/* MAIN SCROLLABLE CONTENT (TWO COLUMNS) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-6">
            
            {/* LEFT COLUMN: Media, Tags, Description, Progress & Map (8 Cols) */}
            <div className="md:col-span-8 space-y-5 text-left">
              
              {/* 1. Large Image Carousel */}
              <div className="relative w-full h-52 sm:h-56 md:h-60 bg-black/40 rounded-2xl overflow-hidden border border-white/15 shadow-inner group">
                <img
                  src={images[activeImageIndex] || request.imageUrl}
                  alt={request.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />

                {/* Left/Right Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            idx === activeImageIndex ? "w-5 bg-white shadow" : "w-2 bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 2. Tag Pills Row & Share Button */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                  {badges.map((badgeName, idx) => {
                    const upper = badgeName.toUpperCase();
                    const colorConf = BADGE_COLOR_MAP[upper] || { bg: "bg-[#455a64]", text: "text-white" };
                    return (
                      <span
                        key={idx}
                        className={`${colorConf.bg} ${colorConf.text} text-[11px] sm:text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm font-sans`}
                      >
                        {badgeName}
                      </span>
                    );
                  })}
                </div>

                {/* Share Icon */}
                <button
                  type="button"
                  onClick={() => onShare && onShare(request)}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Share this request"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* 3–5. Compact request summary beside progress and location */}
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(260px,2fr)] gap-4 lg:gap-5 items-start">
              {/* 3. Specifications & Description */}
              <div className="space-y-1.5 text-xs text-[#f4efe5]/90 leading-relaxed bg-black/20 p-4 sm:p-5 rounded-xl border border-white/10">
                <div className="text-[10px] font-mono text-white/60 font-semibold uppercase tracking-wider">
                  posted {formatRequestPostedDate(request.postedDate, request.postedTimestamp)}
                </div>
                {campaignName && (
                  <div className="font-mono text-[11px]">
                    <span className="text-white/70">Campaign Name: </span>
                    <span className="text-white font-semibold">{campaignName}</span>
                  </div>
                )}
                <div className="font-mono text-[11px]">
                  <span className="text-white/70">Brand: </span>
                  <span className="text-white font-semibold">{brandName}</span>
                </div>
                <div className="font-mono text-[11px]">
                  <span className="text-white/70">Colour: </span>
                  <span className="text-white font-semibold">{colourName}</span>
                </div>
                <p className="pt-1.5 text-xs text-white/90 whitespace-pre-line leading-relaxed">
                  {request.description}
                </p>
              </div>

              <div className="space-y-3">
              {/* 4. CAMPAIGN PROGRESS */}
              <div className="space-y-1.5 pt-1 relative">
                <div className="flex items-center justify-between text-xs">
                  <div 
                    onClick={() => setShowProgressTooltip(!showProgressTooltip)}
                    className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-white/80 font-bold tracking-wider cursor-pointer hover:text-yellow-300 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-white/70" />
                    <span>CAMPAIGN PROGRESS</span>
                  </div>
                  <div 
                    onClick={() => setShowProgressTooltip(!showProgressTooltip)}
                    className="font-mono text-xs font-bold text-white tracking-wide cursor-pointer hover:text-yellow-300 transition-colors"
                  >
                    {progressRatio}
                  </div>
                </div>

                {/* Progress Bar with 3 matching segments */}
                <div 
                  onMouseEnter={() => setShowProgressTooltip(true)}
                  onMouseLeave={() => setShowProgressTooltip(false)}
                  onClick={() => setShowProgressTooltip(!showProgressTooltip)}
                  className="relative h-3 w-full bg-white rounded-full overflow-hidden flex shadow-inner cursor-pointer"
                >
                  {/* Segment 1: Lime green (Done) */}
                  <div
                    style={{ width: `${donePct}%` }}
                    className="h-full bg-[#bef264] transition-all duration-500"
                  />
                  {/* Segment 2: Yellow (In transit/processing) */}
                  <div
                    style={{ width: `${inTransitPct}%` }}
                    className="h-full bg-[#fef08a] transition-all duration-500"
                  />
                  {/* Segment 3: White (Remaining needed) */}
                  <div 
                    style={{ width: `${neededPct}%` }}
                    className="h-full bg-white transition-all duration-500" 
                  />
                </div>

                {/* Tooltip speech bubble pointing to progress bar */}
                <AnimatePresence>
                  {showProgressTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 bg-[#fef08a] text-[#2c221a] text-[11px] font-mono font-bold px-3 py-1 rounded-xl shadow-2xl pointer-events-none whitespace-nowrap border border-yellow-500/40"
                    >
                      <span>
                        {done}/{total} done... {inTransit}/{total} in transit
                      </span>
                      {/* Down arrow triangle */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#fef08a]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. LOCATION MAP PREVIEW */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono uppercase text-white/80 font-bold tracking-wider">
                    LOCATION
                  </span>
                  <span className="text-[10px] font-mono text-white/60">
                    {distance}
                  </span>
                </div>

                {/* Stylized Interactive Map graphic */}
                <div className="relative h-24 sm:h-28 w-full rounded-xl overflow-hidden border border-white/20 shadow-inner bg-[#457b9d]/30 flex items-center justify-center">
                  {/* Realistic Topographic Map Visual Background */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-85"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')`
                    }}
                  />
                  <div className="absolute inset-0 bg-[#2d5045]/60 backdrop-blur-[0.5px]" />

                  {/* Location Pin & Label */}
                  <div className="relative z-10 flex items-center gap-2 bg-[#2c221a]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 shadow-lg">
                    <MapPin className="w-4 h-4 text-red-500 fill-red-500 animate-bounce" />
                    <span className="text-xs font-bold font-sans text-white">
                      {request.location}
                    </span>
                  </div>
                </div>
              </div>
              </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Updates & Community (4 Cols) */}
            <div className="md:col-span-4 flex flex-col space-y-4 sm:space-y-5 text-left border-t md:border-t-0 md:border-l md:border-white/15 md:pl-5 lg:pl-6 pt-4 md:pt-0">
              
              {/* UPDATES SECTION */}
              <div className="space-y-2.5">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                  Updates
                </h3>

                {/* Timeline with orange line & yellow node dots */}
                <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#f97316]">
                  {updates.map((up) => (
                    <div key={up.id} className="relative space-y-0.5">
                      {/* Node Dot */}
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#facc15] border-2 border-[#314638] shadow" />
                      
                      <div className="text-[11px] font-mono font-bold text-white/90">
                        {up.date}
                      </div>
                      <p className="text-xs text-[#f4efe5]/80 leading-relaxed font-sans">
                        {up.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMMUNITY SECTION (LIVE CHAT BUBBLES) - Sits directly below Updates without large empty space */}
              <div className="space-y-2.5 pt-1">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                  Community
                </h3>

                {/* Scrollable comments stream */}
                <div className="space-y-2.5 max-h-60 sm:max-h-72 overflow-y-auto pr-1">
                  {comments.map((comm) => {
                    const avatar = getCommentAvatar(comm);
                    const displayName = getCommentDisplayName(comm);
                    const isSelf = isUserComment(comm);

                    return (
                      <div key={comm.id} className="flex items-start gap-2.5">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-black/40 border border-white/20 shrink-0 flex items-center justify-center">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={displayName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : isSelf ? (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold bg-[#c5dc80] text-[#2c221a]">
                              {currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : "ME"}
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-amber-600 text-white">
                              {comm.userName[0]}
                            </div>
                          )}
                        </div>

                        {/* Content Bubble */}
                        <div className="space-y-0.5 max-w-[85%]">
                          <div className="text-[10px] font-mono font-bold text-white/80 pl-1">
                            {displayName}
                          </div>
                          <div className="bg-[#5eb5a0] text-[#0d2a22] font-medium text-xs px-3.5 py-2 rounded-2xl rounded-tl-sm shadow-md leading-snug">
                            {comm.comment}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>

                {/* Comment Input Box */}
                <form onSubmit={handleSendComment} className="pt-1.5">
                  <div className="relative flex items-center bg-[#f4efe5] rounded-full p-1.5 shadow-md">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Leave your comments here ....."
                      className="w-full bg-transparent border-none px-3.5 py-1 text-xs text-[#2c221a] placeholder:text-[#2c221a]/60 focus:outline-none"
                    />

                    <div className="flex items-center gap-1 pr-1">
                      <button
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className="w-7 h-7 rounded-full bg-[#314638] hover:bg-[#24352b] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all cursor-pointer shadow"
                        title="Send comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>

          </div>

          {/* BOTTOM ACTION FOOTER BAR (TWO LARGE MINT BUTTONS) */}
          <div className="px-5 sm:px-7 py-4 bg-black/25 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {/* 1. ADD TO DONATE BOX / REMOVE FROM DONATE BOX */}
            <button
              type="button"
              onClick={() => {
                if (isInDonateBox) {
                  if (onRemoveFromDonateBox) {
                    onRemoveFromDonateBox(request);
                  }
                } else {
                  onAddToDonateBox(request);
                }
              }}
              className={`w-full sm:w-1/2 py-3.5 px-6 rounded-full font-bold font-sans text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                isInDonateBox
                  ? "bg-[#4e8a7d] text-white ring-2 ring-[#a3e635] hover:bg-[#43796d]"
                  : "bg-[#6ea99b] hover:bg-[#5da091] text-white hover:shadow-cyan-500/20"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{isInDonateBox ? "REMOVE FROM DONATE BOX" : "ADD TO DONATE BOX"}</span>
            </button>

            {/* 2. SUPPORT NOW */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSupportNow(request);
              }}
              className="w-full sm:w-1/2 py-3.5 px-6 bg-[#6ea99b] hover:bg-[#5da091] active:scale-98 text-white rounded-full font-bold font-sans text-xs uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>SUPPORT NOW</span>
            </button>
          </div>

          </motion.div>

          {/* Side-by-Side Receiver Profile Window */}
          <AnimatePresence>
            {showReceiverProfile && (
              <ReceiverProfileWindow
                request={request}
                onClose={() => setShowReceiverProfile(false)}
                isEmergency={isEmergency}
                currentUser={currentUser}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
