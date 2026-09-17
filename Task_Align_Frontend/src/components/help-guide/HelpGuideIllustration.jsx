export default function HelpGuideIllustration({ className = "w-full max-w-[280px] h-auto" }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Glow */}
      <ellipse cx="160" cy="175" rx="130" ry="18" fill="#F0F7F4" />

      {/* Decorative Floating Leaves - Left side */}
      <g opacity="0.85">
        <path
          d="M75 120 C 60 110, 50 85, 52 70 C 68 75, 80 95, 75 120 Z"
          fill="#DAEBE3"
        />
        <path
          d="M62 90 C 50 80, 42 60, 48 50 C 58 55, 68 70, 62 90 Z"
          fill="#B5DBCB"
        />
        <path
          d="M85 85 C 75 75, 72 58, 80 48 C 88 56, 92 72, 85 85 Z"
          fill="#DAEBE3"
        />
        {/* Leaf stems */}
        <path
          d="M72 125 C 68 100, 60 70, 50 52"
          stroke="#163C3B"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* Decorative Floating Leaves - Right side */}
      <g opacity="0.85">
        <path
          d="M245 120 C 260 110, 270 85, 268 70 C 252 75, 240 95, 245 120 Z"
          fill="#DAEBE3"
        />
        <path
          d="M258 90 C 270 80, 278 60, 272 50 C 262 55, 252 70, 258 90 Z"
          fill="#B5DBCB"
        />
        <path
          d="M235 85 C 245 75, 248 58, 240 48 C 232 56, 228 72, 235 85 Z"
          fill="#DAEBE3"
        />
        {/* Leaf stems */}
        <path
          d="M248 125 C 252 100, 260 70, 270 52"
          stroke="#163C3B"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* Small floating decorative dots */}
      <circle cx="95" cy="55" r="3" fill="#B5DBCB" />
      <circle cx="225" cy="50" r="3.5" fill="#99CDD8" />
      <circle cx="270" cy="142" r="2.5" fill="#DAEBE3" />
      <circle cx="50" cy="140" r="3" fill="#99CDD8" />

      {/* Open Book Shadow */}
      <path
        d="M60 155 Q 160 172 260 155 Q 160 162 60 155 Z"
        fill="#163C3B"
        opacity="0.12"
      />

      {/* Open Book Cover Base */}
      <path
        d="M60 148 Q 160 162 260 148 L 260 152 Q 160 166 60 152 Z"
        fill="#163C3B"
      />

      {/* Left Page Base */}
      <path
        d="M62 146 C 100 140, 140 142, 158 147 L 158 92 C 140 87, 100 85, 62 91 Z"
        fill="#E8F4EE"
        stroke="#163C3B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Left Page Layer 2 */}
      <path
        d="M65 149 C 102 143, 142 145, 160 150 L 160 95 C 142 90, 102 88, 65 94 Z"
        fill="#FFFFFF"
        stroke="#163C3B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Right Page Base */}
      <path
        d="M258 146 C 220 140, 180 142, 162 147 L 162 92 C 180 87, 220 85, 258 91 Z"
        fill="#E8F4EE"
        stroke="#163C3B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Right Page Layer 2 */}
      <path
        d="M255 149 C 218 143, 178 145, 160 150 L 160 95 C 178 90, 218 88, 255 94 Z"
        fill="#FFFFFF"
        stroke="#163C3B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Book Center Spine */}
      <path
        d="M160 95 L 160 150"
        stroke="#163C3B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Left Page Text Lines */}
      <path d="M80 108 Q 115 104 142 107" stroke="#C5E0D4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80 117 Q 115 113 142 116" stroke="#C5E0D4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80 126 Q 115 122 142 125" stroke="#C5E0D4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80 135 Q 115 131 135 134" stroke="#C5E0D4" strokeWidth="2.5" strokeLinecap="round" />

      {/* Right Page Text Lines */}
      <path d="M178 107 Q 205 104 240 108" stroke="#C5E0D4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M178 116 Q 205 113 240 117" stroke="#C5E0D4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M178 125 Q 205 122 240 126" stroke="#C5E0D4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M178 134 Q 205 131 225 135" stroke="#C5E0D4" strokeWidth="2.5" strokeLinecap="round" />

      {/* Question Mark Bubble above Left Page */}
      <g>
        <circle cx="120" cy="55" r="16" fill="#DAEBE3" stroke="#163C3B" strokeWidth="2" />
        <path
          d="M115 50 C 115 45, 125 45, 125 50 C 125 54, 120 54, 120 58"
          stroke="#163C3B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="120" cy="63" r="1.5" fill="#163C3B" />
      </g>

      {/* Magnifying Glass on Right Page */}
      <g>
        {/* Glass Outer Rim */}
        <circle
          cx="210"
          cy="120"
          r="22"
          fill="#FFFFFF"
          fillOpacity="0.7"
          stroke="#163C3B"
          strokeWidth="3.5"
        />
        {/* Inner Glare Arc */}
        <path
          d="M196 112 A 16 16 0 0 1 216 102"
          stroke="#99CDD8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Handle */}
        <path
          d="M226 135 L 244 153"
          stroke="#163C3B"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M226 135 L 244 153"
          stroke="#DAEBE3"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
