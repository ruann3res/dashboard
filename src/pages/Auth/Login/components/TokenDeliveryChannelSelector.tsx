import { Mail, MessageCircle } from 'lucide-react'
import { featureFlags } from '@/lib/feature-flags'
import type { TokenDeliveryChannel } from '@/types/auth'

interface TokenDeliveryChannelSelectorProps {
  value: TokenDeliveryChannel
  onChange: (channel: TokenDeliveryChannel) => void
}

const channelOptions: Array<{
  id: TokenDeliveryChannel
  label: string
  description: string
  icon: typeof Mail
}> = [
  {
    id: 'email',
    label: 'E-mail',
    description: 'Receba o código no e-mail cadastrado',
    icon: Mail,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: 'Receba o código no seu WhatsApp',
    icon: MessageCircle,
  },
]

export const TokenDeliveryChannelSelector = ({
  value,
  onChange,
}: TokenDeliveryChannelSelectorProps) => {
  const whatsappEnabled = featureFlags.whatsappAuthEnabled()

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-base-content">
        Como deseja receber o código?
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {channelOptions.map((option) => {
          const Icon = option.icon
          const isSelected = value === option.id
          const isDisabled = option.id === 'whatsapp' && !whatsappEnabled

          return (
            <button
              key={option.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(option.id)}
              className={[
                'relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all',
                isSelected && !isDisabled
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-base-300 bg-base-100',
                isDisabled
                  ? 'cursor-not-allowed opacity-60'
                  : 'hover:border-primary/50 hover:bg-base-200/40',
              ].join(' ')}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-base-content">{option.label}</span>
                </div>
                {isDisabled && (
                  <span className="badge badge-ghost badge-sm">Em breve</span>
                )}
              </div>
              <p className="text-xs text-base-content/60">{option.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
