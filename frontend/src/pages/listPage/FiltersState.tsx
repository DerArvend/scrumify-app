import { RangePickerValue } from 'antd/lib/date-picker/interface';

export interface FilterState {
    dateRange?: RangePickerValue;
    userNames?: string[];
}
