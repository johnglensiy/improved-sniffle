import imageDetails from '../backend/gps_data.json'

type ImageDetail = {
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

export const ImageComponent = ({
    imageUrl = "",
}: {
    imageUrl?: string | null;
}) => {
    const base = imageUrl ? getBaseNameFromUrl(imageUrl) : null
    const details = base
      ? (imageDetails as ImageDetail[]).find((d) => getBaseNameFromFile(d.file) === base)
      : undefined

    return (
        <div>
            <img height={500} src={imageUrl ?? ""} alt="Current Image" />
            <pre
              style={{
                marginTop: 12,
                padding: 12,
                background: '#111',
                color: '#eee',
                borderRadius: 8,
                overflowX: 'auto',
              }}
            >
              {details
                ? JSON.stringify(details, null, 2)
                : base
                  ? `No imageDetails found for ${base}`
                  : 'Pick an image to see details'}
            </pre>
        </div>
    );
};
