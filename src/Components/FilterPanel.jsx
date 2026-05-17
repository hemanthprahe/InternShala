import React, { useState } from 'react'
import '../styles/FilterPanel.css'

const POPULAR_PROFILES = ['Frontend Developer', 'Data Science', 'Marketing', 'Design', 'Finance']
const POPULAR_LOCATIONS = ['Work From Home', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad']

export default function FilterPanel({ filters, onChange, onClear }) {
  const [local, setLocal] = useState(filters)

  const handleChange = (field, value) => {
    const updated = { ...local, [field]: value }
    setLocal(updated)
    onChange(updated) // live filtering
  }

  const handleClear = () => {
    const empty = { profile: '', location: '', duration: '', stipend: '' }
    setLocal(empty)
    onClear()
  }

  const hasActiveFilters = local.profile || local.location || local.duration || local.stipend

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3 className="filter-title">Filters</h3>
        {hasActiveFilters && (
          <button className="filter-clear-btn" onClick={handleClear}>
            Clear all
          </button>
        )}
      </div>

      {/* ── Profile / Role ── */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-profile">
          <span className="filter-label-icon">💼</span>
          Profile / Role
        </label>
        <div className="filter-input-wrap">
          <input
            id="filter-profile"
            type="text"
            className="filter-input"
            placeholder="e.g. Frontend Developer"
            value={local.profile}
            onChange={(e) => handleChange('profile', e.target.value)}
          />
          {local.profile && (
            <button
              className="filter-input-clear"
              onClick={() => handleChange('profile', '')}
              aria-label="Clear profile"
            >×</button>
          )}
        </div>
        <div className="filter-suggestions">
          {POPULAR_PROFILES.filter(p =>
            !local.profile || p.toLowerCase().includes(local.profile.toLowerCase())
          ).slice(0, 4).map(p => (
            <button
              key={p}
              className={`filter-chip ${local.profile === p ? 'active' : ''}`}
              onClick={() => handleChange('profile', p)}
            >{p}</button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      {/* ── Location ── */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-location">
          <span className="filter-label-icon">📍</span>
          Location
        </label>
        <div className="filter-input-wrap">
          <input
            id="filter-location"
            type="text"
            className="filter-input"
            placeholder="City or Work From Home"
            value={local.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
          {local.location && (
            <button
              className="filter-input-clear"
              onClick={() => handleChange('location', '')}
              aria-label="Clear location"
            >×</button>
          )}
        </div>
        <div className="filter-suggestions">
          {POPULAR_LOCATIONS.filter(l =>
            !local.location || l.toLowerCase().includes(local.location.toLowerCase())
          ).slice(0, 4).map(l => (
            <button
              key={l}
              className={`filter-chip ${local.location === l ? 'active' : ''}`}
              onClick={() => handleChange('location', l)}
            >{l}</button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      {/* ── Duration ── */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-duration">
          <span className="filter-label-icon">📅</span>
          Max Duration
        </label>
        <select
          id="filter-duration"
          className="filter-select"
          value={local.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
        >
          <option value="">Any duration</option>
          <option value="1">Up to 1 month</option>
          <option value="2">Up to 2 months</option>
          <option value="3">Up to 3 months</option>
          <option value="4">Up to 4 months</option>
          <option value="6">Up to 6 months</option>
        </select>
      </div>

      <div className="filter-divider" />

      {/* ── Minimum Stipend ── */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-stipend">
          <span className="filter-label-icon">💰</span>
          Min Stipend
        </label>
        <select
          id="filter-stipend"
          className="filter-select"
          value={local.stipend}
          onChange={(e) => handleChange('stipend', e.target.value)}
        >
          <option value="">Any stipend</option>
          <option value="2000">₹2,000+/month</option>
          <option value="5000">₹5,000+/month</option>
          <option value="10000">₹10,000+/month</option>
          <option value="15000">₹15,000+/month</option>
          <option value="20000">₹20,000+/month</option>
          <option value="30000">₹30,000+/month</option>
        </select>
      </div>

      <div className="filter-divider" />

      {/* ── Active filter summary ── */}
      {hasActiveFilters && (
        <div className="filter-active-summary">
          <p className="filter-active-label">Active filters:</p>
          <div className="filter-active-chips">
            {local.profile && (
              <span className="filter-active-chip">
                {local.profile}
                <button onClick={() => handleChange('profile', '')}>×</button>
              </span>
            )}
            {local.location && (
              <span className="filter-active-chip">
                {local.location}
                <button onClick={() => handleChange('location', '')}>×</button>
              </span>
            )}
            {local.duration && (
              <span className="filter-active-chip">
                ≤{local.duration}mo
                <button onClick={() => handleChange('duration', '')}>×</button>
              </span>
            )}
            {local.stipend && (
              <span className="filter-active-chip">
                ₹{(parseInt(local.stipend)/1000).toFixed(0)}K+
                <button onClick={() => handleChange('stipend', '')}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
