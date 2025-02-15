import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers, getMissingClerkUsers } from "@/lib/actions/user.actions";
import { parseStringify } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");

  const userIds = Object.keys(room.usersAccesses);
  
  // Fetch users and missing emails
  const  sortedUsers  = await getClerkUsers({ userIds });

  const missingUsers = await getMissingClerkUsers({ userIds });

  const missingEmails = missingUsers.map((user: User) => user.email);

  const usersData = sortedUsers.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));

  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes("room:write")
    ? "editor"
    : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
        missingEmails={missingEmails} // Pass missing emails to component
      />
    </main>
  );
};

export default Document;
