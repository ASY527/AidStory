import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Gift, 
  Truck, 
  Puzzle, 
  User, 
  Mail, 
  BarChart3, 
  MousePointerClick, 
  Home, 
  MessageSquareCode, 
  Activity, 
  X, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  MapPin, 
  AlertCircle, 
  Sparkles,
  Info,
  Upload,
  FileText,
  Trash2,
  Lock,
  Package,
  Plus,
  Minus,
  Heart,
  Boxes,
  Building2,
  Bell,
  BellRing,
  BellOff,
  ExternalLink,
  Radio,
  ShieldAlert,
  Check,
  Settings as SettingsIcon,
  Sliders,
  Volume2
} from "lucide-react";
import { RequestDetailModal } from "./RequestDetailModal";
import { DEFAULT_NEEDS_REQUESTS } from "./AppNeeds";
import { RecipientRequest } from "../types";

// Verified NGOs and Requesters for member subscriptions
export const ALL_VERIFIED_REQUESTERS = [
  {
    name: "Sibu Animal Hope Shelter (NGO)",
    location: "Sibu, Sabah",
    category: "Animal",
    specialty: "Animal Rescue, Kibbles & Vet Aid",
    avatar: "🐶",
    activeUrgentNeed: "Campaign A - DOG'S FOODS"
  },
  {
    name: "Bangsar Infant Care Relief (Charity)",
    location: "Bangsar, KL",
    category: "Baby & Children",
    specialty: "Infant Care, Baby Diapers & Milk",
    avatar: "🍼",
    activeUrgentNeed: "BABY PAMPERS"
  },
  {
    name: "Kids Hope Workshop Foundation (NGO)",
    location: "Sibu, Sabah",
    category: "Education",
    specialty: "Educational Toys, Lego & Workshops",
    avatar: "🧱",
    activeUrgentNeed: "Campaign A - Lego for Kids"
  },
  {
    name: "Sibu Community Kindergarten (NGO)",
    location: "Sibu, Sabah",
    category: "Education",
    specialty: "Early Literacy, Books & Schoolbags",
    avatar: "📚",
    activeUrgentNeed: "Campaign B - STORYBOOKS"
  },
  {
    name: "Perak Community Relief Center (NGO)",
    location: "Ipoh, Perak",
    category: "Clothing",
    specialty: "Warm Clothes, Pants & Bedding",
    avatar: "👕",
    activeUrgentNeed: "Wear Saka Long Pants & Warm Clothing"
  },
  {
    name: "Selangor Food Aid Network (NGO)",
    location: "Shah Alam, Selangor",
    category: "Food Supplies",
    specialty: "10kg Fragrant White Rice & Staples",
    avatar: "🍚",
    activeUrgentNeed: "10kg AAA Fragrant White Rice"
  },
  {
    name: "Shah Alam Disaster Relief (Charity)",
    location: "Shah Alam, Selangor",
    category: "Emergency",
    specialty: "Monsoon Relief, Warm Jackets & Sweaters",
    avatar: "🧥",
    activeUrgentNeed: "Warm Winter Jackets & Sweaters"
  },
  {
    name: "WeAreCharity1 (NGO)",
    location: "Petaling Jaya, Selangor",
    category: "Household",
    specialty: "Emergency Blankets & Bath Towels",
    avatar: "🧺",
    activeUrgentNeed: "Blankets & Towel Request"
  }
];

// Whimsical floating storybook graphics for donation categories
const FLOATING_BACKGROUND_ITEMS = [
  // Toys & Fun items
  { icon: "🧸", label: "Teddy Bear", x: "6%", y: "12%", delay: 0, duration: 9, scale: 1.15 },
  { icon: "🚗", label: "Toy Car", x: "5%", y: "78%", delay: 1.1, duration: 9.5, scale: 1.1 },
  { icon: "⚽", label: "Soccer Ball", x: "18%", y: "88%", delay: 4.4, duration: 8.5, scale: 1.0 },
  { icon: "🎸", label: "Toy Ukulele", x: "4%", y: "45%", delay: 2.8, duration: 10.5, scale: 1.2 },
  { icon: "🚂", label: "Toy Train", x: "12%", y: "34%", delay: 1.5, duration: 11, scale: 1.15 },
  { icon: "🎨", label: "Art Palette", x: "28%", y: "24%", delay: 0.8, duration: 9.2, scale: 1.2 },
  { icon: "🎈", label: "Balloon", x: "26%", y: "70%", delay: 3.1, duration: 10.2, scale: 1.1 },
  { icon: "🐱", label: "Kitten Doll", x: "15%", y: "48%", delay: 2.2, duration: 11.2, scale: 1.25 },
  { icon: "🍬", label: "Candy", x: "20%", y: "20%", delay: 1.9, duration: 8.8, scale: 1.0 },
  
  // Essential Daily Donations
  { icon: "🍎", label: "Fresh Food", x: "14%", y: "58%", delay: 3.9, duration: 9, scale: 1.1 },
  { icon: "👕", label: "Warm Clothes", x: "5%", y: "26%", delay: 2.5, duration: 9.8, scale: 1.15 },
  { icon: "🍼", label: "Baby Care", x: "24%", y: "6%", delay: 5.2, duration: 9.2, scale: 1.05 },
  
  // Right side items
  { icon: "✈️", label: "Toy Plane", x: "88%", y: "15%", delay: 2.2, duration: 11, scale: 1.25 },
  { icon: "🐶", label: "Puppy Doll", x: "90%", y: "75%", delay: 3.3, duration: 11.5, scale: 1.2 },
  { icon: "🧩", label: "Puzzle", x: "74%", y: "85%", delay: 1.7, duration: 10, scale: 1.15 },
  { icon: "📚", label: "Storybook", x: "82%", y: "46%", delay: 0.6, duration: 10.8, scale: 1.2 },
  { icon: "🎒", label: "Backpack", x: "92%", y: "32%", delay: 4.8, duration: 12, scale: 1.2 },
  { icon: "🩹", label: "First Aid", x: "72%", y: "5%", delay: 1.3, duration: 8.8, scale: 1.1 },
  { icon: "🦖", label: "Dinosaur", x: "78%", y: "28%", delay: 3.0, duration: 10.4, scale: 1.25 },
  { icon: "🧥", label: "Winter Jacket", x: "94%", y: "55%", delay: 1.4, duration: 9.6, scale: 1.15 },
  { icon: "🥫", label: "Canned Food", x: "72%", y: "62%", delay: 2.7, duration: 11.0, scale: 1.1 },
  { icon: "🚲", label: "Bicycle", x: "86%", y: "88%", delay: 4.1, duration: 10.0, scale: 1.2 },
  { icon: "⛵", label: "Sailboat", x: "88%", y: "5%", delay: 0.5, duration: 9.4, scale: 1.1 },
  { icon: "🧱", label: "Toy Blocks", x: "76%", y: "18%", delay: 3.6, duration: 10.2, scale: 1.15 },
];

interface AppMainMenuProps {
  navigateToView: (view: "home" | "comments" | "explore" | "main_menu" | "your_request" | "needs" | "preparing_donate_box") => void;
}

