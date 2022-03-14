import {  Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserI } from '../users/dto/user.interface';

const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService 
  ) {}

  async generateJwt(user: UserI): Promise<string> {
    return this.jwtService.signAsync({ user });
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }

}

