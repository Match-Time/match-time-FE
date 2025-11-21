'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Image from 'next/image';
import {cn} from '@/lib/utils';
import {X} from 'lucide-react';
import Tag from './Tag';
import {fetchRoomUsers, User} from '@/lib/api';

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({className, ...props}, ref) => (
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
>(({className, children, ...props}, ref) => (
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

interface ParticipantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId?: number;
}

export function ParticipantSheet({
  open,
  onOpenChange,
  roomId,
}: ParticipantSheetProps) {
  const [participants, setParticipants] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !roomId) return;
    const load = async () => {
      setLoading(true);
      try {
        const users = await fetchRoomUsers(roomId);
        setParticipants(users);
        setError(null);
      } catch (err: any) {
        setError(err.message || '참여자를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, roomId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ParticipantSheetContent>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full" />

        <DialogPrimitive.Title className="text-lg font-semibold text-left p-4">
          참여자 ({participants.length})
        </DialogPrimitive.Title>
        <DialogPrimitive.Close className="absolute top-6 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
          <X className="h-5 w-5 text-gray-500" />
        </DialogPrimitive.Close>

        {error && <p className="text-sm text-red-main">{error}</p>}
        {loading ? (
          <p className="text-gray-medium text-center pb-4">불러오는 중...</p>
        ) : (
          <div className=" space-y-4">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center">
                <Image
                  src="/images/ic_profile_cat.png"
                  alt={participant.nickname}
                  width={60}
                  height={60}
                />
                <div className="flex-1 ml-4">
                  <p className="font-medium">{participant.nickname}</p>
                  <p className="text-xs text-gray-medium">
                    {participant.email}
                  </p>
                </div>
              </div>
            ))}
            {participants.length === 0 && (
              <p className="text-center text-gray-medium pb-4">
                참여자가 없어요.
              </p>
            )}
          </div>
        )}
      </ParticipantSheetContent>
    </Dialog>
  );
}
