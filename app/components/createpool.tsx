export function CreatePool() {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">Create Investment Pool</h1>
  
          <form className="space-y-6">
            {/* Basic Information */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pool Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., ETH Growth Fund"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Symbol
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., ETH_USD"
                  />
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={4}
                  placeholder="Describe your investment pool..."
                />
              </div>
            </section>
  
            {/* Investment Parameters */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Investment Parameters</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount (ETH)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    placeholder="100"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    placeholder="30"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Investment (ETH)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    placeholder="0.1"
                    step="0.1"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Investment (ETH)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    placeholder="10"
                    step="0.1"
                  />
                </div>
              </div>
            </section>
  
            {/* Advanced Settings */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Advanced Settings</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Management Fee (%)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    placeholder="2"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lock Period (Days)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg"
                    placeholder="30"
                  />
                </div>
              </div>
            </section>
  
            {/* Preview & Submit */}
            <div className="pt-6 border-t">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Preview
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Pool
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }