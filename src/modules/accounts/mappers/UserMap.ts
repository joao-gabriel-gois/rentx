import { classToClass } from 'class-transformer';

import IUserResponseDTO from "../DTOs/IUserResponseDTO";
import User from "../infra/typeorm/entities/User";

class UserMap {
  static toDTO({
    id,
    name,
    email,
    driver_license,
    avatar,
    getAvatarUrl
  }: User): IUserResponseDTO {
    const user = classToClass({
      id,
      name,
      email,
      driver_license,
      avatar,
      avatar_url: getAvatarUrl
    });

    return user;
  }
}

export { UserMap };