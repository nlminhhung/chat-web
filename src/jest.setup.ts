import 'whatwg-fetch'; // Polyfills fetch, Request, Response globally
import { TextEncoder, TextDecoder } from 'util';
import dotenv from 'dotenv';

dotenv.config();

(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;
