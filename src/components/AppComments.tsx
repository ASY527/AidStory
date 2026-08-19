import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { FeedbackComment } from "../types";

interface AppCommentsProps {
  navigateToView: (view: "home" | "comments" | "explore" | "main_menu") => void;
  feedbackList: FeedbackComment[];
  onAddComment: (name: string, email: string, comment: string) => void;
}

export default function AppComments({ navigateToView, feedbackList, onAddComment }: AppCommentsProps) {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formComment, setFormComment] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) {
      alert("Please fill in your name and comment.");
      return;
    }

    onAddComment(formName, formEmail, formComment);

    setFormName("");
    setFormEmail("");
    setFormComment("");
    
    setNotification("Your comments and thoughts have been added locally! Thank you.");
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-brand-deep-dark flex flex-col justify-between selection:bg-brand-olive selection:text-brand-dark animate-fadeIn">
      {/* Main Top Bar Navigation */}
      <header className="border-b border-brand-cream/10 bg-brand-dark/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => {
              const isLogged = localStorage.getItem("aidstory_current_user");
              if (isLogged) {
                navigateToView("main_menu");
              } else {
                navigateToView("home");
              }
            }}
            className="group flex items-center gap-2.5 text-xs font-mono font-medium uppercase tracking-wider text-brand-text-muted hover:text-[#c5dc80] transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text-muted group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-olive animate-pulse" />
            <span className="text-xs font-mono tracking-widest uppercase font-semibold text-brand-cream">AidStory</span>
          </div>
        </div>
      </header>

      {/* Standalone Comments Page Content */}
      <main className="flex-grow py-16 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Editorial Headers and Form */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-brand-olive/15 text-brand-olive px-3.5 py-1.5 rounded-full border border-brand-olive/30 inline-block">
              Donor Stories & Feedback
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-brand-cream tracking-tight">
              Words of Hope
            </h1>
            <p className="text-sm font-baskerville text-brand-text-muted leading-relaxed font-light">
              Every donor has a story, and every story begins with you. We invite you to read the words of hope from our community or leave your own thoughts.
            </p>
          </div>

          {/* Leave your comment card */}
          <div className="bg-[#2c221a]/60 border border-brand-cream/10 rounded-2xl p-6 md:p-8 space-y-5 shadow-xl">
            <div>
              <h4 className="font-serif text-xl italic text-[#c5dc80]">Leave your words</h4>
              <p className="text-xs text-brand-text-muted mt-1 leading-relaxed">
                Share your ideas, story, or words of encouragement with our community of donors and recipients.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {notification && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-brand-olive/15 border border-brand-olive/30 text-brand-olive text-xs rounded-lg flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{notification}</span>
                </motion.div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-brand-text-muted uppercase tracking-wide">Your Name *</label>
                <input 
                  type="text" 
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-brand-dark/80 border border-brand-cream/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-brand-olive focus:ring-1 focus:ring-brand-olive/30 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-brand-text-muted uppercase tracking-wide">Your Email</label>
                <input 
                  type="email" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full bg-brand-dark/80 border border-brand-cream/10 rounded-lg px-3.5 py-2.5 text-xs text-brand-cream focus:outline-none focus:border-brand-olive focus:ring-1 focus:ring-brand-olive/30 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-brand-text-muted uppercase tracking-wide">Message / Comments *</label>
                <textarea 
                  rows={4}
                  required
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Tell us what you think..."
                  className="w-full bg-brand-dark/80 border border-brand-cream/10 rounded-lg p-3.5 text-xs text-brand-cream focus:outline-none focus:border-brand-olive focus:ring-1 focus:ring-brand-olive/30 transition-colors resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#c5dc80] hover:bg-[#b2c86e] text-[#2c221a] font-sans font-bold uppercase tracking-wider py-3 rounded-lg transition-all duration-200 text-xs min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#c5dc80]/10"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Story</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Grid of Comments */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-baseline border-b border-brand-cream/10 pb-4">
            <h3 className="font-serif text-2xl italic text-brand-cream font-light">
              Community Voices
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#c5dc80] bg-[#c5dc80]/10 px-2.5 py-0.5 rounded-full border border-[#c5dc80]/20">
                {feedbackList.length} {feedbackList.length === 1 ? "story" : "stories"}
              </span>
            </div>
          </div>

          {/* Feed List or Empty State */}
          {feedbackList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] lg:max-h-[85vh] overflow-y-auto pr-1">
              {feedbackList.map((item) => (
                <div key={item.id} className="p-5 bg-[#2c221a]/30 rounded-2xl border border-brand-cream/5 space-y-3.5 text-left flex flex-col justify-between hover:border-brand-cream/10 transition-colors duration-200 animate-fadeIn">
                  <p className="text-sm font-light text-brand-text-muted leading-relaxed italic">
                    "{item.comment}"
                  </p>
                  <div className="pt-2 border-t border-brand-cream/5 flex justify-between items-end">
                    <div>
                      <h5 className="font-sans font-medium text-brand-cream text-xs">{item.name}</h5>
                      {item.email && <p className="text-[9px] font-mono text-brand-text-muted/60">{item.email}</p>}
                    </div>
                    <span className="text-[9px] font-mono text-brand-text-muted/40 shrink-0">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-brand-cream/15 rounded-2xl p-10 text-center space-y-3 bg-[#2c221a]/10">
              <p className="text-sm font-light text-brand-text-muted">No stories shared yet in this browser.</p>
              <p className="text-xs text-brand-text-muted/50 leading-relaxed">
                Be the first to leave a message or share your thoughts using the form on the left!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Dedicated Comments View Footer */}
      <footer className="bg-brand-deep-dark py-8 px-6 text-center border-t border-brand-cream/5 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-mono text-brand-text-muted/50">
          <p>© 2026 AidStory. All rights reserved.</p>
          <div className="flex gap-4">
            <button onClick={() => navigateToView("home")} className="hover:text-[#c5dc80] transition-colors cursor-pointer">Home Page</button>
            <span>•</span>
            <span className="hover:text-brand-olive transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-brand-olive transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
