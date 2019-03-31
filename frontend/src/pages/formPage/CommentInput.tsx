import * as React from 'react';
import styled from 'styled-components';
import TextArea from 'antd/lib/input/TextArea';

export interface CommentInputProps {
    value?: string;
    onChange?: (value?: string) => void;
}

const Wrapper = styled.div`
    width: 100%;
    max-width: 550px;
`;

const Title = styled.div`
    color: rgba(0, 0, 0, 0.65);
`;

export class CommentInput extends React.Component<CommentInputProps> {
    render() {
        return (
            <Wrapper>
                <Title>Комментарий:</Title>
                <TextArea onChange={this.handleChange} value={this.props.value} />
            </Wrapper>
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        this.props.onChange && this.props.onChange(e.target.value);
}
