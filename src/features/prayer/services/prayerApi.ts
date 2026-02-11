const ALADHAN_API = 'https://api.aladhan.com/v1';

export interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

export interface PrayerTimesResponse {
    times: PrayerTimes;
    date: {
        readable: string;
        hijri: {
            date: string;
            day: string;
            month: { en: string; ar: string };
            year: string;
        };
    };
}

export async function fetchPrayerTimes(
    latitude: number,
    longitude: number,
    method: number = 2
): Promise<PrayerTimesResponse> {
    const response = await fetch(
        `${ALADHAN_API}/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
    }

    const data = await response.json();

    return {
        times: data.data.timings,
        date: {
            readable: data.data.date.readable,
            hijri: data.data.date.hijri,
        },
    };
}

export async function fetchPrayerTimesByCity(
    city: string,
    country: string,
    method: number = 2
): Promise<PrayerTimesResponse> {
    const response = await fetch(
        `${ALADHAN_API}/timingsByCity?city=${city}&country=${country}&method=${method}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
    }

    const data = await response.json();

    return {
        times: data.data.timings,
        date: {
            readable: data.data.date.readable,
            hijri: data.data.date.hijri,
        },
    };
}

export const PRAYER_METHODS = [
    { id: 1, name: 'University of Islamic Sciences, Karachi' },
    { id: 2, name: 'Islamic Society of North America (ISNA)' },
    { id: 3, name: 'Muslim World League (MWL)' },
    { id: 4, name: 'Umm Al-Qura University, Makkah' },
    { id: 5, name: 'Egyptian General Authority of Survey' },
    { id: 7, name: 'Institute of Geophysics, University of Tehran' },
];
