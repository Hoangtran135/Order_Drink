declare module 'express-session' {
    interface Session {
        userId?: number;
        username?: string;
        cart?: any[];
    }
}
export {};
//# sourceMappingURL=server.d.ts.map