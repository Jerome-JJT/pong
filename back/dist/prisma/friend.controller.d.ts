import { Friends } from '@prisma/client';
import { FriendService } from './friend.service';
export declare class FriendController {
    private friendService;
    constructor(friendService: FriendService);
    createFriend(id: number, user_1: string, user_2: string, status: string, created_at: string): Promise<Friends>;
    getAllUsers(): Promise<Friends[]>;
    getUserById(id: string): Promise<Friends | null>;
}
