import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, Bell, BookOpen, BookOpenCheck, ChartNoAxesCombined, Check, CircleHelp,
  Code2, GraduationCap, KeyRound, Layers3, LibraryBig, Mail,
  Menu, MessageSquareMore, NotebookTabs, Search, ShieldCheck, Sparkles, Users,
  UserRoundCog, X,
} from 'lucide-react'
import api from '../../components/common/api'

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const features = [
  { icon: Search, title: 'Digital Catalog', description: 'Find every title, category, and resource from a focused search experience.' },
  { icon: ShieldCheck, title: 'Secure Access', description: 'Protect each action with JWT authentication and role-aware permissions.' },
  { icon: Bell, title: 'Smart Notifications', description: 'Keep readers current on due dates, returns, and library announcements.' },
]

const technology = ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'PostgreSQL', 'React', 'Vite', 'Tailwind CSS']

const roles = [
  { icon: UserRoundCog, title: 'Admin', description: 'Oversee people, inventory, announcements, reports, and library operations.', accent: 'bg-violet-100 text-violet-700' },
  { icon: LibraryBig, title: 'Librarian', description: 'Issue books, manage catalog records, and keep daily circulation moving.', accent: 'bg-emerald-100 text-emerald-700' },
  { icon: GraduationCap, title: 'Student', description: 'Discover books, manage borrowing, and stay informed from one account.', accent: 'bg-sky-100 text-sky-700' },
]

const reasons = [
  { icon: Search, text: 'Fast Book Search' }, { icon: KeyRound, text: 'Secure Authentication' },
  { icon: NotebookTabs, text: 'Issue Tracking' }, { icon: Users, text: 'Role Based Access' },
  { icon: CircleHelp, text: 'Complaint System' }, { icon: MessageSquareMore, text: 'Feedback System' },
  { icon: Bell, text: 'News Management' }, { icon: ChartNoAxesCombined, text: 'Modern Dashboard' },
]

const counters = [
  { value: 25000, suffix: '+', label: 'Books' }, { value: 1500, suffix: '+', label: 'Students' },
  { value: 8400, suffix: '+', label: 'Issues' }, { value: 120, suffix: '+', label: 'News' },
]

