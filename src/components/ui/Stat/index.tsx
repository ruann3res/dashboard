
type StatProps = {
    title: string
    value: string
    component?: React.ReactNode
    icon?: boolean
    onClick?: () => void
}

export function Stat({ title, value, component, icon, onClick }: StatProps) {
    return (
        <div className="stats shadow w-full rounded-2xl border border-base-200">
            <div className="stat">
                {component && (
                    <div className="stat-figure text-secondary">
                        {icon && (
                            <div 
                                className={`flex items-center justify-center h-12 w-12 border-2 border-base-300 rounded-xl ${onClick ? 'cursor-pointer hover:bg-base-200 transition-colors' : ''}`}
                                onClick={onClick}
                            >
                                {component}
                            </div>
                        )}
                        {!icon && component}
                    </div>
                )}
                <div className="stat-title">{title}</div>
                <div className="stat-value text-secondary">{value}</div>
            </div>
        </div>
    )
}