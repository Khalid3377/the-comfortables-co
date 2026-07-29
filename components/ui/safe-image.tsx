"use client"
import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { Leaf } from 'lucide-react'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackClassName?: string
}

export default function SafeImage({
  src,
  alt,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[#F0EDE8] w-full h-full min-h-[inherit] ${fallbackClassName || ""}`}>
        <Leaf className="text-[#C9B79C]" size={32} />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  )
}
