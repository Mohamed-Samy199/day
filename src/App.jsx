import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/* ================= CONFIG ================= */
const IMG = {
  pasha: 'images/basha.webp',
  clay: 'images/clay.webp',
  me: 'images/me.webp',
}
const PEOPLE = [
  { k: 'pasha', n: 'محمد علي باشا', t: 'بنى دولة مصر الحديثة', y: '1769 – 1849', m: 'م' },
  { k: 'clay', n: 'محمد علي كلاي', t: 'غيّر قواعد لعبة الملاكمة', y: '1942 – 2016', m: 'ك' },
  { k: 'me', n: 'محمد علي', t: 'ومن بين كل المبرمجين ... في واحد بس بيعمل deploy من غير ما يخاف.', y: 'Full Stack Developer', m: '🎂' },
]
const BOOT_LINES = ['loading profile mohamed_ali', 'compiling memories', 'installing friendship', 'checking birthday date', 'ready']
const CHANGES = [
  { t: 'ADDED', c: 'text-cyan-400', x: 'زين 👶 — فيتشر جديد ومستقر، بس محتاج صيانة كل ساعتين' },
  { t: 'ADDED', c: 'text-cyan-400', x: 'لقب «بابا» — Stable Release' },
  { t: 'IMPROVED', c: 'text-[#b9a4ff]', x: 'الصبر +300%، وحب القهوة بقى dependency أساسي' },
  { t: 'KNOWN ISSUES', c: 'text-[#ff8fb1]', x: 'قلة النوم · الدايبرز memory leak · الكوباية بتخلص بسرعة' },
]
const HOLD = [1800, 3200, 2200] // مدة بقاء كل شاشة بالثواني × 1000
const TERM = '$ git tag -a v26.0.0 -m "Happy Birthday Mohamed Ali"'
/* ========================================== */

const GRAD = 'bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)]'
const GT = `${GRAD} bg-clip-text text-transparent`
const MONO = 'font-mono [direction:ltr] [unicode-bidi:plaintext]'
const BTN = `${GRAD} rounded-full px-[34px] py-3.5 text-lg font-black text-white shadow-[0_8px_30px_#8b5cf666]`

function burst() {
  const cols = ['#8b5cf6', '#22d3ee', '#f472b6', '#b9a4ff', '#fff']
  const x = innerWidth / 2, y = innerHeight * 0.35
  for (let i = 0; i < 100; i++) {
    const d = document.createElement('div')
    d.className = 'pointer-events-none fixed z-[99] h-3.5 w-2.5 rounded-sm'
    d.style.cssText += `background:${cols[i % 5]};left:${x}px;top:${y}px`
    document.body.appendChild(d)
    gsap.to(d, {
      x: gsap.utils.random(-240, 240), y: gsap.utils.random(-260, 380),
      rotation: gsap.utils.random(-540, 540), duration: gsap.utils.random(1.4, 2.6), ease: 'power2.out',
      onComplete: () => gsap.to(d, { opacity: 0, y: '+=300', duration: 1, onComplete: () => d.remove() }),
    })
  }
}

/* ---------- 1) شاشة التحميل ---------- */
function Boot({ onDone }) {
  const root = useRef(null), bar = useRef(null), done = useRef(false)
  const [count, setCount] = useState(0)

  const finish = () => {
    if (done.current) return
    done.current = true
    gsap.to(root.current, { autoAlpha: 0, duration: 0.6, onComplete: onDone })
  }

  useEffect(() => {
    let dead = false
    const t = gsap.to(bar.current, { width: '100%', duration: 3.6, ease: 'power2.out' })
    ;(async () => {
      const w = (ms) => new Promise((r) => setTimeout(r, ms))
      for (let i = 1; i <= BOOT_LINES.length; i++) {
        if (dead || done.current) return
        setCount(i)
        await w(650)
      }
      await w(300)
      if (!dead) finish()
    })()
    return () => { dead = true; t.kill() }
  }, [])

  return (
    <div ref={root} onClick={finish} dir="ltr" className="absolute inset-0 z-50 grid content-center gap-5 bg-[#060916] p-6">
      <h1 className="font-mono text-2xl text-[#b9a4ff]">Loading Mohamed’s story...</h1>
      <div className="min-h-[9.5em] font-mono text-sm leading-8 text-[#9aa4c7]">
        {BOOT_LINES.slice(0, count).map((l) => (
          <div key={l}><span className="text-cyan-400">✔</span> {l}</div>
        ))}
      </div>
      <div className="h-1 overflow-hidden bg-[#2a3361]"><div ref={bar} className={`h-full w-0 ${GRAD}`} /></div>
      <p className="font-mono text-xs text-[#9aa4c7]">tap to skip</p>
    </div>
  )
}