export default function AppMainMenu({ navigateToView }: AppMainMenuProps) {
  const [user, setUser] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#donate-box") return "donate";
      const storedTab = sessionStorage.getItem("aidstory_active_tab");
      if (storedTab) {
        sessionStorage.removeItem("aidstory_active_tab");
        return storedTab;
      }
    }
    return null;
  });

  // Dynamic floating background items with refreshing positions
  const [floatingItems, setFloatingItems] = useState(FLOATING_BACKGROUND_ITEMS);

  useEffect(() => {
    const handleCheckTab = () => {
      if (window.location.hash === "#donate-box") {
        setActiveTab("donate");
      }
      const storedTab = sessionStorage.getItem("aidstory_active_tab");
      if (storedTab) {
        sessionStorage.removeItem("aidstory_active_tab");
        setActiveTab(storedTab);
      }
    };
    handleCheckTab();
    window.addEventListener("hashchange", handleCheckTab);
    return () => window.removeEventListener("hashchange", handleCheckTab);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingItems(prevItems => 
        prevItems.map(item => {
          // Find original item to reference its original sector
          const originalItem = FLOATING_BACKGROUND_ITEMS.find(orig => orig.label === item.label) || item;
          const baseX = parseFloat(originalItem.x);
          const baseY = parseFloat(originalItem.y);
          
          const isLeft = baseX < 45;
          const isRight = baseX > 55;
          
          // Generate a gentle drift of up to +/- 12% from the base position
          let newX = baseX + (Math.random() * 24 - 12);
          let newY = baseY + (Math.random() * 24 - 12);
          
          // Keep left/right balance so they don't cover the main center card
          if (isLeft) {
            newX = Math.max(3, Math.min(28, newX));
          } else if (isRight) {
            newX = Math.max(72, Math.min(97, newX));
          } else {
            newX = Math.max(15, Math.min(85, newX));
          }
          
          newY = Math.max(5, Math.min(93, newY));
          
          return {
            ...item,
            x: `${newX.toFixed(1)}%`,
            y: `${newY.toFixed(1)}%`
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("aidstory_current_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed) {
          if (!parsed.joinedDate) {
            // Check if aidstory_users has joinedDate
            const existingUsersJSON = localStorage.getItem("aidstory_users") || "[]";
            try {
              const existingUsers = JSON.parse(existingUsersJSON);
              const matched = existingUsers.find((u: any) => u.email?.toLowerCase() === parsed.email?.toLowerCase());
              if (matched && matched.joinedDate) {
                parsed.joinedDate = matched.joinedDate;
              } else {
                // Seed sensible default
                if (parsed.email?.toLowerCase() === "aidstoryadmin@gmail.com" || parsed.username?.toUpperCase() === "ADMIN") {
                  parsed.joinedDate = "2026-05-08T00:00:00.000Z";
                } else {
                  parsed.joinedDate = new Date().toISOString();
                }
              }
            } catch (err) {
              parsed.joinedDate = new Date().toISOString();
            }
            localStorage.setItem("aidstory_current_user", JSON.stringify(parsed));
          }
          setUser(parsed);
        }
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  // Helper to calculate days of journey from the joined day until the current day
  const getDaysOfJourney = (): number => {
    if (!user) {
      return 100; // Sample for guest explorer preview
    }
    if (!user.joinedDate) {
      return 1;
    }
    const joined = new Date(user.joinedDate);
    if (isNaN(joined.getTime())) {
      return 1;
    }
    const now = new Date();
    // Compare start of calendar day (midnight) in local time
    const startOfJoined = new Date(joined.getFullYear(), joined.getMonth(), joined.getDate()).getTime();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const diffTime = startOfToday - startOfJoined;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Day 1 on joined date, Day 2 on next date, etc.
    return Math.max(1, diffDays + 1);
  };

  // Check if current user is Admin
  const isAdmin = Boolean(
    user && (
      user.email?.toLowerCase() === "aidstoryadmin@gmail.com" ||
      user.username?.toUpperCase() === "ADMIN" ||
      user.role === "admin" ||
      user.isAdmin === true
    )
  );

  const handleLogout = () => {
    localStorage.removeItem("aidstory_current_user");
    navigateToView("home");
  };

  const getFormattedLocation = () => {
    if (!user || !user.location) {
      return "unknown";
    }
    const { address, postcode, state, country } = user.location;
    const parts = [address, postcode, state, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "unknown";
  };

  // State managers for interactive sub-features
  const [chatbotMessages, setChatbotMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Hello! I am your AidStory companion. How can I assist you with your donation journey today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatbotMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let botResponse = "That's wonderful! We appreciate your support. For direct logistics coordination, please select the 'Delivery Status' or 'Your Inventory' tabs in the main menu.";
      if (userMsg.toLowerCase().includes("food") || userMsg.toLowerCase().includes("rice") || userMsg.toLowerCase().includes("eat")) {
        botResponse = "Perak Food Distribution Center currently has a high demand for canned food and white rice. You can use 'Donate Box' to log a package!";
      } else if (userMsg.toLowerCase().includes("volunteer") || userMsg.toLowerCase().includes("join") || userMsg.toLowerCase().includes("help")) {
        botResponse = "Thank you for wanting to join us! Please click 'Apply Now' on the Explore panel to submit your volunteering application.";
      } else if (userMsg.toLowerCase().includes("status") || userMsg.toLowerCase().includes("track") || userMsg.toLowerCase().includes("where")) {
        botResponse = "You can track real-time dispatches using the 'Delivery Status' tab. Our system automatically optimizes fuel emissions by 32%!";
      }
      setChatbotMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
    }, 1000);
  };

  // State for Browse Needs & Completed Donations
  const [pledgedItems, setPledgedItems] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aidstory_user_pledged_items");
        if (saved) return JSON.parse(saved);
      } catch (err) {}
    }
    return [];
  });

  const [completedDonations, setCompletedDonations] = useState<Array<{
    id: string;
    title: string;
    category?: string;
    quantity?: string | number;
    date: string;
    status: string;
  }>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aidstory_completed_donations");
        if (saved) return JSON.parse(saved);
      } catch (err) {}
    }
    return [];
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Sync donations from localStorage across changes
  useEffect(() => {
    const syncDonations = () => {
      try {
        const savedPledges = localStorage.getItem("aidstory_user_pledged_items");
        if (savedPledges) {
          setPledgedItems(JSON.parse(savedPledges));
        }
        const savedCompleted = localStorage.getItem("aidstory_completed_donations");
        if (savedCompleted) {
          setCompletedDonations(JSON.parse(savedCompleted));
        }
      } catch (e) {}
    };

    syncDonations();
    window.addEventListener("storage", syncDonations);
    return () => window.removeEventListener("storage", syncDonations);
  }, []);

  // Calculate dynamic count of completed donations based on user's real actions
  const getCompletedDonationsCount = (): number => {
    const completedSet = new Set<string>();
    completedDonations.forEach(d => {
      if (d.title) completedSet.add(d.title);
      else if (d.id) completedSet.add(d.id);
    });
    pledgedItems.forEach(item => {
      if (item) completedSet.add(item);
    });

    const baseCount = typeof user?.donationsCompleted === "number" ? user.donationsCompleted : 0;
    return baseCount + Math.max(completedSet.size, completedDonations.length, pledgedItems.length);
  };

  const handlePledgeNeed = (needTitle: string) => {
    setPledgedItems(prev => {
      const next = prev.includes(needTitle) ? prev : [...prev, needTitle];
      try {
        localStorage.setItem("aidstory_user_pledged_items", JSON.stringify(next));
      } catch (err) {}
      return next;
    });

    const newDonation = {
      id: `pledge-${Date.now()}`,
      title: needTitle,
      date: new Date().toISOString(),
      status: "completed"
    };

    setCompletedDonations(prev => {
      const next = [...prev, newDonation];
      try {
        localStorage.setItem("aidstory_completed_donations", JSON.stringify(next));
      } catch (err) {}
      return next;
    });

    setSuccessMessage(`Pledge for "${needTitle}" registered successfully! Thank you for making a difference.`);
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // State for Donate Box
  const [boxCategory, setBoxCategory] = useState("Food Supplies");
  const [boxQuantity, setBoxQuantity] = useState("5");
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [donateSuccessMessage, setDonateSuccessMessage] = useState("");

  // Donate Box Cart items (collected from Community Needs)
  const [donateBoxItems, setDonateBoxItems] = useState<Array<{
    id: string;
    requestId: string;
    title: string;
    category: string;
    imageUrl: string;
    location: string;
    unit: string;
    quantity: number;
    maxNeeded: number;
  }>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aidstory_donate_box_cart");
        if (saved) return JSON.parse(saved);
      } catch (err) {}
    }
    return [];
  });
  const [donateBoxDeliveryMethod, setDonateBoxDeliveryMethod] = useState<"courier" | "dropoff" | "volunteer">("courier");
  const [donateBoxDonorNote, setDonateBoxDonorNote] = useState("");
  const [isDonateBoxCheckingOut, setIsDonateBoxCheckingOut] = useState(false);

  // Sync cart items with localStorage and other tabs
  useEffect(() => {
    const syncCart = () => {
      try {
        const saved = localStorage.getItem("aidstory_donate_box_cart");
        if (saved) setDonateBoxItems(JSON.parse(saved));
        else setDonateBoxItems([]);
      } catch (e) {}
    };
    syncCart();
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const handleUpdateDonateBoxQuantity = (itemId: string, newQty: number) => {
    setDonateBoxItems(prev => {
      const updated = prev.map(item => {
        if (item.id === itemId) {
          const clamped = Math.max(1, Math.min(item.maxNeeded, newQty));
          return { ...item, quantity: clamped };
        }
        return item;
      });
      localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromDonateBox = (itemId: string) => {
    setDonateBoxItems(prev => {
      const filtered = prev.filter(item => item.id !== itemId);
      localStorage.setItem("aidstory_donate_box_cart", JSON.stringify(filtered));
      return filtered;
    });
  };

  const handleClearDonateBox = () => {
    setDonateBoxItems([]);
    localStorage.setItem("aidstory_donate_box_cart", JSON.stringify([]));
  };

  const handleDonateBoxCheckout = () => {
    if (donateBoxItems.length === 0) return;
    setIsDonateBoxCheckingOut(true);

    setTimeout(() => {
      // 1. Update recipient requests in localStorage
      try {
        const savedRequestsJSON = localStorage.getItem("aidstory_recipient_requests");
        if (savedRequestsJSON) {
          const requests = JSON.parse(savedRequestsJSON);
          const updated = requests.map((r: any) => {
            const cartItem = donateBoxItems.find(item => item.requestId === r.id);
            if (cartItem) {
              const nextPledged = Math.min(r.quantity, (r.pledgedQuantity || 0) + cartItem.quantity);
              const nextStatus = nextPledged >= r.quantity ? "fulfilled" : r.status;
              return { ...r, pledgedQuantity: nextPledged, status: nextStatus };
            }
            return r;
          });
          localStorage.setItem("aidstory_recipient_requests", JSON.stringify(updated));
        }
      } catch (err) {}

      // 2. Add to user pledged items
      try {
        const savedPledgesJSON = localStorage.getItem("aidstory_user_pledged_items") || "[]";
        const savedPledges: string[] = JSON.parse(savedPledgesJSON);
        donateBoxItems.forEach(item => {
          if (!savedPledges.includes(item.title)) {
            savedPledges.push(item.title);
          }
        });
        localStorage.setItem("aidstory_user_pledged_items", JSON.stringify(savedPledges));
        setPledgedItems(savedPledges);
      } catch (err) {}

      // 3. Add to completed donations
      try {
        const savedCompletedJSON = localStorage.getItem("aidstory_completed_donations") || "[]";
        const savedCompleted: any[] = JSON.parse(savedCompletedJSON);
        donateBoxItems.forEach(item => {
          savedCompleted.push({
            id: `donate-box-${Date.now()}-${item.id}`,
            type: "donate_box_cart",
            title: item.title,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            date: new Date().toISOString(),
            status: "completed"
          });
        });
        localStorage.setItem("aidstory_completed_donations", JSON.stringify(savedCompleted));
        setCompletedDonations(savedCompleted);
      } catch (err) {}

      const totalItemsCount = donateBoxItems.reduce((acc, curr) => acc + curr.quantity, 0);
      setDonateBoxItems([]);
      localStorage.setItem("aidstory_donate_box_cart", JSON.stringify([]));
      setIsDonateBoxCheckingOut(false);
      setDonateSuccess(true);
      setDonateSuccessMessage(`Dispatched ${totalItemsCount} aid units across ${donateBoxItems.length} urgent community needs!`);
    }, 600);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const boxTitle = `${boxQuantity} Box(es) of ${boxCategory}`;
    const newDonation = {
      id: `box-${Date.now()}`,
      title: boxTitle,
      category: boxCategory,
      quantity: boxQuantity,
      date: new Date().toISOString(),
      status: "completed"
    };

    setPledgedItems(prev => {
      const next = [...prev, boxTitle];
      try {
        localStorage.setItem("aidstory_user_pledged_items", JSON.stringify(next));
      } catch (err) {}
      return next;
    });

    setCompletedDonations(prev => {
      const next = [...prev, newDonation];
      try {
        localStorage.setItem("aidstory_completed_donations", JSON.stringify(next));
      } catch (err) {}
      return next;
    });

    setDonateSuccess(true);
    setDonateSuccessMessage(`Your custom box of ${boxQuantity}x ${boxCategory} has been recorded!`);
    setTimeout(() => {
      setDonateSuccess(false);
      setActiveTab(null);
    }, 3000);
  };

  // State for Post Request & Recipient Verification
  const [isVerifiedRecipient, setIsVerifiedRecipient] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aidstory_verified_recipient") === "true";
    }
    return false;
  });
  const [isPostLockedModalOpen, setIsPostLockedModalOpen] = useState(false);

  const [postTitle, setPostTitle] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab(null);
      setPostTitle("");
      setPostLocation("");
      setPostDesc("");
    }, 3000);
  };

  // State for Apply Now
  const [volunteerRole, setVolunteerRole] = useState("Sorter");
  const [volunteerExperience, setVolunteerExperience] = useState("");
  const [volunteerSuccess, setVolunteerSuccess] = useState(false);
  
  const [applyFormType, setApplyFormType] = useState<"recipient" | "volunteer" | null>(null);
  
  const [recipientName, setRecipientName] = useState("");
  const [recipientType, setRecipientType] = useState("NGO Representative");
  const [recipientInfo, setRecipientInfo] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientNeeds, setRecipientNeeds] = useState("");
  const [recipientSuccess, setRecipientSuccess] = useState(false);
  
  // Drag & drop file states
  const [recipientDocuments, setRecipientDocuments] = useState<{ id: string; name: string; size: string; type: string; url?: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (files: FileList) => {
    const newDocs = Array.from(files).map((file) => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: sizeStr,
        type: file.type,
        url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
      };
    });
    setRecipientDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeDocument = (idToRemove: string) => {
    setRecipientDocuments((prev) => prev.filter((doc) => doc.id !== idToRemove));
  };

  const [volName, setVolName] = useState("");
  const [volTransport, setVolTransport] = useState("Yes, I have my own car/van");
  const [volPhone, setVolPhone] = useState("");

  // Recipient Applications Manual Approval State
  const DEFAULT_APPLICATIONS = [
    {
      id: "app_101",
      name: "Siti Rahmah Binti Ahmad",
      type: "Faced Difficulties",
      displayType: "General Community in Need",
      info: "Single mother of 3 residing in Ipoh, Perak. Income impacted by recent retrenchment.",
      phone: "+60 17-8823411",
      needs: "Monthly dry food groceries & school supplies for children",
      documents: ["Electricity_Bill_May2026.pdf", "Income_Declaration_Letter.pdf"],
      status: "Pending",
      submittedAt: "22 Jul 2026"
    },
    {
      id: "app_102",
      name: "Tan Boon Hock",
      type: "Faced Difficulties",
      displayType: "General Community in Need",
      info: "Elderly resident living alone in Kampar, Perak. Requires assistance with daily living expenses.",
      phone: "+60 12-4491023",
      needs: "Adult diapers & medical nutrition powder",
      documents: ["B40_Aid_Verification_Doc.png", "Kampar_Utility_Receipt.pdf"],
      status: "Pending",
      submittedAt: "21 Jul 2026"
    },
    {
      id: "app_103",
      name: "Persatuan Kebajikan Kasih Perak",
      type: "NGO Representative",
      displayType: "NGO Representative",
      info: "Registered NGO (PPM-012-08-19022018) operating community food pantry.",
      phone: "+60 5-3128890",
      needs: "Canned goods, rice packs (10kg), and cooking oil",
      documents: ["ROS_Registration_Certificate.pdf"],
      status: "Pending",
      submittedAt: "19 Jul 2026"
    },
    {
      id: "app_104",
      name: "Muthusamy A/L Subramaniam",
      type: "OKU Individual",
      displayType: "OKU Individual",
      info: "OKU Cardholder (OKU-382901-08-5421). Physically impaired.",
      phone: "+60 16-5521908",
      needs: "Wheelchair maintenance support & hygiene pack",
      documents: ["OKU_Kad_Subramaniam.jpg"],
      status: "Pending",
      submittedAt: "18 Jul 2026"
    }
  ];

  const [recipientApplications, setRecipientApplications] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_recipient_applications");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return DEFAULT_APPLICATIONS;
        }
      }
    }
    return DEFAULT_APPLICATIONS;
  });

  const [appFilterStatus, setAppFilterStatus] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [applicationActionToast, setApplicationActionToast] = useState<string | null>(null);

  // User Notifications state
  const DEFAULT_NOTIFICATIONS = [
    {
      id: "notif_fema",
      sender: "FEMA Coordination Center",
      title: "Community Dispatch",
      message: "New local sorting dropbox configured in Perak Central. Code drop: 31900.",
      date: "Today",
      type: "info",
      read: true
    },
    {
      id: "notif_match",
      sender: "System Matching Engine",
      title: "Donation Dispatch",
      message: "Donation matched! 40 packs baby diapers dispatched safely to Downtown Hope Depot.",
      date: "Yesterday",
      type: "info",
      read: true
    },
    {
      id: "notif_welcome",
      sender: "AidStory Welcome",
      title: "Welcome aboard",
      message: "Welcome aboard! Let's build a transparent and zero-waste local donor ecosystem together.",
      date: "3 days ago",
      type: "info",
      read: true
    }
  ];

  const [userNotifications, setUserNotifications] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_user_notifications");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return DEFAULT_NOTIFICATIONS;
        }
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const handleUpdateApplicationStatus = (appId: string, newStatus: "Approved" | "Rejected" | "Pending") => {
    const updated = recipientApplications.map((app) => {
      if (app.id === appId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setRecipientApplications(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("aidstory_recipient_applications", JSON.stringify(updated));
    }

    const appTarget = recipientApplications.find((a) => a.id === appId);
    const nameStr = appTarget ? appTarget.name : "Applicant";
    setApplicationActionToast(`Application for "${nameStr}" status changed to ${newStatus}.`);

    const hasApproved = updated.some((a) => a.status === "Approved");
    if (hasApproved) {
      setIsVerifiedRecipient(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("aidstory_verified_recipient", "true");
      }
    } else {
      setIsVerifiedRecipient(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("aidstory_verified_recipient", "false");
      }
    }

    // Send notification to user when admin approves application
    if (newStatus === "Approved") {
      const newNotif = {
        id: `notif_${Date.now()}`,
        sender: "AidStory Admin Team",
        title: "Recipient Application Approved 🎉",
        message: `Congratulations! The recipient application for "${nameStr}" has been officially approved by the admin. You are now successfully registered and verified as an eligible recipient on AidStory.`,
        date: "Just now",
        type: "approval",
        read: false
      };
      setUserNotifications((prevNotifs) => {
        const nextNotifs = [newNotif, ...prevNotifs];
        if (typeof window !== "undefined") {
          localStorage.setItem("aidstory_user_notifications", JSON.stringify(nextNotifs));
        }
        return nextNotifs;
      });
    }

    setTimeout(() => {
      setApplicationActionToast(null);
    }, 3500);
  };

  const handleApplyRecipient = (e: React.FormEvent) => {
    e.preventDefault();

    const newApp = {
      id: `app_${Date.now()}`,
      name: recipientName || user?.username || "Anonymous Applicant",
      type: recipientType,
      displayType:
        recipientType === "Faced Difficulties"
          ? "General Community in Need"
          : recipientType === "NGO Representative"
          ? "NGO Representative"
          : "OKU Individual",
      info:
        recipientInfo ||
        (recipientType === "Faced Difficulties"
          ? "Uploaded income & utility supporting documents for verification."
          : "Details submitted."),
      phone: recipientPhone || user?.contact || "+60 12-3456789",
      needs: recipientNeeds || "Basic dry food groceries & essential living aids",
      documents: recipientDocuments.map((doc) => doc.name),
      status: "Pending",
      submittedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    };

    const updatedApps = [newApp, ...recipientApplications];
    setRecipientApplications(updatedApps);
    if (typeof window !== "undefined") {
      localStorage.setItem("aidstory_recipient_applications", JSON.stringify(updatedApps));
    }

    setRecipientSuccess(true);
    setTimeout(() => {
      setRecipientSuccess(false);
      setApplyFormType(null);
      setRecipientName("");
      setRecipientInfo("");
      setRecipientPhone("");
      setRecipientNeeds("");
      setRecipientDocuments([]);
    }, 3000);
  };

  const handleApplyLogisticsVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerSuccess(true);
    setTimeout(() => {
      setVolunteerSuccess(false);
      setApplyFormType(null);
      setVolName("");
      setVolPhone("");
      setVolunteerExperience("");
    }, 3000);
  };

  const handleApplyVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerSuccess(true);
    setTimeout(() => {
      setVolunteerSuccess(false);
      setActiveTab(null);
      setVolunteerExperience("");
    }, 3000);
  };

  // Push Notifications for Urgent Local Donation Requests State & Handlers
  const [urgentPushEnabled, setUrgentPushEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_urgent_push_enabled");
      if (saved !== null) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return true; // Enabled by default for community alerts
  });

  const [subscribedRequesters, setSubscribedRequesters] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aidstory_subscribed_organizers");
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list) && list.length > 0) return list;
        } catch (e) {}
      }
    }
    // Seed sensible defaults matching reference requests
    return [
      "Sibu Animal Hope Shelter (NGO)",
      "Bangsar Infant Care Relief (Charity)"
    ];
  });

  const [activePushToast, setActivePushToast] = useState<{
    id: string;
    requesterName: string;
    itemTitle: string;
    urgency: string;
    description: string;
    location: string;
    requestObj?: RecipientRequest;
  } | null>(null);

  const [selectedDetailRequest, setSelectedDetailRequest] = useState<RecipientRequest | null>(null);
  const [showManageSubscriptionsModal, setShowManageSubscriptionsModal] = useState(false);
  const [pushToggleToast, setPushToggleToast] = useState("");

  const handleToggleUrgentPush = (forcedVal?: boolean) => {
    const nextVal = forcedVal !== undefined ? forcedVal : !urgentPushEnabled;
    setUrgentPushEnabled(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("aidstory_urgent_push_enabled", JSON.stringify(nextVal));
    }
    if (nextVal) {
      setPushToggleToast("🔔 Push Notifications for urgent local donation requests ENABLED. You will receive real-time dispatches when your subscribed requesters post urgent needs.");
    } else {
      setPushToggleToast("🔕 Push Notifications for urgent local donation requests PAUSED.");
    }
    setTimeout(() => setPushToggleToast(""), 4500);
  };

  const handleToggleRequesterSubscription = (orgName: string) => {
    setSubscribedRequesters((prev) => {
      let updated: string[];
      if (prev.includes(orgName)) {
        updated = prev.filter((item) => item !== orgName);
        setPushToggleToast(`Unsubscribed from ${orgName}. You will no longer receive urgent push alerts for this requester.`);
      } else {
        updated = [...prev, orgName];
        setPushToggleToast(`Subscribed to ${orgName}! You will receive urgent push alerts when they post emergency local requests.`);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("aidstory_subscribed_organizers", JSON.stringify(updated));
      }
      setTimeout(() => setPushToggleToast(""), 4000);
      return updated;
    });
  };

  const handleTriggerTestPushAlert = () => {
    if (!urgentPushEnabled) {
      setPushToggleToast("⚠️ Push notifications are currently paused. Enable the toggle switch in the Main Menu to receive urgent local request alerts.");
      setTimeout(() => setPushToggleToast(""), 4000);
      return;
    }

    const sampleReq = DEFAULT_NEEDS_REQUESTS.find(r => r.id === "need_1") || DEFAULT_NEEDS_REQUESTS[0];
    const targetOrg = subscribedRequesters[0] || sampleReq.organizerName || "Sibu Animal Hope Shelter (NGO)";

    const newNotif = {
      id: `notif_urgent_${Date.now()}`,
      sender: targetOrg,
      title: `🚨 Urgent Local Request: ${sampleReq.title}`,
      message: `[URGENT LOCAL AID ALERT] ${targetOrg} has posted an urgent high-priority request for "${sampleReq.title}" (${sampleReq.quantity} ${sampleReq.unit} needed in ${sampleReq.location}). As a subscribed member, you are receiving this live push notification dispatch.`,
      date: "Just now",
      type: "urgent_push",
      read: false,
      requestId: sampleReq.id
    };

    setUserNotifications((prev) => {
      const updated = [newNotif, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem("aidstory_user_notifications", JSON.stringify(updated));
      }
      return updated;
    });

    setActivePushToast({
      id: newNotif.id,
      requesterName: targetOrg,
      itemTitle: sampleReq.title,
      urgency: "HIGH PRIORITY",
      description: sampleReq.description,
      location: sampleReq.location,
      requestObj: sampleReq
    });
  };

  const localNeeds = [
    { id: "1", title: "Canned Fish & Beans", quantity: "200 units", hub: "Downtown Hope Depot", urgency: "High" },
    { id: "2", title: "Baby Diapers (Size M/L)", quantity: "150 packs", hub: "Eastside Community Locker", urgency: "Critical" },
    { id: "3", title: "Warm Woolen Blankets", quantity: "80 items", hub: "Perak Community Center", urgency: "Medium" },
    { id: "4", title: "Adult Hygiene Kits", quantity: "120 packs", hub: "Downtown Hope Depot", urgency: "High" }
  ];

  return (
    <div className="min-h-screen bg-[#f4efe5] text-[#2c221a] flex flex-col justify-between selection:bg-brand-olive selection:text-brand-dark relative animate-fadeIn py-8 px-4 md:px-8 overflow-hidden">
      
      {/* Whimsical Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {floatingItems.map((item, index) => (
          <motion.div
            key={index}
            className="absolute hidden sm:flex flex-col items-center justify-center pointer-events-none"
            animate={{
              left: item.x,
              top: item.y,
              y: [0, -18, 0],
              rotate: [0, 8, -8, 0],
              scale: [item.scale, item.scale * 1.06, item.scale * 0.95, item.scale]
            }}
            transition={{
              left: { duration: 2.8, ease: "easeInOut" },
              top: { duration: 2.8, ease: "easeInOut" },
              y: { duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay },
              rotate: { duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay },
              scale: { duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay }
            }}
          >
            <span className="text-3xl md:text-4xl filter saturate-[0.95] drop-shadow-sm select-none opacity-55 transition-all duration-300">
              {item.icon}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Upper Navigation Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full mb-8 flex justify-between items-center border-none pb-0">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-[80px] text-[#2c221a] font-light tracking-tight">
            AidStory
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-full text-center font-sans font-bold tracking-wider text-[20px] mb-[-60px] transition-all duration-300 bg-[#82afa6] text-white hover:bg-[#ffee1a] hover:text-[#2c221a] hover:scale-105 active:scale-95 shadow-md cursor-pointer"
        >
          Log Out
        </button>
      </header>

      {/* Center 3D Flippable Card Stage */}
      <main className="relative z-10 max-w-4xl mx-auto w-full flex-grow flex flex-col items-center justify-center pt-0 pb-4">

        <div className="w-full perspective-2000 relative min-h-[560px] md:min-h-[500px]">
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full preserve-3d relative min-h-[560px] md:min-h-[500px]"
          >
            
            {/* FRONT SIDE: User Journey Card (Page 1) */}
            <div 
              className={`absolute inset-0 w-full h-full backface-hidden bg-[#352a21] rounded-3xl border border-brand-cream/15 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-hidden group ${isFlipped ? "pointer-events-none select-none opacity-0" : "pointer-events-auto"}`}
            >
              {/* Backglow effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-olive/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-olive/10 transition-all duration-500" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-grow">
                {/* Left side text section (7 cols) */}
                <div className="md:col-span-7 space-y-6 text-center z-10 flex flex-col items-center justify-center">
                  <div className="space-y-4 w-full flex flex-col items-center">
                    {/* User Icon & Name */}
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="w-[150px] h-[150px] rounded-full bg-brand-cream/10 border border-brand-cream/20 flex items-center justify-center text-brand-cream shrink-0 shadow-inner">
                        <User className="w-[75px] h-[75px]" />
                      </div>
                      <div className="text-center">
                        <h2 className="text-3xl font-sans font-extrabold text-brand-cream tracking-wide leading-tight">
                           {user ? user.username : "Example User"}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                          <p className="text-xs font-mono text-brand-olive uppercase tracking-widest">
                             {user ? "Registered Member" : "Guest Explorer"}
                          </p>
                          {isVerifiedRecipient && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Location display (no background, no title, placed below username) */}
                    <div className="text-center px-4">
                      <p className="text-sm font-serif italic text-brand-cream/90 font-light leading-relaxed max-w-md mx-auto">
                        location: {getFormattedLocation()}
                      </p>
                    </div>
                  </div>

                  {/* Two Stats Side-By-Side Badges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#352a21] rounded-2xl p-4 border-2 border-[#716565] text-center flex flex-col justify-center relative overflow-hidden transition-all h-[90px] w-[181px]">
                      <span className="block text-4xl font-bold text-brand-olive" style={{ fontFamily: 'Times New Roman', fontStyle: 'normal' }}>
                        {getDaysOfJourney()}
                      </span>
                      <span className="text-[11px] font-mono text-brand-text-muted/80 uppercase tracking-wider mt-1 italic">days journey</span>
                    </div>

                    <div className="bg-[#352a21] rounded-2xl p-4 border-2 border-[#716565] w-[181px] border-solid text-center flex flex-col justify-center relative overflow-hidden transition-all h-[90px]">
                      <span className="block text-brand-olive" style={{ fontFamily: 'Times New Roman', fontStyle: 'normal', fontWeight: 'bold', fontSize: '36px', lineHeight: '40px' }}>
                        {getCompletedDonationsCount()}
                      </span>
                      <span className="text-[11px] font-mono text-brand-text-muted/80 uppercase tracking-wider mt-1 italic">donations made</span>
                    </div>
                  </div>
                </div>

                {/* Right side illustration (5 cols) - Custom Whimsical Storybook Graphic */}
                <div className="md:col-span-5 h-full flex items-center justify-center z-10">
                  <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden relative border-none shadow-xl bg-[#000000] group p-4 flex flex-col justify-between select-none">
                    {/* Stars in the background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {/* Random subtle glowing star points */}
                      <span className="absolute top-[10%] left-[15%] w-1 h-1 bg-[#ffee1a] rounded-full animate-ping opacity-75" />
                      <span className="absolute top-[25%] right-[20%] w-1 h-1 bg-[#ffee1a] rounded-full animate-ping opacity-50 [animation-delay:1s]" />
                      <span className="absolute bottom-[40%] left-[30%] w-0.5 h-0.5 bg-white rounded-full opacity-40" />
                      <span className="absolute top-[50%] left-[80%] w-1 h-1 bg-white rounded-full animate-pulse opacity-60" />
                      <span className="absolute bottom-[25%] left-[10%] w-1.5 h-1.5 bg-[#82afa6]/30 rounded-full animate-pulse [animation-delay:1.5s]" />
                    </div>

                    {/* Dreamy clouds at the top */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between opacity-30 pointer-events-none">
                      <div className="w-12 h-4 bg-white/60 rounded-full blur-[2px]" />
                      <div className="w-16 h-5 bg-white/50 rounded-full blur-[2px]" />
                    </div>

                    {/* Magic light rays rising from the book */}
                    <div className="absolute inset-x-0 bottom-12 top-6 flex justify-center pointer-events-none">
                      <div className="w-24 h-full bg-gradient-to-t from-[#ffee1a]/15 via-[#82afa6]/5 to-transparent blur-md transform -skew-x-12 animate-pulse" />
                      <div className="w-16 h-full bg-gradient-to-t from-[#82afa6]/10 via-[#ffee1a]/5 to-transparent blur-md transform skew-x-12 animate-pulse [animation-delay:0.5s]" />
                    </div>

                    {/* Whimsical Magic Trail / Dotted curve */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M 120 220 Q 90 140 130 80 Q 170 30 110 20" 
                        fill="none" 
                        stroke="rgba(255, 238, 26, 0.25)" 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4" 
                        className="animate-dash"
                        style={{
                          strokeDashoffset: 100,
                          animation: "dash 15s linear infinite"
                        }}
                      />
                    </svg>

                    {/* Main Magical Float Elements (Rising from the open book) */}
                    <div className="relative flex-grow flex flex-col justify-center items-center">
                      
                      {/* Floating Gift Box of Hope */}
                      <motion.div 
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, -4, 4, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="absolute top-[18%] left-[25%] bg-[#ffee1a] text-[#2c221a] p-2 rounded-xl shadow-lg border border-white/20 z-20 flex items-center justify-center group-hover:scale-110 transition-transform"
                      >
                        <Gift className="w-5 h-5" />
                      </motion.div>

                      {/* Floating Sparkles of Kindness */}
                      <motion.div 
                        animate={{ 
                          y: [0, -15, 0],
                          scale: [1, 1.2, 0.9, 1],
                          rotate: [0, 90, 180, 270, 360]
                        }}
                        transition={{ 
                          duration: 5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                        className="absolute top-[10%] right-[32%] text-[#ffee1a] z-20"
                      >
                        <Sparkles className="w-7 h-7 filter drop-shadow-[0_2px_8px_rgba(255,238,26,0.5)]" />
                      </motion.div>

                      {/* Floating Cozy Community Hub House */}
                      <motion.div 
                        animate={{ 
                          y: [-3, 5, -3],
                          rotate: [-3, 3, -3]
                        }}
                        transition={{ 
                          duration: 6, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: 1
                        }}
                        className="absolute top-[32%] right-[15%] bg-[#82afa6] text-white p-2 rounded-xl shadow-lg border border-white/10 z-20 flex items-center justify-center group-hover:scale-110 transition-transform"
                      >
                        <Home className="w-4 h-4" />
                      </motion.div>

                      {/* Floating Warm Red Heart */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.15, 1],
                          y: [0, -4, 0]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity, 
                          ease: "easeInOut"
                        }}
                        className="absolute top-[36%] left-[12%] text-rose-400 font-sans text-2xl filter drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)] z-20"
                      >
                        ❤️
                      </motion.div>

                      {/* Floating Little Letter/Mail of Hope */}
                      <motion.div 
                        animate={{ 
                          y: [2, -6, 2],
                          rotate: [5, -5, 5]
                        }}
                        transition={{ 
                          duration: 4.5, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: 2
                        }}
                        className="absolute top-[48%] left-[28%] bg-white/10 backdrop-blur-sm text-brand-cream p-1.5 rounded-lg border border-brand-cream/15 z-20 flex items-center justify-center"
                      >
                        <Mail className="w-3.5 h-3.5 text-brand-olive" />
                      </motion.div>

                    </div>

                    {/* The Open Storybook Base (resting at the bottom) */}
                    <div className="relative w-full flex justify-center pb-2 z-10">
                      <div className="relative w-44 h-16 transform transition-transform duration-500 group-hover:scale-105">
                        {/* Book shadow */}
                        <div className="absolute -bottom-1 left-2 right-2 h-3 bg-black/40 rounded-full blur-md" />
                        
                        {/* Book pages (3D effect layers) */}
                        <div className="absolute inset-0 bg-[#ecdcc4] rounded-sm border-b-4 border-[#c5b196] shadow-md flex">
                          {/* Left Page */}
                          <div className="w-1/2 h-full border-r border-[#dfceba]/80 relative p-1 px-2 flex flex-col justify-between overflow-hidden">
                            {/* Lines of story text (placeholder lines) */}
                            <div className="space-y-1 pt-2">
                              <div className="h-1 bg-black/15 rounded-full w-4/5" />
                              <div className="h-1 bg-black/15 rounded-full w-full" />
                              <div className="h-1 bg-black/15 rounded-full w-3/4" />
                              <div className="h-1 bg-black/15 rounded-full w-5/6" />
                            </div>
                            <span className="text-[7px] font-mono text-black/25 text-left select-none">Pg. 45</span>
                            
                            {/* Left page fold highlight */}
                            <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-r from-transparent to-black/5" />
                          </div>

                          {/* Right Page */}
                          <div className="w-1/2 h-full relative p-1 px-2 flex flex-col justify-between overflow-hidden">
                            {/* Lines of story text (placeholder lines) */}
                            <div className="space-y-1 pt-2 pl-1">
                              <div className="h-1 bg-black/15 rounded-full w-5/6" />
                              <div className="h-1 bg-black/15 rounded-full w-full" />
                              <div className="h-1 bg-black/15 rounded-full w-2/3" />
                              <div className="h-1 bg-black/15 rounded-full w-4/5" />
                            </div>
                            <span className="text-[7px] font-mono text-black/25 text-right select-none pr-1">Pg. 46</span>
                            
                            {/* Right page fold highlight */}
                            <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-l from-transparent to-black/5" />
                          </div>
                        </div>

                        {/* Hardcover spine base */}
                        <div className="absolute top-0 bottom-0 left-1/2 -ml-1 w-2 bg-[#8c3c24] rounded-sm shadow-inner" />
                        
                        {/* Little bookmark ribbon hanging out */}
                        <div className="absolute bottom-[-10px] left-1/2 -ml-0.5 w-1 h-3 bg-rose-500 rounded-b-sm animate-pulse" />
                      </div>
                    </div>

                    {/* Bottom cozy storybook graphic title block */}
                    <div className="border-t border-brand-cream/10 pt-2 text-center bg-black/20 rounded-xl p-2 mt-2 z-10">
                      <p className="text-xs font-serif italic text-[#ffee1a] font-medium tracking-wide">
                        "The Storybook of Shared Hope"
                      </p>
                      <p className="text-[9px] font-mono text-brand-cream/60 leading-tight mt-0.5">
                        A cozy chapter built of daily small kindnesses.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* Bottom bar with more features link at the bottom right */}
              <div className="flex justify-between items-center border-t border-brand-cream/10 pt-4 mt-4 text-xs font-mono w-full">
                <span className="text-brand-cream/40">AidStory © 2026</span>
                <button
                  onClick={() => setIsFlipped(true)}
                  className="flex items-center gap-1 bg-transparent border-none text-[#ffee1a] hover:text-yellow-400 font-bold transition-colors cursor-pointer animate-pulse text-right"
                >
                  more features &gt;
                </button>
              </div>
            </div>

            {/* BACK SIDE: Explore Grid (Page 2) */}
            <div 
              className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#2d241e] rounded-3xl border border-brand-cream/15 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto ${!isFlipped ? "pointer-events-none select-none opacity-0" : "pointer-events-auto"}`}
            >
              <div className="space-y-4">
                <div className="flex justify-center items-center border-b border-brand-cream/10 pb-3">
                  <h3 className="text-3xl font-serif italic text-brand-cream font-light tracking-tight text-center">
                    Explore with...
                  </h3>
                </div>

                {/* 12 pill buttons layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 text-left">
                  
                  {/* BUTTON 1 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToView("needs");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">🛍️</span>
                    <span className="pointer-events-none select-none">Browse Needs</span>
                  </button>

                  {/* BUTTON 2 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToView("preparing_donate_box");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">📦</span>
                    <span className="pointer-events-none select-none">Donate Box</span>
                  </button>

                  {/* BUTTON 3 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("delivery");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">🚚</span>
                    <span className="pointer-events-none select-none">Delivery Status</span>
                  </button>

                  {/* BUTTON 4 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isVerifiedRecipient || isAdmin) {
                        navigateToView("your_request");
                      } else {
                        setIsPostLockedModalOpen(true);
                      }
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">🧩</span>
                    <span className="pointer-events-none select-none">Post Request</span>
                  </button>

                  {/* BUTTON 5 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("profile");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">👤</span>
                    <span className="pointer-events-none select-none">Profile</span>
                  </button>

                  {/* BUTTON 6 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("notification");
                      setUserNotifications((prevNotifs) => {
                        const updated = prevNotifs.map((n) => ({ ...n, read: true }));
                        if (typeof window !== "undefined") {
                          localStorage.setItem("aidstory_user_notifications", JSON.stringify(updated));
                        }
                        return updated;
                      });
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto relative"
                  >
                    <span className="text-4xl pointer-events-none select-none">✉️</span>
                    <span className="pointer-events-none select-none flex items-center justify-between w-full">
                      <span>Notification</span>
                      {userNotifications.filter((n) => !n.read).length > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse ml-1">
                          {userNotifications.filter((n) => !n.read).length}
                        </span>
                      )}
                    </span>
                  </button>

                  {/* BUTTON 7 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("dashboard");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">📊</span>
                    <span className="pointer-events-none select-none">Dashboard</span>
                  </button>

                  {/* BUTTON 8 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("apply");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">🖱️</span>
                    <span className="pointer-events-none select-none">Apply Now</span>
                  </button>

                  {/* BUTTON 9 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("inventory");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">🏠</span>
                    <span className="pointer-events-none select-none">Your Inventory</span>
                  </button>

                  {/* BUTTON 10 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("chatbot");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">🤖</span>
                    <span className="pointer-events-none select-none">Customer Service</span>
                  </button>

                  {/* BUTTON 11 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Redirect to the existing comments view as feedback
                      navigateToView("comments");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">⏱️</span>
                    <span className="pointer-events-none select-none">Feedback</span>
                  </button>

                  {/* BUTTON 12: SETTINGS */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab("settings");
                    }}
                    className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto"
                  >
                    <span className="text-4xl pointer-events-none select-none">⚙️</span>
                    <span className="pointer-events-none select-none">Settings</span>
                  </button>

                  {/* BUTTON 13: APPLICATION (ADMIN APPROVAL - ONLY FOR ADMIN) */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("application");
                      }}
                      className="flex items-center gap-3 bg-white hover:bg-yellow-400 text-[#2c221a] py-3.5 px-4 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer w-full max-w-[200px] mx-auto relative"
                    >
                      <span className="text-4xl pointer-events-none select-none">📋</span>
                      <span className="pointer-events-none select-none flex items-center justify-between w-full">
                        <span>Application</span>
                        {recipientApplications.filter((a) => a.status === "Pending").length > 0 && (
                          <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse ml-1">
                            {recipientApplications.filter((a) => a.status === "Pending").length}
                          </span>
                        )}
                      </span>
                    </button>
                  )}

                </div>
              </div>

              {/* Instructions back side bottom */}
              <div className="flex justify-between items-center border-t border-brand-cream/10 pt-4 mt-6 text-xs font-mono text-brand-cream/50">
                <button
                  onClick={() => setIsFlipped(false)}
                  className="flex items-center gap-1 bg-transparent border-none text-brand-cream/70 hover:text-yellow-400 font-bold transition-colors cursor-pointer"
                >
                  &lt; AidStory © 2026
                </button>
                <span className="text-brand-cream/40 italic">Click &lt; AidStory © 2026 to flip back</span>
              </div>
            </div>

          </motion.div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center mt-8 text-xs text-[#2c221a]/50 font-light border-t border-[#2c221a]/10 pt-4">
        <p>© 2026 AidStory. All rights reserved.</p>
      </footer>

      {/* DETAILED INTERACTIVE TAB MODALS (AnimatePresence) */}
      <AnimatePresence>
        {activeTab && activeTab !== "apply" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTab(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`relative w-full ${activeTab === "donate" ? "max-w-2xl" : "max-w-lg"} bg-[#395244] p-6 md:p-8 rounded-2xl border border-brand-cream/20 shadow-2xl z-10 text-brand-cream max-h-[90vh] overflow-y-auto`}
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setActiveTab(null);
                  if (typeof window !== "undefined" && window.location.hash === "#donate-box") {
                    window.location.hash = "main-menu";
                  }
                }}
                className="absolute top-4 right-4 text-brand-cream/75 hover:text-brand-cream transition-colors p-2 rounded-full hover:bg-brand-cream/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* BROWSE NEEDS MODAL */}
              {activeTab === "browse" && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-olive" />
                    <h3 className="text-xl font-serif text-brand-cream">Browse Local Hub Needs</h3>
                  </div>
                  <p className="text-xs text-brand-cream/80">Select any urgent item request to pledge your matched delivery package:</p>

                  {successMessage && (
                    <div className="bg-[#82afa6]/20 border border-[#82afa6]/40 text-[#82afa6] text-xs p-3 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    {localNeeds.map(need => {
                      const isPledged = pledgedItems.includes(need.title);
                      return (
                        <div key={need.id} className="p-3 bg-black/25 border border-brand-cream/10 rounded-xl flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-xs text-brand-cream">{need.title}</h4>
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                                need.urgency === "Critical" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse" :
                                need.urgency === "High" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-brand-olive/20 text-brand-olive"
                              }`}>
                                {need.urgency}
                              </span>
                            </div>
                            <p className="text-[10px] text-brand-cream/60 mt-1">Target: {need.quantity} • Location: {need.hub}</p>
                          </div>
                          
                          <button
                            disabled={isPledged}
                            onClick={() => handlePledgeNeed(need.title)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                              isPledged 
                                ? "bg-brand-cream/10 text-brand-cream/40 border border-brand-cream/10" 
                                : "bg-brand-olive text-brand-dark hover:bg-[#ffee1a]"
                            }`}
                          >
                            {isPledged ? "Pledged ✓" : "Pledge"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DONATE BOX PAGE / MODAL */}
              {activeTab === "donate" && (
                <div className="space-y-6 text-left">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-brand-cream/15 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-brand-cream font-bold">Donate Box</h3>
                        <p className="text-[11px] text-brand-cream/70">
                          Fulfill collected community needs or assemble custom care boxes
                        </p>
                      </div>
                    </div>
                  </div>

                  {donateSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-4 bg-black/20 rounded-2xl border border-[#82afa6]/30 p-6"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#82afa6]/20 text-[#82afa6] flex items-center justify-center mx-auto border border-[#82afa6]/40">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="font-serif text-xl text-brand-cream font-bold">Donation Package Pledged!</h4>
                      <p className="text-xs text-brand-cream/80 max-w-md mx-auto leading-relaxed">
                        {donateSuccessMessage || "Your donation pledge has been securely registered with AidStory Perak hubs. Our team is coordinating delivery logistics."}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => setActiveTab("delivery")}
                          className="py-2.5 px-5 bg-brand-olive hover:bg-[#ffee1a] text-brand-dark rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Truck className="w-4 h-4" />
                          Track Delivery Status
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDonateSuccess(false);
                            setActiveTab(null);
                          }}
                          className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-brand-cream rounded-full font-bold text-xs transition-colors cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {/* SECTION 1: Collected Items from Community Needs (Shopee Cart) */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                              Collected Aid Items ({donateBoxItems.reduce((acc, curr) => acc + curr.quantity, 0)})
                            </span>
                            {donateBoxItems.length > 0 && (
                              <span className="bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                                {donateBoxItems.length} needs
                              </span>
                            )}
                          </div>
                          {donateBoxItems.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearDonateBox}
                              className="text-[11px] text-rose-300 hover:text-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Clear All
                            </button>
                          )}
                        </div>

                        {donateBoxItems.length > 0 ? (
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {donateBoxItems.map((item) => (
                              <div
                                key={item.id}
                                className="p-3 bg-black/30 border border-brand-cream/15 rounded-xl flex items-center gap-3 hover:border-amber-400/40 transition-colors"
                              >
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-12 h-12 rounded-lg object-cover bg-black/40 shrink-0 border border-white/10"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-black/40 text-2xl flex items-center justify-center shrink-0 border border-white/10">
                                    📦
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  <h5 className="text-xs font-bold text-brand-cream truncate">{item.title}</h5>
                                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-brand-cream/60">
                                    <span className="bg-white/10 px-1.5 py-0.2 rounded text-[9px] font-mono">{item.category}</span>
                                    <span className="flex items-center gap-0.5 truncate">
                                      <MapPin className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                                      {item.location}
                                    </span>
                                  </div>
                                </div>

                                {/* Quantity Modifier */}
                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-lg px-2 py-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDonateBoxQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="text-brand-cream/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-0.5 cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="text-xs font-mono font-bold text-amber-300 min-w-[20px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateDonateBoxQuantity(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.maxNeeded}
                                    className="text-brand-cream/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-0.5 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Remove single item */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromDonateBox(item.id)}
                                  className="text-brand-cream/40 hover:text-rose-300 p-1.5 transition-colors cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-black/20 border border-dashed border-brand-cream/20 text-center space-y-2">
                            <Package className="w-8 h-8 text-brand-cream/40 mx-auto" />
                            <p className="text-xs text-brand-cream/70">
                              Your Donate Box is currently empty.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab(null);
                                navigateToView("needs");
                              }}
                              className="py-1.5 px-4 bg-amber-400 hover:bg-yellow-300 text-black rounded-full font-bold text-[11px] uppercase tracking-wider transition-transform active:scale-95 cursor-pointer inline-flex items-center gap-1.5 shadow"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Browse Community Needs
                            </button>
                          </div>
                        )}

                        {/* Dispatch Options for collected items */}
                        {donateBoxItems.length > 0 && (
                          <div className="p-3.5 bg-black/25 rounded-xl border border-brand-cream/10 space-y-3 mt-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-mono text-brand-cream/70 uppercase font-semibold">
                                Dispatch / Fulfillment Method
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setDonateBoxDeliveryMethod("courier")}
                                  className={`p-2 rounded-lg text-left text-xs border transition-all cursor-pointer ${
                                    donateBoxDeliveryMethod === "courier"
                                      ? "bg-amber-400/20 border-amber-400 text-amber-200"
                                      : "bg-black/20 border-white/10 text-brand-cream/70 hover:border-white/20"
                                  }`}
                                >
                                  <div className="font-bold flex items-center gap-1">
                                    <Truck className="w-3 h-3 text-amber-300" />
                                    Courier Dispatch
                                  </div>
                                  <div className="text-[9px] text-brand-cream/60 mt-0.5">Ship parcel directly to hub</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDonateBoxDeliveryMethod("dropoff")}
                                  className={`p-2 rounded-lg text-left text-xs border transition-all cursor-pointer ${
                                    donateBoxDeliveryMethod === "dropoff"
                                      ? "bg-amber-400/20 border-amber-400 text-amber-200"
                                      : "bg-black/20 border-white/10 text-brand-cream/70 hover:border-white/20"
                                  }`}
                                >
                                  <div className="font-bold flex items-center gap-1">
                                    <Building2 className="w-3 h-3 text-amber-300" />
                                    Hub Drop-off
                                  </div>
                                  <div className="text-[9px] text-brand-cream/60 mt-0.5">Self drop at Perak relief hub</div>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDonateBoxDeliveryMethod("volunteer")}
                                  className={`p-2 rounded-lg text-left text-xs border transition-all cursor-pointer ${
                                    donateBoxDeliveryMethod === "volunteer"
                                      ? "bg-amber-400/20 border-amber-400 text-amber-200"
                                      : "bg-black/20 border-white/10 text-brand-cream/70 hover:border-white/20"
                                  }`}
                                >
                                  <div className="font-bold flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-amber-300" />
                                    Direct Handover
                                  </div>
                                  <div className="text-[9px] text-brand-cream/60 mt-0.5">Volunteer meet / handoff</div>
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleDonateBoxCheckout}
                              disabled={isDonateBoxCheckingOut}
                              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 active:scale-98 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Package className="w-4 h-4" />
                              {isDonateBoxCheckingOut
                                ? "Processing Pledge Dispatch..."
                                : `Pledge & Dispatch All (${donateBoxItems.reduce((acc, curr) => acc + curr.quantity, 0)} Units)`}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* SECTION 2: Custom Care Box Builder */}
                      <div className="border-t border-brand-cream/15 pt-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-brand-olive" />
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-cream">
                            Or Build a Custom Relief Package
                          </h4>
                        </div>
                        <p className="text-[11px] text-brand-cream/70">
                          Construct standard care packages categorized for emergency distributions:
                        </p>

                        <form onSubmit={handleDonateSubmit} className="space-y-3 bg-black/20 p-3.5 rounded-xl border border-brand-cream/10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-brand-cream/70 uppercase">Category *</label>
                              <select
                                value={boxCategory}
                                onChange={(e) => setBoxCategory(e.target.value)}
                                className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3 py-2 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6]"
                              >
                                <option value="Food Supplies">Food Supplies (Rice, Oats, Cans)</option>
                                <option value="Clothing & Blankets">Clothing & Blankets</option>
                                <option value="Baby & Kid Essentials">Baby & Kid Essentials</option>
                                <option value="Hygiene Kits">Hygiene Kits</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-brand-cream/70 uppercase">Quantity (units/boxes) *</label>
                              <input
                                type="number"
                                required
                                min="1"
                                max="100"
                                value={boxQuantity}
                                onChange={(e) => setBoxQuantity(e.target.value)}
                                className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3 py-2 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6]"
                              >
                              </input>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-brand-olive hover:bg-[#ffee1a] text-brand-dark rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Pledge Custom Box Delivery
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DELIVERY STATUS MODAL */}
              {activeTab === "delivery" && (
                <div className="space-y-5 text-left">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-brand-olive" />
                    <h3 className="text-xl font-serif text-brand-cream">Emissions Optimized Delivery</h3>
                  </div>

                  <p className="text-xs text-brand-cream/80">
                    AidStory's logistics scheduler coordinates with certified transporters. Here is the active Perak dispatch path:
                  </p>

                  <div className="p-4 bg-black/30 rounded-xl border border-brand-cream/10 space-y-4">
                    <div className="flex justify-between items-center text-xs font-mono text-brand-cream/60">
                      <span>Perak Route 4B-West</span>
                      <span className="text-brand-olive animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-olive" />
                        <span>En Route</span>
                      </span>
                    </div>

                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="absolute h-full w-[30%] bg-gradient-to-r from-transparent via-brand-olive to-transparent"
                      />
                      <div className="absolute left-[65%] h-full w-2 bg-brand-olive" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-brand-cream/50">
                      <div>
                        <span className="block font-semibold text-brand-cream text-xs">PLEDGED</span>
                        <span>Depot Check</span>
                      </div>
                      <div>
                        <span className="block font-semibold text-brand-olive text-xs">TRANSIT</span>
                        <span>En Route 4B</span>
                      </div>
                      <div>
                        <span className="block font-semibold text-brand-cream text-xs font-bold">ARRIVED</span>
                        <span>Recipient Hub</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-brand-olive bg-brand-olive/10 p-3 rounded-lg border border-brand-olive/20">
                    <Sparkles className="w-4 h-4 text-brand-olive shrink-0" />
                    <span>Optimized route layout cuts local fuel emissions by 32%.</span>
                  </div>
                </div>
              )}

              {/* POST REQUEST MODAL */}
              {activeTab === "post" && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-5 h-5 text-brand-olive" />
                    <h3 className="text-xl font-serif text-brand-cream">Post Community Request</h3>
                  </div>

                  {postSuccess ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#82afa6]/20 text-[#82afa6] flex items-center justify-center mx-auto border border-[#82afa6]/30">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-lg text-brand-cream">Request Posted Successfully!</h4>
                      <p className="text-xs text-brand-cream/70 max-w-xs mx-auto">
                        Your request has been published. Local coordinators will verify and align it with matched pledges.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handlePostRequest} className="space-y-3">
                      <p className="text-xs text-brand-cream/80">Are you an NGO representative or community leader? Register local supply deficiencies:</p>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-brand-cream/70 uppercase">Supply Needed *</label>
                        <input
                          type="text"
                          required
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          placeholder="e.g. 50 packs infant milk"
                          className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-brand-cream/70 uppercase">Specific Hub Location *</label>
                        <input
                          type="text"
                          required
                          value={postLocation}
                          onChange={(e) => setPostLocation(e.target.value)}
                          placeholder="e.g. Perak Flood Center B"
                          className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-brand-cream/70 uppercase">Brief Description / Urgent Context *</label>
                        <textarea
                          required
                          rows={3}
                          value={postDesc}
                          onChange={(e) => setPostDesc(e.target.value)}
                          placeholder="Describe the target families and emergency urgency detail..."
                          className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-brand-olive hover:bg-[#ffee1a] text-brand-dark rounded-full font-bold text-xs uppercase tracking-wider transition-colors mt-2"
                      >
                        Publish Request
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* PROFILE MODAL */}
              {activeTab === "profile" && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-olive" />
                    <h3 className="text-xl font-serif text-brand-cream">Your Account Profile</h3>
                  </div>

                  <div className="space-y-3 bg-black/25 border border-brand-cream/10 rounded-xl p-4 font-sans text-xs">
                    <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                      <span className="text-brand-cream/50 font-mono">USERNAME:</span>
                      <span className="font-bold text-brand-cream">{user ? user.username : "Guest User (Example)"}</span>
                    </div>

                    <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                      <span className="text-brand-cream/50 font-mono">EMAIL ADDRESS:</span>
                      <span className="text-brand-cream">{user ? user.email : "guest@aidstory.org"}</span>
                    </div>

                    <div className="flex justify-between border-b border-brand-cream/5 pb-2">
                      <span className="text-brand-cream/50 font-mono">CONTACT PREFIX:</span>
                      <span className="text-brand-cream font-mono">{user ? user.contact : "+60 12-3456789"}</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-brand-cream/50 font-mono block">GEOGRAPHIC ADRESS:</span>
                      <p className="text-brand-cream bg-black/20 p-2 rounded border border-brand-cream/5 font-serif italic">
                        {getFormattedLocation()}
                      </p>
                    </div>

                    <div className="flex justify-between border-t border-brand-cream/5 pt-2">
                      <span className="text-brand-cream/50 font-mono">JOINED DATE:</span>
                      <span className="text-brand-cream font-mono">
                        {user?.joinedDate 
                          ? new Date(user.joinedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) 
                          : "16 Aug 2026"}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-brand-cream/5 pt-2">
                      <span className="text-brand-cream/50 font-mono">JOURNEY DURATION:</span>
                      <span className="font-bold text-brand-olive font-mono">{getDaysOfJourney()} {getDaysOfJourney() === 1 ? "Day" : "Days"}</span>
                    </div>

                    <div className="flex justify-between border-t border-brand-cream/5 pt-2 text-[10px] text-brand-olive font-mono">
                      <span>ROLE TYPE: {user ? "AIDSTORY COMMUNITY DISPATCHER" : "GUEST VISITOR"}</span>
                      <span>ACTIVE: YES</span>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATION MODAL */}
              {activeTab === "notification" && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-brand-cream/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-brand-olive" />
                      <h3 className="text-xl font-serif text-brand-cream">Community Dispatches & Alerts</h3>
                    </div>
                    <span className="text-[10px] font-mono text-brand-cream/60">
                      {userNotifications.length} Messages
                    </span>
                  </div>

                  {/* Push Notification Preferences Setting Box */}
                  <div className="bg-black/30 border border-brand-cream/20 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${urgentPushEnabled ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/40" : "bg-white/5 text-brand-cream/40 border border-brand-cream/10"}`}>
                          {urgentPushEnabled ? <BellRing className="w-4.5 h-4.5 animate-pulse" /> : <BellOff className="w-4.5 h-4.5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-brand-cream flex items-center gap-2">
                            <span>Push Notifications (Urgent Local Requests)</span>
                            <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${urgentPushEnabled ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-stone-500/20 text-stone-400 border border-stone-500/30"}`}>
                              {urgentPushEnabled ? "ENABLED" : "DISABLED"}
                            </span>
                          </h4>
                          <p className="text-[10px] text-brand-cream/70 leading-relaxed mt-0.5">
                            Subscribed members receive instant dispatches when organizers post urgent emergency aid requests.
                          </p>
                        </div>
                      </div>

                      {/* Main Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={urgentPushEnabled}
                        onClick={() => handleToggleUrgentPush()}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${urgentPushEnabled ? "bg-yellow-400" : "bg-stone-600"}`}
                        title="Toggle urgent local requests push notifications"
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${urgentPushEnabled ? "translate-x-5 !bg-[#2c221a]" : "translate-x-0 !bg-stone-300"}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-brand-cream/10 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setShowManageSubscriptionsModal(true)}
                        className="text-[#82afa6] hover:text-yellow-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Manage Subscribed Requesters ({subscribedRequesters.length})</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerTestPushAlert}
                        className="bg-brand-cream/10 hover:bg-yellow-400 hover:text-[#2c221a] px-2.5 py-1 rounded text-[10px] font-bold text-brand-cream transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Radio className="w-3 h-3 text-yellow-300 animate-pulse" />
                        <span>Simulate Push Alert</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 bg-black/20 border border-brand-cream/5 rounded-xl text-center">
                        <p className="text-xs text-brand-cream/50 font-mono">No notifications received yet.</p>
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            notif.type === "urgent_push"
                              ? "bg-rose-950/30 border-rose-500/50 shadow-lg"
                              : notif.type === "approval"
                              ? "bg-emerald-950/30 border-emerald-500/50 shadow-md"
                              : "bg-black/25 border-brand-cream/10"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-brand-cream flex items-center gap-1.5">
                                {notif.type === "urgent_push" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />}
                                {notif.type === "approval" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                                {notif.sender}
                              </span>
                              {notif.type === "urgent_push" && (
                                <span className="bg-rose-500/20 text-rose-300 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border border-rose-500/30">
                                  SUBSCRIBED PUSH ALERT
                                </span>
                              )}
                              {notif.type === "approval" && (
                                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                                  APPROVED RECIPIENT
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] font-mono text-brand-cream/40">{notif.date}</span>
                          </div>
                          {notif.title && (
                            <h4 className={`text-xs font-bold mb-1 ${notif.type === "urgent_push" ? "text-rose-300" : notif.type === "approval" ? "text-emerald-300" : "text-brand-cream"}`}>
                              {notif.title}
                            </h4>
                          )}
                          <p className="text-xs text-brand-cream/85 leading-relaxed">{notif.message}</p>
                          {notif.requestId && (
                            <button
                              onClick={() => {
                                const found = DEFAULT_NEEDS_REQUESTS.find((r) => r.id === notif.requestId);
                                if (found) {
                                  setSelectedDetailRequest(found);
                                } else {
                                  navigateToView("needs");
                                }
                              }}
                              className="mt-2 text-[10px] font-mono text-yellow-300 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Requested Item & Pledge Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* DASHBOARD MODAL */}
              {activeTab === "dashboard" && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-brand-olive" />
                    <h3 className="text-xl font-serif text-brand-cream">Impact Dashboard</h3>
                  </div>

                  <p className="text-xs text-brand-cream/80">Real-time stats showing transparent distribution efficiency this week:</p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-black/20 border border-brand-cream/10 rounded-xl text-center">
                      <span className="block text-xl font-bold text-brand-cream">4.2K</span>
                      <span className="text-[9px] font-mono text-brand-cream/50 uppercase">Total KG Aid</span>
                    </div>
                    <div className="p-3 bg-black/20 border border-brand-cream/10 rounded-xl text-center">
                      <span className="block text-xl font-bold text-brand-olive">98.4%</span>
                      <span className="text-[9px] font-mono text-brand-cream/50 uppercase">Match Success</span>
                    </div>
                    <div className="p-3 bg-black/20 border border-brand-cream/10 rounded-xl text-center">
                      <span className="block text-xl font-bold text-brand-cream">321</span>
                      <span className="text-[9px] font-mono text-brand-cream/50 uppercase">Local Drivers</span>
                    </div>
                  </div>

                  {/* SVG Line representation of matched cases */}
                  <div className="p-4 bg-black/30 border border-brand-cream/10 rounded-xl">
                    <div className="flex justify-between text-[10px] font-mono text-brand-cream/40 mb-2">
                      <span>Donation Match Trends</span>
                      <span>+24% vs last month</span>
                    </div>
                    <div className="h-16 flex items-end justify-between gap-1 pt-4">
                      {[30, 45, 35, 60, 50, 75, 90, 85, 100].map((height, i) => (
                        <div key={i} className="flex-grow bg-[#82afa6]/30 hover:bg-[#ffee1a] rounded-t transition-colors relative group h-full">
                          <div 
                            style={{ height: `${height}%` }} 
                            className="bg-brand-olive rounded-t absolute bottom-0 left-0 right-0"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-brand-cream/40 mt-2">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Old apply now modal removed to support dedicated fullscreen view */}

              {/* YOUR INVENTORY & DONATIONS MODAL */}
              {activeTab === "inventory" && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-brand-cream/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-brand-olive" />
                      <h3 className="text-xl font-serif text-brand-cream">Your Inventory & Donations</h3>
                    </div>
                    <span className="text-xs font-mono bg-brand-olive/20 text-brand-olive border border-brand-olive/30 px-2.5 py-0.5 rounded-full font-bold">
                      {getCompletedDonationsCount()} Completed
                    </span>
                  </div>

                  <p className="text-xs text-brand-cream/80">
                    A record of all packages, pledges, and community aid fulfilled under this account:
                  </p>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {completedDonations.length === 0 && pledgedItems.length === 0 ? (
                      <div className="p-4 bg-black/20 border border-brand-cream/5 rounded-xl text-center">
                        <p className="text-xs text-brand-cream/50 font-mono">No donations or pledges found yet.</p>
                        <p className="text-[10px] text-brand-cream/40 mt-1">Select "Browse Needs" or "Donate Box" to start a matched donation!</p>
                      </div>
                    ) : (
                      (completedDonations.length > 0
                        ? completedDonations
                        : pledgedItems.map((item, idx) => ({
                            id: `pledge-${idx}`,
                            title: item,
                            date: new Date().toISOString(),
                            status: "completed"
                          }))
                      ).map((item, idx) => (
                        <div key={item.id || idx} className="p-3 bg-black/20 border border-brand-cream/10 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-xs text-brand-cream">{item.title}</h4>
                            <span className="text-[9px] font-mono text-brand-cream/50 block mt-0.5">
                              ID: DON-00{idx + 1}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
                            Completed
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* CUSTOMER SERVICE CHATBOT MODAL */}
              {activeTab === "chatbot" && (
                <div className="space-y-4 text-left flex flex-col h-[400px]">
                  <div className="flex items-center gap-2 border-b border-brand-cream/10 pb-2">
                    <MessageSquareCode className="w-5 h-5 text-brand-olive" />
                    <div>
                      <h3 className="text-lg font-serif text-brand-cream">Customer Service Bot</h3>
                      <span className="text-[9px] font-mono text-brand-olive">● Online Assistant</span>
                    </div>
                  </div>

                  {/* Message stream */}
                  <div className="flex-grow overflow-y-auto space-y-3 pr-1 p-2 bg-black/20 rounded-xl border border-brand-cream/5">
                    {chatbotMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex flex-col max-w-[85%] ${
                          msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <span className="text-[8px] font-mono text-brand-cream/40 mb-0.5">
                          {msg.sender === "user" ? "You" : "AidStory Bot"}
                        </span>
                        <div 
                          className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                            msg.sender === "user" 
                              ? "bg-brand-olive text-brand-dark rounded-tr-none font-medium" 
                              : "bg-[#24352b] text-brand-cream rounded-tl-none border border-brand-cream/10"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat input form */}
                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about foods, volunteer, tracking..."
                      className="flex-grow bg-[#24352b] border border-brand-cream/15 rounded-full px-4 py-2 text-xs text-brand-cream focus:outline-none focus:border-[#82afa6] placeholder:text-brand-cream/45"
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-brand-olive hover:bg-[#ffee1a] text-brand-dark rounded-full transition-colors flex items-center justify-center cursor-pointer min-h-[38px] min-w-[38px]"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* APPLICATION MANUAL APPROVAL MODAL (ADMIN ONLY) */}
              {activeTab === "application" && isAdmin && (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-brand-cream/10 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-brand-olive" />
                      <div>
                        <h3 className="text-xl font-serif text-brand-cream">Recipient Applications</h3>
                        <p className="text-[10px] text-brand-cream/70 font-mono">Manual Approval Portal</p>
                      </div>
                    </div>
                    <span className="bg-brand-olive/20 text-brand-olive text-[10px] font-mono px-2.5 py-1 rounded-full border border-brand-olive/30 font-bold">
                      ADMIN
                    </span>
                  </div>

                  {applicationActionToast && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#82afa6]/20 border border-[#82afa6]/40 text-[#82afa6] text-xs p-3 rounded-lg flex items-center gap-2 animate-fadeIn"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#82afa6]" />
                      <span>{applicationActionToast}</span>
                    </motion.div>
                  )}

                  {/* Filter Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {(["All", "Pending", "Approved", "Rejected"] as const).map((status) => {
                      const count =
                        status === "All"
                          ? recipientApplications.length
                          : recipientApplications.filter((a) => a.status === status).length;
                      return (
                        <button
                          key={status}
                          onClick={() => setAppFilterStatus(status)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                            appFilterStatus === status
                              ? "bg-brand-olive text-brand-dark font-bold shadow"
                              : "bg-black/30 text-brand-cream/70 hover:bg-black/50 border border-brand-cream/10"
                          }`}
                        >
                          {status} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Applications List */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 pt-1">
                    {recipientApplications.filter(
                      (app) => appFilterStatus === "All" || app.status === appFilterStatus
                    ).length === 0 ? (
                      <div className="p-6 bg-black/20 border border-brand-cream/5 rounded-xl text-center">
                        <p className="text-xs text-brand-cream/50 font-mono">
                          No {appFilterStatus.toLowerCase()} applications found.
                        </p>
                      </div>
                    ) : (
                      recipientApplications
                        .filter((app) => appFilterStatus === "All" || app.status === appFilterStatus)
                        .map((app) => (
                          <div
                            key={app.id}
                            className={`p-4 rounded-xl border transition-all ${
                              app.status === "Pending"
                                ? "bg-amber-950/20 border-amber-500/40"
                                : app.status === "Approved"
                                ? "bg-emerald-950/20 border-emerald-500/30"
                                : "bg-rose-950/20 border-rose-500/30"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-brand-cream">{app.name}</h4>
                                  <span className="text-[9px] font-mono text-brand-cream/50">({app.submittedAt})</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span
                                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                      app.type === "Faced Difficulties"
                                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30 font-semibold"
                                        : "bg-cyan-400/20 text-cyan-200 border border-cyan-400/30"
                                    }`}
                                  >
                                    {app.displayType || app.type}
                                  </span>
                                  {app.type === "Faced Difficulties" && (
                                    <span className="text-[9px] font-mono text-amber-300/80 italic">
                                      Manual Review Required
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span
                                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                                  app.status === "Pending"
                                    ? "bg-amber-500/30 text-amber-200 border border-amber-500/50 animate-pulse"
                                    : app.status === "Approved"
                                    ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/50"
                                    : "bg-rose-500/30 text-rose-200 border border-rose-500/50"
                                }`}
                              >
                                {app.status === "Pending" ? "● Pending Review" : app.status}
                              </span>
                            </div>

                            <p className="text-xs text-brand-cream/85 my-2 leading-relaxed bg-black/25 p-2.5 rounded-lg border border-brand-cream/5">
                              {app.info}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-brand-cream/70 my-2">
                              <div>
                                <span className="text-brand-cream/40 block text-[9px]">CONTACT:</span>
                                <span>{app.phone}</span>
                              </div>
                              <div>
                                <span className="text-brand-cream/40 block text-[9px]">REQUESTED NEEDS:</span>
                                <span>{app.needs}</span>
                              </div>
                            </div>

                            {/* Uploaded Documents section */}
                            {app.documents && app.documents.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-brand-cream/10">
                                <span className="text-[9px] font-mono text-brand-cream/50 uppercase block mb-1">
                                  Supporting Documents Submitted:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {app.documents.map((docName: string, dIdx: number) => (
                                    <span
                                      key={dIdx}
                                      className="text-[10px] font-mono bg-black/40 text-brand-cream/90 px-2 py-1 rounded border border-brand-cream/10 flex items-center gap-1"
                                    >
                                      <FileText className="w-3 h-3 text-brand-olive" />
                                      <span>{docName}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Manual Action Buttons */}
                            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-brand-cream/10">
                              {app.status !== "Approved" && (
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, "Approved")}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-sans font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve Recipient</span>
                                </button>
                              )}

                              {app.status !== "Rejected" && (
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, "Rejected")}
                                  className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/30 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              )}

                              {app.status !== "Pending" && (
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, "Pending")}
                                  className="px-3 py-1.5 bg-black/40 hover:bg-black/60 text-brand-cream/70 rounded-full text-[11px] font-mono transition-all cursor-pointer"
                                >
                                  Revert to Pending
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* SETTINGS MODAL */}
              {activeTab === "settings" && (
                <div className="space-y-5 text-left">
                  <div className="flex items-center justify-between border-b border-brand-cream/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-brand-olive/20 text-brand-olive flex items-center justify-center border border-brand-olive/30">
                        <SettingsIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-serif text-brand-cream">Settings & Preferences</h3>
                        <p className="text-[10px] text-brand-cream/70 font-mono">Notification dispatching & alert subscriptions</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-white/10 text-brand-cream/80 px-2.5 py-1 rounded-full border border-brand-cream/15">
                      AidStory v2.6
                    </span>
                  </div>

                  {/* SECTION 1: PUSH NOTIFICATIONS TOGGLE SWITCH */}
                  <div className="bg-black/35 border border-brand-cream/20 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                          urgentPushEnabled 
                            ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 shadow-lg shadow-yellow-500/10" 
                            : "bg-white/5 text-brand-cream/40 border border-brand-cream/10"
                        }`}>
                          {urgentPushEnabled ? <BellRing className="w-5 h-5 animate-pulse" /> : <BellOff className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-brand-cream">
                              Push Notifications (Urgent Local Requests)
                            </h4>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                              urgentPushEnabled 
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                                : "bg-stone-500/20 text-stone-400 border border-stone-500/30"
                            }`}>
                              {urgentPushEnabled ? "ENABLED" : "PAUSED"}
                            </span>
                          </div>
                          <p className="text-xs text-brand-cream/75 leading-relaxed mt-1">
                            Push real-time alert notifications to members who subscribe to the requesting NGO/Charity when urgent local relief items are requested.
                          </p>
                        </div>
                      </div>

                      {/* Main Interactive Push Notification Toggle Switch */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={urgentPushEnabled}
                        onClick={() => handleToggleUrgentPush()}
                        className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          urgentPushEnabled ? "bg-yellow-400" : "bg-stone-600"
                        }`}
                        title={urgentPushEnabled ? "Disable push notifications" : "Enable push notifications"}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            urgentPushEnabled ? "translate-x-6 !bg-[#2c221a]" : "translate-x-0 !bg-stone-300"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Test alert trigger & state note */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-brand-cream/10 text-xs font-mono">
                      <span className="text-brand-cream/60 text-[11px] flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${urgentPushEnabled ? "bg-emerald-400 animate-ping" : "bg-stone-500"}`} />
                        {urgentPushEnabled ? "Actively listening for subscribed requests" : "Alerts muted"}
                      </span>

                      <button
                        type="button"
                        onClick={handleTriggerTestPushAlert}
                        className="bg-brand-cream/10 hover:bg-yellow-400 hover:text-[#2c221a] px-3 py-1.5 rounded-full text-[10px] font-bold text-brand-cream transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                        title="Simulate an urgent local request push alert"
                      >
                        <Radio className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                        <span>Simulate Push Alert 🔔</span>
                      </button>
                    </div>
                  </div>

                  {/* SECTION 2: SUBSCRIBED REQUESTERS LIST */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-cream flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-brand-olive" />
                          <span>Subscribed Organizations ({subscribedRequesters.length})</span>
                        </h4>
                        <p className="text-[11px] text-brand-cream/65 mt-0.5">
                          Only organizations you subscribe to will send you urgent local push alerts:
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {ALL_VERIFIED_REQUESTERS.map((org) => {
                        const isSubbed = subscribedRequesters.includes(org.name);
                        return (
                          <div
                            key={org.name}
                            className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                              isSubbed
                                ? "bg-amber-950/25 border-yellow-400/35 shadow-sm"
                                : "bg-black/20 border-brand-cream/10 hover:border-brand-cream/20"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xl select-none shrink-0">{org.avatar}</span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-brand-cream truncate">{org.name}</span>
                                  <span className="text-[9px] font-mono text-brand-olive bg-brand-cream/10 px-1.5 py-0.2 rounded">
                                    {org.location}
                                  </span>
                                </div>
                                <p className="text-[10px] text-brand-cream/60 truncate">{org.specialty}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleRequesterSubscription(org.name)}
                              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                                isSubbed
                                  ? "bg-yellow-400 text-[#2c221a] hover:bg-yellow-300 shadow"
                                  : "bg-white/10 hover:bg-white/20 text-brand-cream border border-brand-cream/20"
                              }`}
                            >
                              {isSubbed ? (
                                <>
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>Subscribed</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Subscribe</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 3: SYSTEM PREFERENCES SUMMARY */}
                  <div className="pt-2 border-t border-brand-cream/10 grid grid-cols-2 gap-2 text-[10px] font-mono text-brand-cream/60">
                    <div className="p-2.5 bg-black/20 rounded-xl border border-brand-cream/5 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-brand-olive" />
                      <span>Alert Chimes: Active</span>
                    </div>
                    <div className="p-2.5 bg-black/20 rounded-xl border border-brand-cream/5 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-brand-olive" />
                      <span>Auto Dispatch: Enabled</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}

        {/* FULLSCREEN CUSTOM APPLY AS PAGE (matching the screenshot exactly) */}
        {activeTab === "apply" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2c221a] text-[#f4efe5] flex flex-col justify-between overflow-y-auto p-6 md:p-12 selection:bg-brand-olive selection:text-brand-dark"
          >
            {/* Inner Content Wrapper */}
            <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col justify-between">
              
              {/* Top Navigation Row */}
              <div className="flex items-start gap-6 w-full mb-8">
                <button
                  onClick={() => {
                    setActiveTab(null);
                    setApplyFormType(null);
                  }}
                  className="text-[#f4efe5]/80 hover:text-white transition-colors text-3xl font-mono cursor-pointer select-none -mt-1 hover:scale-110 active:scale-90"
                  title="Go Back"
                >
                  &lt;
                </button>
                <h2 className="text-4xl md:text-7xl font-serif italic text-[#f4efe5] leading-none select-none font-normal">
                  Apply As...
                </h2>
              </div>

              {/* Three Cards Responsive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-auto py-8">
                
                {/* CARD 1: Need Helps? */}
                <div 
                  className="group bg-[#352a21]/60 border border-[#f4efe5]/15 text-[#f4efe5] hover:bg-[#fcfaf2] hover:text-[#2c221a] transition-all duration-300 rounded-3xl p-8 flex flex-col justify-between shadow-lg hover:scale-[1.02] hover:shadow-2xl h-full min-h-[420px] cursor-pointer"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
                      Need Helps?
                    </h3>
                    <div className="space-y-4 text-sm md:text-base leading-relaxed">
                      <p>Apply and verify as recipients to share your needs.</p>
                      <p>If you’re NGO, we will verify you through registration number.</p>
                      <p>If you’re OKU or faced difficulties, verified through supporting details.</p>
                      <p className="text-[#f4efe5]/50 group-hover:text-[#2c221a]/50 text-xs md:text-sm font-light mt-6 transition-colors">
                        The verification process may take more than 3 days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-[#f4efe5]/10 group-hover:border-[#2c221a]/10 transition-colors">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setApplyFormType("recipient");
                      }}
                      className="w-full bg-gradient-to-r from-cyan-400 to-yellow-300 hover:from-yellow-300 hover:to-cyan-400 text-[#2c221a] py-3.5 px-6 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                    >
                      Apply As Recipients
                    </button>
                  </div>
                </div>

                {/* CARD 2: Interested to help more? */}
                <div 
                  className="group bg-[#352a21]/60 border border-[#f4efe5]/15 text-[#f4efe5] hover:bg-[#fcfaf2] hover:text-[#2c221a] transition-all duration-300 rounded-3xl p-8 flex flex-col justify-between shadow-lg hover:scale-[1.02] hover:shadow-2xl h-full min-h-[420px] cursor-pointer"
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
                      Interested to help more?
                    </h3>
                    <div className="space-y-4 text-sm md:text-base leading-relaxed">
                      <p>Apply and verify as a volunteer to help other people more.</p>
                      <p>It is necessary to have your own transport.</p>
                      <p className="text-[#f4efe5]/50 group-hover:text-[#2c221a]/50 text-xs md:text-sm font-light mt-6 transition-colors">
                        You will receive some delivery requests from your area. You can choose to accept or reject the requests.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#f4efe5]/10 group-hover:border-[#2c221a]/10 transition-colors">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setApplyFormType("volunteer");
                      }}
                      className="w-full bg-gradient-to-r from-cyan-400 to-yellow-300 hover:from-yellow-300 hover:to-cyan-400 text-[#2c221a] py-3.5 px-6 rounded-full font-sans font-bold text-sm shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                    >
                      Apply As Logistics Volunteer
                    </button>
                  </div>
                </div>

                {/* CARD 3: More Details */}
                <div 
                  className="group bg-[#352a21]/60 border border-[#f4efe5]/15 text-[#f4efe5] hover:bg-[#fcfaf2] hover:text-[#2c221a] transition-all duration-300 rounded-3xl p-8 flex flex-col justify-start shadow-lg hover:scale-[1.02] hover:shadow-2xl h-full min-h-[420px] cursor-pointer"
                >
                  <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-8">
                    More Details
                  </h3>
                  
                  <div className="space-y-8">
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-wider text-[#f4efe5]/50 group-hover:text-[#2c221a]/50 font-mono block transition-colors">
                        Phone
                      </span>
                      <p className="text-xl md:text-2xl font-serif text-[#f4efe5] group-hover:text-[#2c221a] transition-colors font-medium">
                        (123) 456-7890
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-wider text-[#f4efe5]/50 group-hover:text-[#2c221a]/50 font-mono block transition-colors">
                        Email
                      </span>
                      <p className="text-xl md:text-2xl font-serif text-[#f4efe5] group-hover:text-[#2c221a] transition-colors font-medium break-all">
                        abc@gmail.com
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Copyright */}
              <footer className="w-full text-center mt-8 text-xs text-[#f4efe5]/40 font-light border-t border-[#f4efe5]/10 pt-4">
                <p>© 2026 AidStory. All rights reserved.</p>
              </footer>

            </div>

            {/* INTERACTIVE FORM DIALOG OVERLAYS */}
            <AnimatePresence>
              {applyFormType && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setApplyFormType(null)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  />

                  {/* Form Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-lg bg-[#395244] p-6 md:p-8 rounded-2xl border border-[#f4efe5]/20 shadow-2xl z-10 text-[#f4efe5] max-h-[90vh] overflow-y-auto animate-fadeIn"
                  >
                    <button
                      onClick={() => setApplyFormType(null)}
                      className="absolute top-4 right-4 text-[#f4efe5]/75 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* RECIPIENT REGISTRATION */}
                    {applyFormType === "recipient" && (
                      <div className="space-y-4 text-left">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-brand-olive" />
                          <h3 className="text-xl font-serif text-[#f4efe5]">Recipient Verification</h3>
                        </div>

                        {recipientSuccess ? (
                          <div className="text-center py-8 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#82afa6]/20 text-[#82afa6] flex items-center justify-center mx-auto border border-[#82afa6]/30 animate-scaleUp">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h4 className="font-serif text-lg text-white">Application Submitted!</h4>
                            <p className="text-xs text-[#f4efe5]/75 max-w-xs mx-auto">
                              Your application as {recipientType} has been submitted and is pending review and approval by an admin.
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleApplyRecipient} className="space-y-3">
                            <p className="text-xs text-[#f4efe5]/80">Please submit your identification details to verify recipient status:</p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Full Name *</label>
                              <input
                                type="text"
                                required
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Recipient Type *</label>
                              <select
                                value={recipientType}
                                onChange={(e) => setRecipientType(e.target.value)}
                                className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              >
                                <option value="NGO Representative">NGO Representative</option>
                                <option value="OKU Individual">OKU Individual</option>
                                <option value="Faced Difficulties">General Community in Need</option>
                              </select>
                            </div>

                            {recipientType !== "Faced Difficulties" && (
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">
                                  {recipientType === "NGO Representative" ? "NGO Registration Number *" : "Supporting identification / Card number *"}
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={recipientInfo}
                                  onChange={(e) => setRecipientInfo(e.target.value)}
                                  placeholder={recipientType === "NGO Representative" ? "e.g. PPM-012-08-XXXXXXXX" : "e.g. OKU registration card or MyKad number"}
                                  className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                                />
                              </div>
                            )}

                            {/* Conditional file uploader for General Community in Need (Faced Difficulties) */}
                            {recipientType === "Faced Difficulties" && (
                              <div className="space-y-2 mt-2">
                                <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase block">
                                  Upload Supporting Documents (Income Statement / Utility Bill) *
                                </label>
                                
                                <div
                                  onDragEnter={handleDrag}
                                  onDragOver={handleDrag}
                                  onDragLeave={handleDrag}
                                  onDrop={handleDrop}
                                  className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[110px] ${
                                    dragActive 
                                      ? "border-brand-olive bg-[#1d2d24] scale-[1.01]" 
                                      : "border-[#f4efe5]/25 bg-[#203026] hover:border-[#82afa6]/50"
                                  }`}
                                >
                                  <input
                                    type="file"
                                    id="recipient-doc-input"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  />
                                  
                                  <Upload className={`w-6 h-6 mb-1.5 transition-colors ${dragActive ? "text-brand-olive animate-bounce" : "text-[#f4efe5]/50"}`} />
                                  
                                  <p className="text-[11px] text-[#f4efe5]/90 font-medium leading-relaxed">
                                    Drag & drop documents here, or{" "}
                                    <label htmlFor="recipient-doc-input" className="text-brand-olive hover:underline cursor-pointer font-bold">
                                      browse files
                                    </label>
                                  </p>
                                  <p className="text-[9px] text-[#f4efe5]/50 mt-1">
                                    Supports PDF, Word, Images up to 10MB
                                  </p>
                                </div>

                                {/* Display selected files */}
                                {recipientDocuments.length > 0 && (
                                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                                    {recipientDocuments.map((doc) => (
                                      <div 
                                        key={doc.id} 
                                        className="flex items-center justify-between bg-[#1e2a22] border border-[#f4efe5]/10 rounded-lg p-2 text-xs transition-all hover:bg-[#233228]"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          {doc.url ? (
                                            <img 
                                              src={doc.url} 
                                              alt="thumbnail" 
                                              className="w-7 h-7 object-cover rounded border border-[#f4efe5]/20 flex-shrink-0" 
                                              referrerPolicy="no-referrer"
                                            />
                                          ) : (
                                            <FileText className="w-5 h-5 text-brand-olive flex-shrink-0" />
                                          )}
                                          <div className="min-w-0">
                                            <p className="font-medium text-[#f4efe5] truncate text-[11px] max-w-[180px]">
                                              {doc.name}
                                            </p>
                                            <p className="text-[9px] text-[#f4efe5]/50">
                                              {doc.size}
                                            </p>
                                          </div>
                                        </div>
                                        
                                        <button
                                          type="button"
                                          onClick={() => removeDocument(doc.id)}
                                          className="text-[#f4efe5]/60 hover:text-red-400 p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                                          title="Remove File"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Contact Phone Number *</label>
                              <input
                                type="tel"
                                required
                                value={recipientPhone}
                                onChange={(e) => setRecipientPhone(e.target.value)}
                                placeholder="e.g. +60 12-3456789"
                                className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Primary Assistance Needed *</label>
                              <textarea
                                required
                                rows={3}
                                value={recipientNeeds}
                                onChange={(e) => setRecipientNeeds(e.target.value)}
                                placeholder="e.g. Food staples, baby formula, medical supplies..."
                                className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={recipientType === "Faced Difficulties" && recipientDocuments.length === 0}
                              className={`w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors mt-2 cursor-pointer ${
                                recipientType === "Faced Difficulties" && recipientDocuments.length === 0
                                  ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-60"
                                  : "bg-brand-olive hover:bg-[#ffee1a] text-brand-dark"
                              }`}
                            >
                              {recipientType === "Faced Difficulties" && recipientDocuments.length === 0
                                ? "Please Upload Supporting Document"
                                : "Submit Verification Form"}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* LOGISTICS VOLUNTEER REGISTRATION */}
                    {applyFormType === "volunteer" && (
                      <div className="space-y-4 text-left">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-brand-olive" />
                          <h3 className="text-xl font-serif text-[#f4efe5]">Logistics Volunteer Registration</h3>
                        </div>

                        {volunteerSuccess ? (
                          <div className="text-center py-8 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#82afa6]/20 text-[#82afa6] flex items-center justify-center mx-auto border border-[#82afa6]/30 animate-scaleUp">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h4 className="font-serif text-lg text-white">Application Received!</h4>
                            <p className="text-xs text-[#f4efe5]/75 max-w-xs mx-auto">
                              Thank you for volunteering! Your registration as a logistics dispatch volunteer has been received. Let's make a difference together.
                            </p>
                          </div>
                        ) : (
                          <form onSubmit={handleApplyLogisticsVolunteer} className="space-y-3">
                            <p className="text-xs text-[#f4efe5]/80">Please submit details to register as an active logistics driver or depot packer:</p>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Full Name *</label>
                              <input
                                type="text"
                                required
                                value={volName}
                                onChange={(e) => setVolName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Own transport capability *</label>
                              <select
                                value={volTransport}
                                onChange={(e) => setVolTransport(e.target.value)}
                                className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              >
                                <option value="Yes, car/van">Yes, I have my own car/van</option>
                                <option value="Yes, motorcycle">Yes, I have my own motorcycle</option>
                                <option value="No, depot packer">No, but I can assist in depot packing / sorting</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Volunteer Role Interest *</label>
                              <select
                                value={volunteerRole}
                                onChange={(e) => setVolunteerRole(e.target.value)}
                                className="w-full bg-[#24352b] border border-brand-cream/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              >
                                <option value="Dispatch Driver">Dispatch Driver (Transporter)</option>
                                <option value="Sorter">Depot Sorter & Package Packer</option>
                                <option value="Community Coordinator">Community Coordinator</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Contact Phone Number *</label>
                              <input
                                type="tel"
                                required
                                value={volPhone}
                                onChange={(e) => setVolPhone(e.target.value)}
                                placeholder="e.g. +60 12-3456789"
                                className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono text-[#f4efe5]/70 uppercase">Brief experience / Motivation *</label>
                              <textarea
                                required
                                rows={3}
                                value={volunteerExperience}
                                onChange={(e) => setVolunteerExperience(e.target.value)}
                                placeholder="Tell us if you have similar experience, or what motivates you..."
                                className="w-full bg-[#24352b] border border-[#f4efe5]/15 rounded-lg px-3.5 py-2 text-xs text-[#f4efe5] focus:outline-none focus:border-[#82afa6]"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-brand-olive hover:bg-[#ffee1a] text-brand-dark rounded-full font-bold text-xs uppercase tracking-wider transition-colors mt-2 cursor-pointer"
                            >
                              Submit Volunteer Application
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* LOCKED POST REQUEST POPUP OVERLAY */}
      <AnimatePresence>
        {isPostLockedModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPostLockedModalOpen(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-[360px] sm:max-w-[400px] bg-[#423a31] p-8 md:p-9 rounded-[28px] border border-white/10 shadow-2xl z-10 text-center text-[#f4efe5]"
            >
              {/* Close 'x' Button */}
              <button
                onClick={() => setIsPostLockedModalOpen(false)}
                className="absolute top-4 right-5 text-white/70 hover:text-white transition-colors text-base font-mono cursor-pointer p-1 rounded-full hover:bg-white/10 flex items-center justify-center min-w-[32px] min-h-[32px]"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Lock Logo Illustration */}
              <div className="relative w-28 h-28 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Shackle */}
                  <path
                    d="M 32 46 V 32 C 32 21 40 14 50 14 C 60 14 68 21 68 32 V 46"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Lock Body */}
                  <rect
                    x="22"
                    y="42"
                    width="56"
                    height="46"
                    rx="12"
                    fill="#ff8800"
                    stroke="#cc6600"
                    strokeWidth="3.5"
                  />
                  {/* Keyhole */}
                  <circle cx="50" cy="61" r="5" fill="#423a31" />
                  <path d="M 48 64 L 46 75 H 54 L 52 64 Z" fill="#423a31" />
                </svg>
              </div>

              {/* Title & Subtitle matching image.png */}
              <h3 className="text-2xl md:text-3xl font-serif text-[#f4efe5] font-medium tracking-tight mb-2">
                Locked.
              </h3>
              <p className="text-sm md:text-base text-[#f4efe5]/85 font-sans mb-6 leading-relaxed">
                Verify as recipient to unlock it.
              </p>

              {/* Action Button */}
              <button
                onClick={() => {
                  setIsPostLockedModalOpen(false);
                  setActiveTab("apply");
                  setApplyFormType("recipient");
                }}
                className="w-full sm:w-auto px-9 py-3 bg-[#ff5500] hover:bg-[#ff6600] text-white font-bold text-sm md:text-base rounded-full shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer mx-auto block"
              >
                Apply Now
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANAGE SUBSCRIBED REQUESTERS MODAL */}
      <AnimatePresence>
        {showManageSubscriptionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManageSubscriptionsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#352a21] p-6 md:p-7 rounded-3xl border border-brand-cream/20 shadow-2xl z-10 text-brand-cream max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowManageSubscriptionsModal(false)}
                className="absolute top-4 right-4 text-brand-cream/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 border-b border-brand-cream/10 pb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/20 text-yellow-300 flex items-center justify-center border border-yellow-400/30">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-brand-cream">Subscribed Requesters</h3>
                    <p className="text-[11px] font-mono text-brand-cream/70">
                      Manage organizations whose urgent local requests trigger push alerts
                    </p>
                  </div>
                </div>

                {/* Status bar */}
                <div className="p-3 bg-black/30 border border-brand-cream/15 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${urgentPushEnabled ? "bg-emerald-400 animate-ping" : "bg-stone-500"}`} />
                    <span>Push System: {urgentPushEnabled ? "ACTIVE" : "PAUSED"}</span>
                  </div>
                  <button
                    onClick={() => handleToggleUrgentPush()}
                    className="text-[#ffee1a] underline hover:text-yellow-300 cursor-pointer text-[11px]"
                  >
                    {urgentPushEnabled ? "Disable Push" : "Enable Push"}
                  </button>
                </div>

                {/* List of Verified Requesters */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {ALL_VERIFIED_REQUESTERS.map((org) => {
                    const isSubbed = subscribedRequesters.includes(org.name);
                    return (
                      <div
                        key={org.name}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isSubbed
                            ? "bg-amber-950/20 border-yellow-400/40 shadow-sm"
                            : "bg-black/25 border-brand-cream/10 hover:border-brand-cream/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl select-none pt-0.5">{org.avatar}</span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-brand-cream">{org.name}</h4>
                              <span className="text-[9px] font-mono text-brand-olive bg-brand-cream/10 px-2 py-0.5 rounded-full">
                                {org.location}
                              </span>
                            </div>
                            <p className="text-[10px] text-brand-cream/70 mt-0.5">{org.specialty}</p>
                            {org.activeUrgentNeed && (
                              <p className="text-[9px] font-mono text-yellow-300 mt-1 flex items-center gap-1">
                                <span className="text-rose-400 font-bold">● Urgent Request:</span> {org.activeUrgentNeed}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleRequesterSubscription(org.name)}
                          className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                            isSubbed
                              ? "bg-yellow-400 text-[#2c221a] hover:bg-yellow-300 shadow"
                              : "bg-white/10 hover:bg-white/20 text-brand-cream border border-brand-cream/20"
                          }`}
                        >
                          {isSubbed ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Subscribed</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Subscribe</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-brand-cream/10 text-center">
                  <button
                    onClick={() => setShowManageSubscriptionsModal(false)}
                    className="px-6 py-2 bg-brand-cream/10 hover:bg-brand-cream/20 text-brand-cream rounded-full font-mono text-xs cursor-pointer transition-colors"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING LIVE URGENT PUSH NOTIFICATION TOAST BANNER */}
      <AnimatePresence>
        {activePushToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-lg bg-[#2c1d11] border-2 border-yellow-400 rounded-3xl p-4 shadow-2xl text-brand-cream backdrop-blur-md"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 animate-bounce">
                <BellRing className="w-5 h-5" />
              </div>

              <div className="flex-grow space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-rose-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                    🚨 URGENT LOCAL REQUEST
                  </span>
                  <span className="text-[10px] font-mono text-brand-cream/50">Just now</span>
                </div>

                <h4 className="text-xs font-bold text-[#ffee1a] leading-tight">
                  {activePushToast.requesterName}
                </h4>

                <p className="text-xs font-semibold text-brand-cream">
                  "{activePushToast.itemTitle}"
                </p>

                <p className="text-[11px] text-brand-cream/80 leading-relaxed line-clamp-2">
                  {activePushToast.description}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      const req = activePushToast.requestObj || DEFAULT_NEEDS_REQUESTS[0];
                      setSelectedDetailRequest(req);
                      setActivePushToast(null);
                    }}
                    className="flex-grow py-1.5 px-3 bg-yellow-400 hover:bg-yellow-300 text-[#2c221a] font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer shadow"
                  >
                    <span>View Item Details & Pledge</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActivePushToast(null)}
                    className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-brand-cream font-mono text-xs rounded-full transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActivePushToast(null)}
                className="text-brand-cream/50 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK STATUS TOAST NOTIFICATION */}
      <AnimatePresence>
        {pushToggleToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[90%] bg-[#241a12] text-brand-cream border border-yellow-400/50 p-3 px-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-mono"
          >
            <span className="text-lg">📢</span>
            <span className="flex-grow leading-relaxed">{pushToggleToast}</span>
            <button
              onClick={() => setPushToggleToast("")}
              className="text-brand-cream/60 hover:text-brand-cream p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REQUEST DETAIL MODAL (when triggered from push alerts) */}
      <AnimatePresence>
        {selectedDetailRequest && (
          <RequestDetailModal
            request={selectedDetailRequest}
            onClose={() => setSelectedDetailRequest(null)}
            onPledge={handlePledgeNeed}
            isPledged={pledgedItems.includes(selectedDetailRequest.title)}
            onNavigate={(viewId) => {
              setSelectedDetailRequest(null);
              navigateToView(viewId);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
