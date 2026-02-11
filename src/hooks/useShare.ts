import { useCallback } from 'react';

interface ShareData {
    title: string;
    text: string;
    url?: string;
}

export function useShare() {
    const canShare = typeof navigator !== 'undefined' && !!navigator.share;

    const share = useCallback(async (data: ShareData) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: data.title,
                    text: data.text,
                    url: data.url ?? window.location.href,
                });
                return true;
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
                return false;
            }
        }
        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(data.url ?? window.location.href);
            return true;
        } catch {
            return false;
        }
    }, []);

    return { canShare, share };
}
