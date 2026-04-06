import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { FindOneOptions, FindOptionsWhere, Like, Repository } from 'typeorm';

import {
  IGetUserFilterOptions,
  IUserDataCreation,
  IUserDataRemoving,
  IUserDataUpdate,
} from '@/users/interfaces/user.service.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { UserRolesEnum } from '@/users/enums/user-role.enum';
import { UserStatusEnum } from '@/users/enums/user-status.enum';
import { AdminUserPageDto } from '@/users/dto/admin-users-page.dto';
import { SortingDbHelper } from '@/common/helper/sorting.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async create(data: IUserDataCreation) {
    const user = this.repository.create({
      ...data,
      roles: [UserRolesEnum.CLIENT],
    });
    return await this.repository.save(user);
  }

  async update(data: IUserDataUpdate) {
    const { id, ...updateData } = data;

    const updatedUser = await this.repository.update(id, updateData);

    if (updatedUser.affected == 0)
      throw new NotFoundException('User not found');
    return;
  }

  async getOne(options: IGetUserFilterOptions) {
    const findOneOptions: FindOneOptions<UserEntity> = {};
    findOneOptions.where = this.getFilter(options);
    return await this.repository.findOne(findOneOptions);
  }

  async findOneOrFail(options: IGetUserFilterOptions) {
    const findOneOptions: FindOneOptions<UserEntity> = {};
    findOneOptions.where = this.getFilter(options);
    const user = await this.repository.findOne(findOneOptions);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async getPage(options: AdminUserPageDto) {
    const { limit = 20, page = 1 } = options;
    const sorting = new SortingDbHelper<UserEntity>(options);
    const filter = this.getFilter(options);

    const [models, count] = await this.repository.findAndCount({
      where: filter,
      order: sorting.orderBy,
      take: limit,
      skip: (page - 1) * limit,
    });

    console.log(models[0]);

    return { models, count };
  }

  async checkUserEmailExists(email: string) {
    const user = await this.repository.findOne({ where: { email } });
    if (user) throw new BadRequestException('User email already exist');
    return;
  }

  async remove({ id, password }: IUserDataRemoving) {
    const user = await this.findOneOrFail({ id });
    const verifyPass = await verify(user.password, password);
    if (!verifyPass) throw new BadRequestException('Wrong password');
    await this.repository.update(id, { status: UserStatusEnum.DISABLED });
  }

  getFilter(options: IGetUserFilterOptions): FindOptionsWhere<UserEntity> {
    const filter: FindOptionsWhere<UserEntity> = {};

    if (options.id != null) filter.id = options.id;
    if (options.name != null) filter.name = Like(`%${options.name}%`);
    if (options.email != null) filter.email = options.email;
    if (options.status != null) filter.status = options.status;

    return filter;
  }
}
