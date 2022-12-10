import useInput from '../../front/src/hooks/useInput';
import React, {useCallback, VFC} from 'react';
import Modal from "../src/components/Modal";
import {Button, Input, Label } from '../../front/src/pages/SignUp/style';
import axios from "axios";
import {useParams} from "react-router";
import {toast} from "react-toastify";
import useSWR from 'swr';
import {IChannel, IUser } from 'front/src/typings/db';
import fetcher from '../src/utils/fetch';


interface Props{
    show: boolean;
    onCloseModal: ()=> void;
    setShowCreateChannelModal:(value:boolean)=>void;
}

const Index : VFC<Props>=({show,onCloseModal,setShowCreateChannelModal}) => {

    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
    const {workspace, channel} = useParams<{workspace: string; channel:string}>();
    const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
    const { mutate: revalidateChannel } = useSWR<IChannel[]>(
        userData ? `/api/workspaces/${workspace}/channels` : null,
        fetcher,
    );

    const onCreateChannel = useCallback(
        (e) => {
            e.preventDefault();
            if (!newChannel || !newChannel.trim()) {
                return;
            }
            axios
                .post(`/api/workspaces/${workspace}/channels`, {
                    name: newChannel,
                })
                .then(() => {
                    setShowCreateChannelModal(false);
                    revalidateChannel();

                    setNewChannel('');
                })
                .catch((error) => {
                    console.dir(error);
                    toast.error(error.response?.data, { position: 'bottom-center' });
                });
        },
        [newChannel, revalidateChannel, setNewChannel, setShowCreateChannelModal, workspace],
    );




    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널 이름</span>
                    <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
                </Label>
                <Button>생성하기</Button>
            </form>
        </Modal>
    );
};

export default Index;