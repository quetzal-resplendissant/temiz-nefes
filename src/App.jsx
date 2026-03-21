import { useState, useEffect, useCallback } from 'react';
import {
  loadData, saveData, getDaysSinceQuit, getDailySaving, getTotalSaved,
  getCigarettesAvoided, getLifeRegained, getActiveGoal, getTodayNudge,
  addJournalEntry, healthMilestones,
} from './store';

const C = {
  mint: '#0D9F6E', mintL: '#E1F5EE', mintD: '#065F46',
  coral: '#F97066', coralL: '#FEE4E2',
  amber: '#F59E0B', amberL: '#FEF3C7',
  cream: '#FAFAF5', white: '#fff',
  charcoal: '#1C1917', stone: '#57534E', stoneL: '#A8A29E',
  border: 'rgba(28,25,23,0.08)',
};

const card = {
  background: C.white, borderRadius: 20, border: `1px solid ${C.border}`,
  padding: '20px 24px', marginBottom: 12,
};

const btn = (active = true) => ({
  width: '100%', padding: 16, background: active ? C.mint : C.stoneL,
  color: '#fff', border: 'none', borderRadius: 14, fontSize: 16,
  fontWeight: 600, cursor: active ? 'pointer' : 'default',
  fontFamily: "'DM Sans',sans-serif", transition: 'background 0.2s',
});

