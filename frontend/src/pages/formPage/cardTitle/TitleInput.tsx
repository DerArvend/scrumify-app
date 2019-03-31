import React from 'react';
import styled from 'styled-components';

interface TitleInputFieldProps {
    placeholder?: string;
}

const TitleInputField = styled.div`
    margin: 1px;
    padding: 5px;
    width: 290px;
    white-space: normal;

    &:empty::before {
        content: "${(props: TitleInputFieldProps) => props.placeholder}";
        color: #ababab;
    }

    &:empty:focus::before {
        color: #e0e0e0;
    }


    &:focus {
        outline: none;
    }
`;

export interface TitleInputProps extends TitleInputFieldProps {
    value?: string;
    onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
}

export class TitleInput extends React.Component<TitleInputProps> {
    render() {
        return <TitleInputField
            onPaste={this.onPaste}
            onBlur={this.props.onBlur}
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
