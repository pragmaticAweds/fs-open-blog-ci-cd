import { ReactNode, useEffect, useRef } from "react";

const Modal = ({
  isOpen,
  closeModal,
  children,
}: {
  children: ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const closeDialog = () => {
    dialogRef.current?.close();
    document.body.style.overflow = "";
    closeModal();
  };

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      closeDialog();
    }

    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleOnClick(event: MouseEvent) {
    const isFirstElement =
      dialogRef.current &&
      event.composedPath().includes(dialogRef?.current) &&
      event.composedPath()[0] === dialogRef.current;

    if (isFirstElement) closeDialog();
  }

  useEffect(() => {
    document.body.addEventListener("click", handleOnClick);
    return () => {
      document.body.removeEventListener("click", handleOnClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <dialog
        ref={dialogRef}
        className="relative overflow-visible backdrop:bg-black/85 bg-transparent min-w-[70vw] md:min-w-[50vw] xl:min-w-[40vw]"
      >
        <button
          className="flex items-center justify-center size-10 bg-zinc-200 rounded-full shadow absolute -top-2 -right-2 z-1"
          onClick={closeDialog}
        >
          <svg
            className="size-5 text-zinc-900"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
        {children}
      </dialog>
    </>
  );
};

export default Modal;
