import React from "react";
import { TitleInputProps, TitleInput } from './TitleInput';
import styled from "styled-components";
import { Button } from "antd";

export interface FormTaskCardTitleProps extends TitleInputProps {
    onClose?: () => void;
}

const Wrapper = styled.div`
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

export class FormTaskCardTitle extends React.Component<FormTaskCardTitleProps> {
    render() {
        return <Wrapper>
            <TitleInput {...this.props} />
            <CloseButton icon='close' shape='circle' onClick={this.props.onClose} />
        </Wrapper>;
    }
}
