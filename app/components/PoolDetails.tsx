
export function PoolDetails({ poolId }) {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Pool Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">ETH Growth Fund</h1>
                        <p className="text-gray-600">Created by 0x1234...5678</p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Active
                    </div>
                </div>

                {/* Pool Stats */}
                <div className="grid grid-cols-4 gap-6 mt-6">
                    <div>
                        <p className="text-sm text-gray-500">Target Amount</p>
                        <p className="text-xl font-semibold">100 ETH</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Current Amount</p>
                        <p className="text-xl font-semibold">75 ETH</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Investors</p>
                        <p className="text-xl font-semibold">45</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Time Remaining</p>
                        <p className="text-xl font-semibold">5 days</p>
                    </div>
                </div>
            </div>

            {/* Investment Form */}
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {/* Pool Description */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">About This Pool</h2>
                        <p className="text-gray-600">
                            Detailed description of the investment pool and its strategy...
                        </p>
                    </div>

                    {/* Investment History */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Investments</h2>
                        <div className="space-y-4">
                            {/* Investment Items */}
                        </div>
                    </div>
                </div>

                {/* Investment Form */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Invest</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (ETH)
                                </label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="0.0"
                                    step="0.01"
                                />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-500">Min Investment</span>
                                    <span className="text-sm font-medium">0.1 ETH</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Max Investment</span>
                                    <span className="text-sm font-medium">10 ETH</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                                Invest Now
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4">Pool Information</h2>
                        <PoolInformation />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PoolInformation() {
    return (
        <div className="space-y-4">
            <InfoItem
                label="Pool Type"
                value="Growth Fund"
                icon="📈"
            />
            <InfoItem
                label="Lock Period"
                value="30 Days"
                icon="🔒"
            />
            <InfoItem
                label="Management Fee"
                value="2%"
                icon="💰"
            />
            <InfoItem
                label="Minimum Investment"
                value="0.1 ETH"
                icon="💎"
            />
            <InfoItem
                label="Maximum Investment"
                value="10 ETH"
                icon="🎯"
            />
            <InfoItem
                label="Smart Contract"
                value="0x1234...5678"
                copyable
                icon="📄"
            />
        </div>
    );
}

function InfoItem({ label, value, icon, copyable = false }) {
    return (
        <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-2">
                <span>{icon}</span>
                <span className="text-gray-600">{label}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className="font-medium">{value}</span>
                {copyable && (
                    <button className="text-blue-600 hover:text-blue-700">
                        <CopyIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}