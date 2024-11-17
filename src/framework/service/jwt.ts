import jwt from 'jsonwebtoken';
import { Ijwtservices } from '../../entities/services/ijwt';

class JwtServices implements Ijwtservices {
  constructor(private readonly jwtAccessKey: string, private readonly RefreshKey: string) {}

  
  generateToken(payload: Object, options?: jwt.SignOptions): string {
    return jwt.sign(payload, this.jwtAccessKey, options);
  }

 
  generateRefreshToken(payload: Object, options?: jwt.SignOptions): string {
    return jwt.sign(payload, this.RefreshKey, options);
  }

  
  verifyjwt(refreshToken: string): { success: boolean; newAccessToken?: string; error?: string } {
    try {
      
      const decodedPayload = jwt.verify(refreshToken, this.RefreshKey) as jwt.JwtPayload;

      
      if (!decodedPayload || !decodedPayload.username) {
        throw new Error('Invalid payload in refresh token');
      }

      
      const newAccessToken = jwt.sign(
        { username: decodedPayload.username },
        this.jwtAccessKey,
        { expiresIn: '15m' }
      );

      return { success: true, newAccessToken };

    } catch (error) {
      
      return { success: false, error: error instanceof Error ? error.message : 'Invalid refresh token' };
    }
  }
}

export default JwtServices;
