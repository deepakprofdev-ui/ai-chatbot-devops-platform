/**
 * LapLogo.jsx
 * Lap AI brand logo — inline SVG component.
 * Scalable, no external assets, works everywhere.
 */

export default function LapLogo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lap AI logo"
      role="img"
    >
      {/* ── Petal / figure shapes arranged in a circle ── */}

      {/* Top — Blue figure */}
      <g transform="rotate(0, 100, 100)">
        <circle cx="100" cy="28" r="12" fill="#2196F3" />
        <path d="M78 55 Q100 38 122 55 Q115 80 100 85 Q85 80 78 55Z" fill="#2196F3" />
        <path d="M85 65 Q100 58 115 65 Q108 78 100 80 Q92 78 85 65Z" fill="#4FC3F7" opacity="0.7" />
      </g>

      {/* Top-right — Green figure */}
      <g transform="rotate(51.4, 100, 100)">
        <circle cx="100" cy="28" r="12" fill="#4CAF50" />
        <path d="M78 55 Q100 38 122 55 Q115 80 100 85 Q85 80 78 55Z" fill="#4CAF50" />
        <path d="M85 65 Q100 58 115 65 Q108 78 100 80 Q92 78 85 65Z" fill="#81C784" opacity="0.7" />
      </g>

      {/* Right — Teal/Cyan figure */}
      <g transform="rotate(102.8, 100, 100)">
        <circle cx="100" cy="28" r="12" fill="#00BCD4" />
        <path d="M78 55 Q100 38 122 55 Q115 80 100 85 Q85 80 78 55Z" fill="#00BCD4" />
        <path d="M85 65 Q100 58 115 65 Q108 78 100 80 Q92 78 85 65Z" fill="#80DEEA" opacity="0.7" />
      </g>

      {/* Bottom-right — Orange figure */}
      <g transform="rotate(154.2, 100, 100)">
        <circle cx="100" cy="28" r="12" fill="#FF9800" />
        <path d="M78 55 Q100 38 122 55 Q115 80 100 85 Q85 80 78 55Z" fill="#FF9800" />
        <path d="M85 65 Q100 58 115 65 Q108 78 100 80 Q92 78 85 65Z" fill="#FFCC80" opacity="0.7" />
      </g>

      {/* Bottom — Red figure */}
      <g transform="rotate(205.7, 100, 100)">
        <circle cx="100" cy="28" r="12" fill="#F44336" />
        <path d="M78 55 Q100 38 122 55 Q115 80 100 85 Q85 80 78 55Z" fill="#F44336" />
        <path d="M85 65 Q100 58 115 65 Q108 78 100 80 Q92 78 85 65Z" fill="#EF9A9A" opacity="0.7" />
      </g>

      {/* Bottom-left — Purple/Magenta figure */}
      <g transform="rotate(257.1, 100, 100)">
        <circle cx="100" cy="28" r="12" fill="#9C27B0" />
        <path d="M78 55 Q100 38 122 55 Q115 80 100 85 Q85 80 78 55Z" fill="#9C27B0" />
        <path d="M85 65 Q100 58 115 65 Q108 78 100 80 Q92 78 85 65Z" fill="#CE93D8" opacity="0.7" />
      </g>

      {/* Left — Yellow figure */}
      <g transform="rotate(308.5, 100, 100)">
        <circle cx="100" cy="28" r="12" fill="#FFC107" />
        <path d="M78 55 Q100 38 122 55 Q115 80 100 85 Q85 80 78 55Z" fill="#FFC107" />
        <path d="M85 65 Q100 58 115 65 Q108 78 100 80 Q92 78 85 65Z" fill="#FFE082" opacity="0.7" />
      </g>

      {/* Center overlay — dark navy to tie it together */}
      <circle cx="100" cy="100" r="22" fill="#1a1630" opacity="0.85" />
      <circle cx="100" cy="100" r="16" fill="#6C63FF" opacity="0.9" />
    </svg>
  );
}