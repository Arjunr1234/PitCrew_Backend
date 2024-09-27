import jwt from 'jsonwebtoken';
import { Ijwtservices } from '../../entities/services/ijwt';

class JwtServices implements Ijwtservices {
  constructor(private readonly jwtAccessKey: string, private readonly RefreshKey: string) {}

  // Generates Access Token
  generateToken(payload: Object, options?: jwt.SignOptions): string {
    return jwt.sign(payload, this.jwtAccessKey, options);
  }

  // Generates Refresh Token
  generateRefreshToken(payload: Object, options?: jwt.SignOptions): string {
    return jwt.sign(payload, this.RefreshKey, options);
  }

  // Verifies the refresh token and generates a new access token
  verifyjwt(refreshToken: string): { success: boolean; newAccessToken?: string; error?: string } {
    try {
      // Verify the refresh token with the RefreshKey
      const decodedPayload = jwt.verify(refreshToken, this.RefreshKey) as jwt.JwtPayload;

      // Ensure the expected payload exists
      if (!decodedPayload || !decodedPayload.username) {
        throw new Error('Invalid payload in refresh token');
      }

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { username: decodedPayload.username },
        this.jwtAccessKey,
        { expiresIn: '15m' }
      );

      return { success: true, newAccessToken };

    } catch (error) {
      // Return error information if verification fails
      return { success: false, error: error instanceof Error ? error.message : 'Invalid refresh token' };
    }
  }
}

export default JwtServices;
