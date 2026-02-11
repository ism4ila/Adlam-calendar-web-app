import type { ClockSkin } from '../types/settings';

export interface ClockSkinColors {
  face: string;
  faceDark: string;
  border: string;
  borderDark: string;
  hourHand: string;
  minuteHand: string;
  secondHand: string;
  centerDot: string;
  hourMarker: string;
  hourMarkerMajor: string;
  numerals: string;
  numeralsDark: string;
}

export interface ClockSkinMeta {
  id: ClockSkin;
  name: string;
  colors: ClockSkinColors;
}

export const clockSkins: ClockSkinMeta[] = [
  {
    id: 'classic',
    name: 'Classic',
    colors: {
      face: 'from-amber-50 to-orange-100',
      faceDark: 'from-gray-800 to-gray-900',
      border: 'border-amber-200',
      borderDark: 'border-amber-900',
      hourHand: '#92400e',
      minuteHand: '#d97706',
      secondHand: '#dc2626',
      centerDot: 'bg-amber-800',
      hourMarker: 'bg-amber-400',
      hourMarkerMajor: 'bg-amber-600',
      numerals: 'text-amber-900',
      numeralsDark: 'text-amber-100',
    },
  },
  {
    id: 'nomad',
    name: 'Nomad',
    colors: {
      face: 'from-stone-100 to-amber-100',
      faceDark: 'from-stone-800 to-stone-900',
      border: 'border-stone-300',
      borderDark: 'border-stone-700',
      hourHand: '#78716c',
      minuteHand: '#a8a29e',
      secondHand: '#ef4444',
      centerDot: 'bg-stone-700',
      hourMarker: 'bg-stone-300',
      hourMarkerMajor: 'bg-stone-500',
      numerals: 'text-stone-800',
      numeralsDark: 'text-stone-200',
    },
  },
  {
    id: 'royal',
    name: 'Royal',
    colors: {
      face: 'from-gray-100 to-gray-200',
      faceDark: 'from-gray-950 to-black',
      border: 'border-yellow-500',
      borderDark: 'border-yellow-600',
      hourHand: '#ca8a04',
      minuteHand: '#eab308',
      secondHand: '#fbbf24',
      centerDot: 'bg-yellow-600',
      hourMarker: 'bg-yellow-300',
      hourMarkerMajor: 'bg-yellow-500',
      numerals: 'text-gray-900',
      numeralsDark: 'text-yellow-400',
    },
  },
  {
    id: 'lewru',
    name: 'Lewru',
    colors: {
      face: 'from-blue-50 to-indigo-100',
      faceDark: 'from-blue-950 to-indigo-950',
      border: 'border-blue-300',
      borderDark: 'border-blue-800',
      hourHand: '#1e40af',
      minuteHand: '#3b82f6',
      secondHand: '#93c5fd',
      centerDot: 'bg-blue-700',
      hourMarker: 'bg-blue-200',
      hourMarkerMajor: 'bg-blue-400',
      numerals: 'text-blue-900',
      numeralsDark: 'text-blue-200',
    },
  },
  {
    id: 'metal',
    name: 'Metal',
    colors: {
      face: 'from-gray-200 to-gray-300',
      faceDark: 'from-gray-800 to-gray-900',
      border: 'border-gray-400',
      borderDark: 'border-gray-600',
      hourHand: '#374151',
      minuteHand: '#6b7280',
      secondHand: '#ef4444',
      centerDot: 'bg-gray-600',
      hourMarker: 'bg-gray-400',
      hourMarkerMajor: 'bg-gray-600',
      numerals: 'text-gray-800',
      numeralsDark: 'text-gray-200',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      face: 'from-white to-gray-50',
      faceDark: 'from-gray-900 to-gray-950',
      border: 'border-gray-200',
      borderDark: 'border-gray-800',
      hourHand: '#111827',
      minuteHand: '#374151',
      secondHand: '#f59e0b',
      centerDot: 'bg-gray-800',
      hourMarker: 'bg-gray-200',
      hourMarkerMajor: 'bg-gray-400',
      numerals: 'text-gray-700',
      numeralsDark: 'text-gray-300',
    },
  },
  {
    id: 'sahel',
    name: 'Sahel',
    colors: {
      face: 'from-orange-50 to-red-100',
      faceDark: 'from-orange-950 to-red-950',
      border: 'border-orange-300',
      borderDark: 'border-orange-800',
      hourHand: '#c2410c',
      minuteHand: '#ea580c',
      secondHand: '#fbbf24',
      centerDot: 'bg-orange-700',
      hourMarker: 'bg-orange-300',
      hourMarkerMajor: 'bg-orange-500',
      numerals: 'text-orange-900',
      numeralsDark: 'text-orange-200',
    },
  },
  {
    id: 'fouta',
    name: 'Fouta',
    colors: {
      face: 'from-green-50 to-emerald-100',
      faceDark: 'from-green-950 to-emerald-950',
      border: 'border-green-400',
      borderDark: 'border-green-800',
      hourHand: '#166534',
      minuteHand: '#22c55e',
      secondHand: '#fbbf24',
      centerDot: 'bg-green-700',
      hourMarker: 'bg-green-300',
      hourMarkerMajor: 'bg-green-500',
      numerals: 'text-green-900',
      numeralsDark: 'text-green-200',
    },
  },
  {
    id: 'digital_adlam',
    name: 'Digital Adlam',
    colors: {
      face: 'from-gray-900 to-black',
      faceDark: 'from-gray-950 to-black',
      border: 'border-green-500',
      borderDark: 'border-green-600',
      hourHand: '#22c55e',
      minuteHand: '#4ade80',
      secondHand: '#86efac',
      centerDot: 'bg-green-500',
      hourMarker: 'bg-green-800',
      hourMarkerMajor: 'bg-green-500',
      numerals: 'text-green-400',
      numeralsDark: 'text-green-400',
    },
  },
];

export const getClockSkin = (id: ClockSkin): ClockSkinMeta => {
  return clockSkins.find(s => s.id === id) ?? clockSkins[0];
};
