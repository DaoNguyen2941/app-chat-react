// src/components/MuiCarousel.tsx
import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import { NextArrow, PrevArrow } from './Arrow'; 

interface MuiCarouselProps {
  images: string[];
}

const MuiCarousel: React.FC<MuiCarouselProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box className="w-full max-w-4xl mx-auto mb-6"> 
      <Slider {...settings}>
        {images.map((img, idx) => (
          <Box key={idx} className="p-2">
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-[500px] object-cover rounded-2xl" 
            />
          </Box>
        ))}
      </Slider>
    </Box>

  );
};

export default MuiCarousel;
