import { IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

export const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      className="!absolute !top-1/2 !translate-y-[-50%] !right-[-2.5rem] z-10 bg-white hover:bg-gray-200 shadow-lg"
    >
      <ArrowForwardIos className="text-black" />
    </IconButton>
  );
};

export const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      className="!absolute !top-1/2 !translate-y-[-50%] !left-[-2.5rem] z-10 bg-white hover:bg-gray-200 shadow-lg"
    >
      <ArrowBackIos className="text-black" />
    </IconButton>
  );
};
