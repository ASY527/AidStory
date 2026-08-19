import React from "react";
import { motion } from "motion/react";
import { 
  Heart, 
  MapPin, 
  Truck, 
  Package, 
  ChevronRight, 
  Phone, 
  Mail, 
  ArrowRight
} from "lucide-react";
import { ModalType } from "../types";

// Asset imports
const heroBg = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2560";
import giftBanner from "../assets/images/gift_handover_banner_1782830703656.jpg";
import handsCircle from "../assets/images/hands_circle_community_1782830772711.jpg";
import foodItems from "../assets/images/food_donation_items_1782830790126.jpg";
import collabBlocks from "../assets/images/collab_building_blocks_1782830809033.jpg";

interface AppHomeProps {
  navigateToView: (view: "home" | "comments" | "explore") => void;
  setActiveModal: (modal: ModalType) => void;
}

export default function AppHome({ navigateToView, setActiveModal }: AppHomeProps) {
  return (
    <>
      {/* 1. HERO SECTION WITH BACKGROUND IMAGE */}
      <section 
        id="hero"
        className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between p-6 md:p-12 lg:p-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Deep, highly legible ambient gradient overlay for robust contrast */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1715]/95 via-[#231e1c]/80 to-transparent pointer-events-none" />

        {/* Floating Top Nav / Identity Tag */}
        <div className="relative z-10 flex justify-end items-center w-full">
          {/* Top row elements removed to keep layout pristine and minimal */}
        </div>

        {/* Core Hero Content Layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto mt-auto mb-4 md:mb-5 space-y-4">
          
          {/* Spacing Control 1: Tagline container */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-xs md:text-sm font-mono tracking-widest uppercase bg-brand-olive/15 text-brand-olive px-3.5 py-1.5 rounded-full border border-brand-olive/30">
              In-kind donations
            </span>
          </motion.div>

          {/* Spacing Control 2: Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-[10vw] sm:text-[8.5vw] md:text-[8vw] lg:text-[6.5vw] xl:text-[6.5rem] font-baskerville leading-none tracking-tight font-normal text-brand-cream mt-4"
          >
            AidStory
          </motion.h1>

          {/* Spacing Control 3: Sub-grid for description and CTA button */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end w-full pt-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:col-span-8 space-y-1 max-w-2xl"
            >
              <p className="text-lg md:text-xl lg:text-2xl font-baskerville italic text-brand-olive leading-snug font-normal">
                “Every Donation Has a Story.”
              </p>
              <p 
                className="text-xs sm:text-sm md:text-base text-brand-text-muted font-baskerville leading-snug font-normal max-w-xl md:max-w-2xl"
                style={{ textAlign: "justify" }}
              >
                Every Story Begins with You. Connecting kindness with those in need.<br className="hidden md:inline" /> We bypass intermediaries to bridge the gap between kind hearts and real, urgent community requirements.
              </p>
            </motion.div>

            {/* Spacing Control 4: Button placement */}
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigateToView("explore")}
                style={{ marginRight: 0, marginBottom: -30 }}
                className="group relative inline-flex items-center gap-3 bg-brand-olive hover:bg-brand-olive-hover text-brand-dark font-gotham font-bold tracking-wider uppercase text-xs md:text-sm px-7 py-4 rounded-full transition-all duration-300 shadow-xl shadow-brand-dark/30 hover:shadow-brand-olive/20 min-h-[44px] cursor-pointer"
              >
                <span>Explore Your Journey</span>
                <div className="w-8 h-8 rounded-full bg-brand-dark/10 flex items-center justify-center group-hover:bg-brand-dark/20 transition-colors">
                  <ChevronRight className="w-5 h-5 text-brand-dark group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            </div>
          </div>

        </div>

        {/* Elegant Bottom Scroller Indicator */}
        <div className="relative z-10 w-full flex justify-between items-center text-xs font-mono text-brand-text-muted/70 mt-8 pt-4 border-t border-brand-cream/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-olive animate-pulse" />
            <span>Active Resource Dashboard Ready</span>
          </div>
          <div className="flex gap-4">
            <a href="#about" className="hover:text-brand-olive transition-colors">About Us</a>
            <span>/</span>
            <a href="#contact" className="hover:text-brand-olive transition-colors">Contact Us</a>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about" className="relative bg-brand-dark pt-20 pb-12 px-6 md:px-12 lg:px-20">
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
      </section>

      {/* 3. MIDDLE SPACER BANNER */}
      <section className="relative w-full overflow-hidden" style={{ height: "330px" }}>
        <img 
          src={giftBanner} 
          alt="Hands giving beautifully wrapped gift box with cream ribbon" 
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          style={{ height: "330px" }}
        />
        <div className="absolute inset-0 bg-brand-deep-dark/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-transparent to-brand-deep-dark/90" />
      </section>

      {/* 4. CONTACT US & COMMUNITY VOICES SECTION */}
      <section id="contact" className="relative bg-brand-deep-dark py-20 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Contact Form & Info */}
            <div className="lg:col-span-6 space-y-12">
              <div>
                <h2 className="text-5xl md:text-6xl font-serif font-light italic tracking-tight text-brand-cream">
                  Contact Us
                </h2>
                <p className="text-brand-text-muted mt-3 font-light text-base max-w-md">
                  Reach out to join our logistic network, request in-kind items for your center, or submit questions.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-cream/5 flex items-center justify-center text-brand-olive border border-brand-cream/10 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-brand-text-muted/65 uppercase tracking-wider">Phone</span>
                    <span className="text-xl font-serif text-brand-cream font-medium">
                      (123) 456-7890
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-cream/5 flex items-center justify-center text-brand-olive border border-brand-cream/10 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-brand-text-muted/65 uppercase tracking-wider">Email</span>
                    <a href="mailto:info@aidstory.org" className="text-xl font-serif text-brand-cream hover:text-brand-olive transition-colors font-medium">
                      info@aidstory.org
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-brand-dark/40 p-6 md:p-8 rounded-2xl border border-brand-cream/5">
                <div className="space-y-1">
                  <span className="block text-xs font-mono text-brand-olive uppercase tracking-wider font-semibold">Community Feedback</span>
                  <h3 className="text-2xl font-serif italic text-brand-cream">Comments & Ideas</h3>
                </div>
                <p className="text-sm text-brand-text-muted leading-relaxed font-baskerville">
                  Every donor has a story, and every story begins with you. We invite you to visit our dedicated Community Comments page where you can read words of hope or leave your own thoughts.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => navigateToView("comments")}
                    className="group relative inline-flex items-center gap-2 bg-brand-olive hover:bg-brand-olive-hover text-brand-dark font-gotham font-bold tracking-wider uppercase text-xs px-6 py-3.5 rounded-full transition-all duration-300 min-h-[44px] cursor-pointer shadow-md shadow-brand-olive/10"
                  >
                    <span>View & Leave Comments</span>
                    <ArrowRight className="w-4 h-4 text-brand-dark group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Collage Section */}
            <div className="lg:col-span-6 relative pt-8 lg:pt-0">
              <div className="relative w-full aspect-[4/3] md:aspect-[1.1] max-w-lg mx-auto">
                
                {/* 1. Food Donations */}
                <motion.div 
                  className="absolute top-0 right-0 w-[53%] aspect-square rounded-[2rem] overflow-hidden border-2 border-brand-deep-dark shadow-2xl z-10 bg-brand-dark/80"
                  whileHover={{ scale: 1.03, zIndex: 40 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={foodItems} 
                    alt="Canned foods, bottled waters, and pasta stacked for donation drives" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-deep-dark/5" />
                  <div className="absolute bottom-3 left-3 bg-brand-deep-dark/75 backdrop-blur-md px-3 py-1 rounded-full border border-brand-cream/10">
                    <span className="text-[10px] font-mono uppercase text-brand-olive tracking-wider">Item Collection</span>
                  </div>
                </motion.div>

                {/* 2. Hands Circle Community */}
                <motion.div 
                  className="absolute top-[12%] left-[23.5%] w-[53%] aspect-square rounded-[2rem] overflow-hidden border-2 border-brand-deep-dark shadow-2xl z-30 bg-brand-dark/80"
                  whileHover={{ scale: 1.03, zIndex: 40 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={handsCircle} 
                    alt="Top down photo of multiple hands stacked in a circle on green grass" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-deep-dark/5" />
                  <div className="absolute bottom-3 left-3 bg-brand-deep-dark/75 backdrop-blur-md px-3 py-1 rounded-full border border-brand-cream/10">
                    <span className="text-[10px] font-mono uppercase text-brand-olive tracking-wider">Community Power</span>
                  </div>
                </motion.div>

                {/* 3. Block Stacking */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-[53%] aspect-square rounded-[2rem] overflow-hidden border-2 border-brand-deep-dark shadow-2xl z-20 bg-brand-dark/80"
                  whileHover={{ scale: 1.03, zIndex: 40 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={collabBlocks} 
                    alt="Hands building structures out of natural wooden blocks together" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-deep-dark/5" />
                  <div className="absolute bottom-3 left-3 bg-brand-deep-dark/75 backdrop-blur-md px-3 py-1 rounded-full border border-brand-cream/10">
                    <span className="text-[10px] font-mono uppercase text-brand-olive tracking-wider">Collaboration</span>
                  </div>
                </motion.div>

              </div>

              <div className="absolute -top-12 -left-12 w-24 h-24 bg-brand-olive/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-olive/10 rounded-full blur-3xl pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-brand-deep-dark py-12 px-6 text-center border-t border-brand-cream/5">
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
