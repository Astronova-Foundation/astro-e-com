'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BannerSlide } from './BannerSlide'
import { CarouselBanner } from '@/types'
import type { Swiper as SwiperType } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

interface BannerCarouselProps {
  banners: CarouselBanner[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  showDots?: boolean
  className?: string
}

export function BannerCarousel({
  banners,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showDots = true,
  className = ''
}: BannerCarouselProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)

  if (!banners || banners.length === 0) return null

  if (banners.length === 1) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="aspect-[21/10] w-full rounded-xl overflow-hidden">
          <BannerSlide banner={banners[0]} />
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full ${className} group`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={setSwiperInstance}
        navigation={false}
        pagination={
          showDots
            ? {
                clickable: true,
                // add our extra class so we can target it specifically
                renderBullet: (index, className) =>
                  `<span class="${className} custom-bullet"></span>`,
              }
            : false
        }
        autoplay={
          autoPlay
            ? {
                delay: autoPlayInterval,
                disableOnInteraction: false,
              }
            : false
        }
        loop={banners.length > 1}
        speed={700}
        effect="slide"
        className="w-full rounded-xl overflow-hidden"
        style={{
          // Keep navigation arrow color variable if you use default arrows somewhere
          '--swiper-navigation-color': '#2563eb',
        } as any}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="aspect-[21/10] w-full">
              <BannerSlide banner={banner} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Controls */}
      {showControls && banners.length > 1 && swiperInstance && (
        <>
          <button
            onClick={() => swiperInstance.slidePrev()}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-none shadow-2xl md:opacity-0 group-hover:md:opacity-100 transition-all duration-300 backdrop-blur-sm hover:scale-110 w-10 h-10 rounded-full items-center justify-center z-10"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          <button
            onClick={() => swiperInstance.slideNext()}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-none shadow-2xl md:opacity-0 group-hover:md:opacity-100 transition-all duration-300 backdrop-blur-sm hover:scale-110 w-10 h-10 rounded-full items-center justify-center z-10"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Pagination bullets CSS override */}
      <style jsx global>{`
        /* base size & spacing for bullets */
        .custom-bullet {
          width: 0.625rem; /* 10px */
          height: 0.625rem;
          display: inline-block;
          border-radius: 9999px;
          margin: 0 6px;
          background-color: rgba(37, 99, 235, 0.18); /* light variant for inactive */
          opacity: 1; /* ensure visible */
          transform: scale(1);
          transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
          box-shadow: none;
        }

        /* active bullet */
        .swiper-pagination-bullet.swiper-pagination-bullet-active.custom-bullet {
          background-color: #2563eb !important; /* your requested color */
          transform: scale(1.25);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.18);
        }

        /* make bullets clickable & ensure they're on top */
        .swiper-pagination {
          z-index: 20;
        }

        /* tweak pagination container position if needed */
        .swiper-pagination-bullets {
          bottom: 12px;
        }
      `}</style>
    </div>
  )
}
