'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Tag from './Tag';

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ParticipantSheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div className="w-full max-w-sm">
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              'relative grid w-full gap-4 bg-white p-6 pt-8 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom rounded-t-2xl',
              className
            )}
            {...props}
          >
            {children}
          </DialogPrimitive.Content>
        </div>
      </div>
    </DialogPortal>
  ));
ParticipantSheetContent.displayName = 'ParticipantSheetContent';

const mockParticipants = [
    { id: 1, name: '이모임', avatar: '/images/img_animal.png', isLeader: true },
    { id: 2, name: '홍길동', avatar: '/images/img_animal.png', isLeader: false },
    { id: 3, name: '최용건', avatar: '/images/img_animal.png', isLeader: false },
    { id: 4, name: '안수민', avatar: '/images/img_animal.png', isLeader: false },
];

interface ParticipantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ParticipantSheet({ open, onOpenChange }: ParticipantSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ParticipantSheetContent>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full" />
        
        <DialogPrimitive.Title className="text-lg font-semibold text-center">
            참여자 ({mockParticipants.length})
        </DialogPrimitive.Title>
        <DialogPrimitive.Close className="absolute top-6 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
            <X className="h-5 w-5 text-gray-500" />
        </DialogPrimitive.Close>
        
        <div className="mt-6 space-y-4">
            {mockParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center">
                    <Image 
                        src={participant.avatar} 
                        alt={participant.name}
                        width={40} 
                        height={40}
                        className="rounded-full border-2 border-yellow-main"
                    />
                    <p className="flex-1 ml-4 font-medium">{participant.name}</p>
                    {participant.isLeader && <Tag text="팀장" />}
                </div>
            ))}
        </div>
      </ParticipantSheetContent>
    </Dialog>
  );
}
