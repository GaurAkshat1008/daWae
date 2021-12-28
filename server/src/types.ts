import { Response, Request } from 'express'
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";

export type MyContext = {
    req: Request & {
        session: { userId: number } & Session & Partial<SessionData>;
    }
    redis:Redis
    res: Response
}