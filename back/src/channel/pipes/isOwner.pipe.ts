import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  ForbiddenException, Inject,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { REQUEST } from '@nestjs/core'

@Injectable()
export class isOwnerPipe implements PipeTransform {
  constructor(
      @Inject(REQUEST) protected readonly request: Request,
      private prisma: PrismaService) {
  }

  async transform(channelId: any, _metadata: ArgumentMetadata) {
    let user = await this.request["user"]
    const userChannel = await this.prisma.userChannel.findFirst({
      where: {
        channelId: channelId,
        AND: [{userId: user.id}]
      },
    });
    console.log ("isOwnerPipe => userChannel.isOwner === ", userChannel.isOwner)
    if (userChannel.isOwner === false) {
      throw new ForbiddenException("User is ban of this channel.");
    }
    return channelId
  }
}
