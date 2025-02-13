'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useSelf } from '@liveblocks/react/suspense';
import React, { useEffect, useState } from 'react'
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";

const ShareModal = ({ roomId, collaborators, creatorId, currentUserType, missingEmails }: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('viewer');

  // State to handle temporary error visibility
  const [visibleErrors, setVisibleErrors] = useState<string[]>(missingEmails || []);

  useEffect(() => {
  if (missingEmails?.length > 0) {
    // Remove duplicates
    setVisibleErrors(Array.from(new Set(missingEmails)));

    // Hide error after 5 seconds
    const timer = setTimeout(() => {
      setVisibleErrors([]);
    }, 5000);

    return () => clearTimeout(timer); // Cleanup on unmount or change
  }
}, [JSON.stringify(missingEmails)]);  // Use JSON.stringify to track deep changes

  const shareDocumentHandler = async () => {
    setLoading(true);
    await updateDocumentAccess({ 
      roomId, 
      email, 
      userType: userType as UserType, 
      updatedBy: user.info,
    });
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType !== 'editor'}>
          <Image
            src="/assets/icons/share.svg"
            alt="share"
            width={20}
            height={20}
            className="min-w-4 md:size-5"
          />
          <p className="mr-1 hidden sm:block">Share</p>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>Select which users can view and edit this document</DialogDescription>
        </DialogHeader>

        <Label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input 
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-input"
              autoComplete="off"
            />
            <UserTypeSelector 
              userType={userType}
              setUserType={setUserType}
            />
          </div>
          <Button type="submit" onClick={shareDocumentHandler} className="gradient-blue flex h-full gap-1 px-5" disabled={loading}>
            {loading ? 'Sending...' : 'Invite'}
          </Button>
        </div>

        {/* Temporary error message - disappears after 5 seconds */}
        {visibleErrors?.length > 0 && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded animate-fade-out">
            ⚠️ Below email(s) not found. Please check and try again:
            <ul className="mt-1 text-sm">
              {visibleErrors.map((email) => (
                <li key={email} className="ml-2">• {email}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator) => (
              <Collaborator 
                key={collaborator.id}
                roomId={roomId}
                creatorId={creatorId}
                email={collaborator.email}
                collaborator={collaborator}
                user={user.info}
              />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareModal;
