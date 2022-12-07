import useInput from '../../front/src/hooks/useInput';
import React, {useCallback, VFC} from 'react';
import Modal from "../src/components/Modal";
import {Button, Input, Label } from '../../front/src/pages/SignUp/style';


interface Props{
    show: boolean;
    onCloseModal: ()=> void;
}

const Index : VFC<Props>=({show,onCloseModal}) => {

    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

    const onCreateWorkspace = useCallback(()=>{

    },[])


    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateWorkspace}>
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