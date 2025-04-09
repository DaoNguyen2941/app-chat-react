import { useAppDispatch } from '../../hooks/reduxHook';
import { setChatOpent } from "../../store/socketSlice";
import { useEffect } from 'react';

export default function WelCome() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(setChatOpent(""))
    }, [])
    return (
        <b>WelCome</b>
    )
}