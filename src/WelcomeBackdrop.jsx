// Shared dark, cosmic background used by both the Welcome splash screen
// and the sign-in options screen that follows it, so the two feel like
// one continuous moment rather than two different screens.

// Scattered decorative dots, roughly matching the reference design.
// Each is [top%, left%, size px, opacity].
const DOTS = [
  [8, 60, 3, 0.7],
  [14, 45, 2, 0.6],
  [18, 88, 3, 0.8],
  [24, 37, 2, 0.5],
  [47, 93, 3, 0.7],
  [58, 12, 2, 0.5],
  [62, 8, 3, 0.6],
  [74, 95, 2, 0.6],
  [84, 47, 3, 0.5],
  [91, 68, 2, 0.6],
]

function WelcomeBackdrop({ children }) {
  return (
    <div className="welcome-screen">
      {DOTS.map(([top, left, size, opacity], i) => (
        <span
          key={i}
          className="welcome-dot"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: size,
            height: size,
            '--dot-opacity': opacity,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      {children}
    </div>
  )
}

export default WelcomeBackdrop
