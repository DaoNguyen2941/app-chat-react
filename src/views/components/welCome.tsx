import { useAppDispatch } from '../../hooks/reduxHook';
import { setChatOpent } from "../../store/socketSlice";
import { useEffect } from 'react';
import MuiCarousel from '../pages/home/components/elements/MuiCarousel';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/backgroundBoCongAnh.jpg';

export default function WelCome() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setChatOpent(""))
    }, [])

    const images = [
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrbQ33UWGP4KRr1LAMVSprfsLnWT6wo7pB5A&s',
       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY-CeS0jGuV6oyXTRoBH78_6rUjPuhw1rS9g&s',
       'https://gcs.tripi.vn/public-tripi/tripi-feed/img/482525sVw/anh-mo-ta.png'
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <MuiCarousel images={images} />
        </div>
    )
}