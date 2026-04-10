import React from 'react'

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, danger }) {
    if (!open) return null

    return (
        <>
            <div className="overlay" onClick={onCancel} />
            <div className="fixed inset-0 flex items-center justify-center z-50 px-6">
                <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl animate-scaleIn">
                    <h3 className="font-bold text-base text-navy mb-1">{title || 'Are you sure?'}</h3>
                    <p className="text-sm text-gray-500 mb-5">{message || 'This action cannot be undone.'}</p>
                    <div className="flex gap-3">
                        <button onClick={onCancel} className="btn btn-outline flex-1">
                            {cancelLabel || 'Cancel'}
                        </button>
                        <button onClick={onConfirm} className={`btn flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}>
                            {confirmLabel || 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
