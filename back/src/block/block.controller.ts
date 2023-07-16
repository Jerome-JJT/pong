import { Controller, Get, Post, Body, Delete, Param, HttpCode, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Block, User } from '@prisma/client';
import { BlockService } from './block.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';

class CreateBlockDto {
  @ApiProperty()
  blockerId: number;

  @ApiProperty()
  blockedId: number;
}

@ApiTags('block')
@Controller('block')
@UseGuards(AuthenticatedGuard)
export class BlockController {
  constructor(private blockService: BlockService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a block request' })
  @ApiResponse({ status: 201, description: 'The block request has been successfully created.'})
  @ApiBody({ type: CreateBlockDto })
  createBlockRequest(@Body() createBlockDto: CreateBlockDto): Promise<Block> {
    return this.blockService.createBlockRequest(createBlockDto.blockerId, createBlockDto.blockedId);
  }

  @Get('/blocked/:blockerId')
  @ApiOperation({ summary: 'Get blocked users' })
  @ApiResponse({ status: 200, description: 'List of blocked users.'})
  async getBlockedUsers(@Param('blockerId', ParseIntPipe) blockerId: number): Promise<User[]> {
    return this.blockService.getBlockedUsers(blockerId);
  }


  @Delete('/remove')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a block request' })
  @ApiResponse({ status: 204, description: 'The block request has been successfully removed.'})
  @ApiBody({ type: CreateBlockDto })
  removeBlockRequest(@Body() removeBlockDto: CreateBlockDto): Promise<Block> {
    return this.blockService.removeBlockRequest(removeBlockDto.blockerId, removeBlockDto.blockedId);
  }
}
