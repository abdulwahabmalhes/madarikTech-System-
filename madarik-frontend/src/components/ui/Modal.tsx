import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[hsl(var(--surface))] w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <h3 className="font-bold text-[hsl(var(--foreground))]">{title}</h3>
          <button onClick={onClose} className="p-1 text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-hover))] rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
