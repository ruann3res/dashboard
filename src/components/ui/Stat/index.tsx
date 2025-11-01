
type StatProps = {
    title: string
    value: string
    component?: React.ReactNode
    icon?: boolean
}

export function Stat({ title, value, component, icon }: StatProps) {
    return (
        <div className="stats shadow w-full rounded-2xl border border-base-200">
            <div className="stat">
                {component && (
                    <div className="stat-figure text-secondary">
                        {icon && <div className="flex items-center justify-center h-12 w-12 border-2 border-base-300 rounded-xl">
                            {component}
                        </div>}
                        {!icon && component}
                    </div>
                )}
                <div className="stat-title">{title}</div>
                <div className="stat-value text-secondary">{value}</div>
            </div>
        </div>
    )
}