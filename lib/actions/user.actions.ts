'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getMissingClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const clerk = await clerkClient();
        const { data } = await clerk.users.getUserList({
            emailAddress: userIds,
        });

        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        // Filter out emails that do exist, and map missing ones to a default object.
        const missingUsers = userIds
            .filter((email) => !users.some((user) => user.email === email))
            .map((email) => ({ id: email, name: "Anonymous", email, avatar: "", color: "" }));

        return parseStringify(missingUsers);
    } catch (error) {
        console.log(`Error fetching users: ${error}`);
    }
};


export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const clerk = await clerkClient();
        const { data } = await clerk.users.getUserList({
            emailAddress: userIds,
        });
        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));
        const sortedUsers = userIds
            .map((email) => users.find((user) => user.email === email))
            .filter((user) => user !== undefined);
        return parseStringify(sortedUsers);
    } catch (error) {
        console.log(`Error fetching users: ${error}`);
    }
};



export const getDocumentUsers = async ({roomId, currentUser, text}: {roomId: string, currentUser: string, text: string}) => {
    try{
        const room = await liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if (text.length > 0) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));

            return parseStringify(filteredUsers);
        }
        
    return parseStringify(users);
    }catch(error){
        console.log(`Error fetching document users: ${error}`);
    }
}