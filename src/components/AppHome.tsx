import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  MapPin, 
  Truck, 
  Package, 
  X
} from "lucide-react";
import { ModalType } from "../types";

// Asset imports
import deskBackgroundArt from "../assets/images/aidstory-desk-background.png";
import mobileDeskBackgroundArt from "../assets/images/aidstory-mobile-background.png";
import tabletLayerArt from "../assets/images/aidstory-tablet-layer.png";
import notebookLayerArt from "../assets/images/aidstory-notebook-layer.png";
import openAboutBookArt from "../assets/images/aidstory-open-book-layer.png";
import contactStickyNoteArt from "../assets/images/aidstory-contact-sticky-note.png";
import forestPathArt from "../assets/images/forest_sunset_hero_1782830685827.jpg";

interface AppHomeProps {
  navigateToView: (view: "home" | "comments" | "explore") => void;
  setActiveModal: (modal: ModalType) => void;
}

export default function AppHome({ navigateToView, setActiveModal }: AppHomeProps) {
  const [isDeskSwapped, setIsDeskSwapped] = useState(false);
  const [isAboutBookOpen, setIsAboutBookOpen] = useState(false);
  const [isContactStickyOpen, setIsContactStickyOpen] = useState(false);
  const [isJourneyZooming, setIsJourneyZooming] = useState(false);

  const handleNotebookClick = () => {
    if (isDeskSwapped) {
      setIsAboutBookOpen(true);
      return;
    }
    setIsDeskSwapped(true);
  };

  return (
    <>
      {/* Mobile keeps the same scrapbook interactions, using a portrait desk composition. */}
      <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#211b14] sm:hidden">
        <img
          src={mobileDeskBackgroundArt}
          alt="AidStory portrait scrapbook desk"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <motion.button
          type="button"
          onClick={() => {
            if (isDeskSwapped) {
              setIsDeskSwapped(false);
              return;
            }
            setIsJourneyZooming(true);
          }}
          aria-label={isDeskSwapped ? "Return tablet and notebook to their original positions" : "Explore your journey"}
          title={isDeskSwapped ? "Return to original positions" : "Explore Your Journey"}
          animate={{
            left: isDeskSwapped ? "20%" : "21%",
            top: isDeskSwapped ? "55%" : "28%",
            width: isDeskSwapped ? "62%" : "74%",
            rotate: isDeskSwapped ? -1 : -3,
            zIndex: isDeskSwapped ? 20 : 10,
          }}
          transition={{ type: "spring", stiffness: 105, damping: 18 }}
          className="absolute cursor-pointer rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive"
        >
          <img src={tabletLayerArt} alt="AidStory tablet" className="block h-auto w-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.42)]" />
        </motion.button>

        {!isAboutBookOpen && <motion.button
          type="button"
          onClick={handleNotebookClick}
          aria-label={isDeskSwapped ? "Open About Us notebook" : "Swap notebook and tablet positions"}
          title={isDeskSwapped ? "Open About Us" : "Swap notebook and tablet"}
          animate={{
            left: isDeskSwapped ? "13%" : "43%",
            top: isDeskSwapped ? "28%" : "56%",
            width: isDeskSwapped ? "76%" : "52%",
            rotate: isDeskSwapped ? 2 : -5,
            zIndex: isDeskSwapped ? 10 : 20,
          }}
          transition={{ type: "spring", stiffness: 105, damping: 18 }}
          className="absolute cursor-pointer rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive"
        >
          <img src={notebookLayerArt} alt="About Us notebook" className="block h-auto w-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.42)]" />
        </motion.button>}

        <button
          type="button"
          onClick={() => setIsContactStickyOpen((isOpen) => !isOpen)}
          aria-label={isContactStickyOpen ? "Hide Contact Us note" : "Show Contact Us note"}
          title={isContactStickyOpen ? "Hide Contact Us" : "Show Contact Us"}
          className="absolute left-[4%] top-[57%] w-[31%] cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive"
        >
          <img src={contactStickyNoteArt} alt="Contact Us sticky note" className="block h-auto w-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.38)]" />
        </button>

        <AnimatePresence>
          {isContactStickyOpen && (
            <motion.div
              initial={{ opacity: 0, x: "-42vw", y: "55vh", rotate: -16, scale: 0.32 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: -1, scale: 1 }}
              exit={{ opacity: 0, x: "-35vw", y: "50vh", rotate: -12, scale: 0.45 }}
              transition={{ type: "spring", stiffness: 135, damping: 17, mass: 0.85 }}
              className="absolute left-[4%] top-[24%] z-30 w-[92%] origin-bottom-left"
            >
              <button
                type="button"
                onClick={() => navigateToView("comments")}
                aria-label="Contact Us. View and leave comments"
                title="View & Leave Comments"
                className="block w-full cursor-pointer rounded-[2rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive"
              >
                <img src={contactStickyNoteArt} alt="Contact Us sticky note with phone, email, and View & Leave Comments" className="block h-auto w-full drop-shadow-[0_24px_22px_rgba(42,26,12,0.46)]" />
              </button>
              <button
                type="button"
                onClick={() => setIsContactStickyOpen(false)}
                aria-label="Close Contact Us note"
                title="Close"
                className="absolute right-[3%] top-[3%] grid h-9 w-9 place-items-center rounded-full bg-[#3f3428]/90 text-[#fff6e6] shadow-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 1. INTERACTIVE SCRAPBOOK HOME */}
      <section id="hero" className="relative hidden h-screen w-screen overflow-hidden bg-[#211b14] sm:block">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={deskBackgroundArt}
            alt="AidStory scrapbook desk"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* The tablet and notebook are independent layers so they can exchange places. */}
          <motion.button
            type="button"
            onClick={() => {
              if (isDeskSwapped) {
                setIsDeskSwapped(false);
                return;
              }
              setIsJourneyZooming(true);
            }}
            aria-label={isDeskSwapped ? "Return tablet and notebook to their original positions" : "Explore your journey"}
            title={isDeskSwapped ? "Return to original positions" : "Explore Your Journey"}
            animate={{
              left: isDeskSwapped ? "70%" : "19%",
              top: isDeskSwapped ? "23%" : "20%",
              width: isDeskSwapped ? "34%" : "62%",
              rotate: isDeskSwapped ? -3 : -5,
              zIndex: isDeskSwapped ? 20 : 10,
            }}
            transition={{ type: "spring", stiffness: 105, damping: 18 }}
            className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive rounded-3xl cursor-pointer"
          >
            <img src={tabletLayerArt} alt="AidStory tablet" className="block h-auto w-full drop-shadow-[0_20px_18px_rgba(0,0,0,0.42)]" />
          </motion.button>

          {/* Spiral notebook */}
          {!isAboutBookOpen && <motion.button
            type="button"
            onClick={handleNotebookClick}
            aria-label={isDeskSwapped ? "Open About Us notebook" : "Swap notebook and tablet positions"}
            title={isDeskSwapped ? "Open About Us" : "Swap notebook and tablet"}
            animate={{
              left: isDeskSwapped ? "17%" : "68%",
              top: isDeskSwapped ? "16%" : "19%",
              width: isDeskSwapped ? "64%" : "36%",
              rotate: isDeskSwapped ? 2 : -4,
              zIndex: isDeskSwapped ? 10 : 20,
            }}
            transition={{ type: "spring", stiffness: 105, damping: 18 }}
            className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive rounded-3xl cursor-pointer"
          >
            <img src={notebookLayerArt} alt="About Us notebook" className="block h-auto w-full drop-shadow-[0_20px_18px_rgba(0,0,0,0.42)]" />
          </motion.button>}

          {/* Kindness sticky note */}
          <button
            type="button"
            onClick={() => setIsContactStickyOpen((isOpen) => !isOpen)}
            aria-label={isContactStickyOpen ? "Hide Contact Us note" : "Show Contact Us note"}
            title={isContactStickyOpen ? "Hide Contact Us" : "Show Contact Us"}
            className="absolute left-[12%] top-[57%] h-[28%] w-[16%] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive hover:bg-white/10 transition-colors cursor-pointer"
          />

          <AnimatePresence>
            {isContactStickyOpen && (
              <motion.div
                initial={{ opacity: 0, x: "-45vw", y: "58vh", rotate: -18, scale: 0.3 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -2, scale: 1 }}
                exit={{ opacity: 0, x: "-14vw", y: "18vh", rotate: 8, scale: 0.72 }}
                transition={{ type: "spring", stiffness: 135, damping: 17, mass: 0.85 }}
                className="absolute left-[5%] top-[18%] z-30 w-[34%] origin-bottom-left"
              >
                <button
                  type="button"
                  onClick={() => navigateToView("comments")}
                  aria-label="Contact Us. View and leave comments"
                  title="View & Leave Comments"
                  className="block w-full cursor-pointer rounded-[2rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive"
                >
                  <img
                    src={contactStickyNoteArt}
                    alt="Contact Us sticky note with phone, email, and View & Leave Comments"
                    className="block h-auto w-full drop-shadow-[0_24px_22px_rgba(42,26,12,0.46)]"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setIsContactStickyOpen(false)}
                  aria-label="Close Contact Us note"
                  title="Close"
                  className="absolute right-[3%] top-[3%] grid h-9 w-9 place-items-center rounded-full bg-[#3f3428]/90 text-[#fff6e6] shadow-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive sm:h-11 sm:w-11"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      <AnimatePresence>
        {isJourneyZooming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] overflow-hidden bg-[#15120d]"
          >
            <motion.img
              src={forestPathArt}
              alt="Moving through a forest path"
              initial={{ scale: 0.9, x: "0%", y: "0%" }}
              animate={{ scale: 1.8, x: "-4%", y: "8%" }}
              transition={{ duration: 1.15, ease: [0.22, 0.75, 0.25, 1] }}
              onAnimationComplete={() => navigateToView("explore")}
              className="h-full w-full object-cover"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.35 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#e9daac]/35 bg-[#241b13]/65 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#fff3d7] backdrop-blur-sm"
            >
              Follow the path
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The large notebook peels open only after the tablet and notebook have swapped. */}
      <AnimatePresence>
        {isAboutBookOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] bg-transparent pointer-events-none flex items-center justify-center p-3 sm:p-6"
          >
            <motion.button
              type="button"
              onClick={() => setIsAboutBookOpen(false)}
              initial={{ opacity: 0.45, scale: 0.5, y: "6vh", rotate: 2, clipPath: "polygon(0 0, 8% 0, 8% 100%, 0 100%)" }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
              exit={{ opacity: 0, scale: 0.5, y: "6vh", rotate: 2, clipPath: "polygon(0 0, 8% 0, 8% 100%, 0 100%)" }}
              transition={{ duration: 0.68, ease: [0.22, 0.8, 0.25, 1] }}
              aria-label="Open About Us book. Click to close it."
              title="Click to close About Us"
              style={{ transformPerspective: 1500, transformOrigin: "left center" }}
              className="relative w-full max-w-[1700px] aspect-[16/9] overflow-hidden pointer-events-auto cursor-pointer"
            >
              <img
                src={openAboutBookArt}
                alt="Open AidStory Journal with About Us, donation matching, transparency, and community growth"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <motion.span
                initial={{ scaleX: 1, rotateY: 0, opacity: 0.95 }}
                animate={{ scaleX: 0, rotateY: -78, opacity: 0 }}
                exit={{ scaleX: 1, rotateY: 0, opacity: 0.95 }}
                transition={{ duration: 0.58, ease: "easeInOut" }}
                style={{ transformOrigin: "left center", transformPerspective: 1500 }}
                className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(105deg,#fff5dd_0%,#e8d3ad_55%,#b89366_100%)] shadow-[14px_0_22px_rgba(59,36,18,0.28)] pointer-events-none"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ABOUT US SECTION */}
      {false && <section id="about" className="relative bg-brand-dark pt-20 pb-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-brand-cream relative">
                About Us
                <span className="absolute -bottom-2 left-0 w-16 h-[1px] bg-brand-olive/50" />
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-xl md:text-2xl font-serif text-brand-text-muted leading-relaxed font-light">
                <strong className="text-brand-cream font-medium">AidStory</strong> is a central platform for efficient resource allocation. Recipients post what they need, and donors find direct ways to help.
              </p>
            </div>
          </div>

          {/* Three Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-6">
            
            {/* Feature Card 1 */}
            <div className="flex flex-col items-center group/card">
              <div className="w-[250px] h-[250px] bg-[#3a2e26] rounded-[2rem] p-8 flex flex-col items-center justify-center mb-6 shadow-xl border border-brand-cream/5 relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 bg-radial from-[#c5dc80]/15 to-transparent opacity-60 group-hover/card:opacity-90 transition-opacity duration-500" />
                
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-[85%] h-[85%] rounded-full border border-brand-cream/10 animate-[spin_40s_linear_infinite]" />
                  <div className="absolute w-[65%] h-[65%] rounded-full border border-dashed border-[#c5dc80]/20 animate-[spin_20s_linear_infinite_reverse]" />
                  
                  <div className="relative flex flex-col items-center justify-center">
                    <motion.div 
                      className="bg-[#c5dc80] text-[#2c221a] p-2.5 rounded-xl shadow-lg z-30 mb-[-14px]"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                      <Heart className="w-5 h-5 fill-[#2c221a] text-[#2c221a]" />
                    </motion.div>
                    
                    <div className="bg-[#4d3f35] border border-brand-cream/10 p-5 rounded-2xl shadow-xl z-20 flex items-center justify-center w-24 h-24">
                      <Package className="w-12 h-12 text-brand-cream group-hover/card:scale-110 transition-transform duration-300" />
                    </div>

                    <div className="w-36 h-3 bg-[#2a1f18] rounded-full blur-[2px] mt-3 opacity-60" />
                  </div>

                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-1 bg-[#c5dc80]/30 rounded-full" />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-1 bg-[#c5dc80]/30 rounded-full" />
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-[#c5dc80]/30 rounded-full" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-[#c5dc80]/30 rounded-full" />
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-brand-cream/5 border border-[#c5dc80]/20 flex items-center justify-center text-brand-olive shrink-0">
                  <Package className="w-4 h-4 text-[#c5dc80]" />
                </div>
                <div className="text-left">
                  <h3 className="font-sans font-medium text-brand-cream text-[15px]">
                    Donations Go Exactly
                  </h3>
                  <p className="text-[11px] font-mono text-[#c5dc80] tracking-wide font-light">
                    Zero Waste • Target Matching
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="flex flex-col items-center group/card">
              <div className="w-[250px] h-[250px] bg-[#3a2e26] rounded-[2rem] p-8 flex flex-col items-center justify-center mb-6 shadow-xl border border-brand-cream/5 relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 bg-radial from-[#c5dc80]/15 to-transparent opacity-60 group-hover/card:opacity-90 transition-opacity duration-500" />

                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-4 border border-brand-cream/5 rounded-2xl grid grid-cols-4 grid-rows-4 opacity-40">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="border-[0.5px] border-brand-cream/5" />
                    ))}
                  </div>

                  <svg className="absolute inset-0 w-full h-full text-[#c5dc80]/20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
                    <path d="M 40,150 Q 120,60 200,150 T 360,150" />
                  </svg>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <motion.div 
                      className="bg-[#c5dc80] text-[#2c221a] p-5 rounded-3xl shadow-xl flex items-center justify-center w-24 h-24 relative border border-[#c5dc80]/20"
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                      <Truck className="w-11 h-11 text-[#2c221a] group-hover/card:translate-x-1 transition-transform duration-300" />
                      <span className="absolute -inset-1 rounded-3xl border border-[#c5dc80]/40 animate-ping opacity-45" />
                    </motion.div>
                    
                    <div className="w-28 h-2.5 bg-[#2a1f18] rounded-full blur-[2px] mt-3 opacity-60" />
                  </div>

                  <div className="absolute top-12 left-16 w-3 h-3 rounded-full bg-[#c5dc80] animate-pulse shadow-[0_0_8px_rgba(197,220,128,0.8)]" />
                  <div className="absolute bottom-16 right-16 w-3 h-3 rounded-full bg-brand-cream/40" />
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-brand-cream/5 border border-[#c5dc80]/20 flex items-center justify-center text-brand-olive shrink-0">
                  <Truck className="w-4 h-4 text-[#c5dc80]" />
                </div>
                <div className="text-left">
                  <h3 className="font-sans font-medium text-brand-cream text-[15px]">
                    Transparency
                  </h3>
                  <p className="text-[11px] font-mono text-[#c5dc80] tracking-wide font-light">
                    Dynamic Logistics & Track Your Donations
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="flex flex-col items-center group/card">
              <div className="w-[250px] h-[250px] bg-[#3a2e26] rounded-[2rem] p-8 flex flex-col items-center justify-center mb-6 shadow-xl border border-brand-cream/5 relative overflow-hidden transition-all duration-300">
                <div className="absolute inset-0 bg-radial from-[#c5dc80]/15 to-transparent opacity-60 group-hover/card:opacity-90 transition-opacity duration-500" />

                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-[90%] h-[90%] rounded-full border border-brand-cream/5" />
                  <div className="absolute w-[65%] h-[65%] rounded-full border border-brand-cream/10 flex items-center justify-center">
                    <div className="absolute w-[70%] h-[70%] rounded-full border border-[#c5dc80]/10 animate-ping duration-1000" />
                  </div>
                  <div className="absolute w-[40%] h-[40%] rounded-full border border-[#c5dc80]/20" />

                  <div className="absolute w-full h-full rounded-full animate-[spin_6s_linear_infinite] opacity-25 bg-gradient-to-tr from-[#c5dc80]/20 via-transparent to-transparent pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <motion.div 
                      className="bg-[#4d3f35] border border-brand-cream/10 p-5 rounded-full shadow-xl flex items-center justify-center w-24 h-24 relative"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      <MapPin className="w-11 h-11 text-[#c5dc80]" />
                    </motion.div>

                    <div className="w-24 h-2 bg-[#2a1f18] rounded-full blur-[2px] mt-3 opacity-60" />
                  </div>

                  <div className="absolute left-[18%] bottom-[35%] flex items-center gap-1 bg-[#2c221a]/90 px-2 py-0.5 rounded-full border border-brand-cream/15 text-[9px] font-mono text-[#c5dc80] shadow-md z-20">
                    <span className="w-1 h-1 rounded-full bg-[#c5dc80] animate-pulse" />
                    <span>2 min</span>
                  </div>

                  <div className="absolute top-[22%] right-[25%] flex items-center gap-1 bg-[#4d3f35]/80 px-2 py-1 rounded-lg border border-brand-cream/10 text-[9px] font-mono text-brand-cream">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5dc80]" />
                    <span>0.8 mi</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-brand-cream/5 border border-[#c5dc80]/20 flex items-center justify-center text-brand-olive shrink-0">
                  <MapPin className="w-4 h-4 text-[#c5dc80]" />
                </div>
                <div className="text-left">
                  <h3 className="font-sans font-medium text-brand-cream text-[15px]">
                    Community Growth
                  </h3>
                  <p className="text-[11px] font-mono text-[#c5dc80] tracking-wide font-light">
                    Nearest & Closest
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-10 text-center border-t border-brand-cream/5" style={{ paddingTop: "0px" }}>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-brand-olive font-light leading-relaxed max-w-4xl mx-auto"
            >
              "Connecting those who have abundance to those who endure scarcity — one parcel of hope at a time."
            </motion.p>
          </div>

        </div>
      </section>}

      {/* Footer */}
q      <footer className="bg-brand-deep-dark py-12 px-6 text-center border-t border-brand-cream/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-mono text-brand-text-muted/50">
          <p>© 2026 AidStory. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-brand-olive transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-brand-olive transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-brand-olive transition-colors cursor-pointer">Resource Dispatch</span>
          </div>
        </div>
      </footer>
    </>
  );
}
