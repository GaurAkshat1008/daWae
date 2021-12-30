import { Response, Request } from 'express'
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { createUpdootLoader } from './utils/createUpdootLoader';
import { createUserLoader } from './utils/createUserLoader';

export type MyContext = {
    req: Request & {
        session: { userId: number } & Session & Partial<SessionData>;
    }
    redis:Redis
    res: Response
    userLoader: ReturnType<typeof createUserLoader>
    updootLoader: ReturnType<typeof createUpdootLoader>
}