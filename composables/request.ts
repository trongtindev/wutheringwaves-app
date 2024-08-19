import axios from 'axios';
import axiosRetry from 'axios-retry';

const instance = axios.create();
axiosRetry(instance);

export const useRequest = () => instance;
