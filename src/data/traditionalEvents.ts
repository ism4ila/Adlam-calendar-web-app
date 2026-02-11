import type { SupportedLanguage } from '../types/settings';

export type TraditionalEvent = {
  id: string;
  month: number;
  day: number;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
};

export const traditionalEvents: TraditionalEvent[] = [
  {
    id: 'fulfulde-festival',
    month: 2,
    day: 5,
    title: {
      en: 'Fulfulde Cultural Festival',
      fr: 'FÃªte traditionnelle Fulfulde',
      ar: 'Ù…Ù‡Ø±Ø¬Ø§Ù† Ø«Ù‚Ø§ÙÙŠ ÙÙˆÙ„ÙÙ„Ø¯ÙŠ',
      adlam: 'Fulfulde Cultural Festival',
    },
    description: {
      en: 'Celebration of Fulfulde heritage, music, and storytelling.',
      fr: 'CÃ©lÃ©bration du patrimoine Fulfulde, musique et contes.',
      ar: 'Ø§Ø­ØªÙØ§Ù„ Ø¨Ø§Ù„ØªØ±Ø§Ø« Ø§Ù„ÙÙˆÙ„ÙÙ„Ø¯ÙŠ ÙˆØ§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ ÙˆØ§Ù„Ø­ÙƒØ§ÙŠØ§Øª.',
      adlam: 'Celebration of Fulfulde heritage, music, and storytelling.',
    },
  },
  {
    id: 'rainy-season',
    month: 5,
    day: 20,
    title: {
      en: 'Start of the Rainy Season',
      fr: 'DÃ©but de la saison des pluies',
      ar: 'Ø¨Ø¯Ø§ÙŠØ© Ù…ÙˆØ³Ù… Ø§Ù„Ø£Ù…Ø·Ø§Ø±',
      adlam: 'Start of the Rainy Season',
    },
    description: {
      en: 'Traditional marker for the new agricultural cycle.',
      fr: 'RepÃ¨re traditionnel pour le nouveau cycle agricole.',
      ar: 'Ø¹Ù„Ø§Ù…Ø© ØªÙ‚Ù„ÙŠØ¯ÙŠØ© Ù„Ø¨Ø¯Ø§ÙŠØ© Ø§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ø²Ø±Ø§Ø¹ÙŠØ©.',
      adlam: 'Traditional marker for the new agricultural cycle.',
    },
  },
  {
    id: 'transhumance',
    month: 8,
    day: 12,
    title: {
      en: 'Transhumance of Livestock',
      fr: 'Transhumance du bÃ©tail',
      ar: 'Ø§Ù„ØªØ±Ø­Ø§Ù„ Ø§Ù„Ù…ÙˆØ³Ù…ÙŠ Ù„Ù„Ù…Ø§Ø´ÙŠØ©',
      adlam: 'Transhumance of Livestock',
    },
    description: {
      en: 'Seasonal movement to new grazing lands.',
      fr: 'DÃ©placement saisonnier vers de nouveaux pÃ¢turages.',
      ar: 'Ø§Ù„Ø§Ù†ØªÙ‚Ø§Ù„ Ø§Ù„Ù…ÙˆØ³Ù…ÙŠ Ø¥Ù„Ù‰ Ù…Ø±Ø§Ø¹ÙŠ Ø¬Ø¯ÙŠØ¯Ø©.',
      adlam: 'Seasonal movement to new grazing lands.',
    },
  },
  {
    id: 'lunar-celebration',
    month: 9,
    day: 3,
    title: {
      en: 'Lunar Celebration',
      fr: 'CÃ©lÃ©bration lunaire',
      ar: 'Ø§Ø­ØªÙØ§Ù„ Ù‚Ù…Ø±ÙŠ',
      adlam: 'Lunar Celebration',
    },
    description: {
      en: 'Night gathering aligned with the lunar cycle.',
      fr: 'Rassemblement nocturne alignÃ© sur le cycle lunaire.',
      ar: 'ØªØ¬Ù…Ø¹ Ù„ÙŠÙ„ÙŠ Ù…ØªØ²Ø§Ù…Ù† Ù…Ø¹ Ø§Ù„Ø¯ÙˆØ±Ø© Ø§Ù„Ù‚Ù…Ø±ÙŠØ©.',
      adlam: 'Night gathering aligned with the lunar cycle.',
    },
  },
  {
    id: 'weekly-market',
    month: 0,
    day: 7,
    title: {
      en: 'Weekly Market Day',
      fr: 'MarchÃ© hebdomadaire',
      ar: 'ÙŠÙˆÙ… Ø§Ù„Ø³ÙˆÙ‚ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ÙŠ',
      adlam: 'Weekly Market Day',
    },
    description: {
      en: 'Community market day for trade and exchange.',
      fr: 'JournÃ©e de marchÃ© communautaire pour les Ã©changes.',
      ar: 'ÙŠÙˆÙ… Ø³ÙˆÙ‚ Ù…Ø¬ØªÙ…Ø¹ÙŠ Ù„Ù„ØªØ¨Ø§Ø¯Ù„ ÙˆØ§Ù„ØªØ¬Ø§Ø±Ø©.',
      adlam: 'Community market day for trade and exchange.',
    },
  },
];

export const getTraditionalEventsForMonth = (month: number): TraditionalEvent[] => {
  return traditionalEvents.filter((event) => event.month === month);
};
