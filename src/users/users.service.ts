import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { Users } from './users.entity';
import { dataSource } from '@src/db/data-source';
import { E_Roles } from './roles';
import * as bcrypt from 'bcrypt';
import { ChangeUserPasswordDTO } from './dto/change-user-password.dto';


@Injectable()
export class UsersService {

  async addNewUser(dto: CreateUserDTO) {
    const isUserExist = await dataSource.getRepository(Users).findOneBy({ email: dto.email })
    if (isUserExist) {
      throw new BadRequestException(`User ${dto.email} already exist`)
    }
    const newUser = new Users()
    newUser.email = dto.email
    newUser.password = await bcrypt.hash(dto.password, 10)
    newUser.role = dto.role
    const registeredUser = await dataSource.manager.save(newUser)
    const {password, ...rest} = registeredUser
    return rest
  }

  async changeUserPassword(dto: ChangeUserPasswordDTO) {
    const user = await this.getUser(dto.email)
    if (!user) {
      throw new NotFoundException()
    }
    user.password = await bcrypt.hash(dto.password, 10)
    return await dataSource.manager.save(user)
  }

  async getUser(email: string) {
    return await dataSource.getRepository(Users).findOneBy({email})
  }

}
