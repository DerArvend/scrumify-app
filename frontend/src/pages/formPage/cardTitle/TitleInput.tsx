import React from 'react';
import styled from 'styled-components';

interface TitleInputFieldProps {
    placeholder?: string;
}

const TitleInputField = styled.div`
    margin: 1px;
    padding: 5px;
    width: 300px;
    white-space: normal;

    &:empty:not(:focus)::before {
        content: "${(props: TitleInputFieldProps) => props.placeholder}";
        color: #ababab;
    }

    &:focus {
        outline: none;
    }
`;

export interface TitleInputProps extends TitleInputFieldProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export class TitleInput extends React.Component<TitleInputProps> {
    render() {
        return <TitleInputField
            onPaste={this.onPaste}
            onChange={this.props.onChange}
            placeholder={this.props.placeholder}
            contentEditable
            spellCheck={false}
            suppressContentEditableWarning >
            {this.props.value}
        </TitleInputField>;
    }

    private onPaste = (e: any) => {
        e.preventDefault();
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand("insertHTML", false, text);
    };
}
