'use client'

import { useState } from 'react'
import Image from 'next/image'

type Media = { type: 'image' | 'video'; src: string }

export default function ProductGallery({
  images,
  video,
  name,
}: {
  images: string[]
  video?: string
  name: string
}) {
  const media: Media[] = [
    ...images.map(src => ({ type: 'image' as const, src })),
    ...(video ? [{ type: 'video' as const, src: video }] : []),
  ]
  const [active, setActive] = useState(0)
  const current = media[active]

  if (!current) {
    return <div className="aspect-3/4 w-full rounded-2xl bg-[#E8D5A3]/30" />
  }

  return (
    <div>
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-[#E8D5A3]/20">
        {current.type === 'image' ? (
          <Image src={current.src} alt={name} fill className="object-cover" priority />
        ) : (
          <video src={current.src} controls className="h-full w-full object-cover" />
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {media.map((m, i) => (
            <button
              key={`${m.type}-${i}`}
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? 'border-[#B8962E]' : 'border-transparent'
              }`}
              aria-label={`View ${m.type} ${i + 1}`}
            >
              {m.type === 'image' ? (
                <Image src={m.src} alt="" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#1A1208] text-[10px] uppercase tracking-wider text-white">
                  Video
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
