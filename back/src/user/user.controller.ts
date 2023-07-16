import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

class CreateUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  secretO2FA: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  xp: number;
}

class UpdateUserAvatarDto {
  @ApiProperty()
  avatar: string;
}

class UpdateUserNameDto {
  @ApiProperty()
  username: string;
}

@ApiTags('users')
@Controller('users')
@UseGuards(AuthenticatedGuard)
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create a user' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUser(createUserDto.id, createUserDto.username, createUserDto.secretO2FA, createUserDto.avatar, createUserDto.xp);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get user by id' })
  async getUserById(@Param('id') id: number): Promise<User | null> {
    return this.userService.getUserById(Number(id));
  }

  @Put('avatar/:id')
  @ApiOperation({ summary: 'Update user\'s avatar' })
  @ApiBody({ type: UpdateUserAvatarDto })
  async updateUserAvatar(@Param('id') id: number, @Body() updateUserAvatarDto: UpdateUserAvatarDto): Promise<User> {
    return this.userService.updateUserAvatar(Number(id), updateUserAvatarDto.avatar);
  }

  @Put('username/:id')
  @ApiOperation({ summary: 'Update user\'s username' })
  @ApiBody({ type: UpdateUserNameDto })
  async updateUserName(@Param('id') id: number, @Body() updateUserNameDto: UpdateUserNameDto): Promise<User> {
    return this.userService.updateUserName(Number(id), updateUserNameDto.username);
  }

  @Get('friends/:id')
  @ApiOperation({ summary: 'Get friends of user' })
  async getFriendsOfUser(@Param('id') id: number): Promise<User[]> {
    return this.userService.getFriendsOfUser(Number(id));
  }

  @Get('blocks/:id')
  @ApiOperation({ summary: 'Get blocked of user' })
  async getBlocksOfUser(@Param('id') id: number): Promise<User[]> {
    return this.userService.getBlocksOfUser(Number(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: number): Promise<User> {
    return this.userService.deleteUser(Number(id));
  }

}
