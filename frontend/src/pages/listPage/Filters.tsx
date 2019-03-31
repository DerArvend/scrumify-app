import * as React from 'react';
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import { FilterState } from './FiltersState';
import { DatePicker, Select } from 'antd';
import ru_RU from 'antd/lib/date-picker/locale/ru_RU';
import styled from 'styled-components';
import { isEqual } from 'lodash';

const { RangePicker } = DatePicker;

const FiltersWrapper = styled.div`
    margin: 25px auto;
    display: flex;
    flex-direction: column;
    width: 400px;
`;

interface FiltersModalProps {
    filter: FilterState;
    onFilterChange: (filters: FilterState) => void;
    allUserNames: string[];
}

interface FiltersModalState {
    filter: FilterState;
}

export class Filters extends React.Component<FiltersModalProps, FiltersModalState> {
    constructor(props: FiltersModalProps) {
        super(props);
        this.state = { filter: {} };
    }

    render() {
        return (
            <FiltersWrapper>
                <RangePicker
                    value={this.props.filter.dateRange}
                    onChange={this.handleDateRangeChange}
                    locale={ru_RU}
                    format="DD.MM.YYYY"
                />
                <div style={{ height: '15px' }} />
                <Select
                    mode="multiple"
                    placeholder="Фильтр по пользователям"
                    onChange={this.handleUserNamesChange}
                    onBlur={this.handleUserNamesBlur}
                    allowClear
                >
                    {this.props.allUserNames
                        .sort()
                        .map(name => <Select.Option key={name} value={name}>{name}</Select.Option>)}
                </Select>
            </FiltersWrapper>
        );
    }
    private handleDateRangeChange = (dateRange: RangePickerValue) => {
        this.props.onFilterChange({ dateRange });
    }

    private handleUserNamesBlur = (userNames: string[]) => {
        if (!isEqual(userNames, this.props.filter.userNames)) {
            this.props.onFilterChange({ userNames });
        }
    }

    private handleUserNamesChange = (userNames: string[]) => {
        if (!isEqual(userNames, this.props.filter.userNames) || userNames.length === 0) {
            this.props.onFilterChange({ userNames });
        }
    }
}
