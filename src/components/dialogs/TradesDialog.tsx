import { Dialog } from '@headlessui/react';
import { trades } from '@/data/trades';
import { DialogHeader } from '../shared/DialogHeader';

interface TradesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToSearch: () => void;
  onSelectTrade: (tradeName: string) => void;
}

export function TradesDialog({
  isOpen,
  onClose,
  onBackToSearch,
  onSelectTrade,
}: TradesDialogProps) {
  const BackButton = (
    <button 
      onClick={onBackToSearch}
      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back to search
    </button>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md" aria-hidden="true" />
      
      <div className="fixed inset-0 flex flex-col">
        <Dialog.Panel className="flex flex-col w-full h-full bg-white sm:h-[calc(100vh-80px)] sm:max-w-5xl sm:mx-auto sm:my-10 sm:rounded-lg">
          <DialogHeader
            onClose={onClose}
            leftElement={BackButton}
          />
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-8 sm:space-y-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-[-0.01em] mb-3">Available trades</h2>
                <p className="text-base text-gray-500">Browse our selection of trusted local trades and services.</p>
              </div>
              {/* Group trades by category */}
              {Array.from(new Set(trades.map(t => t.category))).map(category => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-400 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trades
                      .filter(trade => trade.category === category)
                      .map((trade) => {
                        const Icon = trade.icon;
                        return (
                          <div 
                            key={trade.name}
                            className={`
                              bg-gray-50/60 border border-gray-200/60 rounded-md overflow-hidden transition-all
                              ${!trade.available && 'opacity-60'}
                            `}
                          >
                            <button
                              onClick={() => trade.available && onSelectTrade(trade.name)}
                              className={`
                                w-full p-3 sm:p-4 text-left transition-all
                                ${trade.available 
                                  ? 'hover:bg-gray-100/50 active:bg-gray-100' 
                                  : 'cursor-not-allowed'
                                }
                              `}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-gray-100 rounded-md shrink-0">
                                  <Icon className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="min-w-0 space-y-1.5 sm:space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">{trade.name}</span>
                                    {!trade.available && (
                                      <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Coming Soon</span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-600 line-clamp-2">{trade.description}</div>
                                  <div className="flex gap-1.5 flex-wrap">
                                    {trade.subcategories.slice(0, 2).map(sub => (
                                      <span 
                                        key={sub.slug}
                                        className="inline-flex text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                                      >
                                        {sub.name}
                                      </span>
                                    ))}
                                    {trade.subcategories.length > 2 && (
                                      <span className="inline-flex text-[10px] text-gray-400">
                                        +{trade.subcategories.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
