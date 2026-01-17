import { Injectable, NotFoundException } from '@nestjs/common';

export interface User {
  id: string;
  phoneNumber: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  // 临时存储用户（生产环境应使用数据库）
  private users: User[] = [];

  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    return this.users.find((user) => user.phoneNumber === phoneNumber);
  }

  async findOne(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async create(data: { phoneNumber: string }): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      phoneNumber: data.phoneNumber,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}
