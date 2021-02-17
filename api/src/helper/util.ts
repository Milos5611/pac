import jwt from 'jwt-simple';

export const parseToken = (token: any) => {
    if(token.authorization) {
        return token.authorization;
    }
    return null;
};
