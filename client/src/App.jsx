import React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Activity, ArrowRight, BadgeCheck, Bell, Building2, CalendarDays, Check, ChevronRight, CircleUserRound, Clock3, FlaskConical, HeartPulse, LayoutDashboard, LockKeyhole, LogOut, MapPin, Menu, Search, ShieldCheck, Sparkles, Star, TestTube2, Users, X } from 'lucide-react';
import { api, money } from './api.js';

const AuthContext = ({ user, logout }) => user ? <div className="user-menu"><span className="avatar">{user.name.charAt(0)}</span><span className="user-copy"><strong>{user.name.split(' ')[0]}</strong><small>{user.role}</small></span><Link className="nav-icon" to="/dashboard" aria-label="Dashboard"><LayoutDashboard size={19} /></Link><button className="nav-icon" onClick={logout} aria-label="Sign out"><LogOut size={19} /></button></div> : <div className="auth-actions"><Link className="text-link" to="/login">Log in</Link><Link className="button button-small" to="/register">Get started</Link></div>;

function Layout({ user, logout }) {
  const [open, setOpen] = useState(false);
  return <>
    <header className="site-header">
      <Link className="brand" to="/"><span className="brand-mark"><FlaskConical size={22} /></span><span>labseek</span></Link>
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        <NavLink to="/laboratories">Find a laboratory</NavLink><NavLink to="/tests">Browse tests</NavLink><a href="/#how">How it works</a><a href="/#trust">For laboratories</a>
      </nav>
      <div className="desktop-auth"><AuthContext user={user} logout={logout} /></div>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
    </header>
  </>;
}

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submit = (event) => { event.preventDefault(); navigate(`/tests?q=${encodeURIComponent(query)}`); };
  return <main>
    <section className="hero">
      <div className="hero-glow one"/><div className="hero-glow two"/>
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={15}/> Healthcare, without the guesswork</span>
        <h1>Better answers begin with the <em>right lab.</em></h1>
        <p>Discover trusted laboratories, compare tests and book appointments — all from one calm, secure place.</p>
        <form className="hero-search" onSubmit={submit}><Search size={21}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="What test are you looking for?"/><button>Search tests <ArrowRight size={18}/></button></form>
        <div className="hero-proof"><span><ShieldCheck size={17}/> Verified laboratories</span><span><LockKeyhole size={17}/> Private by design</span><span><Clock3 size={17}/> Book in minutes</span></div>
      </div>
      <div className="hero-visual" aria-label="LabSeek appointment preview">
        <div className="orbital orbital-a"/><div className="orbital orbital-b"/>
        <div className="result-card floating"><span className="mini-icon mint"><Activity/></span><div><small>Latest result</small><strong>All markers normal</strong></div><span className="status-dot"/></div>
        <div className="appointment-card">
          <div className="card-top"><span className="mini-logo">NP</span><div><strong>NovaPath Sandton</strong><span><BadgeCheck size={14}/> Verified laboratory</span></div></div>
          <div className="appointment-date"><div><small>SEP</small><strong>02</strong></div><p><strong>Full Blood Count</strong><span>Wednesday · 09:30</span></p></div>
          <div className="progress-track"><i/><i/><i/></div><div className="progress-labels"><span>Booked</span><span>Confirmed</span><span>Complete</span></div>
          <button className="mock-button"><Check size={16}/> Appointment confirmed</button>
        </div>
        <div className="rating-card floating"><div className="stars">★★★★★</div><strong>4.9</strong><span>Patient rating</span></div>
      </div>
    </section>

    <section className="trust-strip"><span>Trusted by patients across Gauteng</span><div><b>180+</b><small>Laboratory partners</small></div><div><b>24k</b><small>Bookings completed</small></div><div><b>4.8/5</b><small>Average rating</small></div><div><b>99.9%</b><small>Secure access</small></div></section>

    <section className="section" id="how"><div className="section-heading"><span className="eyebrow">Simple by design</span><h2>Your health journey, made clearer.</h2><p>From searching to results, every step is designed to feel effortless and reassuring.</p></div><div className="steps-grid">
      {[['01',Search,'Discover','Search by test or location and compare verified laboratories.'],['02',CalendarDays,'Book','Choose a time that suits you and receive instant confirmation.'],['03',HeartPulse,'Stay informed','Track your appointment and securely access released results.']].map(([number,Icon,title,copy])=><article className="step-card" key={title}><span className="step-number">{number}</span><div className="step-icon"><Icon/></div><h3>{title}</h3><p>{copy}</p><span className="step-line"/></article>)}
    </div></section>

    <section className="featured section"><div className="section-heading left"><span className="eyebrow">Popular near you</span><h2>Trusted care, close to home.</h2></div><Link className="see-all" to="/laboratories">Explore all laboratories <ArrowRight size={17}/></Link><FeaturedLabs/></section>

    <section className="lab-cta" id="trust"><div><span className="eyebrow light">Built for modern laboratories</span><h2>Spend less time on admin.<br/>More time on care.</h2><p>Manage services, appointments and patient results from one secure, intuitive workspace.</p><Link to="/login" className="button button-light">Partner with LabSeek <ArrowRight size={17}/></Link></div><div className="dashboard-preview"><div className="preview-bar"><span/><span/><span/></div><div className="preview-body"><aside><b>labseek</b><i/><i/><i/><i/></aside><section><small>GOOD MORNING</small><h4>Laboratory overview</h4><div className="preview-stats"><span><b>24</b>Today</span><span><b>8</b>Pending</span><span><b>16</b>Complete</span></div><div className="preview-chart"><i/><i/><i/><i/><i/><i/><i/></div></section></div></div></section>
  </main>;
}