function CountUp({ value, suffix }) {
  const [count, setCount] = useState(0)

  const ref = useRef(null)

  const isInView = useInView(ref, {
    once: true,
  })

  useEffect(() => {
    if (!isInView) return

    let frame

    const start = performance.now()
    const duration = 1200

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)

      setCount(
        Math.floor(value * (1 - Math.pow(1 - progress, 3)))
      )

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

function SectionIntro({ eyebrow, title, description, align = 'center', inverted = false }) {
  return (
    <motion.div variants={reveal} className={align === 'left' ? 'max-w-xl' : 'mx-auto max-w-2xl text-center'}>
      <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${inverted ? 'text-sky-300' : 'text-sky-600'}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl ${inverted ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      <p className={`mt-4 text-base leading-7 sm:text-lg ${inverted ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
    </motion.div>
  )
}

function DashboardPreview() {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.2 }} className="relative mx-auto w-full max-w-xl">
      <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/20 sm:p-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-950 text-white"><BookOpen size={15} /></div><span className="text-sm font-semibold text-slate-900">LibraryMS</span></div>
          <div className="flex items-center gap-3 text-slate-400"><Bell size={15} /><div className="h-7 w-7 rounded-full bg-sky-100" /></div>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-3 pt-3 sm:grid-cols-[116px_1fr]">
          <aside className="hidden rounded-lg bg-slate-950 p-3 text-slate-400 sm:block"><p className="mb-5 text-xs font-semibold text-white">Workspace</p>{['Overview', 'Books', 'Issues', 'Members'].map((item, index) => <div key={item} className={`mb-3 flex items-center gap-2 text-[10px] ${index === 0 ? 'text-white' : ''}`}><span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-sky-400' : 'bg-slate-600'}`} />{item}</div>)}</aside>
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2"><div><p className="text-[10px] text-slate-500">Good morning, Alex</p><h3 className="text-sm font-semibold text-slate-950 sm:text-base">Library overview</h3></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700">ADMIN</span></div>
            <div className="mt-3 grid grid-cols-3 gap-2">{[['12,450', 'Books', 'bg-sky-50 text-sky-600'], ['248', 'Borrowed', 'bg-violet-50 text-violet-600'], ['18', 'Notices', 'bg-amber-50 text-amber-600']].map(([number, label, color]) => <motion.div whileHover={{ y: -3 }} key={label} className="rounded-lg border border-slate-100 p-2"><div className={`mb-2 h-5 w-5 rounded-md ${color}`} /><p className="text-xs font-semibold text-slate-950">{number}</p><p className="mt-0.5 text-[8px] text-slate-500">{label}</p></motion.div>)}</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-lg border border-slate-100 p-3"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold text-slate-800">Borrowing activity</p><ChartNoAxesCombined size={12} className="text-sky-500" /></div><div className="mt-4 flex h-14 items-end gap-1.5">{[25, 42, 32, 68, 45, 78, 55, 89].map((height, index) => <motion.div key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: 0.55 + index * 0.06 }} className="flex-1 rounded-t bg-sky-400" />)}</div></div>
              <div className="rounded-lg bg-slate-950 p-3 text-white"><p className="text-[10px] font-semibold">Latest news</p><p className="mt-2 text-[9px] leading-4 text-slate-300">Summer reading week begins Monday.</p><div className="mt-3 flex items-center gap-1 text-[8px] text-sky-300"><span className="h-1.5 w-1.5 rounded-full bg-sky-400" />Live</div></div>
            </div>
            <div className="mt-3 rounded-lg border border-slate-100 p-3"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold text-slate-800">Recent borrowed books</p><span className="text-[9px] text-sky-600">View all</span></div>{['Designing Data-Intensive Applications', 'The Pragmatic Programmer'].map((book, index) => <div key={book} className="mt-2 flex items-center justify-between text-[9px]"><div className="flex items-center gap-2"><div className={`h-5 w-4 rounded-sm ${index ? 'bg-amber-400' : 'bg-rose-400'}`} /><span className="text-slate-600">{book}</span></div><span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] text-emerald-700">Issued</span></div>)}</div>
          </div>
        </div>
      </motion.div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }} className="absolute -bottom-5 -left-3 hidden rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-xl sm:flex sm:items-center sm:gap-2"><div className="rounded-md bg-emerald-100 p-1.5 text-emerald-700"><BookOpenCheck size={14} /></div><div><p className="text-[9px] text-slate-500">Books issued today</p><p className="text-xs font-semibold text-slate-900">+24 records</p></div></motion.div>
    </motion.div>
  )
}

