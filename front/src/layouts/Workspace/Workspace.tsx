import axios from 'axios';
import React, {FC, useCallback} from 'react';
import { Redirect } from 'react-router-dom';
import useSWR from "swr";
import fetcher from '../../utils/fetch';

const Workspace:FC = ({children}) => {
    const {data, error, revalidate,mutate} = useSWR('http://localhost:3095/api/users',fetcher);

    const onLogout = useCallback(()=>{
        axios.post('http://localhost:3095/api/users/logout',null,{
            withCredentials: true,
        }).then(()=>{
            //client 데이터 조작
            mutate(false);
        });
    },[])

    if(!data){
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <button onClick={onLogout}>로그아웃</button>
            {children}
        </div>
    );
};

export default Workspace;