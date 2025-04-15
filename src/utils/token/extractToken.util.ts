import { Request } from "express";
export const extractTokenFromHeader = (request: Request): string | undefined  => {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
}

export const extractTokenFromCookie = (request: Request): string | undefined => {
    const token = request.cookies['accessToken'] || "";
    return token;
}
