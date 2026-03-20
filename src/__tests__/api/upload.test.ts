import { describe, it, expect } from 'vitest'

// Test the upload validation logic without HTTP layer.
// The actual route is at src/app/api/admin/upload/route.ts

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function validateUpload(file: { size: number; type: string; name: string }): {
  valid: boolean
  error?: string
} {
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large (max 5MB)' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Allowed: jpg, png, webp, gif' }
  }

  return { valid: true }
}

function generateFilename(originalName: string): string {
  const ext = originalName.split('.').pop() || 'jpg'
  // Use a deterministic ID for testing instead of crypto.randomUUID()
  return `test-uuid.${ext}`
}

describe('Upload validation logic', () => {
  it('should reject file that is too large', () => {
    const result = validateUpload({
      size: 10 * 1024 * 1024, // 10MB
      type: 'image/png',
      name: 'huge.png',
    })

    expect(result.valid).toBe(false)
    expect(result.error).toBe('File too large (max 5MB)')
  })

  it('should reject file with invalid type', () => {
    const invalidTypes = [
      { type: 'application/pdf', name: 'doc.pdf' },
      { type: 'text/plain', name: 'readme.txt' },
      { type: 'application/javascript', name: 'script.js' },
      { type: 'image/svg+xml', name: 'icon.svg' },
      { type: 'video/mp4', name: 'clip.mp4' },
    ]

    for (const { type, name } of invalidTypes) {
      const result = validateUpload({ size: 1024, type, name })
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Invalid file type')
    }
  })

  it('should accept valid image uploads', () => {
    const validFiles = [
      { size: 1024, type: 'image/jpeg', name: 'photo.jpg' },
      { size: 2048, type: 'image/png', name: 'screenshot.png' },
      { size: 512, type: 'image/webp', name: 'optimized.webp' },
      { size: 4096, type: 'image/gif', name: 'animation.gif' },
    ]

    for (const file of validFiles) {
      const result = validateUpload(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    }
  })

  it('should accept file exactly at size limit', () => {
    const result = validateUpload({
      size: MAX_SIZE,
      type: 'image/jpeg',
      name: 'exact-limit.jpg',
    })

    expect(result.valid).toBe(true)
  })

  it('should extract correct file extension for output filename', () => {
    expect(generateFilename('photo.jpg')).toBe('test-uuid.jpg')
    expect(generateFilename('screenshot.png')).toBe('test-uuid.png')
    expect(generateFilename('image.webp')).toBe('test-uuid.webp')
    expect(generateFilename('no-extension')).toBe('test-uuid.no-extension')
  })
})
