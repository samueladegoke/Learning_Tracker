import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, ShoppingBag, Snowflake, Zap, Heart, Coins } from 'lucide-react'
import { soundManager } from '../utils/SoundManager'

const ShopModal = ({ isOpen, onClose, rpgState, onPurchase }) => {
    const [purchasing, setPurchasing] = useState(false)

    if (!isOpen) return null

    const shopItems = [
        {
            id: 'streak_freeze',
            name: 'Streak Freeze',
            icon: <Snowflake className="w-8 h-8 text-cyan-300" />,
            cost: 50,
            description: 'Protects your streak for one missed day',
            owned: rpgState?.streak_freeze_count || 0,
        },
        {
            id: 'potion_focus',
            name: 'Potion of Focus',
            icon: <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />,
            cost: 20,
            description: 'Instantly refills all Focus Points',
            disabled: rpgState?.focus_points === rpgState?.focus_cap,
        },
        {
            id: 'heart_refill',
            name: 'Heart Refill',
            icon: <Heart className="w-8 h-8 text-red-500 fill-red-500" />,
            cost: 100,
            description: 'Restore one lost heart',
            disabled: rpgState?.hearts >= 3,
        },
    ]

    const handleBuy = async (itemId) => {
        setPurchasing(true)
        try {
            await onPurchase(itemId)
            soundManager.buyItem()
        } catch (err) {
            soundManager.error()
            console.error('Purchase failed:', err)
        } finally {
            setPurchasing(false)
        }
    }

    const canAfford = (cost) => rpgState?.gold >= cost

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-surface-900 rounded-2xl border-2 border-primary-500/30 max-w-2xl w-full mx-4 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-surface-100">Quest Shop</h2>
                        <p className="text-surface-400 text-sm">Spend your hard-earned Gold</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-surface-800 px-4 py-2 rounded-lg border border-surface-700 flex items-center gap-2">
                            <Coins className="w-5 h-5 text-yellow-500" />
                            <span className="text-yellow-500 font-bold text-lg">{rpgState?.gold || 0}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-surface-100 transition-colors flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="grid gap-4">
                    {shopItems.map((item) => {
                        const affordable = canAfford(item.cost)
                        const disabled = item.disabled || !affordable || purchasing

                        return (
                            <div
                                key={item.id}
                                className={`bg-surface-800/50 rounded-xl p-4 border transition-all ${disabled
                                    ? 'border-surface-700/30 opacity-60'
                                    : 'border-surface-700 hover:border-primary-500/50 hover:bg-surface-800'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-surface-900 rounded-xl border border-surface-700 flex items-center justify-center text-3xl">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-surface-100 mb-1">
                                                {item.name}
                                                {item.owned > 0 && (
                                                    <span className="ml-2 text-xs bg-primary-950/80 text-primary-100 border border-primary-500/20 px-2 py-0.5 rounded-full">
                                                        Owned: {item.owned}
                                                    </span>
                                                )}
                                            </h3>
                                            <p className="text-surface-400 text-sm">{item.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleBuy(item.id)}
                                        disabled={disabled}
                                        className={`px-6 py-2 rounded-lg font-medium transition-all ${disabled
                                            ? 'bg-surface-700 text-surface-500 cursor-not-allowed'
                                            : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/30 hover:shadow-primary-900/50 active:scale-95'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Coins className="w-4 h-4" />
                                            <span>{item.cost}</span>
                                            <span>Buy</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ShopModal
