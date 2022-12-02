import React from 'react';
import Workspace from "../../layouts/Workspace/Workspace";
import useSWR from "swr";
import fetcher from "../../utils/fetch";
import {Redirect} from "react-router";

const Channel = () => {


    return (
        <Workspace>
            <div>로그인 완료</div>
        </Workspace>
    );
};

export default Channel;