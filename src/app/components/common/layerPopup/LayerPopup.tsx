import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/app/components/common/dialog";

type LayerPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void; // 팝업 상태 관리
  onConfirm?: () => void;
  type?: "confirm" | "cancelConfirm"; // confirm: 확인 버튼만, cancelConfirm: 취소 + 확인 버튼
  title: string;
  description: string;
};

const LayerPopup = ({
  open,
  onOpenChange,
  type = "confirm",
  title,
  onConfirm,
  description,
}: LayerPopupProps) => {
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onOpenChange(false);
  };

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const closeButtonStyle =
    "px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm";
  const confirmButtonStyle =
    "px-4 py-2 rounded bg-sub-green hover:bg-main-green text-sm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 배경 오버레이 */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-[998]" />}

      <DialogContent className="fixed z-[999] w-full max-w-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {type !== "confirm" ? (
          <DialogFooter>
            <DialogClose asChild>
              <button className={closeButtonStyle}>취소</button>
            </DialogClose>
            <button className={confirmButtonStyle} onClick={handleConfirm}>
              확인
            </button>
          </DialogFooter>
        ) : (
          <DialogFooter>
            <DialogClose asChild>
              <button className={confirmButtonStyle} onClick={handleConfirm}>
                확인
              </button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LayerPopup;
