import React from "react";

const TopBar = () => {
  return (
    <div className="h-10 w-full bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Left Section: Locale */}
        <div className="flex items-center gap-4">
          <span className="cursor-pointer hover:text-primary transition" style={{ color: 'var(--primary-color)' }}>
            🇺🇸 US
          </span>
          <span className="cursor-pointer hover:text-primary transition" style={{ color: 'var(--primary-color)' }}>
            English
          </span>
          <span className="cursor-pointer hover:text-primary transition" style={{ color: 'var(--primary-color)' }}>
            $ USD
          </span>
        </div>

        {/* Center: Date + Location */}
        <div className="hidden md:flex items-center text-gray-500 dark:text-gray-400">
          <span className="mr-4">Tuesday, July 22, 2025</span>
          <span className="text-green-600 dark:text-green-400 text-xs">📍 Your Location</span>
        </div>

        {/* Right Section: Links */}
        <div className="flex items-center gap-4">
          <a href="/account" className="hover:text-primary transition" style={{ color: 'var(--primary-color)' }}>My Account</a>
          <a href="/contact" className="hover:text-primary transition" style={{ color: 'var(--primary-color)' }}>Contact</a>
          <a href="/notifications" className="relative hover:text-primary transition" style={{ color: 'var(--primary-color)' }}>
            Notifications
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] px-1 rounded-full">2</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="cursor-pointer hover:text-primary transition" style={{ color: 'var(--primary-color)' }}>🎨 Color</span>
            <span className="cursor-pointer hover:text-primary transition" style={{ color: 'var(--primary-color)' }}>🌙 Dark</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;