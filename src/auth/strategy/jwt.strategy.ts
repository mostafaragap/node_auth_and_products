import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repository/user.repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
    });
  }

  async validate(payload: any) {
    // Fetch the user from the database
    const user = await this.userRepo.findUserById(payload.sub)
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // Return the full user object
    return user;
  }
}