// ─── ONBOARDING ───
function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [perDay, setPerDay] = useState(20);
  const [price, setPrice] = useState(60);
  const [goal, setGoal] = useState('');

  const goals = [
    { id: 'tatil', emoji: '✈️', label: 'Tatil biriktirmek', amount: '₺15.000' },
    { id: 'saglik', emoji: '💚', label: 'Sağlığıma kavuşmak', amount: '' },
    { id: 'aile', emoji: '👨‍👩‍👧', label: 'Ailem için', amount: '' },
    { id: 'para', emoji: '💰', label: 'Para biriktirmek', amount: '₺10.000' },
  ];

  const finish = () => {
    const data = loadData();
    const updated = {
      ...data, onboarded: true, name, perDay, packPrice: price,
      goalId: goal, quitDate: new Date().toISOString(),
    };
    saveData(updated);
    onFinish();
  };

  const daily = Math.round(price * perDay / 20);
  const yearly = daily * 365;

  if (step === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 28px 40px' }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: C.mintL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 36 }}>🌿</div>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 500, margin: '0 0 12px', lineHeight: 1.3 }}>
        Temiz bir nefes,<br/>yeni bir başlangıç
      </h1>
      <p style={{ color: C.stone, fontSize: 15, lineHeight: 1.6, margin: '0 0 48px' }}>
        Her bırakılan sigara, cebinize para ve hayatınıza zaman katar.
      </p>
      <button onClick={() => setStep(1)} style={btn()}>Başlayalım</button>
    </div>
  );

  if (step === 1) return (
    <div style={{ padding: '48px 24px 40px' }}>
      <p style={{ fontSize: 13, color: C.mint, fontWeight: 600, margin: '0 0 8px' }}>ADIM 1/3</p>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 500, margin: '0 0 8px' }}>Sizi tanıyalım</h2>
      <p style={{ color: C.stone, fontSize: 14, margin: '0 0 24px' }}>Adınız nedir?</p>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Adınızı yazın"
        style={{ width: '100%', padding: 16, border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 16, background: C.white, fontFamily: "'DM Sans'", outline: 'none' }} />

      <div style={{ marginTop: 28 }}>
        <p style={{ fontSize: 14, color: C.stone, margin: '0 0 10px' }}>Günde kaç sigara içiyorsunuz?</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input type="range" min="1" max="60" value={perDay} onChange={e => setPerDay(+e.target.value)} style={{ flex: 1 }} />
          <span style={{ minWidth: 48, textAlign: 'center', fontSize: 28, fontWeight: 700, fontFamily: "'Fraunces',serif", color: C.mint }}>{perDay}</span>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <p style={{ fontSize: 14, color: C.stone, margin: '0 0 10px' }}>Bir paket fiyatı (₺)</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input type="range" min="20" max="150" step="5" value={price} onChange={e => setPrice(+e.target.value)} style={{ flex: 1 }} />
          <span style={{ minWidth: 48, textAlign: 'center', fontSize: 28, fontWeight: 700, fontFamily: "'Fraunces',serif", color: C.mint }}>₺{price}</span>
        </div>
      </div>
      <button onClick={() => setStep(2)} style={{ ...btn(!!name), marginTop: 32 }} disabled={!name}>Devam</button>
      <Dots current={0} />
    </div>
  );

  if (step === 2) return (
    <div style={{ padding: '48px 24px 40px' }}>
      <p style={{ fontSize: 13, color: C.mint, fontWeight: 600, margin: '0 0 8px' }}>ADIM 2/3</p>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 500, margin: '0 0 8px' }}>Hedefiniz ne?</h2>
      <p style={{ color: C.stone, fontSize: 14, margin: '0 0 20px' }}>Biriktirdiğiniz parayı ne için kullanmak istersiniz?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {goals.map(g => (
          <button key={g.id} onClick={() => setGoal(g.id)} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: 16,
            background: goal === g.id ? C.mintL : C.white,
            border: `1.5px solid ${goal === g.id ? C.mint : C.border}`,
            borderRadius: 14, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans'",
          }}>
            <span style={{ fontSize: 24 }}>{g.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: C.charcoal }}>{g.label}</p>
              {g.amount && <p style={{ margin: '2px 0 0', fontSize: 12, color: C.stone }}>{g.amount} hedef</p>}
            </div>
            {goal === g.id && <span style={{ width: 24, height: 24, borderRadius: 12, background: C.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>✓</span>}
          </button>
        ))}
      </div>
      <button onClick={() => setStep(3)} disabled={!goal} style={{ ...btn(!!goal), marginTop: 24 }}>Devam</button>
      <Dots current={1} />
    </div>
  );

  return (
    <div style={{ textAlign: 'center', padding: '64px 28px 40px' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.mintL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 32 }}>✓</div>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 500, margin: '0 0 12px' }}>Hazırsınız, {name}!</h2>
      <p style={{ color: C.stone, fontSize: 15, margin: '0 0 16px' }}>Günlük tasarrufunuz yaklaşık</p>
      <p style={{ fontSize: 48, fontWeight: 700, fontFamily: "'Fraunces',serif", color: C.mint, margin: '0 0 8px', animation: 'countUp 0.5s ease' }}>₺{daily}</p>
      <p style={{ color: C.stone, fontSize: 14, margin: '0 0 44px' }}>
        Yılda <strong style={{ color: C.charcoal }}>₺{yearly.toLocaleString('tr-TR')}</strong> biriktirin
      </p>
      <button onClick={finish} style={btn()}>Yolculuğa başla 🌿</button>
    </div>
  );
}

const Dots = ({ current }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? C.mint : C.border, transition: 'all 0.3s' }} />
    ))}
  </div>
);

