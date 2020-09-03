import jwt from 'jwt-simple';

export const parseToken = (token: any) => {
    if(token.authorization) {
        return jwt.decode(token.authorization, "undefined", true);
    }
    return null;
};
