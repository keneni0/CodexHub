'use client'

const ExploreBtn = () => {
  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => console.log('CLICK')}
    >
      Explore Events   
      <img src="/icons/arrow-down.svg" alt="arrow-right" width={24} height={24} />
    </button>
  )
}

export default ExploreBtn