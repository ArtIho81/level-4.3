import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports:[UsersModule, PassportModule, JwtModule.register({
    secret:"SECRET",
    signOptions: {expiresIn: '600s'}
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
