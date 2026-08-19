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
import { RecipientRequest, RequestUpdate, RequestComment } from "../types";
import { getBadgesForRequest, BADGE_COLOR_MAP, isEmergencyOrUrgent } from "./AppNeeds";

interface RequestDetailModalProps {
  request: RecipientRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToDonateBox: (req: RecipientRequest) => void;
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
  onSupportNow,
  isInDonateBox,
  onShare,
  onOpenDonateBoxPage
}) => {
  if (!isOpen || !request) return null;

  // Multi-image Carousel State
  const images = request.images && request.images.length > 0 ? request.images : [request.imageUrl];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Subscribe State
  const [isSubscribed, setIsSubscribed] = useState(() => {
    if (typeof window !== "undefined") {
      const subs = localStorage.getItem("aidstory_subscribed_organizers");
      if (subs) {
        try {
          const list = JSON.parse(subs);
          return list.includes(request.organizerName || request.authorName || "WeAreCharity1");
        } catch (e) {}
      }
    }
    return false;
  });

  const handleToggleSubscribe = () => {
    const org = request.organizerName || request.authorName || "WeAreCharity1";
    setIsSubscribed((prev) => {
      const next = !prev;
      try {
        const subs = localStorage.getItem("aidstory_subscribed_organizers");
        let list: string[] = subs ? JSON.parse(subs) : [];
        if (next) {
          if (!list.includes(org)) list.push(org);
        } else {
          list = list.filter((item) => item !== org);
        }
        localStorage.setItem("aidstory_subscribed_organizers", JSON.stringify(list));
      } catch (e) {}
      return next;
    });
  };

  // Updates Timeline State
  const defaultUpdates: RequestUpdate[] = [
    {
      id: "up_1",
      date: "3/5/2026",
      text: "Currently, we receive some calls and pledges for these essentials. Thanks for all donor support!",
      author: request.authorName || "Charity Coordinator"
    },
    {
      id: "up_2",
      date: "1/5/2026",
      text: "Aid campaign officially opened for emergency distribution to local community centers.",
      author: request.authorName || "Charity Coordinator"
    }
  ];

  const [updates] = useState<RequestUpdate[]>(() => {
    if (request.updates && request.updates.length > 0) return request.updates;
    return defaultUpdates;
  });

  // Community Comments State
  const defaultComments: RequestComment[] = [
    {
      id: "comm_1",
      userName: "IamDonor1",
      avatarUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=150&q=80",
      comment: "Hope to hear your good news....",
      date: "2h ago"
    },
    {
      id: "comm_2",
      userName: "IamDonor2",
      avatarUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=150&q=80",
      comment: "Dropping off care packages this weekend. Sending prayers and love!",
      date: "1h ago"
    }
  ];

  const storageKey = `aidstory_req_comments_${request.id}`;
  const [comments, setComments] = useState<RequestComment[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return request.comments && request.comments.length > 0 ? request.comments : defaultComments;
  });

  const [newCommentText, setNewCommentText] = useState("");
  const [showProgressTooltip, setShowProgressTooltip] = useState(false);

  const handleSendComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: RequestComment = {
      id: `comm_${Date.now()}`,
      userName: "You (Donor)",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      comment: newCommentText.trim(),
      date: "Just now"
    };

    const updated = [...comments, newComment];
    setComments(updated);
    setNewCommentText("");
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}
  };

  // Dynamic Progress Calculation matching Needs Card exactly
  const total = request.quantity || 1;
  const pledged = request.pledgedQuantity || 0;
  const done = Math.min(pledged, Math.max(0, Math.floor(pledged * 0.4)));
  const inTransit = Math.max(0, pledged - done);
  const needed = Math.max(0, total - (done + inTransit));

  const donePct = Math.min(100, Math.round((done / total) * 100));
  const inTransitPct = Math.min(100 - donePct, Math.round((inTransit / total) * 100));
  const neededPct = Math.max(0, 100 - donePct - inTransitPct);

  const progressRatio = `${pledged} / ${total}`;
  const progressPct = Math.min(100, Math.round((pledged / total) * 100));

  // Category & Urgency Badges (Unified with Request Cards)
  const badges = getBadgesForRequest(request);
  const isEmergency = isEmergencyOrUrgent(request);

  const organizerDisplayName = request.organizerName || request.authorName || "WeAreCharity1";
  const brandName = request.brand || "Any brand";
  const colourName = request.color || "Any";
  const distance = request.distanceText || "5 km away from you";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", duration: 0.45 }}
          className={`relative w-full max-w-5xl text-white rounded-2xl md:rounded-3xl border shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden my-auto transition-colors ${
            isEmergency
              ? "bg-[#541221] border-[#7a1b32]/60"
              : "bg-[#1d4334] border-[#295c47]/60"
          }`}
        >
          {/* TOP HEADER BAR */}
          <div className="flex items-center justify-between px-5 sm:px-7 pt-5 pb-3 border-b border-white/10 shrink-0">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif italic font-bold tracking-tight text-white pr-4">
              {request.title}
            </h2>

            {/* Right Header Area: Organizer & Subscribe + Close */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Organizer Badge */}
              <div className="flex items-center gap-2 bg-black/25 px-2.5 py-1 rounded-full border border-white/15">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#f4efe5] text-[#2c221a] font-serif font-bold text-[10px] sm:text-xs flex items-center justify-center shadow">
                  {request.organizerAvatar ? (
                    <img
                      src={request.organizerAvatar}
                      alt={organizerDisplayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>❤️</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-white/90 truncate max-w-[110px] sm:max-w-[150px]">
                  {organizerDisplayName}
                </span>

                {/* Yellow Subscribe Button */}
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
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-7">
            
            {/* LEFT COLUMN: Media, Tags, Description, Progress & Map (7 Cols) */}
            <div className="md:col-span-7 space-y-5 text-left">
              
              {/* 1. Large Image Carousel */}
              <div className="relative w-full h-64 sm:h-72 md:h-80 bg-black/40 rounded-2xl overflow-hidden border border-white/15 shadow-inner group">
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

              {/* 3. Specifications & Description */}
              <div className="space-y-1.5 text-xs text-[#f4efe5]/90 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/10">
                <div className="text-[10px] font-mono text-white/60 font-semibold uppercase tracking-wider">
                  posted {request.postedDate || "2 DAYS AGO"}
                </div>
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
                <div className="relative h-28 w-full rounded-xl overflow-hidden border border-white/20 shadow-inner bg-[#457b9d]/30 flex items-center justify-center">
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

            {/* RIGHT COLUMN: Updates & Community (5 Cols) */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-6 text-left border-t md:border-t-0 md:border-l md:border-white/15 md:pl-7 pt-4 md:pt-0">
              
              {/* UPDATES SECTION */}
              <div className="space-y-3">
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  Updates
                </h3>

                {/* Timeline with orange line & yellow node dots */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#f97316]">
                  {updates.map((up) => (
                    <div key={up.id} className="relative space-y-1">
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

              {/* COMMUNITY SECTION (LIVE CHAT BUBBLES) */}
              <div className="space-y-3 pt-2 flex-1 flex flex-col justify-end">
                <h3 className="text-xl font-serif font-bold text-white">
                  Community
                </h3>

                {/* Scrollable comments stream */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {comments.map((comm) => (
                    <div key={comm.id} className="flex items-start gap-2.5">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-black/40 border border-white/20 shrink-0">
                        {comm.avatarUrl ? (
                          <img
                            src={comm.avatarUrl}
                            alt={comm.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-amber-600 text-white">
                            {comm.userName[0]}
                          </div>
                        )}
                      </div>

                      {/* Content Bubble */}
                      <div className="space-y-0.5 max-w-[85%]">
                        <div className="text-[10px] font-mono font-bold text-white/80 pl-1">
                          {comm.userName}
                        </div>
                        <div className="bg-[#5eb5a0] text-[#0d2a22] font-medium text-xs px-3.5 py-2 rounded-2xl rounded-tl-sm shadow-md leading-snug">
                          {comm.comment}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing placeholder bubble */}
                  <div className="flex items-start gap-2.5 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-black/30 border border-white/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="bg-[#5eb5a0]/40 text-[#0d2a22] text-xs px-3 py-1.5 rounded-2xl rounded-tl-sm">
                      <span className="animate-pulse">...</span>
                    </div>
                  </div>
                </div>

                {/* Comment Input Box */}
                <form onSubmit={handleSendComment} className="pt-2">
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
            {/* 1. ADD TO DONATE BOX / VIEW DONATE BOX */}
            <button
              type="button"
              onClick={() => {
                if (isInDonateBox && onOpenDonateBoxPage) {
                  onClose();
                  onOpenDonateBoxPage();
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
              <span>{isInDonateBox ? "VIEW IN DONATE BOX →" : "ADD TO DONATE BOX"}</span>
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
      </div>
    </AnimatePresence>
  );
};
