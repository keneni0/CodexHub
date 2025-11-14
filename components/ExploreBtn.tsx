'use client'

import posthog from 'posthog-js'

const ExploreBtn = () => {
  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => {
        posthog.capture('explore_events_button_clicked', { button_id: 'explore-btn' })
        console.log('CLICK')
      }}
    >
      Explore Events   
      <img src="/icons/arrow-down.svg" alt="arrow-right" width={24} height={24} />
    </button>
  )
}

export default ExploreBtn
