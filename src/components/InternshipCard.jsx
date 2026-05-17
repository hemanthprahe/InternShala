import React from 'react'
import '../styles/InternshipCard.css'

function timeAgo(days) {
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

function formatStipend(amount) {
  if (!amount) return 'Unpaid'
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K/month`
  return `₹${amount}/month`
}

// Generate a deterministic color from a string (for company avatars)
function stringToColor(str) {
  const colors = [
    '#e8f0fe', '#fce8e6', '#e6f4ea', '#fff3e0',
    '#f3e8fd', '#e8f5e9', '#fffde7', '#e0f7fa',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + hash * 31
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function InternshipCard({ internship }) {
  const {
    profile, company, location, duration,
    stipend, posted, openings, isWFH, isPPO,
    isPartTime, skills,
  } = internship

  const avatarBg = stringToColor(company)
  const initials = getInitials(company)

  return (
    <article className="internship-card">
      {/* ── Badges row ── */}
      {(isWFH || isPPO || isPartTime) && (
        <div className="card-badges">
          {isWFH && <span className="badge badge-wfh">🏠 Work from home</span>}
          {isPPO && <span className="badge badge-ppo">⭐ PPO</span>}
          {isPartTime && <span className="badge badge-part">⏰ Part-time</span>}
        </div>
      )}

      {/* ── Header ── */}
      <div className="card-header">
        <div className="card-avatar" style={{ background: avatarBg }}>
          {initials}
        </div>
        <div className="card-meta">
          <h3 className="card-profile">{profile}</h3>
          <p className="card-company">{company}</p>
        </div>
        <div className="card-posted">
          <span className="posted-dot" />
          {timeAgo(posted)}
        </div>
      </div>

      {/* ── Info row ── */}
      <div className="card-info-row">
        <div className="card-info-item">
          <span className="info-icon">📍</span>
          <span className="info-text">{location}</span>
        </div>
        <div className="card-info-item">
          <span className="info-icon">📅</span>
          <span className="info-text">{duration} month{duration !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-info-item stipend">
          <span className="info-icon">💰</span>
          <span className="info-text stipend-text">{formatStipend(stipend)}</span>
        </div>
      </div>

      {/* ── Skills ── */}
      {skills && skills.length > 0 && (
        <div className="card-skills">
          {skills.map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="card-footer">
        <span className="card-openings">
          {openings} opening{openings !== 1 ? 's' : ''}
        </span>
        <button className="card-apply-btn">
          Apply now →
        </button>
      </div>
    </article>
  )
}
