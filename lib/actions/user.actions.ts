'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
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

    const sortedUsers: { id: string; name: string; email: string; avatar: string }[] = [];
    const missingEmails: string[] = [];

    userIds.forEach((email) => {
        const user = users.find((user) => user.email === email);
        if (user) {
            sortedUsers.push(user);
        } else {
            console.error(`Email not found: ${email}`);
            missingEmails.push(email); // Store missing emails
        }
    });

    console.log("sortedUsers", sortedUsers);
    
    // Return both found users and missing emails
    return { sortedUsers, missingEmails };
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