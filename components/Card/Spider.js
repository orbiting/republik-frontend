import React from 'react'
import { range, max } from 'd3-array'
import { colors, fontStyles } from '@project-r/styleguide'

const maxDomain = 100
const factor = 0.75
const radians = 2 * Math.PI
const levels = 2
const axisLineColor = 'rgba(0,0,0,0.17)'

function getHorizontalPosition (i, range, factor = 1) {
  return range * (1 - factor * Math.sin(-i * radians / nAxes))
}
function getVerticalPosition (i, range, factor = 1) {
  return range * (1 - factor * Math.cos(-i * radians / nAxes))
}

const base = 22.5
export const axes = [
  { rot: 0, text: 'Offene\nAussenpolitik' },
  { rot: base * 2, text: 'Liberale\nWirtschaftspolitik' },
  { rot: base * 4, text: 'Restriktive\nFinanzpolitik' },
  { rot: -base * 2, text: 'Law & Order\n' },
  { rot: 0, text: 'Restriktive\nMigrationspolitik' },
  { rot: base * 2, text: 'Ausgebauter\nUmweltschutz' },
  { rot: -base * 4, text: 'Ausgebauter\nSozialstaat' },
  { rot: -base * 2, text: 'Liberale\nGesellschaft' }
]
const nAxes = axes.length

const Spider = ({ data, fill, size }) => {
  const cx = size / 2
  const cy = size / 2
  const points = data.map((d, i) => {
    return {
      x: getHorizontalPosition(i, cx, (d / maxDomain) * factor),
      y: getVerticalPosition(i, cy, (d / maxDomain) * factor),
      value: d
    }
  })

  const maxValue = max(data)

  const radius = factor * Math.min(cx, cy)
  const levelFactors = range(0, levels).map((level) => {
    return radius * ((level + 1) / levels)
  })

  return (
    <svg width={size} height={size}>
      {levelFactors.map(levelFactor => (
        <g key={levelFactor}>
          {range(0, nAxes).map(i =>
            <line key={i}
              stroke={axisLineColor}
              strokeWidth='1'
              x1={getHorizontalPosition(i, levelFactor)}
              y1={getVerticalPosition(i, levelFactor)}
              x2={getHorizontalPosition(i + 1, levelFactor)}
              y2={getVerticalPosition(i + 1, levelFactor)}
              transform={`translate(${cx - levelFactor} ${cy - levelFactor})`} />
          )}
        </g>
      ))}
      {axes.map((_, i) => (
        <line
          key={`axis-${i}`}
          stroke={axisLineColor}
          strokeWidth='1'
          x1={cx}
          y1={cy}
          x2={getHorizontalPosition(i, cx, factor)}
          y2={getVerticalPosition(i, cy, factor)} />
      ))}
      {axes.map(({ text, rot }, i) => {
        const below = i > 2 && i < 6
        const highlight = data[i] === maxValue

        const x = getHorizontalPosition(i, cx, factor)
        const y = getVerticalPosition(i, cx, factor)

        return (
          <g key={`labels-${i}`} transform={`translate(${x} ${y}) rotate(${rot})`}>
            <text
              fill={colors.text}
              style={{
                ...fontStyles[highlight ? 'sansSerifMedium' : 'sansSerif'],
                fontSize: highlight ? 12 : 11
              }}
              textAnchor='middle'
            >
              {text
                .split('\n')
                .map((line, i, all) =>
                  <tspan
                    key={i}
                    x='0'
                    y={below
                      ? `${1.1 * (i + 1)}em`
                      : `-${0.5 + 1.1 * (all.length - i - 1)}em`}>
                    {line}
                  </tspan>
                )}
            </text>
          </g>
        )
      })}
      <polygon fill={fill} fillOpacity={0.7} points={points.map((p) => {
        return [p.x, p.y].join(',')
      }).join(' ')} />
      {points.map(({ value, x, y }, i) => {
        if (value !== maxValue) {
          return null
        }
        const below = i > 2 && i < 6
        const { rot } = axes[i]

        return <g key={`max-${i}`} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <text
            style={{
              ...fontStyles.sansSerifMedium,
              fontSize: 12
            }}
            fill={colors.text}
            textAnchor='middle'
            dy={below
              ? value > 92 ? '0em' : '0.8em'
              : value > 92 ? '0.8em' : '0em'}>
            {Math.round(value)}
          </text>
        </g>
      })}
    </svg>
  )
}

export default Spider