// ─── HOME ───
function HomeScreen({ data }) {
  const days = getDaysSinceQuit(data);
  const saved = getTotalSaved(data);
  const daily = getDailySaving(data);
  const cigs = getCigarettesAvoided(data);
  const life = getLifeRegained(data);
  const goal = getActiveGoal(data);
  const nudge = getTodayNudge(data);

  const weeks = [];
  for (let w = 1; w <= Math.min(Math.ceil(days / 7), 4); w++) {
    weeks.push(Math.min(w * 7, days) * daily);
  }

  return (
    <div style={{ padding: '12px 20px 110px', animation: 'fadeIn 0.3s ease' }}>
      <p style={{ margin: 0, fontSize: 13, color: C.stone }}>Gün {days} — dumansız</p>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 500, margin: '6px 0 20px' }}>
        Harikasın, {data.name}! 🌿
      </h1>

      {/* Savings hero */}
      <div style={card}>
        <p style={{ margin: 0, fontSize: 11, color: C.stone, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Toplam tasarruf</p>
        <p style={{ margin: '10px 0 4px', fontSize: 44, fontWeight: 700, fontFamily: "'Fraunces',serif", color: C.mint, lineHeight: 1 }}>
          ₺{saved.toLocaleString('tr-TR')}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: C.stone }}>{days} gün × ₺{daily}/gün</p>

        {weeks.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 18, height: 56 }}>
            {weeks.map((w, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: C.mint }}>₺{w.toLocaleString('tr-TR')}</span>
                <div style={{ width: '100%', borderRadius: 6, height: `${Math.max(8, Math.round((w / (weeks[weeks.length - 1] || 1)) * 44))}px`, background: C.mint }} />
                <span style={{ fontSize: 10, color: C.stoneL }}>H{i + 1}</span>
              </div>
            ))}
            {weeks.length < 4 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, color: C.stoneL }}>?</span>
                <div style={{ width: '100%', borderRadius: 6, height: 44, border: `2px dashed ${C.stoneL}`, opacity: 0.3 }} />
                <span style={{ fontSize: 10, color: C.stoneL }}>H{weeks.length + 1}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Goal progress */}
      {goal.target > 0 && (
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ProgressRing percent={Math.min(100, Math.round((saved / goal.target) * 100))} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{goal.emoji} {goal.label}</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: C.stone }}>
              ₺{saved.toLocaleString('tr-TR')} / ₺{goal.target.toLocaleString('tr-TR')}
            </p>
            {saved < goal.target && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: C.mint, fontWeight: 500 }}>
                ~{Math.ceil((goal.target - saved) / Math.max(1, daily))} gün kaldı
              </p>
            )}
          </div>
        </div>
      )}

      {/* Nudge */}
      <div style={{ background: C.mintL, borderRadius: 20, padding: '18px 24px', marginBottom: 12 }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: C.mintD, textTransform: 'uppercase', letterSpacing: 0.5 }}>Günün mesajı</p>
        <p style={{ margin: 0, fontSize: 15, color: C.mintD, lineHeight: 1.5 }}>{nudge}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div style={card}><p style={{ margin: 0, fontSize: 11, color: C.stone }}>İçilmeyen sigara</p><p style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 700, fontFamily: "'Fraunces',serif" }}>{cigs.toLocaleString('tr-TR')}</p></div>
        <div style={card}><p style={{ margin: 0, fontSize: 11, color: C.stone }}>Kazanılan zaman</p><p style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 700, fontFamily: "'Fraunces',serif" }}>{life.days}g {life.hours}s</p></div>
      </div>

      {/* Health milestones */}
      <div style={card}>
        <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600 }}>Sağlık kilometre taşları</p>
        {healthMilestones.map((m, i) => {
          const done = days >= m.day;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? `1px solid ${C.border}` : 'none', opacity: done ? 1 : 0.4 }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{done ? m.icon : '○'}</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{m.label}</p>
                <p style={{ margin: '1px 0 0', fontSize: 11, color: C.stone }}>Gün {m.day >= 1 ? m.day : '<1'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressRing({ percent, size = 64 }) {
  const r = 26; const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.mint} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ - (percent / 100) * circ} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 14, fontWeight: 700, color: C.mint }}>{percent}%</span>
    </div>
  );
}

