import type { IEcho } from '@/interfaces/echo';
import json from './echos.json';

const items = json.items as IEcho[];
export default items;
