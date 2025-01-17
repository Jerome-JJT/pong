import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Block } from "@prisma/client";
import { User } from "@prisma/client";

@Injectable()
export class BlockService {
  constructor(private prisma: PrismaService) {}

  async createBlockRequest(
    blockerId: number,
    blockedId: number
  ): Promise<Block> {
    console.log(blockerId, blockedId);
    if (blockerId == blockedId) {
      throw new Error("Both blockerId and blockedId shouldn't be the same");
    }
    const existingBlock = await this.prisma.block.findFirst({
      where: {
        blockerId: blockerId,
        blockedId: blockedId,
      },
    });
    if (existingBlock) {
      throw new Error("User is already blocked");
    }
    return this.prisma.block.create({
      data: {
        blockerId,
        blockedId,
      },
    });
  }

  async getBlockedUsers(blockerId: number): Promise<User[]> {
    const blocks = await this.prisma.block.findMany({
      where: {
        blockerId: blockerId,
      },
      include: {
        receivedBy: true,
      },
    });

    return blocks.map((block) => block.receivedBy);
  }

  async removeBlockRequest(
    blockerId: number,
    blockedId: number
  ): Promise<Block> {
    const existingBlock = await this.prisma.block.findFirst({
      where: {
        blockerId: blockerId,
        blockedId: blockedId,
      },
    });

    if (!existingBlock) {
      throw new Error("No block found to remove");
    }

    return this.prisma.block.delete({
      where: {
        id: existingBlock.id,
      },
    });
  }

  async getBlocksOfUser(id: number): Promise<User[]> {
    const blocks = await this.prisma.block.findMany({
      where: { blockerId: id },
      include: { receivedBy: true },
    });

    if (!blocks) throw new Error("No blocked users found");

    return blocks.map((block) => block.receivedBy);
  }
}
