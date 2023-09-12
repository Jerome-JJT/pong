import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiTags,
} from "@nestjs/swagger";
import { Channel } from "@prisma/client";
import { ChannelService } from "../channel.service";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "@nestjs/class-validator";
import { AuthenticatedGuard } from "../../auth/guards/authenticated.guard";
import { IsAdminPipe } from "../pipes/isAdmin.pipe";

export class CreateChannelDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  conv?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  privated?: boolean;


}

export class SendInviteDto {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  ids?: number[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  usernames?: string[];

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  channelId: number;
}

export class UpdateChannelPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ValidateChannelPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

@UseGuards(AuthenticatedGuard)
@ApiTags("channels")
@Controller("channels")
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post()
  @ApiOperation({ summary: "Create a channel" })
  @ApiBody({ type: CreateChannelDto })
  async createChannel(
    @Body() body: CreateChannelDto,
    @Req() req
  ): Promise<Channel> {
    const user = await req.user;
    return this.channelService.createChannel(user.id, body);
  }

  // @Post('invite')
  // @ApiOperation({ summary: 'Invite a list of user on a channel' })
  // @ApiBody({ type: SendInviteDto })
  // async sendInvites(@Body() body: SendInviteDto, @Req() req) {
  //   return this.channelService.sendInvite(await req.user.id, body);
  // }

  @Get("channels")
  @ApiOperation({ summary: "Get channels of user" })
  async getChannelOfUser(@Req() req): Promise<Channel[]> {
    const user = await req.user;
    return this.channelService.getChannelOfUser(Number(user.id));
  }

  @Get("channel/users")
  @ApiOperation({ summary: "Get channels of user" })
  async getAllUsersInChannel(@Req() req): Promise<Channel[]> {
    const channel = await req.channel;
    return this.channelService.getAllUsersInChannel(Number(channel.id));
  }

  @Get("/:channelId/members")
  @ApiOperation({ summary: "Get All users in channel by channel Id" })
  async getChannelAllMembers(
    @Param("channelId", ParseIntPipe) channelId: number
  ): Promise<any> {
    return await this.channelService.getChannelAllMembers(Number(channelId));
  }

  @Post("/:channelId/quit/:userId")
  @ApiOperation({ summary: "Remove a user from a channel (User perspective)" })
  async removeUserFromChannel(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<any> {
    return this.channelService.removeUserFromChannel(channelId, userId);
  }

  @Post("/:channelId/admin-quit/:userId")
  @UsePipes(IsAdminPipe)
  @ApiOperation({ summary: "Remove a user from a channel (Admin perspective)" })
  async removeUserAdminFromChannel(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<any> {
    return this.channelService.removeUserFromChannel(channelId, userId);
  }

  @Post("/:channelId/ban/:userId")
  @UsePipes(IsAdminPipe)
  @ApiOperation({ summary: "Ban a user from a channel" })
  async banUserFromChannel(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<any> {
    return this.channelService.banUserFromChannel(channelId, userId);
  }

  @Post("/:channelId/unban/:userId")
  @UsePipes(IsAdminPipe)
  @ApiOperation({ summary: "Un-Ban a user from a channel" })
  async unbanUserFromChannel(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<any> {
    return this.channelService.unbanUserFromChannel(channelId, userId);
  }

  @Post("/:channelId/mute/:userId")
  @ApiOperation({ summary: "Mute a user from a channel" })
  async muteUserFromChannel(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<any> {
    return this.channelService.muteUserFromChannel(channelId, userId);
  }

  @Get("/:channelId/is-muted/:userId")
  @ApiOperation({ summary: "Check if a user is muted from a channel" })
  async isMutedBannedFromChannel(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Param("userId", ParseIntPipe) userId: number
  ): Promise<boolean> {
    return this.channelService.isUserMutedFromChannel(channelId, userId);
  }

  @Post("/:channelId/set-password")
  @ApiOperation({ summary: "Set or Update password for a channel" })
  @ApiBody({ type: UpdateChannelPasswordDto })
  async setChannelPassword(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Body() updatePasswordDto: UpdateChannelPasswordDto
  ): Promise<Channel> {
    return this.channelService.setChannelPassword(
      channelId,
      updatePasswordDto.password
    );
  }

  @Get("/public-channels")
  @ApiOperation({ summary: "Get all public channels" })
  async getPublicChannels(): Promise<Channel[]> {
    return this.channelService.getPublicChannels();
  }

  @Post("/:channelId/validate-password")
  @ApiOperation({ summary: "Validate password for a channel" })
  @ApiBody({ type: ValidateChannelPasswordDto })
  async validateChannelPassword(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Body() validatePasswordDto: ValidateChannelPasswordDto
  ): Promise<{ isValid: boolean }> {
    const isValid = await this.channelService.validateChannelPassword(
      channelId,
      validatePasswordDto.password
    );
    return { isValid };
  }

  @Post("/:channelId/join")
  @ApiOperation({ summary: "Join a channel" })
  @ApiParam({
    name: "channelId",
    required: true,
    type: Number,
    description: "ID of the channel to join",
  })
  async joinChannel(
    @Param("channelId", ParseIntPipe) channelId: number,
    @Req() req
  ): Promise<any> {
    const user = await req.user;
    return this.channelService.joinChannel(channelId, user.id);
  }
}
