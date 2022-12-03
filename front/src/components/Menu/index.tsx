import React, {CSSProperties, FC, useCallback,PropsWithChildren} from 'react';
import {CloseModalButton, CreateMenu} from "./style";

interface  Props{
    show: boolean;
    onCloseModal:()=>void;
    style:CSSProperties;
    closeButton?:boolean;
}
const Menu:FC<PropsWithChildren<Props>> = ({children,style,show,closeButton,onCloseModal}) => {

        const stopPropagation = useCallback((e)=>{
            e.stopPropagation();
            },[])

    if(!show){
        return null;
    }

    return (
        <CreateMenu onClick={onCloseModal}>
            <div onClick={stopPropagation} style={style}>
                {closeButton && <CloseModalButton onClick={onCloseModal}>
                    $items;
                </CloseModalButton>}
                {children}
            </div>

        </CreateMenu>
    );
};

Menu.defaultProps = {
    closeButton: true
}

export default Menu;