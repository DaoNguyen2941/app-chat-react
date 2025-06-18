import { useAppDispatch } from '../../hooks/reduxHook';
import { setChatOpent } from "../../store/socketSlice";
import { useEffect } from 'react';
import MuiCarousel from '../pages/home/components/elements/MuiCarousel';

export default function WelCome() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setChatOpent(""))
    }, [])

    const images = [
        'https://pub-5c96059ac5534e72b75bf2db6c189f0c.r2.dev/welCome.png',
        'https://pub-5c96059ac5534e72b75bf2db6c189f0c.r2.dev/functionFriend.png',
        'https://pub-5c96059ac5534e72b75bf2db6c189f0c.r2.dev/Introduce%20group%20function.png',
        'https://pub-5c96059ac5534e72b75bf2db6c189f0c.r2.dev/Introducing%20interface%20brightness.png',
        'https://pub-5c96059ac5534e72b75bf2db6c189f0c.r2.dev/security.png'
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <MuiCarousel images={images} />
        </div>
    )
}