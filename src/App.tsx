import { useState } from 'react'
import { MapComponent } from './components/Map'

export default function App() {
const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null)

return (
<>
    <div style={{ padding: 16, width: '50vw', height: '80vh' }}>
        <MapComponent onPick={setPicked} />
        <pre>{picked ? JSON.stringify(picked, null, 2) : 'Click map to place marker'}</pre>
    </div>
    
</>
)
}