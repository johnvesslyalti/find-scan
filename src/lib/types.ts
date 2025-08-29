export type OHLCV = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type BollingerInputs = {
  length: number
  maType: "SMA"
  source: "close"
  stdDev: number
  offset: number
}

export type BollingerStyle = {
  showBasis: boolean
  basisColor: string
  basisWidth: number
  basisStyle: "solid" | "dashed"

  showUpper: boolean
  upperColor: string
  upperWidth: number
  upperStyle: "solid" | "dashed"

  showLower: boolean
  lowerColor: string
  lowerWidth: number
  lowerStyle: "solid" | "dashed"

  showBackground: boolean
  backgroundOpacity: number
}

export type Props = {
  inputs: BollingerInputs
  style: BollingerStyle
  onChange: (inputs: BollingerInputs, style: BollingerStyle) => void
  onClose: () => void
}