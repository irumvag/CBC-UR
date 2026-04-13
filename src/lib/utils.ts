import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract registration number from a UR student email address.
 * Pattern: name_REGNUMBER@stud.ur.ac.rw  →  REGNUMBER
 * Returns null if no numeric part (5+ digits) is found in the username.
 */
export function extractRegNumber(email: string): string | null {
  const username = email.split('@')[0]
  const parts = username.split('_')
  const numericParts = parts.filter(p => /^\d{5,}$/.test(p))
  if (numericParts.length === 0) return null
  return numericParts.reduce((a, b) => a.length >= b.length ? a : b)
}