function HomePage() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    const loadNews = async () => { try { const response = await api.get('/news'); setNews(response.data?.slice(0, 3) || []) } catch { setNews([]) } finally { setNewsLoading(false) } }
    loadNews()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setOpen(false)
  const navLinks = [{ label: 'Home', href: '#home' }, { label: 'Features', href: '#features' }, { label: 'Technology', href: '#technology' }, { label: 'About', href: '#about' }]

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-slate-200/80 bg-white/85 py-2 shadow-sm backdrop-blur-xl' : 'bg-transparent py-4'}`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="#home" className="flex items-center gap-2 font-semibold text-slate-950"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white"><BookOpen size={18} /></span>LibraryMS</a>
          <div className="hidden items-center gap-6 lg:flex">{navLinks.map((item) => <a key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">{item.label}</a>)}<Link to="/login" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Login</Link><Link to="/register" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">Register</Link></div>
          <div className="hidden lg:block"><Link to="/login" className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-600"><span>Get Started</span><ArrowRight size={15} /></Link></div>
          <button onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-700 lg:hidden" aria-label="Toggle navigation">{open ? <X size={18} /> : <Menu size={18} />}</button>
        </nav>
        {open && <div className="mx-5 mt-3 rounded-lg border border-slate-200 bg-white p-3 shadow-lg lg:hidden">{navLinks.map((item) => <a onClick={closeMenu} key={item.label} href={item.href} className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">{item.label}</a>)}<Link onClick={closeMenu} to="/login" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Login</Link><Link onClick={closeMenu} to="/register" className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Register</Link><Link onClick={closeMenu} to="/login" className="mt-2 flex h-10 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">Get Started</Link></div>}
      </header>

      <main>
        <section id="home" className="relative overflow-hidden border-b border-slate-100 bg-slate-50 pt-32 sm:pt-36">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-24 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-10 lg:pb-32">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
              <motion.div variants={reveal} className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700"><Sparkles size={15} />A modern library operating system</motion.div>
              <motion.h1 variants={reveal} className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] text-slate-950 sm:text-5xl lg:text-6xl">Discover knowledge with a smarter library experience.</motion.h1>
              <motion.p variants={reveal} className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Manage books, issues, announcements, and community engagement from one welcoming digital hub.</motion.p>
              <motion.div variants={reveal} className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/login" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-sky-600">Get Started <ArrowRight size={16} /></Link><Link to="/news" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50">View Latest News</Link></motion.div>
              <motion.div variants={reveal} className="mt-9 flex items-center gap-3 text-sm text-slate-500"><div className="flex -space-x-2"><span className="h-7 w-7 rounded-full border-2 border-white bg-sky-200" /><span className="h-7 w-7 rounded-full border-2 border-white bg-violet-200" /><span className="h-7 w-7 rounded-full border-2 border-white bg-emerald-200" /></div><span>Built for every library role</span></motion.div>
            </motion.div>
            <DashboardPreview />
          </div>
        </section>

        <motion.section id="features" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.12 } } }} className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><SectionIntro eyebrow="Features" title="Everything your library needs, in one place" description="A polished workflow for catalog discovery, circulation, communication, and day-to-day management." /><div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <motion.article variants={reveal} whileHover={{ y: -6 }} key={title} className="group rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/60"><div className="mb-5 inline-flex rounded-lg bg-sky-50 p-3 text-sky-700 transition group-hover:bg-sky-600 group-hover:text-white"><Icon size={22} /></div><h3 className="text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 leading-7 text-slate-600">{description}</p></motion.article>)}</div></div></motion.section>

        <section id="technology" className="border-y border-slate-200 bg-slate-950 px-5 py-20 text-white sm:px-8 lg:px-10"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="mx-auto max-w-7xl"><SectionIntro inverted eyebrow="Technology" title="Built on a reliable full-stack foundation" description="A practical, modern stack designed for security, speed, and maintainability." /><div className="mt-10 flex flex-wrap justify-center gap-3">{technology.map((item, index) => <motion.div variants={reveal} whileHover={{ scale: 1.05, y: -2 }} key={item} className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"><span className={`h-2 w-2 rounded-full ${['bg-orange-400', 'bg-emerald-400', 'bg-sky-400', 'bg-amber-400'][index % 4]}`} />{item}</motion.div>)}</div></motion.div></section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><SectionIntro eyebrow="For every role" title="A workspace that adapts to your team" description="Purposeful tools give each person the right view and the right controls." /><div className="mt-12 grid gap-5 md:grid-cols-3">{roles.map(({ icon: Icon, title, description, accent }) => <motion.article variants={reveal} whileHover={{ y: -5 }} key={title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"><div className={`inline-flex rounded-lg p-3 ${accent}`}><Icon size={22} /></div><h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 leading-7 text-slate-600">{description}</p><div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-800"><Check size={15} className="text-emerald-600" />Role-specific dashboard</div></motion.article>)}</div></div></motion.section>

        <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="mx-auto max-w-7xl"><SectionIntro eyebrow="Why LibraryMS" title="Designed around the library work that matters" description="Thoughtful tools remove routine friction and make every interaction easier to manage." /><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{reasons.map(({ icon: Icon, text }) => <motion.div variants={reveal} whileHover={{ y: -3 }} key={text} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><span className="rounded-md bg-sky-50 p-2 text-sky-700"><Icon size={17} /></span><span className="text-sm font-semibold text-slate-800">{text}</span></motion.div>)}</div></motion.div></section>

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="px-5 py-20 sm:px-8 lg:px-10"><div className="mx-auto grid max-w-7xl gap-10 rounded-xl bg-slate-950 px-7 py-10 text-white lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:px-12"><SectionIntro inverted eyebrow="By the numbers" title="A dashboard made for momentum" description="Monitor the activity that keeps your library community thriving." align="left" /><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{counters.map((stat) => <motion.div variants={reveal} key={stat.label} className="border-l border-white/15 pl-4"><p className="text-2xl font-semibold sm:text-3xl"><CountUp value={stat.value} suffix={stat.suffix} /></p><p className="mt-1 text-sm text-slate-400">{stat.label}</p></motion.div>)}</div></div></motion.section>

        <section id="news" className="border-y border-slate-200 bg-slate-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-7xl"><SectionIntro eyebrow="Latest news" title="Updates from the library" description="Announcements and important information, shared with the community." />{newsLoading ? <div className="mt-10 grid gap-5 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-48 animate-pulse rounded-lg bg-slate-200" />)}</div> : news.length ? <div className="mt-12 grid gap-5 lg:grid-cols-3">{news.map((item) => <motion.article variants={reveal} whileHover={{ y: -4 }} key={item.newsId} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-2 text-sm font-medium text-sky-700"><Bell size={16} />Library announcement</div><h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3><p className="mt-3 line-clamp-3 leading-7 text-slate-600">{item.description}</p><p className="mt-5 text-sm text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently posted'}</p></motion.article>)}</div> : <motion.div variants={reveal} className="mx-auto mt-10 max-w-xl rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center"><Bell className="mx-auto text-sky-600" size={24} /><h3 className="mt-4 font-semibold text-slate-900">No announcements yet</h3><p className="mt-2 text-sm leading-6 text-slate-600">New library updates will appear here as soon as they are published.</p><Link to="/news" className="mt-5 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800">Visit news page <ArrowRight className="ml-1" size={16} /></Link></motion.div>}</motion.div></section>

        <section id="about" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }}><SectionIntro eyebrow="About the project" title="A complete library platform, built for the real world" description="LibraryMS is a full-stack project that brings a responsive React interface together with a secure Spring Boot API and a PostgreSQL data layer." align="left" /><motion.div variants={reveal} className="mt-8 grid grid-cols-2 gap-3">{['Spring Boot API', 'React interface', 'PostgreSQL data', 'JWT Authentication', 'Responsive design', 'Role-based workflows'].map((item) => <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700"><Check size={16} className="text-emerald-600" />{item}</div>)}</motion.div></motion.div><motion.aside initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl bg-sky-50 p-7 sm:p-9"><div className="flex items-center justify-between"><div className="rounded-lg bg-slate-950 p-3 text-white"><Layers3 size={22} /></div><span className="text-sm font-semibold text-sky-700">Portfolio project</span></div><h3 className="mt-8 text-2xl font-semibold text-slate-950">Built with care for a better library experience.</h3><p className="mt-4 leading-7 text-slate-600">The system combines thoughtful interface design with practical features for every member of the library ecosystem.</p></motion.aside></div></section>

        <section className="bg-slate-950 px-5 py-20 text-white sm:px-8 lg:px-10"><motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-xl border border-white/10 bg-white/5 p-7 sm:p-10 lg:flex-row lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">Developer</p><h2 className="mt-3 text-3xl font-semibold">Made for thoughtful library teams.</h2><p className="mt-3 max-w-xl leading-7 text-slate-300">Explore the project, connect with the developer, or request the full resume.</p></div><div className="flex flex-wrap gap-3"><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-slate-200 transition hover:bg-white/10"><Code2 size={18} /></a><a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-slate-200 transition hover:bg-white/10"><Users size={18} /></a><a href="mailto:developer@example.com" aria-label="Email developer" className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-slate-200 transition hover:bg-white/10"><Mail size={18} /></a><a href="#home" className="inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-100">Resume</a></div></motion.div></section>
      </main>

      <footer className="bg-slate-950 px-5 pb-8 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl border-t border-white/10 pt-8 text-sm text-slate-400"><div className="flex flex-col justify-between gap-6 sm:flex-row"><div><div className="flex items-center gap-2 font-semibold text-white"><BookOpen size={17} />LibraryMS</div><p className="mt-2">A smarter home for every library.</p></div><div className="flex flex-wrap gap-x-5 gap-y-2">{navLinks.map((item) => <a key={item.label} href={item.href} className="hover:text-white">{item.label}</a>)}<a href="mailto:developer@example.com" className="hover:text-white">Contact</a><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a></div></div><p className="mt-8 border-t border-white/10 pt-6 text-xs text-slate-500">Copyright 2026 LibraryMS. All rights reserved.</p></div></footer>
    </div>
  )
}

export default HomePage
