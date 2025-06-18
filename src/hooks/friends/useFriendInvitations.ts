import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '../reduxHook';
import { setFriendInvitation } from '../../store/notificationSlice';
import { useEffect, useRef } from 'react';
import { getListReqFriend } from '../../services/friendService';
import { IDataFriendReqType } from '../../commom/friend.type';

export const useFriendInvitations = () => {
    const dispatch = useAppDispatch();
    const previousLength = useRef<number | null>(null);

    const query = useQuery<IDataFriendReqType[]>({
        queryKey: ['friend-requests'],
        queryFn: getListReqFriend,
        staleTime: 1000 * 60 * 10,
        initialData: [],

    });

    useEffect(() => {
        if (query.data && query.data.length !== previousLength.current) {
            dispatch(setFriendInvitation(query.data.length));
            previousLength.current = query.data.length;
        }
    }, [query.data, dispatch]);

    return query;
};
