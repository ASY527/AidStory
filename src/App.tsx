import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Sparkles, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";

import { ModalType, FeedbackComment } from "./types";
import AppHome from "./components/AppHome";
import AppComments from "./components/AppComments";
import AppExplore from "./components/AppExplore";
import AppMainMenu from "./components/AppMainMenu";
import AppYourRequest from "./components/AppYourRequest";
import AppNeeds from "./components/AppNeeds";
import AppPreparingDonateBox from "./components/AppPreparingDonateBox";

export default function App() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentView, setCurrentView] = useState<"home" | "comments" | "explore" | "main_menu" | "your_request" | "needs" | "preparing_donate_box">(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("aidstory_current_user");
      if (window.location.hash === "#needs") return "needs";
      if (window.location.hash === "#your-request") return "your_request";
      if (window.location.hash === "#donate-box" || window.location.hash === "#preparing-donate-box") return "preparing_donate_box";
      if (storedUser) {
        return "main_menu";
      }
      if (window.location.hash === "#comments") return "comments";
      // If the user is not logged in, we default to the home view rather than sign-in/menu on refresh
    }
    return "home";
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("aidstory_current_user");
    if (window.location.hash === "#needs") {
      setCurrentView("needs");
      document.title = "Browse Needs - AidStory";
    } else if (window.location.hash === "#your-request") {
      setCurrentView("your_request");
      document.title = "Your Requests - AidStory";
    } else if (window.location.hash === "#donate-box" || window.location.hash === "#preparing-donate-box") {
      setCurrentView("preparing_donate_box");
      document.title = "Preparing your donate box - AidStory";
    } else if (storedUser) {
      window.location.hash = "main-menu";
      document.title = "Main Menu - AidStory";
    } else {
      // Force reset hash to home page on load/reload only if NOT logged in
      if (typeof window !== "undefined" && (window.location.hash === "#comments" || window.location.hash === "#explore" || window.location.hash === "#main-menu" || window.location.hash === "#your-request" || window.location.hash === "#needs" || window.location.hash === "#donate-box" || window.location.hash === "#preparing-donate-box")) {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
        } else {
          window.location.hash = "";
        }
      }
    }

    const handleHashChange = () => {
      const isLogged = localStorage.getItem("aidstory_current_user");
      if (window.location.hash === "#needs") {
        setCurrentView("needs");
      } else if (window.location.hash === "#comments") {
        setCurrentView("comments");
      } else if (window.location.hash === "#explore") {
        setCurrentView("explore");
      } else if (window.location.hash === "#donate-box" || window.location.hash === "#preparing-donate-box") {
        setCurrentView("preparing_donate_box");
      } else if (window.location.hash === "#main-menu") {
        setCurrentView("main_menu");
      } else if (window.location.hash === "#your-request") {
        setCurrentView("your_request");
      } else {
        if (isLogged) {
          setCurrentView("main_menu");
        } else {
          setCurrentView("home");
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToView = (view: "home" | "comments" | "explore" | "main_menu" | "your_request" | "needs" | "preparing_donate_box") => {
    setCurrentView(view);
    if (view === "needs") {
      window.location.hash = "needs";
      document.title = "Browse Needs - AidStory";
    } else if (view === "comments") {
      window.location.hash = "comments";
      document.title = "Community Stories - AidStory";
    } else if (view === "explore") {
      window.location.hash = "explore";
      document.title = "Explore Your Journey - AidStory";
    } else if (view === "main_menu") {
      window.location.hash = "main-menu";
      document.title = "Main Menu - AidStory";
    } else if (view === "your_request") {
      window.location.hash = "your-request";
      document.title = "Your Requests - AidStory";
    } else if (view === "preparing_donate_box") {
      window.location.hash = "preparing-donate-box";
      document.title = "Preparing your donate box - AidStory";
    } else {
      window.location.hash = "";
      document.title = "AidStory";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [feedbackList, setFeedbackList] = useState<FeedbackComment[]>(() => {
    const saved = localStorage.getItem("aidstory_comments");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out the legacy items with ID "1" or "2"
          return parsed.filter((item: any) => item.id !== "1" && item.id !== "2");
        }
      } catch (e) {
        // Fallback to empty array on parse error
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("aidstory_comments", JSON.stringify(feedbackList));
  }, [feedbackList]);

  const handleAddComment = (name: string, email: string, comment: string) => {
    const newComment: FeedbackComment = {
      id: Date.now().toString(),
      name,
      email: email.trim() || "",
      comment,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };
    setFeedbackList((prev) => [newComment, ...prev]);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream overflow-x-hidden selection:bg-brand-olive selection:text-brand-dark">
      
      {currentView === "home" ? (
        <AppHome navigateToView={navigateToView} setActiveModal={setActiveModal} />
      ) : currentView === "comments" ? (
        <AppComments 
          navigateToView={navigateToView} 
          feedbackList={feedbackList} 
          onAddComment={handleAddComment} 
        />
      ) : currentView === "main_menu" ? (
        <AppMainMenu navigateToView={navigateToView} />
      ) : currentView === "your_request" ? (
        <AppYourRequest navigateToView={navigateToView} />
      ) : currentView === "needs" ? (
        <AppNeeds navigateToView={navigateToView} />
      ) : currentView === "preparing_donate_box" ? (
        <AppPreparingDonateBox navigateToView={navigateToView} />
      ) : (
        <AppExplore navigateToView={navigateToView} />
      )}

      {/* INTERACTIVE PREVIEW MODALS (AnimatePresence) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-[#161311]/90 backdrop-blur-sm"
            />

            {/* Modal Content Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-brand-dark p-6 md:p-8 rounded-2xl border border-brand-cream/10 shadow-2xl z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-brand-text-muted hover:text-brand-cream transition-colors p-2 rounded-full hover:bg-brand-cream/5 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL 1: EXPLORE JOURNEY */}
              {activeModal === "explore" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-olive/10 flex items-center justify-center text-brand-olive border border-brand-olive/20">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-light text-brand-cream">Your Donation Journey</h3>
                      <p className="text-xs font-mono text-brand-olive">Efficient & Streamlined allocation</p>
                    </div>
                  </div>

                  <p className="text-sm font-light text-brand-text-muted leading-relaxed">
                    AidStory changes how community assistance is structured. Follow our transparent, three-step journey to see the impact of your generosity:
                  </p>

                  <div className="space-y-4 font-sans text-sm">
                    <div className="flex gap-4 p-3 bg-brand-deep-dark/40 rounded-xl border border-brand-cream/5">
                      <div className="w-7 h-7 rounded-full bg-brand-olive text-brand-dark flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">1</div>
                      <div>
                        <h4 className="font-medium text-brand-cream">Review Hub Needs</h4>
                        <p className="text-xs text-brand-text-muted/80 mt-1">Recipients submit real-time requirements for exact items (food, hygiene, blankets).</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-3 bg-brand-deep-dark/40 rounded-xl border border-brand-cream/5">
                      <div className="w-7 h-7 rounded-full bg-brand-olive text-brand-dark flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">2</div>
                      <div>
                        <h4 className="font-medium text-brand-cream">Pledge Your Packages</h4>
                        <p className="text-xs text-brand-text-muted/80 mt-1">Pack identical units to match the requested items. This maximizes logistics speed.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-3 bg-brand-deep-dark/40 rounded-xl border border-brand-cream/5">
                      <div className="w-7 h-7 rounded-full bg-brand-olive text-brand-dark flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">3</div>
                      <div>
                        <h4 className="font-medium text-brand-cream">Instant Local Routing</h4>
                        <p className="text-xs text-brand-text-muted/80 mt-1">Receive directions to drop them at the nearest distribution depot with direct dispatch trackers.</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveModal("donate_exactly")}
                    className="w-full bg-brand-olive hover:bg-brand-olive-hover text-brand-dark font-sans font-medium py-3 rounded-full text-sm min-h-[44px] flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Start Pledge Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* MODAL 2: DONATE EXACTLY */}
              {activeModal === "donate_exactly" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-olive/10 flex items-center justify-center text-brand-olive border border-brand-olive/20">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-light text-brand-cream">Donations Go Exactly</h3>
                      <p className="text-xs font-mono text-brand-olive">Zero Waste • Target Matching</p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL 3: TRANSPARENCY */}
              {activeModal === "transparency" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-olive/10 flex items-center justify-center text-brand-olive border border-brand-olive/20">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-light text-brand-cream">Transparency</h3>
                      <p className="text-xs font-mono text-brand-olive">Dynamic Logistics & Track Your Donations</p>
                    </div>
                  </div>

                  <p className="text-sm font-light text-brand-text-muted leading-relaxed">
                    Once you make an in-kind donation, our logistics tracker directs delivery trucks, coordinates collection times, and calculates fuel-friendly delivery paths.
                  </p>

                  <div className="p-4 bg-brand-deep-dark/50 rounded-xl border border-brand-cream/10 space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono text-brand-text-muted">
                      <span>Logistics Route 2A-North</span>
                      <span className="text-brand-olive animate-pulse">● Active Delivery</span>
                    </div>

                    <div className="h-2 w-full bg-brand-dark rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="absolute h-full w-[30%] bg-gradient-to-r from-transparent via-brand-olive to-transparent"
                      />
                      <div className="absolute left-[65%] h-full w-2 bg-brand-olive" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-brand-text-muted/70">
                      <div>
                        <span className="block font-semibold text-brand-cream text-xs">A-1</span>
                        <span>Donation Point</span>
                      </div>
                      <div>
                        <span className="block font-semibold text-[#c5dc80] text-xs">Route 2H</span>
                        <span>En Route</span>
                      </div>
                      <div>
                        <span className="block font-semibold text-brand-cream text-xs">Hub Alpha</span>
                        <span>Recipient Center</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-brand-olive">
                    <CheckCircle2 className="w-4 h-4 text-brand-olive shrink-0" />
                    <span>Real-time dispatch system optimizes carbon emission routes by 32%.</span>
                  </div>

                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-brand-cream hover:bg-brand-cream/90 text-brand-dark font-sans font-medium py-3 rounded-full text-sm min-h-[44px] cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              )}

              {/* MODAL 4: COMMUNITY GROWTH */}
              {activeModal === "community_growth" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-olive/10 flex items-center justify-center text-brand-olive border border-brand-olive/20">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-light text-brand-cream">Community Growth</h3>
                      <p className="text-xs font-mono text-brand-olive">Nearest & Closest</p>
                    </div>
                  </div>

                  <p className="text-sm font-light text-brand-text-muted">
                    We maintain community-driven neighborhood dropboxes and sorting depots. Locate the closest center to drop off food or clothes immediately:
                  </p>

                  <div className="space-y-3 font-sans">
                    <div className="p-4 bg-brand-deep-dark/50 rounded-xl border border-brand-cream/5 flex justify-between items-start gap-4 hover:border-brand-olive/20 transition-all">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-brand-olive bg-brand-olive/10 px-2 py-0.5 rounded-full">0.8 miles away</span>
                        <h4 className="font-semibold text-brand-cream mt-1 text-sm">Downtown Hope Depot</h4>
                        <p className="text-xs text-brand-text-muted/80">451 Oakwood Ave, Cityville, CV 401</p>
                        <p className="text-[11px] text-brand-text-muted/60 mt-1">Open daily: 8:00 AM - 7:00 PM</p>
                      </div>
                      <MapPin className="w-5 h-5 text-brand-olive shrink-0 mt-1" />
                    </div>

                    <div className="p-4 bg-brand-deep-dark/50 rounded-xl border border-brand-cream/5 flex justify-between items-start gap-4 hover:border-brand-olive/20 transition-all">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-brand-olive bg-brand-olive/10 px-2 py-0.5 rounded-full">2.4 miles away</span>
                        <h4 className="font-semibold text-brand-cream mt-1 text-sm">Eastside Community Locker</h4>
                        <p className="text-xs text-brand-text-muted/80">902 Spruce Blvd, East City</p>
                        <p className="text-[11px] text-brand-text-muted/60 mt-1">Open 24/7 (Electronic lockers)</p>
                      </div>
                      <MapPin className="w-5 h-5 text-[#c5dc80] shrink-0 mt-1" />
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full bg-brand-olive hover:bg-brand-olive-hover text-brand-dark font-sans font-medium py-3 rounded-full text-sm min-h-[44px] cursor-pointer mt-2"
                  >
                    Find on Live Map
                  </button>
                </div>
              )}

              {/* MODAL 5: SUCCESS CONFIRMATION */}
              {activeModal === "success" && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-olive/10 text-brand-olive border border-brand-olive/30 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-serif font-light text-brand-cream">Pledge Confirmed!</h3>
                  
                  <p className="text-sm font-light text-brand-text-muted max-w-sm mx-auto leading-relaxed">
                    Thank you so much! Your mock pledge has been logged locally. We've drafted a packing manifest and designated downtown hope depot as your drop-off hub.
                  </p>

                  <div className="p-4 bg-brand-deep-dark/60 rounded-xl border border-brand-cream/5 max-w-xs mx-auto text-left font-mono text-xs space-y-1 text-brand-text-muted">
                    <div className="flex justify-between">
                      <span>PLEDGE ID:</span>
                      <span className="text-brand-cream font-bold">L2H-90812-M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>STATUS:</span>
                      <span className="text-brand-olive font-bold">Awaiting dropoff</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HUB TARGET:</span>
                      <span className="text-brand-cream">Downtown Hope</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full max-w-xs bg-brand-olive hover:bg-brand-olive-hover text-brand-dark font-sans font-medium py-3 rounded-full text-sm min-h-[44px] cursor-pointer mx-auto mt-4"
                  >
                    Got it, Thank you!
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
