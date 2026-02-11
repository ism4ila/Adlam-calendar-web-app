import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { User } from 'firebase/auth';

declare global {
  interface Window {
    FlutterwaveCheckout?: (config: Record<string, unknown>) => void;
  }
}

const FLW_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '';

function loadFlutterwaveScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FlutterwaveCheckout) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Flutterwave script'));
    document.head.appendChild(script);
  });
}

export async function initializePayment(
  user: User,
  amount: number,
  onSuccess: () => void,
  onClose: () => void
) {
  await loadFlutterwaveScript();

  const txRef = `ACC-${user.uid}-${Date.now()}`;

  window.FlutterwaveCheckout?.({
    public_key: FLW_PUBLIC_KEY,
    tx_ref: txRef,
    amount,
    currency: 'XOF',
    payment_options: 'mobilemoneyfranco',
    customer: {
      email: user.email || '',
      phone_number: user.phoneNumber || '',
      name: user.displayName || '',
    },
    customizations: {
      title: 'Adlam Calendar Clock - Premium',
      description: 'Soutenir le projet Adlam Calendar Clock',
      logo: '/icons/ic_launcher_round.webp',
    },
    callback: async (response: { status: string; transaction_id: string; tx_ref: string }) => {
      if (response.status === 'successful') {
        await updateDoc(doc(db, 'users', user.uid), {
          isPremium: true,
          premiumSince: serverTimestamp(),
          paymentRef: response.tx_ref,
          transactionId: response.transaction_id,
        });
        onSuccess();
      }
    },
    onclose: onClose,
  });
}