function FeaturedLabs() {
  const [labs, setLabs] = useState([]);
  useEffect(()=>{ api('/laboratories?verified=true').then((data)=>setLabs(data.slice(0,3))).catch(()=>{}); },[]);
  return <div className="lab-grid">{labs.map((lab)=><LabCard key={lab.id} lab={lab}/>)}</div>;
}

function LabCard({ lab }) { return <article className="lab-card"><div className="lab-card-top"><span className="lab-badge" style={{background:lab.accent}}>{lab.initials}</span><span className="verified"><BadgeCheck size={15}/> Verified</span></div><h3>{lab.name}</h3><p className="location"><MapPin size={15}/>{lab.location} · {lab.distance} km</p><p>{lab.description}</p><div className="lab-meta"><span><Star size={15} fill="currentColor"/> {lab.rating} <small>({lab.reviews})</small></span><span><Clock3 size={15}/>{lab.open}</span></div><Link to={`/laboratories/${lab.id}`}>View laboratory <ChevronRight size={17}/></Link></article> }

function Laboratories() {
  const [labs,setLabs]=useState([]), [query,setQuery]=useState(''), [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);api(`/laboratories?q=${encodeURIComponent(query)}`).then(setLabs).finally(()=>setLoading(false));},[query]);
  return <PageShell eyebrow="Verified network" title="Find a laboratory you can trust." copy="Compare locations, services, opening hours and patient ratings."><SearchBox value={query} setValue={setQuery} placeholder="Search by laboratory or location"/>{loading?<Loader/>:<div className="lab-grid catalog">{labs.map(lab=><LabCard key={lab.id} lab={lab}/>)}{!labs.length&&<Empty title="No laboratories found" copy="Try a different name or location."/>}</div>}</PageShell>;
}

function Tests() {
  const initial = new URLSearchParams(location.search).get('q') || '';
  const [tests,setTests]=useState([]),[query,setQuery]=useState(initial),[loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);api(`/tests?q=${encodeURIComponent(query)}`).then(setTests).finally(()=>setLoading(false));},[query]);
  return <PageShell eyebrow="Clear choices" title="Find the right test." copy="Compare prices, preparation guidance and turnaround times across trusted labs."><SearchBox value={query} setValue={setQuery} placeholder="Search blood tests, screenings and panels"/>{loading?<Loader/>:<div className="test-list">{tests.map(test=><article className="test-card" key={test.id}><span className="test-icon"><TestTube2/></span><div className="test-main"><small>{test.category}</small><h3>{test.name}</h3><p><Building2 size={15}/>{test.laboratory.name} · {test.laboratory.location}</p></div><div className="test-detail"><span>Turnaround</span><strong>{test.turnaround}</strong></div><div className="test-price"><span>From</span><strong>{money(test.price)}</strong></div><Link className="button button-small" to={`/laboratories/${test.laboratoryId}?test=${test.id}`}>Book</Link></article>)}{!tests.length&&<Empty title="No tests found" copy="Try another test name or category."/>}</div>}</PageShell>;
}

