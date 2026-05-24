'use client';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  danger = false,
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
        <h2 className="font-syncopate text-lg font-bold tracking-widest">{title}</h2>
        <p className="mt-4 text-sm leading-6 text-white/70">{message}</p>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md px-5 py-2 font-syncopate text-xs font-bold tracking-widest text-white/60 transition-colors hover:text-white disabled:opacity-50"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={
              (danger
                ? 'border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 '
                : 'bg-white text-black hover:bg-white/90 ') +
              'rounded-md border px-6 py-2 font-syncopate text-xs font-bold tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-60'
            }
          >
            {busy ? 'WORKING...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
