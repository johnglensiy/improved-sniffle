import { useState } from 'react'
import { MapComponent } from './components/Map'
import { ImageComponent } from './components/ImageComponent'

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

export default function App() {
const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null)
const [imageUrl, setImageUrl] = useState<string | null>(null)

const generateRandomUrl = () => {
    let urlSuffix = DISNEYGUESSR_IMAGE_URLS[Math.floor(Math.random() * DISNEYGUESSR_IMAGE_URLS.length)]
    setImageUrl(`/disneyguessr_jpgs${urlSuffix}`)
}

return (
<div
  style={{
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    width: '100vw',
    height: '100vh',
    padding: 16,
    overflow: 'hidden',
  }}
>
  <div style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'auto' }}>
    <MapComponent onPick={setPicked} />
    <pre>{picked ? JSON.stringify(picked, null, 2) : 'Click map to place marker'}</pre>
  </div>
  <div style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'auto' }}>
    <ImageComponent imageUrl={imageUrl}></ImageComponent>
    <button onClick={generateRandomUrl}>Generate an image {imageUrl}</button>
  </div>
</div>
)
}