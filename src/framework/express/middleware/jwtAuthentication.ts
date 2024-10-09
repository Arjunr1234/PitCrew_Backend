import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const refreshAccessToken = (refreshToken: string): string | null => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY as string) as TokenPayload;

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
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
      const accessToken = req.cookies?.[type + "AccessToken"];

      jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY as string, async (err: any) => {
        if (err) {
          const refreshToken = req.cookies?.[type + "RefreshToken"];

          if (refreshToken) {
            const newAccessToken = refreshAccessToken(refreshToken);

            if (newAccessToken) {
              res.cookie(`${type}AccessToken`, newAccessToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 30 * 60 * 1000 
              });

              req.cookies[type + "AccessToken"] = newAccessToken;

             return next(); 
            ; 
            } else {
              res.status(403).json({ message: 'Access token expired and refresh token is invalid.' });
              return; 
            }
          }

          res.status(403).json({ message: 'Access token expired and refresh token is missing.' });
          return; 
        }

        next(); 
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(500).json({ message: 'Internal server error.' });
      return; // Ensure we return to avoid further execution
    }
  };
};

export default verification;
