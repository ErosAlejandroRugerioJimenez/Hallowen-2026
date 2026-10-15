import { useId } from 'react'

export function PaperGarland({ compact = false }: { compact?: boolean }) {
  const id = useId().replace(/:/g, '')
  const colors = ['#c97547', '#a36897', '#d4a14d', '#538a83', '#c97547', '#a36897', '#d4a14d', '#538a83']
  return <div className={compact ? 'paper-garland compact' : 'paper-garland'} aria-hidden="true">
    <svg viewBox="0 0 1200 102" fill="none">
      <defs>
        <mask id={id}>
          <path d="M0 0h100v68l-10 10-10-7-10 7-10-7-10 7-10-7-10 7-10-7-10 7L0 68Z" fill="white" />
          <g fill="black">
            <path d="M30 31c0-24 40-24 40 0v17H59v10H41V48H30Z" />
            <circle cx="38" cy="8" r="2" /><circle cx="50" cy="6" r="2" /><circle cx="62" cy="8" r="2" />
            <path d="m11 17 5-5 5 5-5 5Zm68 0 5-5 5 5-5 5ZM8 31h4v24H8m80-24h4v24h-4" />
            <circle cx="17" cy="64" r="3" /><circle cx="83" cy="64" r="3" /><path d="m27 63 4-4 4 4-4 4Zm38 0 4-4 4 4-4 4Z" />
          </g>
          <g fill="white"><circle cx="41" cy="31" r="6" /><circle cx="59" cy="31" r="6" /><path d="m50 37-4 7h8Zm-6 12h3v8h-3Zm9 0h3v8h-3Z" /></g>
        </mask>
      </defs>
      <path d="M0 8Q600 62 1200 8" stroke="#bbaa87" strokeOpacity=".45" />
      {colors.map((color, i) => <g key={i} transform={`translate(${30 + i * 148} ${12 + Math.sin((i + .5) / 8 * Math.PI) * 25})`}>
        <g className="paper-flag" style={{ animationDelay: `${i * -.6}s` }}>
          <path d="M0 0h100v68l-10 10-10-7-10 7-10-7-10 7-10-7-10 7-10-7-10 7L0 68Z" fill={color} mask={`url(#${id})`} />
          <path d="M5 4h90" stroke="#f3debc" strokeOpacity=".3" />
        </g>
      </g>)}
    </svg>
  </div>
}

export function FlowerSpray({ side = 'left' }: { side?: 'left' | 'right' }) {
  return <svg className={`flower-spray ${side}`} viewBox="0 0 220 190" aria-hidden="true">
    <g fill="#40674e"><path d="M20 184Q23 62 127 29Q99 83 20 184ZM21 177Q109 82 213 109Q146 153 21 177Z" /><path d="M26 178Q4 97 11 52Q72 89 26 178Z" /></g>
    {[{x:72,y:97,r:26},{x:129,y:64,r:34},{x:166,y:124,r:27},{x:49,y:152,r:25}].map(({x,y,r}, index) => <g key={x} transform={`translate(${x} ${y})`}>
      {Array.from({length:10}, (_, i) => <ellipse key={i} rx={r * .36} ry={r * .65} fill={index % 2 ? '#d88836' : '#bd692f'} transform={`rotate(${i * 36}) translate(0 ${-r * .4})`} />)}
      <circle r={r * .38} fill="#eba347" /><circle r={r * .15} fill="#9b532c" />
    </g>)}
  </svg>
}
