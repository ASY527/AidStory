import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowLeft, X, Check, AlertCircle } from "lucide-react";

// Local asset imports if available, otherwise high quality unsplash fallback
import foodItems from "../assets/images/food_donation_items_1782830790126.jpg";

interface AppExploreProps {
  navigateToView: (view: "home" | "comments" | "explore" | "main_menu") => void;
}

const carouselImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600",
    alt: "Donated folded clothing stacked neatly on a rustic wooden table",
    tag: "Clothing Drive"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600",
    alt: "Hands packing books and goods into a Donate cardboard box",
    tag: "Education Supplies"
  },
  {
    id: 3,
    url: foodItems || "https://images.unsplash.com/photo-1574607383476-f517f220d398?auto=format&fit=crop&q=80&w=600",
    alt: "In-kind food donation box filled with pasta and water bottles",
    tag: "Food Supplies"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
    alt: "Creative art workspace with paintbrushes, colored papers, and children's crafts",
    tag: "Toys & Crafts"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600",
    alt: "Golden retriever puppy drinking from a bowl",
    tag: "Animal Welfare"
  }
];

export default function AppExplore({ navigateToView }: AppExploreProps) {
  // Let's keep track of the starting index for our visible sliding strip
  const [startIndex, setStartIndex] = useState(0);

  // Sign Up Modal & Form state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpError, setSignUpError] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactPrefix, setContactPrefix] = useState("+60");
  const [contactNumber, setContactNumber] = useState("");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");

  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Log In Modal & Form state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitAttempted, setLoginSubmitAttempted] = useState(false);

  // Password validation checks:
  // - at least 1 alphabet
  // - at least 1 number
  // - at least 1 special character (e.g. !, @, #, $, %)
  // - total length at least 5
  const getPasswordValidationErrors = (pass: string) => {
    const errors: string[] = [];
    if (pass.length < 5) {
      errors.push("total length at least 5");
    }
    if (!/[A-Za-z]/.test(pass)) {
      errors.push("at least 1 alphabet");
    }
    if (!/\d/.test(pass)) {
      errors.push("at least 1 number");
    }
    if (!/[!,@,#,$,%]/.test(pass)) {
      errors.push("at least 1 special sign (eg. !,@,#,$,%)");
    }
    return errors;
  };

  const activeErrors = getPasswordValidationErrors(password);
  const isPasswordValid = activeErrors.length === 0;

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isPasswordValid) {
      return;
    }

    // Save user to simulated database (localStorage)
    const existingUsersJSON = localStorage.getItem("aidstory_users") || "[]";
    let existingUsers: any[] = [];
    try {
      existingUsers = JSON.parse(existingUsersJSON);
    } catch (err) {
      existingUsers = [];
    }

    // Check if user already exists
    const userExists = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      setSignUpError("This email is already registered. Please log in or use a different email!");
      return;
    }

    const newUser = {
      username,
      email: email.toLowerCase(),
      password, // Stored for credential verification
      contact: `${contactPrefix} ${contactNumber}`,
      joinedDate: new Date().toISOString(),
      location: {
        postcode,
        address,
        state: stateName,
        country
      }
    };

    existingUsers.push(newUser);
    localStorage.setItem("aidstory_users", JSON.stringify(existingUsers));
    
    // Set as currently logged in user
    localStorage.setItem("aidstory_current_user", JSON.stringify(newUser));

    // Success response
    setSignUpSuccess(true);
    setTimeout(() => {
      setSignUpSuccess(false);
      setIsSignUpOpen(false);
      setSubmitAttempted(false);
      // Clean up fields
      setUsername("");
      setEmail("");
      setPassword("");
      setContactPrefix("+60");
      setContactNumber("");
      setPostcode("");
      setAddress("");
      setStateName("");
      setCountry("");
      // Stay on the explore page instead of navigating to home page
    }, 2500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitAttempted(true);
    setLoginError("");

    const existingUsersJSON = localStorage.getItem("aidstory_users") || "[]";
    let existingUsers: any[] = [];
    try {
      existingUsers = JSON.parse(existingUsersJSON);
    } catch (err) {
      existingUsers = [];
    }

    // 1. Check if the email exists in our database/localStorage at all
    const emailExists = existingUsers.some(
      (u: any) => u.email.toLowerCase() === loginEmail.toLowerCase()
    );

    if (!emailExists) {
      setLoginError("Email does not exist.");
      return;
    }

    // 2. Check if the password is correct
    const matchedUser = existingUsers.find(
      (u: any) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword
    );

    if (!matchedUser) {
      setLoginError("Incorrect password");
      return;
    }

    if (!matchedUser.joinedDate) {
      matchedUser.joinedDate = new Date().toISOString();
      const uIndex = existingUsers.findIndex(
        (u: any) => u.email.toLowerCase() === matchedUser.email.toLowerCase()
      );
      if (uIndex !== -1) {
        existingUsers[uIndex] = matchedUser;
        localStorage.setItem("aidstory_users", JSON.stringify(existingUsers));
      }
    }

    // Set as currently logged in user
    localStorage.setItem("aidstory_current_user", JSON.stringify(matchedUser));

    setLoginSuccess(true);
    setTimeout(() => {
      setLoginSuccess(false);
      setIsLoginOpen(false);
      setLoginSubmitAttempted(false);
      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
      // Navigate to main menu upon success
      navigateToView("main_menu");
    }, 2000);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  // Seed fixed admin account and automatic sliding interval
  useEffect(() => {
    // Seed admin information if not present
    const existingUsersJSON = localStorage.getItem("aidstory_users") || "[]";
    let existingUsers: any[] = [];
    try {
      existingUsers = JSON.parse(existingUsersJSON);
    } catch (err) {
      existingUsers = [];
    }

    const adminEmail = "aidstoryadmin@gmail.com";
    const adminExists = existingUsers.some((u: any) => u.email.toLowerCase() === adminEmail.toLowerCase());

    if (!adminExists) {
      const adminUser = {
        username: "ADMIN",
        email: adminEmail,
        password: "admin1#",
        contact: "+60 12-3456789",
        joinedDate: "2026-05-08T00:00:00.000Z",
        location: {
          address: "No 1402",
          postcode: "31900",
          state: "perak",
          country: "malaysia"
        }
      };
      existingUsers.push(adminUser);
      localStorage.setItem("aidstory_users", JSON.stringify(existingUsers));
    }

    // Slide timer
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [startIndex]);

  // Generate an array of indices that wraps around for smooth continuous carousel display
  const getVisibleImages = () => {
    const indices = [];
    for (let i = 0; i < 5; i++) {
      indices.push((startIndex + i) % carouselImages.length);
    }
    return indices;
  };

  const visibleIndices = getVisibleImages();

  return (
    <div className="min-h-screen bg-[#2c221a] text-brand-cream flex flex-col justify-between selection:bg-brand-olive selection:text-brand-dark overflow-x-hidden relative animate-fadeIn">
      
      {/* Back to Home bar */}
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigateToView("home")}
            className="group flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-brand-text-muted hover:text-brand-olive transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text-muted group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow flex flex-col justify-center items-center pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-serif italic text-brand-cream font-light leading-tight tracking-tight">
            Explore Your Journey with
          </h1>
        </div>

        {/* 3 Interactive Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-3xl mb-14">
          
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="w-full sm:w-56 py-3.5 rounded-full text-center font-gotham font-extrabold tracking-wider text-[20px] transition-all duration-300 bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a] hover:scale-105 active:scale-95 shadow-md hover:shadow-[#ffee1a]/25 cursor-pointer min-h-[44px]"
          >
            Log In
          </button>

          <button 
            onClick={() => {
              setIsSignUpOpen(true);
              setSignUpError("");
              setSubmitAttempted(false);
            }}
            className="w-full sm:w-56 py-3.5 rounded-full text-center font-gotham font-extrabold tracking-wider text-[20px] transition-all duration-300 bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a] hover:scale-105 active:scale-95 shadow-md hover:shadow-[#ffee1a]/25 cursor-pointer min-h-[44px]"
          >
            Sign Up
          </button>

          <button 
            onClick={() => {
              localStorage.removeItem("aidstory_current_user");
              navigateToView("main_menu");
            }}
            className="w-full sm:w-56 py-3.5 rounded-full text-center font-gotham font-extrabold tracking-wider text-[20px] transition-all duration-300 bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a] hover:scale-105 active:scale-95 shadow-md hover:shadow-[#ffee1a]/25 cursor-pointer min-h-[44px]"
          >
            Browse As Guest
          </button>

        </div>

        {/* Carousel Window */}
        <div className="relative w-full overflow-hidden mb-8">
          
          {/* Main Strip Container */}
          <div className="flex justify-center items-center gap-4 py-4 w-full">
            {visibleIndices.map((imgIndex, idx) => {
              const item = carouselImages[imgIndex];
              // Apply styles depending on whether the item is at the edges (idx === 0 or idx === 4) or middle
              const isEdge = idx === 0 || idx === 4;
              
              return (
                <div 
                  key={`${item.id}-${idx}`}
                  className={`relative rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500 ease-in-out shrink-0
                    ${idx === 2 ? "w-[40%] md:w-[32%] aspect-square z-20 scale-105 border-2 border-brand-cream/20" : ""}
                    ${idx === 1 || idx === 3 ? "w-[28%] md:w-[22%] aspect-square z-10 opacity-75" : ""}
                    ${isEdge ? "w-[12%] md:w-[15%] aspect-square opacity-30 blur-[1px]" : ""}
                  `}
                >
                  <img 
                    src={item.url} 
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle black overlay to make tags pop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
                  
                  {/* Item tag for active center image */}
                  {idx === 2 && (
                    <div className="absolute bottom-4 left-4 right-4 text-center bg-black/50 backdrop-blur-md py-1.5 px-3 rounded-full border border-brand-cream/10">
                      <span className="text-[10px] md:text-xs font-mono font-medium tracking-widest uppercase text-brand-cream">
                        {item.tag}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overlaid Left Navigation Arrow */}
          <button 
            onClick={handlePrev}
            className="absolute left-[3%] md:left-[6%] top-1/2 -translate-y-1/2 z-30 bg-[#2c221a]/80 hover:bg-brand-cream text-brand-cream hover:text-brand-dark border-2 border-brand-cream/20 rounded-full p-2.5 md:p-3.5 shadow-2xl transition-all duration-300 active:scale-90 hover:scale-110 flex items-center justify-center cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
          </button>

          {/* Overlaid Right Navigation Arrow */}
          <button 
            onClick={handleNext}
            className="absolute right-[3%] md:right-[6%] top-1/2 -translate-y-1/2 z-30 bg-[#2c221a]/80 hover:bg-brand-cream text-brand-cream hover:text-brand-dark border-2 border-brand-cream/20 rounded-full p-2.5 md:p-3.5 shadow-2xl transition-all duration-300 active:scale-90 hover:scale-110 flex items-center justify-center cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
          </button>

        </div>

      </div>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-brand-cream/5 bg-brand-deep-dark/40">
        <span className="text-xs font-mono text-brand-text-muted/40">
          © 2026 AidStory. All rights reserved.
        </span>
      </footer>

      {/* Dynamic Sign Up Form Modal */}
      <AnimatePresence>
        {isSignUpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!signUpSuccess) {
                  setIsSignUpOpen(false);
                  setSubmitAttempted(false);
                }
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-[#395244] p-6 md:p-8 rounded-2xl border border-brand-cream/20 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-brand-cream"
            >
              {/* Close Button */}
              {!signUpSuccess && (
                <button 
                  onClick={() => {
                    setIsSignUpOpen(false);
                    setSubmitAttempted(false);
                  }}
                  className="absolute top-4 right-4 text-brand-cream/75 hover:text-brand-cream transition-colors p-2 rounded-full hover:bg-brand-cream/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {signUpSuccess ? (
                <div className="text-center py-8 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#82afa6]/20 text-[#82afa6] border border-[#82afa6]/40 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-light text-brand-cream">Account Created!</h3>
                  <p className="text-sm font-light text-brand-cream/80 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-brand-cream">{username}</strong>. Your registration was successful! Directing you to the home dashboard.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-brand-cream">Sign Up</h3>
                    <p className="text-xs text-brand-cream/85 font-light">Join AidStory to track and match local donations seamlessly.</p>
                  </div>

                  {signUpError && (
                    <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                      <span>{signUpError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSignUpSubmit} className="space-y-4 text-left">
                    
                    {/* Username or Org name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">Username / Organisation Name *</label>
                      <input 
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. Red Cross or John Doe"
                        className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setSignUpError("");
                        }}
                        placeholder="e.g. name@domain.com"
                        className={`w-full bg-[#24352b] border rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:ring-1 transition-colors placeholder:text-brand-cream/45 ${
                          signUpError ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/30" : "border-brand-cream/15 focus:border-[#82afa6] focus:ring-[#82afa6]/30"
                        }`}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">Password *</label>
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className={`w-full bg-[#24352b] border rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:ring-1 transition-colors placeholder:text-brand-cream/45 ${
                          submitAttempted && !isPasswordValid ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/30" : "border-brand-cream/15 focus:border-[#82afa6] focus:ring-[#82afa6]/30"
                        }`}
                      />
                      {/* Password Requirements validation display */}
                      <div className="space-y-1 mt-1.5">
                        {[
                          { key: "len", label: "total length at least 5", check: (p: string) => p.length >= 5 },
                          { key: "alpha", label: "at least 1 alphabet", check: (p: string) => /[A-Za-z]/.test(p) },
                          { key: "num", label: "at least 1 number", check: (p: string) => /\d/.test(p) },
                          { key: "spec", label: "at least 1 special sign (eg. !,@,#,$,%)", check: (p: string) => /[!,@,#,$,%]/.test(p) },
                        ].map((msg) => {
                          const isValid = msg.check(password);
                          const isShowingError = (submitAttempted && !isValid) || (password.length > 0 && !isValid);
                          return (
                            <AnimatePresence key={msg.key}>
                              {isShowingError && (
                                <motion.p 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="text-rose-300 text-[10px] font-mono flex items-center gap-1 leading-none mt-0.5"
                                >
                                  <AlertCircle className="w-3 h-3 text-rose-300 shrink-0" />
                                  <span>*must at least {msg.label}</span>
                                </motion.p>
                              )}
                            </AnimatePresence>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">Contact Number *</label>
                      <div className="flex gap-2">
                        <div className="w-1/4">
                          <input 
                            type="text"
                            required
                            value={contactPrefix}
                            onChange={(e) => setContactPrefix(e.target.value)}
                            placeholder="+60"
                            className="w-full text-center bg-[#24352b] border border-brand-cream/15 rounded-lg px-2 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                          />
                        </div>
                        <div className="w-3/4">
                          <input 
                            type="text"
                            required
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="12-3457890"
                            className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location fields grid */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide block">Location *</span>
                      
                      <div className="space-y-1">
                        <input 
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street Address"
                          className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <input 
                            type="text"
                            required
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            placeholder="Postcode"
                            className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-2.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                          />
                        </div>
                        <div>
                          <input 
                            type="text"
                            required
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            placeholder="State"
                            className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-2.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                          />
                        </div>
                        <div>
                          <input 
                            type="text"
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                            className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-2.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 mt-2 rounded-full text-center font-sans font-bold uppercase tracking-wider text-xs bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a] transition-all duration-300 shadow-md cursor-pointer min-h-[44px]"
                    >
                      Complete Sign Up
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Log In Form Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!loginSuccess) {
                  setIsLoginOpen(false);
                  setLoginSubmitAttempted(false);
                  setLoginError("");
                }
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-[#395244] p-6 md:p-8 rounded-2xl border border-brand-cream/20 shadow-2xl z-10 text-brand-cream"
            >
              {/* Close Button */}
              {!loginSuccess && (
                <button 
                  onClick={() => {
                    setIsLoginOpen(false);
                    setLoginSubmitAttempted(false);
                    setLoginError("");
                  }}
                  className="absolute top-4 right-4 text-brand-cream/75 hover:text-brand-cream transition-colors p-2 rounded-full hover:bg-brand-cream/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {loginSuccess ? (
                <div className="text-center py-8 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#82afa6]/20 text-[#82afa6] border border-[#82afa6]/40 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-light text-brand-cream">Logged In!</h3>
                  <p className="text-sm font-light text-brand-cream/80 max-w-sm mx-auto leading-relaxed">
                    Welcome back to AidStory! Redirecting you to the dashboard.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-brand-cream">Log In</h3>
                    <p className="text-xs text-brand-cream/85 font-light">Enter your registered email and password to access your account.</p>
                  </div>

                  {loginError && (
                    <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. name@domain.com"
                        className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">Password *</label>
                      <input 
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 mt-2 rounded-full text-center font-sans font-bold uppercase tracking-wider text-xs bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a] transition-all duration-300 shadow-md cursor-pointer min-h-[44px]"
                    >
                      Log In
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-xs text-brand-cream/75 font-light">
                      If you do not have an account,{" "}
                      <button
                        onClick={() => {
                          setIsLoginOpen(false);
                          setLoginSubmitAttempted(false);
                          setLoginError("");
                          setIsSignUpOpen(true);
                          setSignUpError("");
                          setSubmitAttempted(false);
                        }}
                        className="underline text-[#ffee1a] hover:text-[#82afa6] font-medium transition-colors cursor-pointer bg-transparent border-none p-0 inline focus:outline-none"
                      >
                        sign up
                      </button>{" "}
                      here.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
