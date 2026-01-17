import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  // 临时存储验证码（生产环境应使用 Redis）
  private verificationCodes = new Map<string, { code: string; expires: Date }>();

  constructor(private usersService: UsersService) {}

  async sendVerificationCode(phoneNumber: string) {
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 设置验证码5分钟后过期
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    
    this.verificationCodes.set(phoneNumber, { code, expires });
    
    // 这里应该调用短信服务发送验证码
    console.log(`验证码发送到 ${phoneNumber}: ${code}`);
    
    return {
      success: true,
      message: '验证码已发送',
      // 仅在开发环境返回验证码
      ...(process.env.NODE_ENV === 'development' && { code }),
    };
  }

  async verifyCode(phoneNumber: string, code: string) {
    const stored = this.verificationCodes.get(phoneNumber);
    
    if (!stored) {
      throw new UnauthorizedException('验证码不存在或已过期');
    }
    
    if (new Date() > stored.expires) {
      this.verificationCodes.delete(phoneNumber);
      throw new UnauthorizedException('验证码已过期');
    }
    
    if (stored.code !== code) {
      throw new UnauthorizedException('验证码错误');
    }
    
    // 验证成功，删除验证码
    this.verificationCodes.delete(phoneNumber);
    
    // 查找或创建用户
    let user = await this.usersService.findByPhoneNumber(phoneNumber);
    if (!user) {
      user = await this.usersService.create({ phoneNumber });
    }
    
    // 生成 token（这里简化处理，生产环境应使用 JWT）
    const token = this.generateToken(user.id);
    
    return {
      success: true,
      message: '登录成功',
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
      },
      token,
    };
  }

  private generateToken(userId: string): string {
    // 这里应该使用 JWT 生成真实的 token
    return `token_${userId}_${Date.now()}`;
  }
}
