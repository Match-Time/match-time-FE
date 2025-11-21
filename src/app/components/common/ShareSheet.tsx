'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Button from './button/Button';
import { DialogTitle } from './dialog';

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

const ShareSheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      {/* Wrapper for positioning and sizing */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div className="w-full max-w-sm">
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              'grid w-full gap-4 border-t bg-white p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:rounded-t-lg',
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
ShareSheetContent.displayName = 'ShareSheetContent';


interface ShareSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
}

export function ShareSheet({ open, onOpenChange, groupId }: ShareSheetProps) {
  const shareLink = `https://www.moyeoyo.com/group/${groupId}`;
  const [isCatVisible, setIsCatVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      // Wait for the sheet animation to finish before showing the cat
      const timer = setTimeout(() => {
        setIsCatVisible(true);
      }, 500); // Corresponds to the slide-in duration
      return () => clearTimeout(timer);
    } else {
      // Hide cat immediately when closing
      setIsCatVisible(false);
    }
  }, [open]);


  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('링크가 복사되었습니다!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ShareSheetContent className="rounded-t-2xl">
        <div className="relative flex flex-col items-center">
            {/* Cat Image */}
            <div className={`absolute -top-24 -z-10 transition-all duration-500 ease-out ${isCatVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-75'}`}>
                <Image src="/images/ic_share_cat.png" alt="Share Cat" width={150} height={150} />
            </div>

            <div className="mt-16 text-center">
                <DialogTitle className="text-xl font-bold">모임에 초대할 준비가 됐어요!</DialogTitle>
                <p className="mt-2 text-sm text-gray-500">복사해서 모임 인원에게 전송해 보세요</p>
            </div>

            {/* Link Input */}
            <div className="relative w-full mt-4">
                <input
                    type="text"
                    readOnly
                    value={shareLink}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button onClick={handleCopy} className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
            </div>

            {/* Confirm Button */}
            <DialogPrimitive.Close asChild className="w-full mt-6">
                <Button className="w-full py-3 text-lg font-bold bg-yellow-main text-black">
                    확인했어요
                </Button>
            </DialogPrimitive.Close>
        </div>
      </ShareSheetContent>
    </Dialog>
  );
}
