import React, {useCallback, useRef } from 'react';
import useSWR, { useSWRInfinite } from "swr";
import fetch from "../../utils/fetch";
import {useParams} from "react-router";
import gravatar from 'gravatar';
import { Header } from './styles';
import ChatBox from '../ChatBox';
import ChatList from '../ChatList';
import Scrollbars from 'react-custom-scrollbars-2';
import useInput from '../../../../front/src/hooks/useInput';
import { IDM } from '../../../../front/src/typings/db';
import fetcher from '../../utils/fetch';
import axios from 'axios';


const PAGE_SIZE = 20;
const DirectMessage = () => {
    const {workspace,id} = useParams<{workspace: string; id:string}>()
    const { data: userData} =useSWR(`\`/api/workspaces/${workspace}/users/${id}`,fetch)
    const { data: myData} =useSWR(`\`/api/users`,fetch)
    const {
        data: chatData,
        mutate: mutateChat,
        setSize,
    } = useSWRInfinite<IDM[]>(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
        fetcher,
        {
            onSuccess(data) {
                if (data?.length === 1) {
                    setTimeout(() => {
                        scrollbarRef.current?.scrollToBottom();
                    }, 100);
                }
            },
        },
    );
    const scrollbarRef = useRef<Scrollbars>(null);
    // const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);
    const [chat, onChangeChat, setChat] = useInput('');


    const onSubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            if (chat?.trim() && chatData) {
                const savedChat = chat;
                mutateChat((prevChatData) => {
                    prevChatData?.[0].unshift({
                        id: (chatData[0][0]?.id || 0) + 1,
                        content: savedChat,
                        SenderId: myData.id,
                        Sender: myData,
                        ReceiverId: userData.id,
                        Receiver: userData,
                        createdAt: new Date(),
                    });
                    return prevChatData;
                }, false).then(() => {
                    localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
                    setChat('');
                    if (scrollbarRef.current) {
                        console.log('scrollToBottom!', scrollbarRef.current?.getValues());
                        scrollbarRef.current.scrollToBottom();
                    }
                });
                axios
                    .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                        content: chat,
                    })
                    .catch(console.error);
            }
        },
        [chat, workspace, id, myData, userData, chatData, mutateChat, setChat],
    );

    if(!userData || !myData){
        return null
    }

    return (
        <div>
            <Header>
                <img src={gravatar.url(userData.email, {s:'24px',d: 'retro'})} alt={userData.nickname}/>
                    <span>{userData.nickname}</span>
            </Header>
            <ChatList/>
            <ChatBox
                onSubmitForm={onSubmitForm}
                chat={chat}
                onChangeChat={onChangeChat}
                placeholder={`Message ${userData.nickname}`}
                data={[]}
            />

        </div>
    );
};

export default DirectMessage;