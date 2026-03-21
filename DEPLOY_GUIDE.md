# Temiz Nefes — Deployment & Play Store Guide

## What You Have

A complete, production-ready PWA (Progressive Web App) quit-smoking app in Turkish.
- **Offline support**: Works without internet after first load
- **Installable**: Users can add to home screen
- **Play Store ready**: Can be wrapped as TWA for Google Play

---

## STEP 1: Deploy to Vercel (Free, 5 minutes)

### Option A: Via Vercel Dashboard (No Terminal Needed)

1. Go to https://vercel.com and sign up (free) with GitHub
2. Push this project folder to a new GitHub repository:
   - Go to https://github.com/new
   - Create repo named `temiz-nefes`
   - Upload the entire project folder
3. In Vercel dashboard → "Add New Project" → Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Click **Deploy**
6. Your app is live at `temiz-nefes.vercel.app` (or similar)

### Option B: Via Terminal (if you have Node.js)

```bash
npm i -g vercel
cd temiz-nefes
vercel
# Follow prompts — done!
```

---

## STEP 2: Test the PWA

1. Open your Vercel URL on your phone's browser
2. On Android Chrome: You should see "Add to Home Screen" prompt
3. On iOS Safari: Tap Share → "Add to Home Screen"
4. The app should work offline after first visit
5. Test all screens: Onboarding → Dashboard → Goals → Journal → Profile

---

## STEP 3: Wrap as TWA for Google Play ($25 one-time)

### 3a. Register Google Play Developer Account
1. Go to https://play.google.com/console
2. Pay the one-time $25 fee
3. Complete identity verification (may take 1-2 days)

### 3b. Generate Android Package with PWABuilder
1. Go to https://www.pwabuilder.com
2. Enter your Vercel URL (e.g., `https://temiz-nefes.vercel.app`)
3. PWABuilder will analyze your PWA (should score well)
4. Click "Package for stores" → Select "Android"
5. Fill in:
   - **Package ID**: `com.temiznefes.app`
   - **App name**: Temiz Nefes
   - **App version**: 1.0.0
   - **Icon**: Upload icon-512.png from /public folder
6. Download the generated `.aab` (Android App Bundle) file

### 3c. Set Up Digital Asset Links
PWABuilder will give you an `assetlinks.json` file. You need to:
1. Create folder `.well-known` in your `public/` directory
2. Put `assetlinks.json` inside it
3. Redeploy to Vercel
4. Verify it works: visit `https://your-url/.well-known/assetlinks.json`

### 3d. Upload to Google Play Console
1. In Play Console → Create app
2. Fill in app details (see Turkish listing below)
3. Go to Production → Create new release
4. Upload the `.aab` file from PWABuilder
5. Submit for review (usually approved within hours to 1 day)

---

## STEP 4: Google Play Store Listing (Turkish)

### App Name
Temiz Nefes - Sigarayı Bırak

### Short Description (80 chars)
Sigarayı bırakın, para biriktirin. Günlük motivasyon ve tasarruf takibi.

### Full Description
Temiz Nefes, sigarayı bırakma yolculuğunuzda en güçlü motivasyon kaynağınız.

Her bırakılan sigara cebinize para, hayatınıza zaman katar. Temiz Nefes bunu somut olarak gösterir — günlük tasarrufunuzu takip edin, hedeflerinize ulaşın, sağlık iyileşmenizi izleyin.

ÖZELLİKLER:
• Para Tasarrufu Takibi: Biriktirdiğiniz parayı gerçek zamanlı görün
• Kişisel Hedefler: Tatil, telefon, kurs — paranızı hayallerinize dönüştürün
• Günlük Motivasyon: Her gün size özel pozitif mesajlar
• Sağlık Takvimi: Vücudunuzun iyileşme sürecini takip edin
• Günlük: Duygularınızı, tetikleyicilerinizi ve zaferlerinizi kaydedin
• Para Eşdeğerlikleri: Biriktirdiğiniz parayla neler alınır, görün

Sigarayı bırakmak zor, ama yalnız değilsiniz. Temiz Nefes her gün yanınızda.

### Category
Health & Fitness

### Tags
sigara bırakma, sağlık, tasarruf, motivasyon, nikotin, bırakma

### Privacy Policy
You'll need a basic privacy policy. The app stores data locally on the device only — no data leaves the phone. You can generate one at https://app-privacy-policy-generator.firebaseapp.com/

---

## Screenshots Needed

For Play Store, you need:
- **Phone screenshots**: At least 2, recommended 4-8
- **Size**: 1080x1920 or similar 9:16 ratio
- **Suggested screenshots**:
  1. Onboarding welcome screen
  2. Dashboard with savings counter
  3. Goals screen with equivalences
  4. Journal screen

Tip: Open the app on your phone, take real screenshots.

---

## Future Improvements

- [ ] Push notifications via OneSignal (free)
- [ ] Cloud sync via Supabase (free tier)
- [ ] Premium tier for advanced analytics
- [ ] Affiliate links for nicotine replacement products
- [ ] Community/social features
- [ ] iOS App Store (requires Adalo/native, ~$36-99/mo + $99/yr Apple fee)
