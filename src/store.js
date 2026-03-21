const STORE_KEY = 'temiz_nefes_data';

const defaults = {
  onboarded: false,
  name: '',
  perDay: 20,
  packPrice: 60,
  goalId: '',
  quitDate: null,
  journal: [],
  goals: [
    { id: 'tatil', emoji: '✈️', label: 'Tatil biriktirmek', target: 15000 },
    { id: 'saglik', emoji: '💚', label: 'Sağlığıma kavuşmak', target: 0 },
    { id: 'aile', emoji: '👨‍👩‍👧', label: 'Ailem için', target: 0 },
    { id: 'para', emoji: '💰', label: 'Para biriktirmek', target: 10000 },
  ],
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch { return { ...defaults }; }
}

export function saveData(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
}

export function getDaysSinceQuit(data) {
  if (!data.quitDate) return 0;
  const diff = Date.now() - new Date(data.quitDate).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function getDailySaving(data) {
  return Math.round(data.packPrice * data.perDay / 20);
}

export function getTotalSaved(data) {
  return getDaysSinceQuit(data) * getDailySaving(data);
}

export function getCigarettesAvoided(data) {
  return getDaysSinceQuit(data) * data.perDay;
}

export function getLifeRegained(data) {
  const cigs = getCigarettesAvoided(data);
  const minutes = cigs * 11;
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  return { days, hours, totalMinutes: minutes };
}

export function getActiveGoal(data) {
  return data.goals.find(g => g.id === data.goalId) || data.goals[0];
}

const nudgeTemplates = [
  (s) => `Bugünkü tasarrufunuzla ${Math.max(1, Math.floor(s / 30))} kahve alabilirsiniz. Kendinizi ödüllendirin!`,
  (s) => `Bu hafta ₺${s.toLocaleString('tr-TR')} biriktirdiniz — güzel bir akşam yemeği hakediyorsunuz!`,
  (s) => `${Math.max(1, Math.floor(s / 50))} kitap parası biriktirdiniz. Okumak için harika bir gün!`,
  (s) => `Hedefinize her gün biraz daha yaklaşıyorsunuz. Bugün de güçlüydünüz!`,
  (s) => `Ciğerleriniz size teşekkür ediyor. Her temiz nefes bir zafer!`,
  (s) => `₺${s.toLocaleString('tr-TR')} ile ${Math.max(1, Math.floor(s / 100))} sinema bileti alınır. Film keyfi yakın!`,
  (s) => `Paranız cebinizde, sağlığınız yerine dönüyor. Harika gidiyorsunuz!`,
];

export function getTodayNudge(data) {
  const day = getDaysSinceQuit(data);
  const saved = getTotalSaved(data);
  const idx = day % nudgeTemplates.length;
  return nudgeTemplates[idx](saved);
}

export function addJournalEntry(data, entry) {
  const updated = { ...data, journal: [{ ...entry, id: Date.now(), date: new Date().toISOString() }, ...data.journal] };
  saveData(updated);
  return updated;
}

export const healthMilestones = [
  { day: 0.01, label: 'Nabız ve tansiyon normalleşmeye başladı', icon: '❤️' },
  { day: 1, label: 'Kandaki karbon monoksit normale döndü', icon: '🫁' },
  { day: 2, label: 'Tat ve koku alma duyusu iyileşiyor', icon: '👃' },
  { day: 3, label: 'Nikotin vücuttan temizlendi', icon: '✨' },
  { day: 14, label: 'Dolaşım sistemi iyileşmeye başladı', icon: '🩸' },
  { day: 30, label: 'Akciğer kapasitesi artıyor', icon: '💨' },
  { day: 90, label: 'Akciğer fonksiyonları %30 arttı', icon: '🏃' },
  { day: 180, label: 'Öksürük ve nefes darlığı büyük ölçüde azaldı', icon: '🌬️' },
  { day: 365, label: 'Kalp krizi riski yarıya düştü', icon: '💚' },
];
