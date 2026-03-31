import { useState, useEffect } from 'react'
import imageDetails from './backend/gps_data.json'
import { socket } from './socket.ts'
import { ImmersiveLayout } from './layouts/ImmersiveLayout'
import './layouts/immersive.css'

export const DISNEYGUESSR_IMAGE_URLS = [
    "/IMG_7385.jpeg",
    "/IMG_7386.jpeg",
    "/IMG_7387.jpeg",
    "/IMG_7388.jpeg",
    "/IMG_7389.jpeg",
    "/IMG_7390.jpeg",
    "/IMG_7396.jpeg",
    "/IMG_7397.jpeg",
    "/IMG_7400.jpeg",
    "/IMG_7401.jpeg",
    "/IMG_7402.jpeg",
    "/IMG_7403.jpeg",
    "/IMG_7404.jpeg",
    "/IMG_7405.jpeg",
    "/IMG_7406.jpeg",
    "/IMG_7407.jpeg",
    "/IMG_7408.jpeg",
    "/IMG_7409.jpeg",
    "/IMG_7410.jpeg",
    "/IMG_7414.jpeg",
    "/IMG_7415.jpeg",
    "/IMG_7416.jpeg",
    "/IMG_7417.jpeg",
    "/IMG_7420.jpeg",
    "/IMG_7421.jpeg",
    "/IMG_7422.jpeg",
    "/IMG_7423.jpeg",
    "/IMG_7425.jpeg",
    "/IMG_7426.jpeg",
    "/IMG_7429.jpeg",
  ] as const

export type ImageDetail = {
  file: string
  lat: number
  lng: number
  heading?: number
  alt?: number
  time?: string
}

function getBaseNameFromUrl(url: string): string | null {
  const withoutQuery = url.split('?')[0]
  const parts = withoutQuery.split('/')
  const filename = parts[parts.length - 1]
  if (!filename) return null
  const dot = filename.lastIndexOf('.')
  return dot >= 0 ? filename.slice(0, dot) : filename
}

function getBaseNameFromFile(file: string): string {
  const dot = file.lastIndexOf('.')
  return dot >= 0 ? file.slice(0, dot) : file
}

function r2Distance(
  a: { lat: number; lng: number } | null,
  b: { lat: number; lng: number } | null,
): number | null {
  if (!a || !b) return null
  const dLat = a.lat - b.lat
  const dLng = a.lng - b.lng
  return dLat * dLat + dLng * dLng
}

function maxR2AcrossDetails(all: ImageDetail[]): number {
  let max = 0
  for (let i = 0; i < all.length; i += 1) {
    for (let j = i + 1; j < all.length; j += 1) {
      const dLat = all[i]!.lat - all[j]!.lat
      const dLng = all[i]!.lng - all[j]!.lng
      const r2 = dLat * dLat + dLng * dLng
      if (r2 > max) max = r2
    }
  }
  return max
}

const MAX_R2_WITHIN_DISNEYLAND = maxR2AcrossDetails(imageDetails as ImageDetail[])

export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const generateRandomUrl = () => {
      let urlSuffix = DISNEYGUESSR_IMAGE_URLS[Math.floor(Math.random() * DISNEYGUESSR_IMAGE_URLS.length)]
      setImageUrl(`/disneyguessr_jpgs${urlSuffix}`)
  }

  const base = imageUrl ? getBaseNameFromUrl(imageUrl) : null
  const details = base
    ? (imageDetails as ImageDetail[]).find((d) => getBaseNameFromFile(d.file) === base)
    : undefined

  function onSubmitGuess() {
    if (!picked) return;
    socket.emit('submit-guess', picked);
  }

  function triggerRoundStart() {
    if (!isAdmin) return;
    socket.emit('trigger-round-start');
  }

  // socket connections
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGuessSubmitted(guess: { lat: number, lng: number }) {
      console.log(`${socket.id} a guess was submitted`, guess);
    }
    
    function onSetAdmin() {
      setIsAdmin(true);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('broadcast-guess', onGuessSubmitted);
    socket.on('set-admin', onSetAdmin);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('broadcast-guess', onGuessSubmitted);
      socket.off('set-admin', onSetAdmin);
    }
  }, []);

  // timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    function onRoundStart({ endTime }: { endTime: number}) {
      console.log('round start received', endTime);

      interval = setInterval(() => {
        const remaining = Math.max(0, endTime - Date.now());
        setTimeLeft(Math.ceil(remaining / 1000));
        if (remaining <= 0) clearInterval(interval);
      }, 500);
    }

    socket.on('round-start', onRoundStart);

    return () => {
      socket.off('round-start', onRoundStart);
      clearInterval(interval);
    };
  }, []);

  const score: number | null = (() => {
    if (!picked || !details) return null
    const r2 = r2Distance(picked, { lat: details.lat, lng: details.lng })
    if (r2 == null || MAX_R2_WITHIN_DISNEYLAND === 0) return null
    const clamped = Math.min(r2, MAX_R2_WITHIN_DISNEYLAND)
    const normalized = 1 - clamped / MAX_R2_WITHIN_DISNEYLAND
    return Math.round(normalized * 1000)
  })()

  return (
    <ImmersiveLayout
      imageUrl={imageUrl}
      imageDetails={details}
      base={base}
      picked={picked}
      timeLeft={timeLeft}
      score={score}
      isAdmin={isAdmin}
      isConnected={isConnected}
      onMapPick={setPicked}
      onSubmitGuess={onSubmitGuess}
      onTriggerRoundStart={triggerRoundStart}
      onGenerateImage={generateRandomUrl}
    />
  )
}