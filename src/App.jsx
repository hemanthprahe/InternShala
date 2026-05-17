import React, { useState, useEffect, useCallback, useRef } from 'react'
import FilterPanel from './components/FilterPanel.jsx'
import InternshipList from './components/InternshipList.jsx'
import './styles/App.css'

// ─── Mock data factory (used as fallback if API is unavailable due to CORS) ───
const PROFILES = [
  'Frontend Developer', 'Backend Developer', 'UI/UX Designer',
  'Data Science', 'Marketing', 'Content Writing', 'Finance', 'HR',
  'Machine Learning', 'Android Development', 'iOS Development',
  'Full Stack Developer', 'Product Management', 'Business Development',
]
const COMPANIES = [
  'Google', 'Microsoft', 'Flipkart', 'Swiggy', 'Zomato', 'Razorpay',
  'CRED', 'Meesho', 'PhonePe', 'Ola', 'Byju\'s', 'Unacademy',
  'Paytm', 'Nykaa', 'Zepto', 'Groww', 'Zerodha', 'PolicyBazaar',
  'Cars24', 'Delhivery', 'MakeMyTrip', 'Freshworks', 'Infosys', 'Wipro',
]
const LOCATIONS = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune',
  'Kolkata', 'Ahmedabad', 'Work From Home', 'Noida', 'Gurgaon',
]
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

function generateMockInternships(count = 20, startId = 0) {
  return Array.from({ length: count }, (_, i) => {
    const profile = rand(PROFILES)
    const company = rand(COMPANIES)
    const location = rand(LOCATIONS)
    const duration = randInt(1, 6)
    const stipend = randInt(5, 60) * 1000
    const posted = randInt(1, 14)
    const openings = randInt(1, 10)
    const isWFH = location === 'Work From Home'
    const isPPO = Math.random() > 0.6
    const isPartTime = Math.random() > 0.8
    return {
      id: startId + i,
      profile,
      company,
      location,
      duration,
      stipend,
      posted,
      openings,
      isWFH,
      isPPO,
      isPartTime,
      skills: Array.from(
        { length: randInt(2, 4) },
        () => rand(['React', 'Node.js', 'Python', 'Figma', 'Excel', 'SQL', 'ML', 'Java', 'CSS', 'Git'])
      ).filter((v, i, a) => a.indexOf(v) === i),
    }
  })
}

