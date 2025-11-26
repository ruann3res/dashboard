import { Stat } from "@/components/ui/Stat";
import { Status } from "@/components/ui/Status";
import { Settings } from "@/components/ui/Icons/icons/settings";
import { AnimateIcon } from "@/components/ui/Icons/icons/icon";

type ProjectPannelProps = {
  title: string
  properties?: { key: string; value: string; color: "success" | "error" | "warning" | "info" , component?: React.ReactNode, icon?: boolean, onClick?: () => void }[]
  onEditClick?: () => void
}

export function ProjectPannel({ title, properties, onEditClick }: ProjectPannelProps) {
  return (
    <div className="card bg-primary-content border border-base-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

      <div className="card-body relative z-10">
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="flex items-center justify-center gap-2 w-full">
          <h2
            aria-label={title}
            title={title}
            className="text-3xl font-bold text-base-content mt-1 tracking-tight text-center"
          >
            {title}
          </h2>
            {onEditClick && (
              <button onClick={onEditClick}>
                  <div
                  className="w-6 h-6 text-base-content mt-1 cursor-pointer"
                >
                  <AnimateIcon animateOnHover>
                    <Settings />
                  </AnimateIcon>
                </div>
              </button>
            )}
          </div>
        </div>

        {properties && properties.length > 0 && (
          <>
            <div className="lg:hidden mt-4 pt-4 border-t border-base-200/40">
              <div className="space-y-3">
                {properties.map((property) => (
                  <div
                    key={property.key}
                    className={`flex items-center justify-between py-3 px-4 bg-base-100 border border-base-200/50 rounded-xl ${property.onClick ? 'cursor-pointer hover:bg-base-200 transition-colors' : ''}`}
                    onClick={property.onClick}
                  >
                    <span className="text-base font-semibold text-base-content/80">{property.key}</span>
                    <div className="flex items-center gap-3">
                      {property.icon && property.component ? (
                        <div className="flex items-center justify-center h-10 w-10 border-2 border-base-300 rounded-xl">
                          {property.component}
                        </div>
                      ) : (
                        <Status color={property.color} text={property.value} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:grid lg:grid-cols-3 gap-4 mt-2">
              {properties.map((property) => (
                <Stat
                  key={property.key}
                  title={property.key}
                  value={property.value}
                  component={property.component}
                  icon={property.icon}
                  onClick={property.onClick}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
