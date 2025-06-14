import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import SanitySvg from "../SanitySvg/SanitySvg"

const VisualElement = ({
  visualElements,
  currentLocale,
}: {
  visualElements: any
  currentLocale: string
}) => {
  return (
    <div className="relative">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        //   autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="w-full"
      >
        {visualElements?.map((element: any, index: number) => (
          <SwiperSlide key={element._id}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div
                className={`bg-gradient-to-br from-${element.gradientFrom} to-${element.gradientTo} rounded-xl p-8 text-center shadow-xl h-64`}
              >
                <div className="w-16 h-16 mx-auto mb-6 text-white">
                  <SanitySvg
                    url={element.icon.asset.url}
                    className="w-full h-full text-white"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {element.heading[currentLocale]}
                </h3>
                <p className="text-orange-100 text-lg">
                  {element.description[currentLocale]}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
              <div className="h-20">
                <div className="mt-6 flex flex-wrap justify-center gap-3 ">
                  {element.badges.map((badge: any, badgeIndex: number) => (
                    <span
                      key={badgeIndex}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                    >
                      {badge[currentLocale]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default VisualElement
