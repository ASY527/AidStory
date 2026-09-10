import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  X, 
  Check, 
  AlertCircle, 
  Mail, 
  KeyRound, 
  Lock, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { saveUserToCloud, getUserFromCloud } from "../lib/cloudService";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { SEED_USERS } from "../data/seedDatabase";

// Local asset imports if available, otherwise high quality unsplash fallback
import foodItems from "../assets/images/food_donation_items_1782830790126.jpg";
import forestPathArt from "../assets/images/forest_sunset_hero_1782830685827.jpg";
import loginSignArt from "../assets/images/aidstory-login-sign.png";
import signUpSignArt from "../assets/images/aidstory-signup-sign.png";
import guestSignArt from "../assets/images/aidstory-guest-sign.png";

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

const getAuthenticationErrorMessage = (error: unknown, action: "signUp" | "login") => {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code === "auth/email-already-in-use") {
    return "This email is already registered. Please log in or use a different email.";
  }
  if (code === "auth/invalid-email") {
    return "Enter a valid email address.";
  }
  if (code === "auth/weak-password") {
    return "Please use a stronger password.";
  }
  if (code === "auth/user-not-found") {
    return "Email does not exist.";
  }
  if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return "Incorrect email or password.";
  }
  return action === "signUp"
    ? "Unable to create the account. Please try again."
    : "Unable to log in. Please try again.";
};

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

  // Forgot Password / Email OTP state
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"email" | "otp" | "new_password" | "success">("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [emailNotificationToast, setEmailNotificationToast] = useState<{ email: string; otp: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotAttempted, setForgotAttempted] = useState(false);

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
  // Malaysian mobile number after the +60 prefix: 9 digits for 01X numbers
  // and 10 digits for 011 numbers. The leading zero is not entered here.
  const isContactNumberValid = /^\d{9,10}$/.test(contactNumber);

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSignUpError("");

    if (!isPasswordValid) {
      return;
    }

    if (!isContactNumberValid) {
      setSignUpError("Enter a valid Malaysian mobile number using 9 to 10 digits after +60.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Keep a local copy for the current browser, while Firebase Authentication
    // provides the permanent account used across refreshes and devices.
    const existingUsersJSON = localStorage.getItem("aidstory_users") || "[]";
    let existingUsers: any[] = [];
    try {
      existingUsers = JSON.parse(existingUsersJSON);
    } catch (err) {
      existingUsers = [];
    }

    // Demo accounts remain available locally; Firebase checks real accounts.
    const isDemoAccount = SEED_USERS.some(
      (user: any) => (user.email || "").trim().toLowerCase() === normalizedEmail
    );
    if (isDemoAccount) {
      setSignUpError("This email is already registered. Please log in or use a different email!");
      return;
    }

    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (error) {
      setSignUpError(getAuthenticationErrorMessage(error, "signUp"));
      return;
    }

    const newUser = {
      uid: credential.user.uid,
      username,
      email: normalizedEmail,
      // Every newly registered account begins as a donor. Recipient access is
      // granted only after an application has been approved by an admin.
      role: "donor" as const,
      isVerified: false,
      donationsCompleted: 0,
      contact: `${contactPrefix} ${contactNumber}`,
      joinedDate: new Date().toISOString(),
      location: {
        postcode,
        address,
        state: stateName,
        country
      }
    };

    const localUserIndex = existingUsers.findIndex(
      (user: any) => (user.email || "").trim().toLowerCase() === normalizedEmail
    );
    if (localUserIndex >= 0) {
      existingUsers[localUserIndex] = newUser;
    } else {
      existingUsers.push(newUser);
    }
    localStorage.setItem("aidstory_users", JSON.stringify(existingUsers));
    
    // Set as currently logged in user
    localStorage.setItem("aidstory_current_user", JSON.stringify(newUser));

    // Store the profile separately from the Firebase Authentication credential.
    await saveUserToCloud(newUser as any);

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

  const finishLogin = (user: any) => {
    localStorage.setItem("aidstory_current_user", JSON.stringify(user));
    setLoginSuccess(true);
    setTimeout(() => {
      setLoginSuccess(false);
      setIsLoginOpen(false);
      setLoginSubmitAttempted(false);
      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
      navigateToView("main_menu");
    }, 2000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

    // Merge SEED_USERS into existingUsers if not already present
    let updatedUsers = false;
    for (const seedU of SEED_USERS) {
      const idx = existingUsers.findIndex((u: any) => u.email.toLowerCase() === seedU.email.toLowerCase());
      if (idx === -1) {
        existingUsers.push(seedU);
        updatedUsers = true;
      } else {
        // Ensure role and isVerified match latest seed rules
        if (existingUsers[idx].role !== seedU.role || existingUsers[idx].isVerified !== seedU.isVerified) {
          existingUsers[idx] = { ...existingUsers[idx], ...seedU };
          updatedUsers = true;
        }
      }
    }
    if (updatedUsers) {
      localStorage.setItem("aidstory_users", JSON.stringify(existingUsers));
    }

    const normalizedEmail = loginEmail.trim().toLowerCase();

    try {
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, loginPassword);
      const cloudProfile = await getUserFromCloud(normalizedEmail);
      const profile = cloudProfile as any;
      const authenticatedUser = {
        ...(profile || {}),
        uid: credential.user.uid,
        username: profile?.username || credential.user.displayName || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role: profile?.role || "donor",
        isVerified: profile?.isVerified || false,
        joinedDate: profile?.joinedDate || credential.user.metadata.creationTime || new Date().toISOString(),
      };

      const index = existingUsers.findIndex(
        (user: any) => (user.email || "").toLowerCase() === normalizedEmail
      );
      if (index >= 0) {
        existingUsers[index] = authenticatedUser;
      } else {
        existingUsers.push(authenticatedUser);
      }
      localStorage.setItem("aidstory_users", JSON.stringify(existingUsers));
      finishLogin(authenticatedUser);
      return;
    } catch (error) {
      // Seed accounts are retained only for prototype demonstration. All newly
      // registered accounts use Firebase Authentication above.
      const demoUser = existingUsers.find(
        (user: any) =>
          (user.email || "").toLowerCase() === normalizedEmail &&
          (user.password === loginPassword || loginPassword === "Password123!")
      );
      if (demoUser) {
        if (!demoUser.joinedDate) {
          demoUser.joinedDate = new Date().toISOString();
        }
        localStorage.setItem("aidstory_users", JSON.stringify(existingUsers));
        finishLogin(demoUser);
        return;
      }
      setLoginError(getAuthenticationErrorMessage(error, "login"));
    }
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Hide simulated email toast automatically after 12 seconds
  useEffect(() => {
    if (!emailNotificationToast) return;
    const toastTimer = setTimeout(() => {
      setEmailNotificationToast(null);
    }, 12000);
    return () => clearTimeout(toastTimer);
  }, [emailNotificationToast]);

  const handleSendOtp = (targetEmailInput?: string) => {
    const rawEmail = (targetEmailInput !== undefined ? targetEmailInput : forgotEmail).trim().toLowerCase();
    setForgotError("");

    if (!rawEmail) {
      setForgotError("Please enter your registered email address.");
      return;
    }

    const existingUsersJSON = localStorage.getItem("aidstory_users") || "[]";
    let existingUsers: any[] = [];
    try {
      existingUsers = JSON.parse(existingUsersJSON);
    } catch (err) {
      existingUsers = [];
    }

    // Check if user exists
    const user = existingUsers.find(
      (u: any) => u.email && u.email.toLowerCase() === rawEmail
    );

    if (!user) {
      setForgotError("We could not find an account with that email address. Please verify your email.");
      return;
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setForgotEmail(rawEmail);
    setForgotStep("otp");
    setOtpDigits(["", "", "", "", "", ""]);
    setResendCountdown(60);
    setForgotError("");
    setForgotAttempted(false);

    // Trigger simulated in-app email arrival toast
    setEmailNotificationToast({
      email: rawEmail,
      otp: code,
    });
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, "");
    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      // Handle paste of full or partial code
      const pastedChars = cleanVal.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedChars[i] || "";
      }
      setOtpDigits(newDigits);
      const nextFocusIdx = Math.min(pastedChars.length, 5);
      const nextEl = document.getElementById(`otp-input-${nextFocusIdx}`);
      nextEl?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (cleanVal && index < 5) {
      const nextEl = document.getElementById(`otp-input-${index + 1}`);
      nextEl?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevEl = document.getElementById(`otp-input-${index - 1}`);
      prevEl?.focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setForgotError("");
    const enteredCode = otpDigits.join("");

    if (enteredCode.length < 6) {
      setForgotError("Please enter all 6 digits of the OTP verification code.");
      return;
    }

    if (enteredCode !== generatedOtp) {
      setForgotError("Invalid OTP verification code. Please check the code sent to your email.");
      return;
    }

    // OTP Verified successfully
    setForgotError("");
    setForgotStep("new_password");
    setNewPassword("");
    setConfirmPassword("");
    setForgotAttempted(false);
  };

  const newPassErrors = getPasswordValidationErrors(newPassword);
  const isNewPassValid = newPassErrors.length === 0;

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotAttempted(true);
    setForgotError("");

    if (!isNewPassValid) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match. Please re-enter.");
      return;
    }

    // Update in localStorage
    const existingUsersJSON = localStorage.getItem("aidstory_users") || "[]";
    let existingUsers: any[] = [];
    try {
      existingUsers = JSON.parse(existingUsersJSON);
    } catch (err) {
      existingUsers = [];
    }

    const userIndex = existingUsers.findIndex(
      (u: any) => u.email && u.email.toLowerCase() === forgotEmail.toLowerCase()
    );

    if (userIndex !== -1) {
      existingUsers[userIndex].password = newPassword;
      localStorage.setItem("aidstory_users", JSON.stringify(existingUsers));
      saveUserToCloud(existingUsers[userIndex]).catch((err) => console.warn("Cloud password sync failed:", err));
    }

    // If currently logged in user is this user, update too
    const currentLoggedJSON = localStorage.getItem("aidstory_current_user");
    if (currentLoggedJSON) {
      try {
        const cur = JSON.parse(currentLoggedJSON);
        if (cur.email && cur.email.toLowerCase() === forgotEmail.toLowerCase()) {
          cur.password = newPassword;
          localStorage.setItem("aidstory_current_user", JSON.stringify(cur));
        }
      } catch (err) {}
    }

    setForgotStep("success");
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

  const openSignUp = () => {
    setIsSignUpOpen(true);
    setSignUpError("");
    setSubmitAttempted(false);
  };

  const continueAsGuest = () => {
    localStorage.removeItem("aidstory_current_user");
    // Guest visits are intentionally ephemeral. Start each visit with a fresh
    // Donate Box and no saved guest activity.
    [
      "aidstory_donate_box_cart",
      "aidstory_user_pledged_items",
      "aidstory_guest_first_visit"
    ].forEach((key) => localStorage.removeItem(key));
    navigateToView("main_menu");
  };

  return (
    <div className="min-h-screen bg-[#15120d] text-brand-cream selection:bg-brand-olive selection:text-brand-dark overflow-hidden relative animate-fadeIn">
      
      {/* Back to Home bar */}
      <header className="absolute left-0 top-0 z-30">
        <div className="flex h-16 items-center px-6">
          <button 
            onClick={() => navigateToView("home")}
            className="group flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-brand-text-muted hover:text-brand-olive transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text-muted group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main className="relative min-h-screen overflow-hidden">
        <motion.img
          src={forestPathArt}
          alt="Forest path at sunrise"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.35, ease: [0.22, 0.75, 0.25, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#17110a]/55 via-[#17110a]/20 to-[#17110a]/75" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
          className="absolute inset-x-4 top-24 z-10 text-center sm:top-28"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#dbe98a]">Choose your path</p>
          <h1 className="mt-3 font-serif text-4xl italic text-[#fff4df] sm:text-5xl md:text-6xl">Your journey begins here</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#fff2db]/85 sm:text-base">Follow one of the three forest paths to enter AidStory.</p>
        </motion.div>

        <div className="absolute inset-0 z-10">
          {[
            { label: "Log In", caption: "Return to your story", artwork: loginSignArt, onClick: () => setIsLoginOpen(true), left: "22%", top: "43%", tilt: "-rotate-3" },
            { label: "Sign Up", caption: "Begin a new chapter", artwork: signUpSignArt, onClick: openSignUp, left: "68%", top: "45%", tilt: "rotate-1" },
            { label: "Guest", caption: "Explore freely", artwork: guestSignArt, onClick: continueAsGuest, left: "90%", top: "44%", tilt: "rotate-3" }
          ].map((path, index) => (
            <motion.button
              key={path.label}
              type="button"
              onClick={path.onClick}
              style={{ left: path.left, top: path.top }}
              initial={{ opacity: 0, y: 90 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + index * 0.16, type: "spring", stiffness: 125, damping: 18 }}
              className={`group absolute flex w-[clamp(132px,18vw,260px)] -translate-x-1/2 flex-col items-center text-center ${path.tilt}`}
            >
              {path.artwork ? (
                <img
                  src={path.artwork}
                  alt="Log In — Return to Your Story"
                  className="relative z-10 block w-full drop-shadow-[0_11px_15px_rgba(0,0,0,0.48)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-focus-visible:-translate-y-2"
                />
              ) : (
                <span
                  className="relative z-10 w-full overflow-hidden rounded-md border-[3px] border-[#241309] px-4 py-3 shadow-[0_11px_15px_rgba(0,0,0,0.48)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-focus-visible:-translate-y-2"
                  style={{
                    backgroundColor: "#623818",
                    backgroundImage: "linear-gradient(108deg, rgba(255,202,112,.20), transparent 25%, rgba(20,8,2,.38) 55%, rgba(221,150,75,.18)), repeating-linear-gradient(8deg, rgba(255,223,155,.17) 0 2px, rgba(56,25,7,.20) 3px 5px, rgba(126,68,28,.14) 6px 10px)"
                  }}
                >
                  <span aria-hidden="true" className="absolute inset-x-0 top-2 h-px bg-[#ffd889]/25" />
                  <span className="relative block font-serif text-[clamp(1.3rem,2.5vw,2rem)] font-semibold text-[#fff1cf] drop-shadow-[0_2px_1px_rgba(0,0,0,0.7)]">{path.label}</span>
                  <span className="relative mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#ecdcae]">{path.caption}</span>
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </main>

      {/* Dynamic Sign Up Form Modal */}
      <AnimatePresence>
        {isSignUpOpen && (
          <motion.div 
            key="explore-signup-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
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
                            inputMode="tel"
                            onChange={(e) => setContactPrefix(e.target.value.replace(/[^\d+]/g, ""))}
                            placeholder="+60"
                            className="w-full text-center bg-[#24352b] border border-brand-cream/15 rounded-lg px-2 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                          />
                        </div>
                        <div className="w-3/4">
                          <input 
                            type="text"
                            required
                            value={contactNumber}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            onChange={(e) => {
                              setContactNumber(e.target.value.replace(/\D/g, ""));
                              setSignUpError("");
                            }}
                            placeholder="123457890"
                            className={`w-full bg-[#24352b] border rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:ring-1 transition-colors placeholder:text-brand-cream/45 ${
                              submitAttempted && !isContactNumberValid
                                ? "border-rose-400 focus:border-rose-400 focus:ring-rose-400/30"
                                : "border-brand-cream/15 focus:border-[#82afa6] focus:ring-[#82afa6]/30"
                            }`}
                          />
                        </div>
                      </div>
                      {submitAttempted && !isContactNumberValid && (
                        <p className="text-rose-300 text-[10px] font-mono flex items-center gap-1 leading-none mt-1.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          Use 9 to 10 digits after +60; letters and symbols are not allowed.
                        </p>
                      )}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Log In Form Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div 
            key="explore-login-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
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
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">Password *</label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsLoginOpen(false);
                            setLoginError("");
                            setForgotEmail(loginEmail);
                            setIsForgotPassOpen(true);
                            setForgotStep("email");
                            setForgotError("");
                            setForgotAttempted(false);
                          }}
                          className="text-xs text-[#ffee1a] hover:underline transition-all cursor-pointer font-sans"
                        >
                          Forgot password?
                        </button>
                      </div>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Forgot Password / Email OTP Modal */}
      <AnimatePresence>
        {isForgotPassOpen && (
          <motion.div 
            key="explore-forgotpass-modal-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (forgotStep !== "success") {
                  setIsForgotPassOpen(false);
                  setForgotError("");
                }
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-[#395244] p-6 md:p-8 rounded-2xl border border-brand-cream/20 shadow-2xl z-10 text-brand-cream"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setIsForgotPassOpen(false);
                  setForgotError("");
                }}
                className="absolute top-4 right-4 text-brand-cream/75 hover:text-brand-cream transition-colors p-2 rounded-full hover:bg-brand-cream/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              {/* STEP 1: Enter Email */}
              {forgotStep === "email" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#82afa6]/20 border border-[#82afa6]/40 flex items-center justify-center text-[#82afa6]">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-brand-cream">Reset Password</h3>
                      <p className="text-xs text-brand-cream/80 font-light">We'll send a 6-digit OTP code to your registered email.</p>
                    </div>
                  </div>

                  {forgotError && (
                    <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendOtp();
                    }} 
                    className="space-y-4 text-left"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">
                        Registered Email Address *
                      </label>
                      <div className="relative">
                        <input 
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            setForgotError("");
                          }}
                          placeholder="e.g. name@domain.com"
                          className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                        />
                        <Mail className="w-4 h-4 text-brand-cream/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 mt-2 rounded-full text-center font-sans font-bold uppercase tracking-wider text-xs bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a] transition-all duration-300 shadow-md cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                    >
                      <span>Send OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <button
                      onClick={() => {
                        setIsForgotPassOpen(false);
                        setIsLoginOpen(true);
                      }}
                      className="text-xs text-brand-cream/75 hover:text-brand-cream transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Log In</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Enter 6-digit OTP */}
              {forgotStep === "otp" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#82afa6]/20 border border-[#82afa6]/40 flex items-center justify-center text-[#82afa6]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-brand-cream">Enter Email OTP</h3>
                      <p className="text-xs text-brand-cream/80 font-light">
                        Sent to <span className="font-semibold text-brand-cream">{forgotEmail}</span>
                      </p>
                    </div>
                  </div>

                  {/* Simulated Email Toast helper if active */}
                  {emailNotificationToast && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#24352b] border border-[#ffee1a]/40 rounded-xl p-3.5 text-xs text-brand-cream shadow-lg space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#ffee1a]">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span>📬</span> In-App Email Simulation
                        </span>
                        <span className="text-[10px] text-brand-cream/60">AidStory Security</span>
                      </div>
                      <div className="text-xs text-brand-cream/90">
                        Your password reset OTP code is: <span className="font-mono font-bold text-base text-[#ffee1a] tracking-widest px-2 py-0.5 bg-black/30 rounded">{emailNotificationToast.otp}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const digits = emailNotificationToast.otp.split("");
                          setOtpDigits(digits);
                          setForgotError("");
                        }}
                        className="text-[11px] font-bold text-[#82afa6] hover:text-[#ffee1a] underline cursor-pointer"
                      >
                        Auto-fill this code
                      </button>
                    </motion.div>
                  )}

                  {forgotError && (
                    <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide block text-center">
                        6-Digit Verification Code *
                      </label>
                      <div className="flex justify-center items-center gap-2 sm:gap-2.5">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-lg sm:text-xl bg-[#24352b] border border-brand-cream/20 rounded-xl text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-2 focus:ring-[#82afa6]/40 transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 mt-3 rounded-full text-center font-sans font-bold uppercase tracking-wider text-xs bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a] transition-all duration-300 shadow-md cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                    >
                      <span>Verify Code</span>
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Resend OTP & Change Email */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs text-brand-cream/75">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep("email");
                        setForgotError("");
                      }}
                      className="text-brand-cream/60 hover:text-brand-cream transition-colors cursor-pointer text-[11px]"
                    >
                      ← Change Email
                    </button>

                    {resendCountdown > 0 ? (
                      <span className="text-[11px] font-mono text-brand-cream/60">
                        Resend code in <strong className="text-[#ffee1a]">{resendCountdown}s</strong>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-[11px] text-[#ffee1a] hover:underline font-medium cursor-pointer inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend OTP Code</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Enter New Password */}
              {forgotStep === "new_password" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#82afa6]/20 border border-[#82afa6]/40 flex items-center justify-center text-[#82afa6]">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-brand-cream">Set New Password</h3>
                      <p className="text-xs text-brand-cream/80 font-light">Create a secure new password for your account.</p>
                    </div>
                  </div>

                  {forgotError && (
                    <div className="bg-rose-950/40 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-left">
                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">New Password *</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setForgotError("");
                          }}
                          placeholder="Enter new password"
                          className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 pr-10 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Requirements live checklist */}
                      <div className="pt-1.5 space-y-1 text-[11px] font-light bg-[#24352b]/60 p-2.5 rounded-lg border border-brand-cream/5">
                        <span className="text-[10px] font-mono text-brand-cream/60 uppercase block mb-1">Must contain:</span>
                        <div className={`flex items-center gap-1.5 ${newPassword.length >= 5 ? "text-[#c5dc80]" : "text-brand-cream/45"}`}>
                          <Check className="w-3 h-3" />
                          <span>Total length at least 5 characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[A-Za-z]/.test(newPassword) ? "text-[#c5dc80]" : "text-brand-cream/45"}`}>
                          <Check className="w-3 h-3" />
                          <span>At least 1 alphabet</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${/\d/.test(newPassword) ? "text-[#c5dc80]" : "text-brand-cream/45"}`}>
                          <Check className="w-3 h-3" />
                          <span>At least 1 number</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${/[!,@,#,$,%]/.test(newPassword) ? "text-[#c5dc80]" : "text-brand-cream/45"}`}>
                          <Check className="w-3 h-3" />
                          <span>At least 1 special sign (!, @, #, $, %)</span>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-brand-cream/70 uppercase tracking-wide">Confirm New Password *</label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setForgotError("");
                          }}
                          placeholder="Re-enter new password"
                          className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 pr-10 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] focus:ring-1 focus:ring-[#82afa6]/30 transition-colors placeholder:text-brand-cream/45"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-[10px] text-rose-300 pt-0.5">Passwords do not match</p>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={!isNewPassValid || newPassword !== confirmPassword}
                      className={`w-full py-3.5 mt-2 rounded-full text-center font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-md cursor-pointer min-h-[44px] ${
                        isNewPassValid && newPassword === confirmPassword
                          ? "bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a]"
                          : "bg-black/30 text-brand-cream/40 cursor-not-allowed"
                      }`}
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 4: Success Screen */}
              {forgotStep === "success" && (
                <div className="text-center py-6 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#82afa6]/20 text-[#82afa6] border border-[#82afa6]/40 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-light text-brand-cream">Password Reset Complete!</h3>
                  <p className="text-xs font-light text-brand-cream/80 max-w-sm mx-auto leading-relaxed">
                    Your password has been successfully updated. You can now log in to your account with your new credentials.
                  </p>

                  <button 
                    type="button"
                    onClick={() => {
                      setIsForgotPassOpen(false);
                      setLoginEmail(forgotEmail);
                      setLoginPassword("");
                      setLoginError("");
                      setIsLoginOpen(true);
                    }}
                    className="w-full py-3.5 mt-3 rounded-full text-center font-sans font-bold uppercase tracking-wider text-xs bg-[#ffee1a] text-[#2c221a] hover:bg-[#82afa6] hover:text-white transition-all duration-300 shadow-md cursor-pointer min-h-[44px]"
                  >
                    Log In Now
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
