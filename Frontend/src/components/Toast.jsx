import { useState, useEffect, useCallback, useRef } from 'react'
import { Check, X, TriangleAlert, Info } from 'lucide-react'

let _addToast = null

export function useToastController() {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const addToast = useCallback((message, type = 'success') => {
    const id = ++idRef.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  useEffect(() => { _addToast = addToast }, [addToast])

  return { toasts }
}

export function toast(message, type = 'success') {
  if (_addToast) _addToast(message, type)
}

const icons = {
  success: Check,
  error: X,
  warning: TriangleAlert,
  info: Info,
}

const typeClass = {
  success: 'info-box-green',
  error:   'info-box-red',
  warning: 'info-box-amber',
  info:    'info-box-blue',
}

export function ToastContainer({ toasts }) {
  return (
    <div style={{
      position: 'fixed', top: '1.25rem', right: '1.25rem',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem',
      maxWidth: '360px', width: '100%',
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`info-box ${typeClass[t.type]} animate-in`}
          style={{ boxShadow: 'var(--shadow-md)', fontWeight: 500 }}
        >
          {(() => { const Icon = icons[t.type] || Check; return <Icon size={18} style={{ flexShrink: 0 }} /> })()}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
