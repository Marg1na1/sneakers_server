export interface Tokens {
    accessToken: string;
    refreshToken: Token;
}

export interface Token {
    token: string;
    exp: Date;
    userId: string;
    agent: string;
}

export interface JwtPayload {
    id: string;
    email: string;
}
