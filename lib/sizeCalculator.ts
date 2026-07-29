// lib/sizeCalculator.ts
// BMI + body type + fit preference size lookup logic

export type BodyType = "Slim" | "Regular" | "Athletic" | "Plus";
export type FitPreference = "Relaxed" | "Regular" | "Fitted";
export type SizeResult = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface SizeInput {
  heightCm: number;
  weightKg: number;
  bodyType: BodyType;
  fitPreference: FitPreference;
}

export interface SizeOutput {
  size: SizeResult;
  confidence: number; // 0–100
  note: string;
}

function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

// Base size from BMI
function baseSizeFromBMI(bmi: number): SizeResult {
  if (bmi < 17.5) return "XS";
  if (bmi < 19.5) return "S";
  if (bmi < 22.5) return "M";
  if (bmi < 26.0) return "L";
  if (bmi < 30.0) return "XL";
  return "XXL";
}

const SIZE_ORDER: SizeResult[] = ["XS", "S", "M", "L", "XL", "XXL"];

function shiftSize(base: SizeResult, delta: number): SizeResult {
  const idx = SIZE_ORDER.indexOf(base);
  const newIdx = Math.max(0, Math.min(SIZE_ORDER.length - 1, idx + delta));
  return SIZE_ORDER[newIdx];
}

const BODY_TYPE_ADJUSTMENT: Record<BodyType, number> = {
  Slim: 0,
  Regular: 0,
  Athletic: 1,  // Athletic builds need more room in chest/shoulders
  Plus: 1,
};

const FIT_ADJUSTMENT: Record<FitPreference, number> = {
  Fitted: -1, // Go down one size for a fitted silhouette
  Regular: 0,
  Relaxed: 1, // Go up one size for relaxed
};

const CONFIDENCE_MAP: Record<FitPreference, number> = {
  Fitted: 88,
  Regular: 94,
  Relaxed: 91,
};

export function calculateSize(input: SizeInput): SizeOutput {
  const { heightCm, weightKg, bodyType, fitPreference } = input;

  if (heightCm < 100 || heightCm > 250 || weightKg < 20 || weightKg > 200) {
    return { size: "M", confidence: 60, note: "Please enter a valid height and weight." };
  }

  const bmi = calculateBMI(heightCm, weightKg);
  const baseSize = baseSizeFromBMI(bmi);
  const bodyAdj = BODY_TYPE_ADJUSTMENT[bodyType];
  const fitAdj = FIT_ADJUSTMENT[fitPreference];

  const finalSize = shiftSize(baseSize, bodyAdj + fitAdj);
  const confidence = CONFIDENCE_MAP[fitPreference];

  const notes: Record<FitPreference, string> = {
    Fitted: "For a close fit that follows your silhouette.",
    Regular: "A classic fit — not too loose, not too snug.",
    Relaxed: "Generous room for breathable all-day comfort.",
  };

  return {
    size: finalSize,
    confidence,
    note: notes[fitPreference],
  };
}
