import type { OHLCV, BollingerInputs } from "../types"

export type BollingerPoint = {
	time: number
	basis: number | null
	upper: number | null
	lower: number | null
	stdDev: number | null
}

// Helper: simple SMA
function sma(values: number[]) {
	if (values.length === 0) return null
	const sum = values.reduce((a, b) => a + b, 0)
	return sum / values.length
}

/**
 * computeBollingerBands
 * - Basis: SMA(source, length)
 * - StdDev: population standard deviation of the last `length` values
 * - Upper = Basis + multiplier * StdDev
 * - Lower = Basis - multiplier * StdDev
 * - Offset: positive offset shifts the series forward (to later indexes)
 */
export function computeBollingerBands(data: OHLCV[], inputs: BollingerInputs): BollingerPoint[] {
		const { length, stdDev: multiplier, offset } = inputs

	const values: number[] = data.map(d => d.close)
	const result: BollingerPoint[] = data.map(d => ({ time: d.time, basis: null, upper: null, lower: null, stdDev: null }))

	for (let i = 0; i < data.length; i++) {
		if (i + 1 >= length) {
			const window = values.slice(i + 1 - length, i + 1)
			const mean = sma(window) as number

			// population stddev (divide by N). Documented in README.
			const variance = window.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / window.length
			const sd = Math.sqrt(variance)

			const basis = mean
			const upper = basis + multiplier * sd
			const lower = basis - multiplier * sd

			const targetIndex = i + offset
			if (targetIndex >= 0 && targetIndex < result.length) {
				result[targetIndex] = { time: data[targetIndex].time, basis, upper, lower, stdDev: sd }
			}
		}
	}

	return result
}

export default computeBollingerBands
