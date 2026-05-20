'use client';

export default function MapPlaceholder({ latitude, longitude }) {
  const hasCoords = latitude != null && longitude != null;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (hasCoords && apiKey) {
    const src = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=16&size=600x220&markers=color:red%7C${latitude},${longitude}&key=${apiKey}`;
    return (
      <img
        src={src}
        alt="地图"
        style={{ width: '100%', height: 220, borderRadius: 'var(--radius)', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div className="map-placeholder">
      <div className="icon">🗺️</div>
      <div>Google Maps 选点</div>
      {hasCoords && <div style={{ fontSize: 12 }}>{latitude}, {longitude}</div>}
    </div>
  );
}