function LaboratoryDetail({ user }) {
  const { id }=useParams(), navigate=useNavigate(); const [lab,setLab]=useState(null),[testId,setTestId]=useState(''),[message,setMessage]=useState('');
  useEffect(()=>{api(`/laboratories/${id}`).then((data)=>{setLab(data);setTestId(new URLSearchParams(location.search).get('test')||String(data.tests[0]?.id||''));});},[id]);
  const book=async(e)=>{e.preventDefault();if(!user)return navigate('/login');const form=new FormData(e.currentTarget);try{const item=await api('/appointments',{method:'POST',body:JSON.stringify({laboratoryId:Number(id),testId:Number(testId),date:form.get('date'),time:form.get('time'),notes:form.get('notes')})});setMessage(`Booking ${item.reference} received. You can track it from your dashboard.`);}catch(error){setMessage(error.message)}};
  if(!lab)return <Loader/>; const minDate=new Date(Date.now()+86400000).toISOString().slice(0,10);
  return <main className="detail-page"><div className="detail-hero"><div className="lab-badge large" style={{background:lab.accent}}>{lab.initials}</div><div><span className="verified"><BadgeCheck size={15}/>{lab.verified?'Verified laboratory':'Verification pending'}</span><h1>{lab.name}</h1><p><MapPin size={16}/>{lab.address}</p><div className="lab-meta"><span><Star size={16} fill="currentColor"/>{lab.rating} ({lab.reviews} reviews)</span><span><Clock3 size={16}/>{lab.open}</span></div></div></div><div className="detail-grid"><section><h2>About this laboratory</h2><p>{lab.description}</p><h2>Available tests</h2><div className="services">{lab.tests.map(test=><button className={String(test.id)===String(testId)?'service selected':'service'} key={test.id} onClick={()=>setTestId(String(test.id))}><span><small>{test.category}</small><strong>{test.name}</strong><em>{test.preparation}</em></span><span><strong>{money(test.price)}</strong><small>{test.turnaround}</small></span></button>)}</div></section><aside className="booking-card"><span className="eyebrow">Book securely</span><h2>Choose your appointment</h2><form onSubmit={book}><label>Selected test<select value={testId} onChange={(e)=>setTestId(e.target.value)}>{lab.tests.map(test=><option value={test.id} key={test.id}>{test.name} — {money(test.price)}</option>)}</select></label><div className="form-row"><label>Date<input name="date" type="date" min={minDate} required/></label><label>Time<select name="time"><option>08:30</option><option>09:30</option><option>11:00</option><option>14:00</option></select></label></div><label>Notes <span>(optional)</span><textarea name="notes" placeholder="Accessibility needs or anything the lab should know"/></label><button className="button wide">Request appointment <ArrowRight size={17}/></button></form>{message&&<div className="form-message">{message}</div>}<p className="secure-note"><LockKeyhole size={15}/>Your health information is encrypted and private.</p></aside></div></main>;
}

