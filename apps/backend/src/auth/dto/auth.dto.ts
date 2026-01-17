import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendCodeDto {
  @ApiProperty({ description: '手机号码', example: '13800138000' })
  @IsNotEmpty({ message: '手机号码不能为空' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式不正确' })
  phoneNumber: string;
}

export class VerifyCodeDto {
  @ApiProperty({ description: '手机号码', example: '13800138000' })
  @IsNotEmpty({ message: '手机号码不能为空' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式不正确' })
  phoneNumber: string;

  @ApiProperty({ description: '验证码', example: '123456' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString()
  @Matches(/^\d{6}$/, { message: '验证码格式不正确' })
  code: string;
}
