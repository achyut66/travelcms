import React from "react";

export default function NotificationBadge({ count = 0 }) {
  return (
    <div className="relative inline-block">
      {/* Bell or any icon */}
      <svg
        className="w-8 h-8 text-gray-700"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M15 17h5l-1.405-1.405C18.79 15.21 18 13.7 18 12V9a6 6 0 00-12 0v3c0 1.7-.79 3.21-1.595 3.595L3 17h5m4 0v1a2 2 0 11-4 0v-1h4z" />
      </svg>

      {/* Red notification bubble */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
}
