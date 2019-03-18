import React from "react";
import { TitleInputProps, TitleInput } from './TitleInput';
import styled from "styled-components";
import { Button, Icon } from "antd";

export interface FormTaskCardTitleProps extends TitleInputProps {
    onClose?: () => void;
}

const Wrapper = styled.div`
    display: flex;
    position: relative;
`;

const CloseButton = styled<any>(Button)`
    && {
        position: absolute;
        right: 0px;
        top: 0px;
        border-color: transparent;
        box-shadow: 0 0 0 0;
    }
`;

const EditIcon = styled<any>(Icon)`
    position: relative;
    top: 9px;
    margin-right: 3px;
`;

export class FormTaskCardTitle extends React.Component<FormTaskCardTitleProps> {
    render() {
        return <Wrapper>
            <EditIcon type='edit' />
            <TitleInput {...this.props} />
            <CloseButton icon='close' shape='circle' onClick={this.props.onClose} />
        </Wrapper>;
    }
}