// ─── GOALS ───
function GoalsScreen({ data }) {
  const saved = getTotalSaved(data);
  const equivalences = [
    { emoji: '☕', label: `${Math.max(1, Math.floor(saved / 30))} kahve`, sub: 'Günlük keyfin' },
    { emoji: '📚', label: `${Math.max(1, Math.floor(saved / 50))} kitap`, sub: 'Bilgi hazinesi' },
    { emoji: '🎬', label: `${Math.max(1, Math.floor(saved / 100))} sinema`, sub: 'Film keyfi' },
    { emoji: '🍽️', label: `${Math.max(1, Math.floor(saved / 150))} restoran`, sub: 'Güzel sofralar' },
  ];

  return (
    <div style={{ padding: '12px 20px 110px', animation: 'fadeIn 0.3s ease' }}>
      <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 500, margin: '0 0 6px' }}>Hedeflerim</h1>
      <p style={{ color: C.stone, fontSize: 14, margin: '0 0 20px' }}>Biriktirdiğiniz para, hayallerinize dönüşsün</p>

      {data.goals.filter(g => g.target > 0).map(g => {
        const pct = Math.min(100, Math.round((saved / g.target) * 100));
        return (
          <div key={g.id} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{g.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{g.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: C.stone }}>₺{saved.toLocaleString('tr-TR')} / ₺{g.target.toLocaleString('tr-TR')}</p>
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fraunces',serif", color: C.mint }}>{pct}%</span>
            </div>
            <div style={{ height: 8, background: C.cream, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: C.mint, transition: 'width 1s ease' }} />
            </div>
            {pct >= 100 && <p style={{ margin: '10px 0 0', fontSize: 13, color: C.mint, fontWeight: 600, textAlign: 'center' }}>Hedefe ulaştınız! Tebrikler! 🎉</p>}
          </div>
        );
      })}

      <p style={{ fontSize: 13, fontWeight: 600, margin: '20px 0 12px', color: C.stone, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        ₺{saved.toLocaleString('tr-TR')} ile neler alınır?
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {equivalences.map((item, i) => (
          <div key={i} style={{ ...card, textAlign: 'center', padding: 16 }}>
            <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{item.emoji}</span>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{item.label}</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: C.stone }}>{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── JOURNAL ───
function JournalScreen({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [crave, setCrave] = useState(0);

  const moods = ['😊', '😌', '😤', '😢', '💪'];
  const days = getDaysSinceQuit(data);

  const save = () => {
    if (!mood) return;
    const updated = addJournalEntry(data, { mood, note, crave });
    setData(updated);
    setShowAdd(false); setMood(''); setNote(''); setCrave(0);
  };

  const relative = (iso) => {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (d === 0) return 'Bugün';
    if (d === 1) return 'Dün';
    return `${d} gün önce`;
  };

  return (
    <div style={{ padding: '12px 20px 110px', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 500, margin: 0 }}>Günlük</h1>
          <p style={{ color: C.stone, fontSize: 14, margin: '4px 0 0' }}>Gün {days}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          background: C.mint, color: '#fff', border: 'none', borderRadius: 12,
          padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans'",
        }}>{showAdd ? '✕ Kapat' : '+ Ekle'}</button>
      </div>

      {showAdd && (
        <div style={{ ...card, background: C.mintL, border: `1.5px solid ${C.mint}` }}>
          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 600, color: C.mintD }}>Bugün nasıl hissediyorsunuz?</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {moods.map(m => (
              <button key={m} onClick={() => setMood(m)} style={{
                width: 44, height: 44, borderRadius: 12, fontSize: 22,
                border: mood === m ? `2px solid ${C.mint}` : `1px solid ${C.border}`,
                background: mood === m ? C.white : 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{m}</button>
            ))}
          </div>

          <p style={{ margin: '0 0 6px', fontSize: 13, color: C.mintD }}>Sigara isteği (0-5)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <input type="range" min="0" max="5" value={crave} onChange={e => setCrave(+e.target.value)} style={{ flex: 1 }} />
            <span style={{ fontWeight: 700, color: crave >= 3 ? C.coral : C.mint, fontSize: 18, minWidth: 24, textAlign: 'center' }}>{crave}</span>
          </div>

          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Bugün ne yaşadınız?"
            rows={3} style={{ width: '100%', padding: 14, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans'", resize: 'none', outline: 'none', background: C.white }} />
          <button onClick={save} disabled={!mood} style={{ ...btn(!!mood), marginTop: 12 }}>Kaydet</button>
        </div>
      )}

      {data.journal.length === 0 && !showAdd && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: C.stoneL }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📔</p>
          <p style={{ fontSize: 15 }}>Henüz kayıt yok</p>
          <p style={{ fontSize: 13 }}>İlk günlük girişinizi ekleyin</p>
        </div>
      )}

      {data.journal.map(e => (
        <div key={e.id} style={{ ...card, padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{e.mood}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{relative(e.date)}</span>
            </div>
            {e.crave > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                background: e.crave >= 3 ? C.coralL : C.amberL,
                color: e.crave >= 3 ? '#991B1B' : '#92400E',
              }}>{e.crave} istek</span>
            )}
          </div>
          {e.note && <p style={{ margin: 0, fontSize: 14, color: C.stone, lineHeight: 1.5 }}>{e.note}</p>}
        </div>
      ))}
    </div>
  );
}

// ─── PROFILE ───
function ProfileScreen({ data, onReset }) {
  const days = getDaysSinceQuit(data);
  const qd = data.quitDate ? new Date(data.quitDate) : new Date();
  const formatted = qd.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: '12px 20px 110px', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ textAlign: 'center', padding: '20px 0 28px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.mintL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 28, fontWeight: 700, fontFamily: "'Fraunces',serif", color: C.mint }}>
          {(data.name || '?')[0].toUpperCase()}
        </div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 500, margin: '0 0 4px' }}>{data.name}</h2>
        <p style={{ color: C.stone, fontSize: 13 }}>{days} gündür dumansız 🌿</p>
      </div>

      <div style={{ ...card, padding: '4px 0' }}>
        {[
          { label: 'Günlük sigara', value: `${data.perDay} adet` },
          { label: 'Paket fiyatı', value: `₺${data.packPrice}` },
          { label: 'Bırakma tarihi', value: formatted },
          { label: 'Günlük tasarruf', value: `₺${getDailySaving(data)}` },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderTop: i ? `1px solid ${C.border}` : 'none' }}>
            <span style={{ fontSize: 14, color: C.stone }}>{item.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</span>
          </div>
        ))}
      </div>

      <button onClick={() => {
        if (confirm('Tüm verileriniz silinecek. Emin misiniz?')) {
          localStorage.clear();
          onReset();
        }
      }} style={{
        width: '100%', padding: 14, background: 'transparent', color: C.coral,
        border: `1.5px solid ${C.coral}`, borderRadius: 14, fontSize: 14,
        fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans'", marginTop: 20,
      }}>Verileri sıfırla</button>

      <p style={{ textAlign: 'center', color: C.stoneL, fontSize: 12, marginTop: 24 }}>Temiz Nefes v1.0</p>
    </div>
  );
}