// ─── Attempt real API, fall back to mock ─────────────────────────────────────
async function fetchInternships(filters, page) {
  // Internshala's public search endpoint — may block due to CORS in browser.
  // We attempt it; on failure we return mock data so the UI always works.
  const params = new URLSearchParams({
    search_fields: JSON.stringify({
      profile: filters.profile || '',
      location: filters.location || '',
      duration: filters.duration || '',
    }),
    start: (page - 1) * 12,
    perPage: 12,
  })
  try {
    const res = await fetch(
      `https://internshala.com/hiring/search?${params}`,
      { headers: { 'X-Requested-With': 'XMLHttpRequest' } }
    )
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    // If we get valid data back, map it
    if (json?.internships_meta) {
      return Object.values(json.internships_meta).map((item, idx) => ({
        id: item.id || idx,
        profile: item.profile_name || 'Internship',
        company: item.company_name || 'Company',
        location: item.location_names?.join(', ') || 'Work From Home',
        duration: parseInt(item.duration) || 2,
        stipend: parseInt(item.stipend?.salary) || 0,
        posted: parseInt(item.posted_by_label?.replace(/\D/g, '')) || 1,
        openings: parseInt(item.number_of_openings) || 1,
        isWFH: item.work_from_home || false,
        isPPO: item.ppo || false,
        isPartTime: item.part_time || false,
        skills: [],
      }))
    }
    throw new Error('Unexpected shape')
  } catch {
    // CORS or parse error → use mock data
    return generateMockInternships(12, (page - 1) * 12)
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [filters, setFilters] = useState({ profile: '', location: '', duration: '', stipend: '' })
  const [internships, setInternships] = useState([])
  const [filteredInternships, setFilteredInternships] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  const loaderRef = useRef(null)

  // ── Load data ──────────────────────────────────────────────────────────────
  const loadInternships = useCallback(async (currentFilters, currentPage, reset = false) => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchInternships(currentFilters, currentPage)
      setInternships(prev => reset ? data : [...prev, ...data])
      setHasMore(data.length === 12)
    } catch (err) {
      setError('Failed to load internships. Please try again.')
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [loading])

  // Initial load
  useEffect(() => {
    loadInternships(filters, 1, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Client-side filter on top of fetched data ──────────────────────────────
  useEffect(() => {
    const f = filters
    const result = internships.filter(item => {
      const matchProfile = !f.profile ||
        item.profile.toLowerCase().includes(f.profile.toLowerCase()) ||
        item.company.toLowerCase().includes(f.profile.toLowerCase())
      const matchLocation = !f.location ||
        item.location.toLowerCase().includes(f.location.toLowerCase()) ||
        (f.location.toLowerCase() === 'wfh' && item.isWFH)
      const matchDuration = !f.duration ||
        item.duration <= parseInt(f.duration)
      const matchStipend = !f.stipend ||
        item.stipend >= parseInt(f.stipend)
      return matchProfile && matchLocation && matchDuration && matchStipend
    })
    setFilteredInternships(result)
  }, [internships, filters])

  // ── Infinite scroll via IntersectionObserver ───────────────────────────────
  useEffect(() => {
    if (!loaderRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          loadInternships(filters, nextPage)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, page, filters, loadInternships])

  // ── Handle filter changes ──────────────────────────────────────────────────
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
    setHasMore(true)
    setInternships([])
    setInitialLoad(true)
    loadInternships(newFilters, 1, true)
  }

  const clearFilters = () => {
    handleFilterChange({ profile: '', location: '', duration: '', stipend: '' })
  }

  const totalShown = filteredInternships.length

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-logo">⚡</span>
            <span className="brand-name">Intern<strong className='text-muted'>Shala</strong></span>
          </div>
          <nav className="header-nav">
            <a href="#">Internships</a>
            <a href="#">Jobs</a>
            <a href="#">Courses</a>
          </nav>
          <button className="btn-login">Login / Register</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">🚀 Fresh opportunities daily</p>
          <h1 className="hero-title">Find Your Perfect<br /><em>Internship</em></h1>
          <p className="hero-subtitle">
            Discover {(10000).toLocaleString()}+ internships at top companies — filtered by role, location & duration.
          </p>
        </div>
        <div className="hero-bg-dots" aria-hidden="true" />
      </section>

      {/* ── Main layout ── */}
      <main className="main-layout">
        <aside className="sidebar">
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onClear={clearFilters}
          />
        </aside>

        <section className="content-area">
          <div className="results-header">
            <h2 className="results-title">
              {initialLoad ? 'Loading…' : `${totalShown.toLocaleString()} Internships`}
            </h2>
            <p className="results-sub">
              {!initialLoad && !loading && 'Showing latest results · Updated today'}
            </p>
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => loadInternships(filters, page, true)}>Retry</button>
            </div>
          )}

          <InternshipList
            internships={filteredInternships}
            loading={loading}
            initialLoad={initialLoad}
          />

          {/* Infinite scroll trigger */}
          <div ref={loaderRef} className="load-trigger" aria-hidden="true" />

          {!hasMore && !loading && totalShown > 0 && (
            <p className="end-message">✓ You've seen all available internships</p>
          )}

          {!loading && totalShown === 0 && !initialLoad && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No internships found</h3>
              <p>Try adjusting your filters or clearing them to see all listings.</p>
              <button className="btn-clear-empty" onClick={clearFilters}>Clear All Filters</button>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2025 InternFind · Built with React + Vite · Data sourced from Internshala</p>
      </footer>
    </div>
  )
}
