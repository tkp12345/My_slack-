import axios from 'axios';
import React, {FC, useCallback, useState, VFC} from 'react';
import {Link, Redirect, Route, Switch } from 'react-router-dom';
import useSWR from "swr";
import fetcher from '../../utils/fetch';
import {
    AddButton,
    Channels,
    Chats,
    Header,
    LogOutButton,
    MenuScroll,
    ProfileImg,
    ProfileModal,
    RightMenu, WorkspaceButton,
    WorkspaceModal,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper
} from "./styles";
import gravatar from 'gravatar';
import Menu from '../../../../front/src/components/Menu';
import Modal from '../../../../front/src/components/Modal';
import loadable from "@loadable/component";
import {IChannel, IUser} from "../../typings/db";
import {Button, Input, Label} from '../../../../front/src/pages/SignUp/style';
import useInput from '../../../../front/src/hooks/useInput';
import { toast } from 'react-toastify';
import CreateChannelModal from '../../../../front/createChannelModal';
import {useParams} from "react-router";

const Channel = loadable(()=> import("../../pages/Channel"));
const DirectMessage = loadable(()=> import("../../pages/DirectMessage"));


const Workspace:VFC = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
    const {workspace} = useParams<{workspace:string}>();

    const {data:userData, error, revalidate,mutate} = useSWR<IUser|false>('http://localhost:3095/api/users',fetcher,);
    const {data: channelData,revalidate:revalidateChannel} = useSWR<IChannel[]>(
        userData?`http://localhost:3095/api/workspaces/${workspace}/channels`:null,
        fetcher,
    );


    const onLogout = useCallback(()=>{
        axios.post('http://localhost:3095/api/users/logout',null,{
            withCredentials: true,
        }).then(()=>{
            //client 데이터 조작
            mutate(false);
        });
    },[])

    const onClickUserProfile = useCallback((e)=>{
        e.stopPropagation()
        setShowUserMenu((prev) => !prev)
    },[])

    const onClickcreateWorkspace = useCallback(()=>{
    setShowCreateWorkspaceModal(true)
    },[])

    const onCloseModal =useCallback(()=>{
    setShowCreateWorkspaceModal(false)
        setShowCreateChannelModal(false)
    },[])

    const onClickInviteWorkspace = useCallback(() => {
        setShowInviteWorkspaceModal(true);
    }, []);

    const toggleWorkspaceModal = useCallback(() => {
        setShowWorkspaceModal((prev) => !prev);
    }, []);

    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true);
    }, []);
    const onCreateWorkspace = useCallback((e)=>{
        e.preventDefault();
        if(!newWorkspace || !newWorkspace.trim()) return;
        if(!newUrl || !newUrl.trim()) return;
        if(!newWorkspace) return;

        axios.post('/api/workspaces',{
            workspace:newWorkspace,
            url:newUrl,
        })
            .then(()=>{
                revalidate();
                setShowCreateWorkspaceModal(false);
                setNewWorkspace('');
                setNewUrl('')
            })
            .catch((error)=>{
                console.dir(error);
                toast.error(error.response?.data, { position: 'bottom-center' });
            })

    },[newWorkspace, newUrl])


    console.log('userData:',userData);
    if(!userData){
        return <Redirect to="/login"/>
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.email,{s: '28px',d:'retro'})} alt={userData.email}/>
                    </span>
                    {showUserMenu && (
                        <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                            <ProfileModal>
                                <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.email} />
                                <div>
                                    <span id="profile-name">{userData.nickname}</span>
                                    <span id="profile-active">Active</span>
                                </div>
                            </ProfileModal>
                            <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                        </Menu>
                    )}
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>
                        {userData?.Workspaces?.map((ws)=>{
                            return(
                                <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                                    <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                                </Link>
                            )
                        })}
                    <AddButton onClick={onClickcreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>workspaceName</WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                        <WorkspaceModal>
                            <h2>sleat</h2>
                            <button onClick={onClickAddChannel}>채널 만들기</button>
                            <button onClick={onLogout}>로그아웃</button>
                        </WorkspaceModal>
                    </Menu>
                        {channelData?.map(v=>(<div>{v.name}</div>))}
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/:workspace/channel/:channel" component={Channel}/>
                        <Route path="/workspace/:workspace/dm/:id" component={DirectMessage}/>
                     </Switch>
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>workspace-name</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
                    </Label>
                    <Label id="workspace-url-label">
                        <span>workspace-name</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}/>
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
            <CreateChannelModal
                show={showCreateChannelModal}
                onCloseModal={onCloseModal}
                setShowCreateChannelModal={setShowCreateChannelModal}
            />
            {/*{children}*/}
        </div>
    );
};

export default Workspace;