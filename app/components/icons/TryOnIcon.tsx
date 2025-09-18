import React from 'react';

export const TryOnIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <circle cx="12" cy="14" r="3" />
    <path d="M2 7l4.5-4.5" />
    <path d="M22 7l-4.5-4.5" />
  </svg>
);
