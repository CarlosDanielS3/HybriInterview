import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../app/auth/auth.service';
import { UsersService } from '../app/users/users.service';



@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private authService: AuthService, private userService: UsersService) { }

  async use(req, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      console.log(tokenArray);
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      console.log(decodedToken)

      // make sure that the user is not deleted, or that props or rights changed compared to the time when the jwt was issued
      const user = await this.userService.findOneOrFail(decodedToken.user.id);
      console.log(user,'aq')
      if (user) {
        // add the user to our req object, so that we can access it later when we need it
        // if it would be here, we would like overwrite
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (err){
      console.log(err);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

}