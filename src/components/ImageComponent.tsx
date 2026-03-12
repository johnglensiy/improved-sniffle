import type { ImageDetail } from '../App.tsx';

export const ImageComponent = ({
    imageUrl = "",
    imageDetails,
    base
}: {
    imageUrl?: string | null;
    imageDetails?: ImageDetail | null;
    base: string | null;
}) => {
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
              {imageDetails
                ? JSON.stringify(imageDetails, null, 2)
                : base
                  ? `No imageDetails found for ${base}`
                  : 'Pick an image to see details'}
            </pre>
        </div>
    );
};
