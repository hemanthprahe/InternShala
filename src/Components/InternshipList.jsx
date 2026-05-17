import React from 'react'
import InternshipCard from './InternshipCard.jsx'
import '../styles/InternshipList.css'

// Skeleton placeholder cards for initial load
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-avatar" />
        <div className="skeleton-meta">
          <div className="skeleton-line" style={{ width: '60%' }} />
          <div className="skeleton-line" style={{ width: '40%' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton-line" style={{ width: '80%' }} />
        <div className="skeleton-line" style={{ width: '55%' }} />
        <div className="skeleton-line" style={{ width: '35%' }} />
      </div>
    </div>
  )
}

export default function InternshipList({ internships, loading, initialLoad }) {
  if (initialLoad) {
    return (
      <div className="internship-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="internship-grid">
        {internships.map((item, index) => (
          <InternshipCard
            key={item.id}
            internship={item}
            style={{ animationDelay: `${(index % 12) * 40}ms` }}
          />
        ))}

        {/* Loading more skeletons at bottom */}
        {loading && !initialLoad && Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={`sk-${i}`} />
        ))}
      </div>
    </>
  )
}
