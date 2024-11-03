import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

const refreshAccessToken = (refreshToken: string): string | null => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY as string) as TokenPayload;

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      process.env.ACCESS_TOKEN_KEY as string,
      { expiresIn: '1h' } 
    );

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

const verification = (type: string): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accessToken = req.cookies?.[`${type}AccessToken`];

      
      if (!accessToken) {
        const refreshToken = req.cookies?.[`${type}RefreshToken`];
        if (refreshToken) {
          const newAccessToken = refreshAccessToken(refreshToken);
          if (newAccessToken) {
            
            res.cookie(`${type}AccessToken`, newAccessToken, {
              httpOnly: true,
              sameSite: 'strict',
              path: '/',
              maxAge: 30 * 60 * 1000,
            });

            req.body.userId = (jwt.decode(newAccessToken) as TokenPayload).userId;
            req.body.role = (jwt.decode(newAccessToken) as TokenPayload).role;
            return next();
          } else {
             res.status(403).json({ message: 'Invalid refresh token.' });
             return
          }
        }
         res.status(403).json({ message: 'Access token and refresh token missing.' });
         return
      }

      jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY as string, (err: any, decoded: any) => {
        if (err) {
          const refreshToken = req.cookies?.[`${type}RefreshToken`];
          if (refreshToken) {
            const newAccessToken = refreshAccessToken(refreshToken);
            if (newAccessToken) {

              res.cookie(`${type}AccessToken`, newAccessToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 30 * 60 * 1000,
              });
              req.body.userId = (jwt.decode(newAccessToken) as TokenPayload).userId;
              req.body.role = (jwt.decode(newAccessToken) as TokenPayload).role;
              return next();
            } else {
              return res.status(403).json({ message: 'Invalid refresh token.' });
            }
          }
          return res.status(403).json({ message: 'Access token expired and refresh token missing.' });
        }

        const decodedPayload = decoded as TokenPayload;
        if (decodedPayload.role !== type) {
          return res.status(403).json({ message: `Access denied for role: ${decodedPayload.role}` });
        }

        req.body.userId = decodedPayload.userId;
        req.body.role = decodedPayload.role;
        next();
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
};

export default verification;