// ─── TAB BAR ───
function TabBar({ active, setScreen }) {
  const tabs = [
    { id: 'home', label: 'Ana Sayfa', d: 'M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3z' },
    { id: 'goals', label: 'Hedefler', d: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 3a4 4 0 100 8 4 4 0 000-8zm0 3a1 1 0 110 2 1 1 0 010-2z' },
    { id: 'journal', label: 'Günlük', d: 'M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm2 4v2h12V8H6zm0 4v2h8v-2H6z' },
    { id: 'profile', label: 'Profil', d: 'M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z' },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(250,250,245,0.92)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${C.border}`, padding: '8px 0 env(safe-area-inset-bottom, 16px)',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setScreen(t.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '6px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          opacity: active === t.id ? 1 : 0.4, transition: 'opacity 0.15s',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={active === t.id ? C.mint : C.stone}><path d={t.d} /></svg>
          <span style={{ fontSize: 10, fontWeight: active === t.id ? 600 : 400, color: active === t.id ? C.mint : C.stone }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── APP ───
export default function App() {
  const [data, setData] = useState(loadData);
  const [screen, setScreen] = useState('home');

  const refresh = useCallback(() => setData(loadData()), []);

  if (!data.onboarded) return <Onboarding onFinish={refresh} />;

  return (
    <>
      {screen === 'home' && <HomeScreen data={data} />}
      {screen === 'goals' && <GoalsScreen data={data} />}
      {screen === 'journal' && <JournalScreen data={data} setData={setData} />}
      {screen === 'profile' && <ProfileScreen data={data} onReset={() => { setData(loadData()); }} />}
      <TabBar active={screen} setScreen={setScreen} />
    </>
  );
}
