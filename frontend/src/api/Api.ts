import axios from "axios";
import {TaskData} from "../entities/TaskData";

interface FetchTasksParams {
    skip: number;
    take: number;
    startDate?: string;
    endDate?: string;
    userNames?: string[];
}

interface WriteReportParams {
    comment?: string;
    reportIsoDate?: string;
    tasks?: TaskData[];
}

class DefaultApi {
    public async fetchTasks(params: FetchTasksParams) {
        const url = `/api/fetchTasks`;
        return axios.post(url, params);
    }

    public async isAuthenticated(userId: string): Promise<boolean> {
        try {
            const response = await axios.post('/api/auth', {userId}, {withCredentials: true});
            return response && response.status === 200;
        } catch {
            return false;
        }

    }

    public async getAllUsers() {
        return axios.get('/api/getAllUsers');
    }

    public async writeReport(params: WriteReportParams) {
        const response = await axios.post('/api/writeReport', params, {withCredentials: true});
        return response && response.status === 200;
    }
}

class FakeApi {
    public async fetchTasks(params: FetchTasksParams): Promise<any> {
        return Promise.resolve({data: [{
            "userName": "TestUser",
            "reportIsoDate": "2020-03-12T00:00:00.000Z",
            "comment": "Comment1",
            "taskId": "F8DD3174-BF07-495B-AB47-9954EC99B3BC",
            "tasks": [{
                "theme": "Theme",
                "url": "url",
                "currentState": "",
                "problems": null
            }]
        }, {
            "userName": "TestUser",
            "reportIsoDate": "2020-03-11T00:00:00.000Z",
            "comment": "Comment2",
            "taskId": "6FB9B4A9-DAEC-4A8C-A37E-0699E955BBB8",
            "tasks": [{
                "theme": "Theme2",
                "url": "url2",
                "currentState": "",
                "problems": null
            }]
        }]});
    }

    public async isAuthenticated(userId: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public async getAllUsers() {
        return Promise.resolve({data: ['TestUser']});
    }

    public async writeReport(params: WriteReportParams) {
        return Promise.resolve(true);
    }
}

export const Api = new FakeApi();
