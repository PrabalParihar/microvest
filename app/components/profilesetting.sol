export function ProfileSettings() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-gray-600">Joined September 2024</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Account Settings */}
        <SettingsSection 
          title="Account Settings"
          fields={[
            {
              label: "Email",
              value: "john@example.com",
              type: "email",
              editable: true
            },
            {
              label: "Wallet Address",
              value: "0x1234...5678",
              type: "text",
              copyable: true
            }
          ]}
        />

        {/* Notification Preferences */}
        <SettingsSection 
          title="Notification Preferences"
          fields={[
            {
              label: "Investment Updates",
              type: "toggle",
              value: true
            },
            {
              label: "New Pool Alerts",
              type: "toggle",
              value: false
            },
            {
              label: "Price Alerts",
              type: "toggle",
              value: true
            }
          ]}
        />

        {/* Security Settings */}
        <SettingsSection 
          title="Security Settings"
          fields={[
            {
              label: "Two-Factor Authentication",
              type: "toggle",
              value: false
            },
            {
              label: "Transaction Notifications",
              type: "toggle",
              value: true
            }
          ]}
        />

        {/* Connected Services */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Connected Services</h2>
          <div className="space-y-4">
            <ConnectedService
              name="Google"
              icon="🔵"
              connected={true}
            />
            <ConnectedService
              name="Twitter"
              icon="🐦"
              connected={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, fields }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <SettingsField key={index} {...field} />
        ))}
      </div>
    </div>
  );
}

function SettingsField({ label, value, type, editable, copyable }) {
  switch (type) {
    case 'toggle':
      return (
        <div className="flex justify-between items-center">
          <span className="text-gray-700">{label}</span>
          <Toggle value={value} />
        </div>
      );
    default:
      return (
        <div className="space-y-1">
          <label className="text-sm text-gray-600">{label}</label>
          <div className="flex items-center space-x-2">
            <input
              type={type}
              value={value}
              readOnly={!editable}
              className={`w-full p-2 rounded-lg ${
                editable ? 'border' : 'bg-gray-50'
              }`}
            />
            {copyable && (
              <button className="text-blue-600 hover:text-blue-700">
                <CopyIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      );
  }
}

function ConnectedService({ name, icon, connected }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-medium">{name}</span>
      </div>
      <button
        className={`px-4 py-2 rounded-lg ${
          connected
            ? 'text-red-600 border border-red-600 hover:bg-red-50'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}