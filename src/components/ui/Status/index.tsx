type StatusProps = {
    color?: 'success' | 'error' | 'warning' | 'info'
    text?: string
}

const colorClasses = {
    success: 'bg-success',
    error: 'bg-error',
    warning: 'bg-warning',
    info: 'bg-info'
}

export function Status({ color = 'error', text }: StatusProps) {
    return (
        <>
        <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`}>
        </div>
        {text && (
            <span className="text-sm text-base-content/60 font-medium tracking-tight capitalize ml-2">
                {text}
            </span>
        )}
        </>
    )
}


