import * as React from 'react';
import { ErrorPage } from "./ErrorPage";

export const NotFoundPage = () => <ErrorPage errorCode='404' text='Страница не найдена' />