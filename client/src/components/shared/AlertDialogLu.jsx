import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function AlertDialogLu({
  open,
  onOpenChange,
  title,
  description,
  showActionButton = true,
  actionLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[360px] p-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex col justify-center items-center gap-2">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={showActionButton ? "grid grid-cols-2 !justify-center" : "flex !justify-center"}>
          <AlertDialogCancel onClick={onCancel} className="w-full">{cancelLabel}</AlertDialogCancel>
          {showActionButton && (
            <AlertDialogAction onClick={onConfirm}>
              {actionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
