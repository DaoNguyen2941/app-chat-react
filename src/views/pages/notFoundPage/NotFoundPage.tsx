import { Link } from 'react-router-dom';
import backgroundImage from '../../../assets/images/404_background.png';

const NotFoundPage = () => {
    return (
        <div
            className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center text-white text-center px-6"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            <p className="text-xl mt-2 drop-shadow-sm italic">
                Gió đã cuốn trang này đi mất rồi...
            </p>
            <p className="text-md mt-1 mb-6 drop-shadow-sm">
                Có vẻ bạn đã lạc vào một cánh đồng yên tĩnh mà không có gì ở đây cả.
            </p>
            <Link
                to="/"
                className="inline-flex items-center gap-3 px-6 py-3 mt-6 bg-white/10 backdrop-blur-lg text-white border border-white/30 rounded-full shadow-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95"
            >
                <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-white"></span>
                </span>
                <span className="font-medium animate-bounce text-white text-xl ">Chở về</span>
            </Link>


        </div>
    );
};

export default NotFoundPage;
