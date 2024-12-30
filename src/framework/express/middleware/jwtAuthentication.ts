import { NextFunction, Request, Response, RequestHandler, response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../../mongoose/model/userSchema";
import providerModel from "../../mongoose/model/providerSchema";
import HttpStatus from "../../../entities/rules/statusCodes";

interface TokenPayload {
  roleId: string; 
  role: string;
  iat?: number;
  exp?: number;
}

const refreshAccessToken = (refreshToken: string): string | null => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY as string) as TokenPayload;

    const newAccessToken = jwt.sign(
      { roleId: decoded.roleId, role: decoded.role }, 
      process.env.ACCESS_TOKEN_KEY as string,
      { expiresIn: '1h' }
    );

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

const isUserBlocked = async (roleId: string): Promise<boolean> => {
  const user = await userModel.findById(roleId).select("blocked");
  return user ? user.blocked : false;
};

const isProviderBlocked = async (roleId: string): Promise<boolean> => {
  console.log("Entered into isProviderBlocked://////////////////////////////////////////////////////////////// ")
  const provider = await providerModel.findById(roleId);
  console.log("This is the roleId: ", roleId)
  console.log("This is the status providerBlocked: ", provider)
  return provider ? provider.blocked : false;
};

const verification = (type: "user" | "provider" | "admin"): RequestHandler => {
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
              sameSite: "strict",
              path: "/",
              maxAge: 30 * 60 * 1000,
            });

            const decodedToken = jwt.decode(newAccessToken) as TokenPayload;
            req.body.roleId = decodedToken.roleId;
            req.body.role = decodedToken.role;

            
            console.log("Role ID from middleware (refresh token flow):", decodedToken.roleId);

            const isBlocked = type === "user"
              ? await isUserBlocked(decodedToken.roleId)
              : await isProviderBlocked(decodedToken.roleId);
              ///////////////////////////////////////////////////////////////// new ////////////////////////////////

            if(decodedToken.role !== type){
               res.status(HttpStatus.UNAUTHORIZED).json({success:false, message:"Role is mismatching"});
               return
            }  

            /////////////////////////////////////////////////////////////////////////////////////////////////////////
              
            if (isBlocked) {
              res.status(403).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} is blocked.`, role: type });
              return;
            }


            return next();
          } else {
            res.status(401).json({ message: "Invalid refresh token.", role: type });
            return;
          }
        }
        res.status(401).json({ message: "Access token and refresh token missing.", role: type });
        return;
      }

      jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY as string, async (err: any, decoded: any) => {
        if (err) {
          const refreshToken = req.cookies?.[`${type}RefreshToken`];
          if (refreshToken) {
            const newAccessToken = refreshAccessToken(refreshToken);
            if (newAccessToken) {
              res.cookie(`${type}AccessToken`, newAccessToken, {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                maxAge: 30 * 60 * 1000,
              });
              const decodedToken = jwt.decode(newAccessToken) as TokenPayload;
              req.body.roleId = decodedToken.roleId;
              req.body.role = decodedToken.role;

              
              console.log("Role ID from middleware (new access token flow):", decodedToken.roleId);

              const isBlocked = type === "user"
                ? await isUserBlocked(decodedToken.roleId)
                : await isProviderBlocked(decodedToken.roleId);
                console.log("Thi sis BBBBBBBlocked: ",isBlocked)
                
              if (isBlocked) {
                 res.status(403).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} is blocked.`, role: type });
                 return
              }

              return next();
            } else {
              return res.status(401).json({ message: "Invalid refresh token.", role: type });
            }
          }
          return res.status(401).json({ message: "Access token expired and refresh token missing.", role: type });
        }

        const decodedPayload = decoded as TokenPayload;
        if (decodedPayload.role !== type) {
          return res.status(403).json({ message: `Access denied for role: ${decodedPayload.role}`, role: decodedPayload.role });
        }

        req.body.roleId = decodedPayload.roleId;
        req.body.role = decodedPayload.role;

        
        console.log("Role ID from middleware (access token flow):", decodedPayload.roleId);

        const isBlocked = type === "user"
          ? await isUserBlocked(decodedPayload.roleId)
          : await isProviderBlocked(decodedPayload.roleId);
          
        if (isBlocked) {
           res.status(403).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} is blocked.`, role: type });
           return
        }

        next();
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(500).json({ message: "Internal server error.", role: type });
    }
  };

  
};

export default verification;
