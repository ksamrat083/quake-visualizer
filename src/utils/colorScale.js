export function magToColor(mag) {
  if (mag >= 6) return '#b30000'   
  if (mag >= 5) return '#e65c00'   
  if (mag >= 4) return '#ff9933'   
  if (mag >= 3) return '#ffd11a'   
  if (mag >= 2) return '#b3ff66'   
  return '#66ff66'                 
}