function AuthPage({ mode, onAuth }) {
  const navigate=useNavigate(); const [error,setError]=useState(''); const register=mode==='register';
  const submit=async(e)=>{e.preventDefault();setError('');const data=Object.fromEntries(new FormData(e.currentTarget));try{const payload=await api(`/auth/${mode}`,{method:'POST',body:JSON.stringify(data)});onAuth(payload);navigate('/dashboard');}catch(err){setError(err.message)}};
  return <main className="auth-page"><section className="auth-panel"><Link className="brand" to="/"><span className="brand-mark"><FlaskConical size={22}/></span><span>labseek</span></Link><div><span className="eyebrow">{register?'Start your journey':'Welcome back'}</span><h1>{register?'Create your secure account.':'Care is waiting for you.'}</h1><p>{register?'Book trusted laboratory services and keep your results in one private place.':'Sign in to manage appointments and access your released results.'}</p></div><div className="auth-trust"><span><ShieldCheck/>Privacy-first</span><span><BadgeCheck/>Verified providers</span></div></section><section className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><h2>{register?'Create account':'Sign in'}</h2><p>{register?'Already have an account?':'New to LabSeek?'} <Link to={register?'/login':'/register'}>{register?'Sign in':'Create an account'}</Link></p>{register&&<label>Full name<input name="name" placeholder="Your full name" required/></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" defaultValue={register?'':'patient@labseek.co.za'} required/></label><label>Password<input name="password" type="password" placeholder="At least 8 characters" defaultValue={register?'':'Patient123!'} minLength="8" required/></label>{error&&<div className="error-message">{error}</div>}<button className="button wide">{register?'Create secure account':'Sign in securely'} <ArrowRight size={17}/></button>{!register&&<div className="demo-hint"><strong>Demo accounts</strong><span>Patient: patient@labseek.co.za / Patient123!</span><span>Lab: lab@labseek.co.za / Laboratory123!</span><span>Admin: admin@labseek.co.za / Admin123!</span></div>}</form></section></main>;
}

function Dashboard({ user }) {
  const [appointments,setAppointments]=useState([]),[results,setResults]=useState([]),[summary,setSummary]=useState(null),[selected,setSelected]=useState(null);
  const load=useCallback(()=>{api('/appointments').then(setAppointments);if(user.role==='user')api('/results').then(setResults);if(user.role==='admin')api('/admin/summary').then(setSummary);},[user.role]);
  useEffect(load,[load]); const update=async(id,status)=>{await api(`/appointments/${id}/status`,{method:'PATCH',body:JSON.stringify({status})});load();};
  if(user.role==='admin')return <AdminDashboard summary={summary} appointments={appointments}/>;
  if(user.role==='laboratory')return <LabDashboard appointments={appointments} update={update}/>;
  return <main className="dashboard"><DashboardHeader user={user}/><section className="dashboard-grid"><div className="dash-main"><div className="metrics"><Metric icon={CalendarDays} value={appointments.filter(a=>a.status!=='completed').length} label="Upcoming"/><Metric icon={TestTube2} value={results.length} label="Results ready"/><Metric icon={Bell} value="2" label="Updates"/></div><div className="panel"><div className="panel-heading"><div><small>NEXT UP</small><h2>Your appointments</h2></div><Link to="/tests">Book a test <ArrowRight size={16}/></Link></div>{appointments.map(item=><AppointmentRow key={item.id} item={item}/>)}</div></div><aside className="dash-side panel"><div className="panel-heading"><div><small>HEALTH RECORD</small><h2>Latest results</h2></div></div>{results.map(result=><button key={result.id} className="result-row" onClick={async()=>setSelected(await api(`/results/${result.id}/secure-view`))}><span className="mini-icon mint"><Activity/></span><span><strong>{result.testName}</strong><small>{result.laboratoryName} · {result.date}</small></span><ChevronRight/></button>)}{!results.length&&<Empty title="No released results" copy="Your laboratory will notify you when a result is ready."/>}<div className="privacy-box"><LockKeyhole/><div><strong>Private by design</strong><span>Only you and authorised laboratory staff can access your results.</span></div></div></aside></section>{selected&&<ResultModal result={selected} close={()=>setSelected(null)}/>}</main>;
}

function DashboardHeader({user}){return <div className="dashboard-header"><div><span className="eyebrow">Your care space</span><h1>Good day, {user.name.split(' ')[0]}.</h1><p>Here’s everything you need, right where you left it.</p></div><Link className="button" to="/tests"><Search size={17}/>Find a test</Link></div>}
function Metric({icon:Icon,value,label}){return <div className="metric"><span className="metric-icon"><Icon/></span><div><strong>{value}</strong><span>{label}</span></div></div>}
function AppointmentRow({item,actions}){return <div className="appointment-row"><div className="date-tile"><small>{new Date(item.date+'T00:00').toLocaleDateString('en-ZA',{month:'short'})}</small><strong>{new Date(item.date+'T00:00').getDate()}</strong></div><div><strong>{item.test.name}</strong><span>{item.laboratory.name} · {item.time}</span></div><span className={`status ${item.status}`}>{item.status}</span>{actions}</div>}
function LabDashboard({appointments,update}){return <main className="dashboard"><div className="dashboard-header"><div><span className="eyebrow">Laboratory workspace</span><h1>Today at a glance.</h1><p>Keep patients moving and appointments up to date.</p></div></div><div className="metrics"><Metric icon={CalendarDays} value={appointments.length} label="Appointments"/><Metric icon={Clock3} value={appointments.filter(a=>a.status==='pending').length} label="Pending"/><Metric icon={Check} value={appointments.filter(a=>a.status==='completed').length} label="Complete"/></div><div className="panel full"><div className="panel-heading"><div><small>APPOINTMENT QUEUE</small><h2>Patient bookings</h2></div></div>{appointments.map(item=><AppointmentRow key={item.id} item={item} actions={<select className="status-select" value={item.status} onChange={e=>update(item.id,e.target.value)}><option>pending</option><option>confirmed</option><option>completed</option><option>cancelled</option></select>}/>)}</div></main>}
function AdminDashboard({summary,appointments}){return <main className="dashboard"><div className="dashboard-header"><div><span className="eyebrow">System overview</span><h1>LabSeek operations.</h1><p>Monitor network activity, access and service delivery.</p></div></div><div className="metrics admin-metrics"><Metric icon={Users} value={summary?.users??'—'} label="Users"/><Metric icon={Building2} value={summary?.laboratories??'—'} label="Laboratories"/><Metric icon={ShieldCheck} value={summary?.pendingVerification??'—'} label="To verify"/><Metric icon={CalendarDays} value={summary?.appointments??'—'} label="Bookings"/></div><div className="panel full"><div className="panel-heading"><div><small>RECENT ACTIVITY</small><h2>Appointment activity</h2></div></div>{appointments.map(item=><AppointmentRow key={item.id} item={item}/>)}</div></main>}
function ResultModal({result,close}){return <div className="modal-backdrop" onClick={close}><section className="result-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close}><X/></button><span className="mini-icon mint"><Activity/></span><span className="eyebrow">Secure result</span><h2>{result.testName}</h2><p>{result.laboratoryName} · Released {result.date}</p>{result.values.map(value=><div className="result-value" key={value.name}><span><small>{value.name}</small><strong>{value.value} <em>{value.unit}</em></strong></span><span><small>Reference range</small><strong>{value.range}</strong></span><i>{value.flag}</i></div>)}<div className="reviewed"><BadgeCheck/><span>Reviewed by <strong>{result.reviewedBy}</strong></span></div><p className="result-notice">{result.notice}</p></section></div>}

function PageShell({eyebrow,title,copy,children}){return <main className="page-shell"><header><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></header>{children}</main>}
function SearchBox({value,setValue,placeholder}){return <div className="catalog-search"><Search/><input value={value} onChange={e=>setValue(e.target.value)} placeholder={placeholder}/><span>{value&&<button onClick={()=>setValue('')}><X size={17}/></button>}</span></div>}
function Loader(){return <div className="loader"><span/><p>Finding the best match…</p></div>}
function Empty({title,copy}){return <div className="empty"><Search/><strong>{title}</strong><span>{copy}</span></div>}

export default function App(){const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('labseek-user')||'null'));const onAuth=({user,token})=>{localStorage.setItem('labseek-user',JSON.stringify(user));localStorage.setItem('labseek-token',token);setUser(user)};const logout=()=>{localStorage.removeItem('labseek-user');localStorage.removeItem('labseek-token');setUser(null)};return <><Layout user={user} logout={logout}/><Routes><Route path="/" element={<Home/>}/><Route path="/laboratories" element={<Laboratories/>}/><Route path="/laboratories/:id" element={<LaboratoryDetail user={user}/>}/><Route path="/tests" element={<Tests/>}/><Route path="/login" element={<AuthPage mode="login" onAuth={onAuth}/>}/><Route path="/register" element={<AuthPage mode="register" onAuth={onAuth}/>}/><Route path="/dashboard" element={user?<Dashboard user={user}/>:<AuthPage mode="login" onAuth={onAuth}/>}/><Route path="*" element={<Home/>}/></Routes></>}
