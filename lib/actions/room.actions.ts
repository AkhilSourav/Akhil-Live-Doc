'use server';

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const createDocument = async ({userId, email}: CreateDocumentParams) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled Document'
        }

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"]
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ["room:write"]
        });
        revalidatePath(`/`);
        return parseStringify(room);

    } catch (error){
        console.log(`Error happended while creating a room: ${error}`);
    }
}

export const getDocument = async ({roomId, userId} : {roomId: string, userId: string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        // TODO: Bring this back when we have permission
        
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        // if (!hasAccess) {
        //     throw new Error(`You don't have access to this Document`);
        // }

        return parseStringify(room);
    } catch (error) {
        console.log(`Error happended while fetching a room: ${error}`);
    }
}