import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { User } from 'firebase/auth';

declare global {
  interface Window {
    CinetPay?: {
      setConfig: (config: {
        apikey: string;
        site_id: string;
        notify_url: string;
        mode: string;
      }) => void;
      getCheckout: (params: Record<string, unknown>) => void;
      waitResponse: (callback: (data: CinetPayResponse) => void) => void;
      onError: (callback: (data: unknown) => void) => void;
    };
  }
}

interface CinetPayResponse {
  status: 'ACCEPTED' | 'REFUSED';
  transaction_id: string;
  amount: number;
  currency: string;
}

const CINETPAY_API_KEY = import.meta.env.VITE_CINETPAY_API_KEY || '';
const CINETPAY_SITE_ID = import.meta.env.VITE_CINETPAY_SITE_ID || '';
const CINETPAY_NOTIFY_URL = import.meta.env.VITE_CINETPAY_NOTIFY_URL || '';
const CINETPAY_MODE = import.meta.env.VITE_CINETPAY_MODE || 'PRODUCTION';

function loadCinetPayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.CinetPay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.cinetpay.com/seamless/main.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load CinetPay script'));
    document.head.appendChild(script);
  });
}

export async function initializePayment(
  user: User,
  amount: number,
  currency: string,
  onSuccess: () => void,
  onClose: () => void
) {
  await loadCinetPayScript();

  const transactionId = `ATS-${user.uid}-${Date.now()}`;

  window.CinetPay!.setConfig({
    apikey: CINETPAY_API_KEY,
    site_id: CINETPAY_SITE_ID,
    notify_url: CINETPAY_NOTIFY_URL,
    mode: CINETPAY_MODE,
  });

  window.CinetPay!.getCheckout({
    transaction_id: transactionId,
    amount,
    currency,
    channels: 'ALL',
    description: 'Adlam Tech Space - Premium',
    customer_name: user.displayName?.split(' ')[0] || '',
    customer_surname: user.displayName?.split(' ').slice(1).join(' ') || '',
    customer_email: user.email || '',
    customer_phone_number: user.phoneNumber || '',
    customer_country: currencyToCountry(currency),
  });

  window.CinetPay!.waitResponse(async (data) => {
    if (data.status === 'ACCEPTED') {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          isPremium: true,
          premiumSince: serverTimestamp(),
          paymentRef: transactionId,
          transactionId: data.transaction_id,
          paymentAmount: amount,
          paymentCurrency: currency,
          paymentProvider: 'cinetpay',
        });
        onSuccess();
      } catch {
        console.error('Failed to update premium status after payment');
      }
    } else {
      onClose();
    }
  });

  window.CinetPay!.onError((data) => {
    console.error('CinetPay error:', data);
    onClose();
  });
}

function currencyToCountry(currency: string): string {
  const map: Record<string, string> = {
    XOF: 'SN',
    XAF: 'CM',
    CDF: 'CD',
    GNF: 'GN',
    USD: 'US',
  };
  return map[currency] || 'CM';
}

// CinetPay supported currencies: XOF, XAF, CDF, GNF, USD
// Amounts must be multiples of 5 (except USD)
export const CURRENCY_OPTIONS = [
  { code: 'XAF', label: 'FCFA (Afrique Centrale)', amounts: [1000, 2000, 5000] },
  { code: 'XOF', label: 'FCFA (Afrique de l\'Ouest)', amounts: [1000, 2000, 5000] },
  { code: 'CDF', label: 'Franc Congolais (RDC)', amounts: [5000, 10000, 20000] },
  { code: 'GNF', label: 'Franc Guinéen (Guinée)', amounts: [10000, 25000, 50000] },
  { code: 'USD', label: 'USD', amounts: [2, 5, 10] },
] as const;
