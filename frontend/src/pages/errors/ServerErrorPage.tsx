import * as React from 'react';
import { ErrorPage } from "./ErrorPage";

export const ServerErrorPage = () => <ErrorPage errorCode='500' text='Что-то пошло не так. Пожалуйста, повторите запрос позже.' />