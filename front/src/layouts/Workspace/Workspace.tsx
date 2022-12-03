import axios from 'axios';
import React, {FC, useCallback, useState} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import useSWR from "swr";
import fetcher from '../../utils/fetch';
import {
    Channels,
    Chats,
    Header,
    LogOutButton,
    MenuScroll,
    ProfileImg,
    ProfileModal,
    RightMenu,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper
} from "./styles";
import gravatar from 'gravatar';
import Menu from '../../../../front/src/components/Menu';
import Modal from 'front/src/components/Modal';
import loadable from "@loadable/component";

const Channel = loadable(()=> import("../../pages/Channel"));
const DirectMessage = loadable(()=> import("../../pages/DirectMessage"));


const Workspace:FC = ({children}) => {
    const {data, error, revalidate,mutate} = useSWR('http://localhost:3095/api/users',fetcher);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const onLogout = useCallback(()=>{
        axios.post('http://localhost:3095/api/users/logout',null,{
            withCredentials: true,
        }).then(()=>{
            //client 데이터 조작
            mutate(false);
        });
    },[])

    const onClickUserProfile = useCallback(()=>{
        setShowUserMenu((prev) => !prev)
    },[])

    if(!data){
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(data.email,{s: '28px',d:'retro'})} alt={data.emial}/>
                    </span>
                    {showUserMenu && (
                        <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                                {/*<img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />*/}
                                <div>
                                    {/*<span id="profile-name">{userData.nickname}</span>*/}
                                    <span id="profile-active">Active</span>
                                </div>
                            </ProfileModal>
                            <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                        </Menu>
                    )}
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>test</Workspaces>
                <Channels>
                    <WorkspaceName>Sleat</WorkspaceName>
                    <MenuScroll>menu scroll</MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/channel" component={Channel}/>
                        <Route path="/workspace/dm" component={DirectMessage}/>
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            {/*<Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>*/}
            {/*{children}*/}
        </div>
    );
};

export default Workspace;