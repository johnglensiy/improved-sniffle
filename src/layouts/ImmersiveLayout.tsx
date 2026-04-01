import { MapComponent } from '../components/Map'
import type { ImageDetail } from '../App'

type LatLng = { lat: number; lng: number }

interface ImmersiveLayoutProps {
  imageUrl: string | null
  imageDetails: ImageDetail | undefined
  base: string | null
  picked: LatLng | null
  timeLeft: number | null
  score: number | null
  isAdmin: boolean
  isConnected: boolean
  onMapPick: (p: LatLng) => void
  onSubmitGuess: () => void
  onTriggerRoundStart: () => void
  onGenerateImage: () => void
}

const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const DARK_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function ImmersiveLayout({
  imageUrl,
  imageDetails: _imageDetails,
  base: _base,
  picked,
  timeLeft,
  score,
  isAdmin,
  isConnected,
  onMapPick,
  onSubmitGuess,
  onTriggerRoundStart,
  onGenerateImage: _onGenerateImage,
}: ImmersiveLayoutProps) {
  const isUrgent = timeLeft !== null && timeLeft < 10
  const hasTimer = timeLeft !== null

  return (
    <div className="immersive-root">
      {/* ── Background photo or dark placeholder ── */}
      {imageUrl ? (
        <img
          className="immersive-bg"
          src={imageUrl}
          alt="Disney park location"
          draggable={false}
        />
      ) : (
        <div>
          {/* <span className="immersive-bg-placeholder-text">Disney Guessr</span> */}
        </div>
      )}

      {/* ── Top glass HUD bar ── */}
      <header className="immersive-hud">
        {/* Title */}
        <div className="hud-title">
        </div>

        {/* Timer */}
        <div className={`hud-timer${isUrgent ? ' urgent' : ''}`}>
          <span className="hud-timer-dot" />
          {hasTimer ? (
            <span>{formatTime(timeLeft!)}</span>
          ) : (
            <span className="hud-timer-waiting">Waiting…</span>
          )}
        </div>

        {/* Score */}
        <div className="hud-score">
          {score !== null ? (
            <>
              <span className="hud-score-value">{score}</span>
              <span className="hud-score-divider">/</span>
              <span className="hud-score-total">1000</span>
            </>
          ) : (
            <span className="hud-score-waiting">— / 1000</span>
          )}
        </div>
      </header>

      {/* ── Connection badge ── */}
      <div className={`immersive-connection${isConnected ? ' connected' : ''}`}>
        <span className="immersive-connection-dot" />
        <span>{isConnected ? 'Live' : 'Offline'}</span>
      </div>

      {/* ── Hover-expand map panel (bottom-right) ── */}
      <div className="immersive-map-panel">
        <MapComponent
          onPick={onMapPick}
          tileUrl={DARK_TILE_URL}
          tileAttribution={DARK_TILE_ATTRIBUTION}
        />
      </div>

      {/* ── Submit guess button (bottom-center) ── */}
      <div className="immersive-submit">
        <button
          onClick={onSubmitGuess}
          disabled={!picked || !hasTimer}
          aria-label="Submit your guess"
        >
          Submit Guess ▶
        </button>
      </div>

      {/* ── Admin gear button (bottom-left) ── */}
      {isAdmin && (
        <div className="admin-gear">
          <button
            onClick={onTriggerRoundStart}
            aria-label="Start round (admin)"
            title="Start Round"
          >
            ⚙
          </button>
        </div>
      )}
    </div>
  )
}

export default ImmersiveLayout
