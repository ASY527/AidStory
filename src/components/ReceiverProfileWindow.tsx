import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  ShieldCheck,
  Heart,
  Instagram,
  Facebook,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { motion } from "motion/react";
import { RecipientRequest } from "../types";
import { formatDetailedLocation, resolveReceiverProfile, ResolvedReceiverProfile } from "../lib/receiverProfileHelper";

interface ReceiverProfileWindowProps {
  request: RecipientRequest;
  onClose: () => void;
  isEmergency?: boolean;
  currentUser?: any;
}

export const ReceiverProfileWindow: React.FC<ReceiverProfileWindowProps> = ({
  request,
  onClose,
  isEmergency = false,
  currentUser
}) => {
  // Resolve receiver profile data consistently matching "Your Account Profile"
  const profile: ResolvedReceiverProfile = resolveReceiverProfile(request, currentUser);
  const subscribedStorageKey = "aidstory_subscribed_organizers";

  // Check if subscribed
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const subs = localStorage.getItem(subscribedStorageKey);
        if (subs) {
          const list: string[] = JSON.parse(subs);
          return list.includes(profile.name) || list.includes(request.organizerName || "");
        }
      } catch (e) {}
    }
    return false;
  });

  // Dynamic Subscriber count
  const [subscriberCount, setSubscriberCount] = useState<number>(profile.subscribersCount);

  // Sync subscribe state with window events
  useEffect(() => {
    const handleSyncSubs = () => {
      if (typeof window !== "undefined") {
        try {
          const subs = localStorage.getItem(subscribedStorageKey);
          if (subs) {
            const list: string[] = JSON.parse(subs);
            setIsSubscribed(list.includes(profile.name) || list.includes(request.organizerName || ""));
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
  }, [profile.name, request.organizerName]);

  // Optional toast message helper
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Toggle Subscribe
  const handleToggleSubscribe = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (profile.isCurrentUser) return;

    setIsSubscribed((prev) => {
      const next = !prev;
      const newCount = next ? subscriberCount + 1 : Math.max(0, subscriberCount - 1);
      setSubscriberCount(newCount);

      if (typeof window !== "undefined") {
        try {
          const subs = localStorage.getItem(subscribedStorageKey);
          let list: string[] = subs ? JSON.parse(subs) : [];
          if (next) {
            if (!list.includes(profile.name)) list.push(profile.name);
            if (request.organizerName && !list.includes(request.organizerName)) list.push(request.organizerName);
          } else {
            list = list.filter((item) => item !== profile.name && item !== request.organizerName);
          }
          localStorage.setItem(subscribedStorageKey, JSON.stringify(list));
          window.dispatchEvent(new Event("aidstory_subscribers_updated"));
        } catch (e) {}
      }

      setToastMsg(next ? `Subscribed to ${profile.name}!` : `Unsubscribed from ${profile.name}`);
      setTimeout(() => setToastMsg(null), 2500);

      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.96 }}
      transition={{ type: "spring", damping: 26, stiffness: 240 }}
      className={`w-full lg:w-[380px] xl:w-[410px] shrink-0 text-white rounded-2xl md:rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
        isEmergency
          ? "bg-[#430f1b] border-[#7a1b32]/70"
          : "bg-[#143327] border-[#295c47]/70"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/25 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
            Verified Organization
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close profile"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* COMPACT BODY - SHORT & CONCISE, NO SCROLL */}
      <div className="p-4 space-y-2.5 text-left text-xs">
        {/* 1. COMPACT PROFILE HERO */}
        <div className="flex flex-col items-center text-center p-3 bg-black/20 rounded-2xl border border-white/10 relative overflow-hidden">
          {/* Top Banner Gradient */}
          <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          {/* Profile Photo */}
          <div className="relative z-10 w-14 h-14 rounded-full border-2 border-emerald-400/80 p-0.5 shadow-md bg-[#f4efe5] text-[#2c221a] flex items-center justify-center overflow-hidden mb-1.5">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif font-bold text-lg bg-[#c5dc80] text-[#2c221a]">
                {profile.initials}
              </div>
            )}
          </div>

          <h3 className="text-base font-serif font-bold text-white tracking-tight leading-tight">
            {profile.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>VERIFIED NGO</span>
            </span>
            <span className="text-[9px] text-white/70 font-mono">
              {profile.roleType}
            </span>
          </div>

          {/* Action Row: Full-width Subscribe (No Call Button) */}
          <div className="w-full mt-2.5">
            {profile.isCurrentUser ? (
              <div className="w-full py-1.5 px-3 rounded-xl bg-white/15 text-amber-200 border border-amber-300/30 text-center font-mono text-[11px] font-semibold">
                Your Account
              </div>
            ) : (
              <button
                type="button"
                onClick={handleToggleSubscribe}
                className={`w-full py-2 px-3 rounded-xl font-mono text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none shadow active:scale-95 ${
                  isSubscribed
                    ? "bg-white/20 hover:bg-white/25 text-white border border-white/30"
                    : "bg-[#facc15] hover:bg-[#eab308] text-black shadow-amber-500/20"
                }`}
                title={isSubscribed ? "Click to unsubscribe" : "Click to subscribe to this organization"}
              >
                <Heart className={`w-3.5 h-3.5 transition-transform ${isSubscribed ? "fill-current scale-110 text-rose-400" : ""}`} />
                <span className="capitalize">{isSubscribed ? "subscribed ✓" : "subscribe"}</span>
              </button>
            )}
          </div>

          {/* Inline notification banner when subscribed / unsubscribed */}
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-amber-400/40 text-amber-200 text-[10px] font-mono text-center shadow-lg"
            >
              {toastMsg}
            </motion.div>
          )}
        </div>

        {/* 2. CHARITY & NGO MISSION / FOCUS */}
        <div className="bg-black/25 border border-white/10 rounded-xl p-2.5 space-y-1">
          <span className="text-[8px] font-mono text-white/50 uppercase tracking-wider block font-semibold">
            CHARITY & NGO MISSION
          </span>
          <p className="text-[11px] text-white/90 font-serif italic leading-snug">
            "{profile.description}"
          </p>
        </div>

        {/* 3. OFFICIAL SOCIAL CHANNELS */}
        <div className="grid grid-cols-2 gap-2">
          {/* Instagram Page Link */}
          <a
            href={`https://instagram.com/${profile.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-gradient-to-br from-purple-950/40 to-pink-950/40 hover:from-purple-900/50 hover:to-pink-900/50 border border-pink-500/30 transition-all flex items-center justify-between group cursor-pointer shadow-sm text-left"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                <Instagram className="w-3 h-3" />
              </div>
              <div className="overflow-hidden min-w-0">
                <span className="block text-[10px] font-bold text-pink-200 truncate">
                  @{profile.instagram}
                </span>
              </div>
            </div>
            <ExternalLink className="w-2.5 h-2.5 text-pink-400/60 shrink-0 ml-1" />
          </a>

          {/* Facebook Page Link */}
          <a
            href={`https://facebook.com/${profile.facebook}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-gradient-to-br from-blue-950/40 to-indigo-950/40 hover:from-blue-900/50 hover:to-indigo-900/50 border border-blue-500/30 transition-all flex items-center justify-between group cursor-pointer shadow-sm text-left"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5 h-5 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                <Facebook className="w-3 h-3 fill-current" />
              </div>
              <div className="overflow-hidden min-w-0">
                <span className="block text-[10px] font-bold text-blue-200 truncate">
                  fb.com/{profile.facebook}
                </span>
              </div>
            </div>
            <ExternalLink className="w-2.5 h-2.5 text-blue-400/60 shrink-0 ml-1" />
          </a>
        </div>

        {/* 4. VERIFIED ORGANIZATION CREDENTIALS */}
        <div className="bg-black/25 border border-white/10 rounded-xl p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Credentials</span>
            </span>
            <span className="text-[8px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              ID: {profile.credentialsId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {/* Email */}
            <div className="p-1.5 rounded-lg bg-black/20 border border-white/5 space-y-0.5">
              <span className="text-white/50 font-mono text-[8px] block">EMAIL</span>
              <span className="text-white truncate block font-medium" title={profile.email}>
                {profile.email}
              </span>
            </div>

            {/* Joined */}
            <div className="p-1.5 rounded-lg bg-black/20 border border-white/5 space-y-0.5">
              <span className="text-white/50 font-mono text-[8px] block">JOINED</span>
              <span className="text-white font-mono block">
                {profile.joinedDate}
              </span>
            </div>
          </div>

          {/* Location & Hub */}
          <div className="p-1.5 rounded-lg bg-black/20 border border-white/5 space-y-0.5">
            <span className="text-white/50 font-mono text-[8px] flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-amber-400" />
              <span>DISTRIBUTION HUB & LOCATION</span>
            </span>
            <p
              className="text-white font-serif italic text-[10px] leading-tight truncate"
              title={formatDetailedLocation(profile.location, profile.name)}
            >
              {formatDetailedLocation(profile.location, profile.name)}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-4 py-2.5 bg-black/30 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60 shrink-0">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          AidStory Verified Organization
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white font-semibold underline underline-offset-2 cursor-pointer"
        >
          Close Profile
        </button>
      </div>
    </motion.div>
  );
};