/* ---------- 2) كروت المشاهير ---------- */
function Parade({ onNext }) {
  const root = useRef(null)
  const [dot, setDot] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.pcard')
      const tl = gsap.timeline({ onComplete: () => setReady(true) })
      cards.forEach((c, i) => {
        const last = i === cards.length - 1
        tl.fromTo(c, { autoAlpha: 0, scale: 0.8, y: 70, rotate: i % 2 ? 5 : -5 },
          { autoAlpha: 1, scale: 1, y: 0, rotate: 0, duration: 0.9, ease: 'back.out(1.5)' }, '+=.1')
          .call(() => setDot(i), null, '<')
        if (!last) tl.to(c, { autoAlpha: 0, scale: 1.12, y: -70, duration: 0.6, ease: 'power2.in' }, '+=2')
        else tl.fromTo(c.querySelector('.nm'), { scale: 1 }, { scale: 1.25, duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.inOut' })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#2b2f77,#0a0e1f_70%)] p-5">
      <div className="mb-3.5 flex gap-2">
        {PEOPLE.map((p, i) => (
          <i key={p.k} className={`h-[9px] w-[9px] rounded-full transition ${i === dot ? 'scale-[1.4] bg-cyan-400' : 'bg-[#2a3361]'}`} />
        ))}
      </div>
      <div className="relative h-[470px] w-full">
        {PEOPLE.map((p) => (
          <div key={p.k} className="pcard invisible absolute inset-0 m-auto h-[450px] w-[290px] text-center">
            <div className="relative h-[340px] w-[290px] overflow-hidden rounded-[18px] border-[3px] border-[#b9a4ff] bg-[#1b2350] shadow-[0_20px_50px_#000a,0_0_40px_#8b5cf644]">
              <div className="absolute inset-0 grid place-items-center text-[90px] font-black text-[#b9a4ff]/50">{p.m}</div>
              <img src={IMG[p.k]} alt="" onError={(e) => (e.currentTarget.style.display = 'none')}
                className="absolute inset-0 h-full w-full object-cover [filter:sepia(.2)_contrast(1.05)]" />
            </div>
            <div className={`mt-2.5 text-[13px] text-[#9aa4c7] ${MONO}`}>{p.y}</div>
            <div className="nm text-2xl font-black text-[#b9a4ff]">{p.n}</div>
            <div className="text-[15px] leading-relaxed">{p.t}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => gsap.to(root.current, { autoAlpha: 0, duration: 0.7, onComplete: onNext })}
        className={`${BTN} transition-opacity duration-500 ${ready ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        كمّل ←
      </button>
    </div>
  )
}

/* ---------- 3) الشاشات اللي بتتتابع أوتوماتيك ---------- */
function Site() {
  const root = useRef(null), term = useRef(null), num = useRef(null)
  const fg = useRef(null), ck = useRef(null), ckp = useRef(null), fin = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scr = gsap.utils.toArray('.scr'), last = scr.length - 1

      const show = (i) => {
        const s = scr[i], tl = gsap.timeline()
        gsap.set(s, { autoAlpha: 1, y: 0 })
        tl.from(s.querySelectorAll('.it'), { y: 40, autoAlpha: 0, duration: 0.8, stagger: 0.35, ease: 'power3.out' })

        if (i === 0) {
          const o = { n: 0 }
          tl.to(o, { n: TERM.length, duration: 2.2, ease: 'none',
            onUpdate: () => { term.current.textContent = TERM.slice(0, Math.round(o.n)) + '▍' } }, 0.2)
        }

        if (i < last) {
          tl.to({}, { duration: HOLD[i] / 1000 })
            .to(s, { autoAlpha: 0, y: -30, duration: 0.5 })
            .call(() => show(i + 1))
          return
        }

        // الشاشة الأخيرة: دايرة بتلف كأنها تحميل لحد 26، وبعدين تقفل وتظهر علامة ✔
        gsap.set(fin.current, { autoAlpha: 0 })
        const o = { n: 0 }, a = { v: 0.28 }
        let spin
        tl.call(() => { spin = gsap.to(fg.current, { rotation: 360, svgOrigin: '100 100', duration: 0.9, ease: 'none', repeat: -1 }) }, null, '+=.1')
          .to(o, { n: 26, duration: 3, ease: 'none', onUpdate: () => { num.current.textContent = Math.round(o.n) } })
          .call(() => spin.kill())
          .to(a, { v: 1, duration: 0.7, ease: 'power2.inOut',
            onUpdate: () => { fg.current.style.strokeDasharray = `${a.v} ${1 - a.v}` } })
          .to(num.current, { autoAlpha: 0, scale: 0.6, duration: 0.3 }, '+=.15')
          .to(ckp.current, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' })
          .fromTo(ck.current, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, '<')
          .call(burst)
          .fromTo(fin.current, { autoAlpha: 0, scale: 0.7, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.6)' }, '<')
      }
      show(0)
    }, root)
    return () => ctx.revert()
  }, [])

  const scr = 'scr invisible absolute inset-0 flex flex-col justify-center gap-3.5 px-[22px] pb-24 pt-6'

  return (
    <div ref={root} className="absolute inset-0 z-30">
      {/* البداية */}
      <section className={scr}>
        <div ref={term} className={`it min-h-[84px] rounded-xl border border-[#2a3361] bg-[#060916] p-3.5 text-[13px] text-cyan-400 ${MONO}`} />
        <div className={`it text-[68px] font-black leading-none ${MONO} ${GT}`}>v26.0.0</div>
        <h2 className="it text-[26px] font-bold">Birthday Release 🎂</h2>
        <p className="it text-[#9aa4c7]">محمد علي · Full Stack Developer · أبو زين </p>
      </section>

      {/* Changelog */}
      <section className={scr}>
        <h3 className="it mb-1.5 text-2xl font-black text-[#b9a4ff]">📋 Changelog</h3>
        {CHANGES.map((c) => (
          <div key={c.x} className="it rounded-[14px] border border-[#2a3361] bg-[#141a36] px-4 py-3.5 leading-7">
            <b className={`mb-1 block text-xs tracking-wider ${MONO} ${c.c}`}>{c.t}</b>{c.x}
          </div>
        ))}
      </section>

      {/* Commit History */}
      <section className={scr}>
        <h3 className="it mb-1.5 text-2xl font-black text-[#b9a4ff]">🌿 Commit History</h3>
        <div className="it rounded-[14px] border border-r-4 border-[#2a3361] border-r-cyan-400 bg-[#141a36] p-5 text-[22px] font-black leading-relaxed">
          <small className={`mb-1.5 block text-[13px] font-normal text-[#9aa4c7] ${MONO}`}>tag: v26.0.0</small>
          26 سنة، وكل سنة نسخة أحسن 🎉
        </div>
      </section>

      {/* الدايرة + الرسالة الأخيرة */}
      <section className={`${scr} items-center text-center`}>
        <div className="it relative h-[210px] w-[210px]">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="none" stroke="#2a3361" strokeWidth="9" />
            <circle ref={fg} cx="100" cy="100" r="90" fill="none" stroke="url(#rg)" strokeWidth="9"
              strokeLinecap="round" pathLength="1" style={{ strokeDasharray: '.28 .72' }} />
          </svg>
          <div ref={num} className={`absolute inset-0 grid place-items-center text-[76px] font-black ${MONO} ${GT}`}>0</div>
          <svg ref={ck} className="absolute inset-0 m-auto h-[100px] w-[100px] overflow-visible" viewBox="0 0 100 100">
            <path ref={ckp} d="M22 52 L43 73 L80 30" fill="none" stroke="url(#rg)" strokeWidth="10"
              strokeLinecap="round" strokeLinejoin="round" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
          </svg>
        </div>
        <div ref={fin} className="invisible rounded-[20px] border-2 border-[#b9a4ff] bg-[linear-gradient(160deg,#2b2f77,#141a36)] px-[18px] py-[26px] shadow-[0_0_40px_#8b5cf655]">
          <h2 className={`mb-2 text-[28px] font-black leading-normal ${GT}`}>كل سنة وإنت طيب يا أبو زين 🎂</h2>
          <p className="leading-8">ربنا يبارك لك في زين، ويخلّي لك البيت عامر والكود دايماً بدون bugs.</p>
        </div>
      </section>
    </div>
  )
}

/* ---------- التطبيق ---------- */
export default function App() {
  const [stage, setStage] = useState('boot')
  return (
    <div dir="rtl" className="fixed inset-0 overflow-hidden bg-[#0a0e1f] font-['Cairo',system-ui,sans-serif] text-[#eef1ff]">
      <div className="relative mx-auto h-full max-w-[480px]">
        {stage === 'boot' && <Boot onDone={() => setStage('parade')} />}
        {stage === 'parade' && <Parade onNext={() => setStage('site')} />}
        {stage === 'site' && <Site />}
      </div>
    </div>
  )
}