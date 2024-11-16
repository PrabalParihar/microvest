"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Portfolio Value"
            value="2.5 ETH"
            change="+12.5%"
            isPositive={true}
            icon="💰"
          />
          <StatCard
            title="Active Investments"
            value="3"
            change="+1"
            isPositive={true}
            icon="📈"
          />
          <StatCard
            title="Available Balance"
            value="1.2 ETH"
            change="-0.5 ETH"
            isPositive={false}
            icon="💳"
          />
          <StatCard
            title="Total Returns"
            value="0.8 ETH"
            change="+0.2 ETH"
            isPositive={true}
            icon="📊"
          />
        </div>
  
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-black">Investment Overview</h2>
              <PortfolioChart />
            </div>
  
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-black">Active Investments</h2>
              <ActiveInvestments />
            </div>
          </div>
  
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-black">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 hover:bg-blue-700 shadow-md">
                  Create New Pool
                </button>
                <button className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-lg transition duration-200 hover:bg-blue-50 shadow-md">
                  Find Investment
                </button>
              </div>
            </div>
  
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-black">Recent Activity</h2>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function StatCard({ title, value, change, isPositive, icon }) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-300 text-white rounded-xl shadow-lg p-6 transition duration-200 hover:shadow-xl">
        <h3 className="text-sm mb-1 flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h3>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className={`text-sm ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
          {change}
        </div>
      </div>
    );
  }

  function InvestmentOverview() {
    const totalInvested = "1.2 ETH";
    const averageReturn = "+25%";
    const totalInvestments = 5;
  
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Investment Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-medium">Total Invested</h4>
            <p className="text-2xl font-bold">{totalInvested}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-medium">Average Return</h4>
            <p className="text-2xl font-bold">{averageReturn}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-medium">Total Investments</h4>
            <p className="text-2xl font-bold">{totalInvestments}</p>
          </div>
        </div>
        <PortfolioChart />
      </div>
    );
  }
  
  function PortfolioChart() {
    const data = [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 500 },
      { name: 'Apr', value: 700 },
      { name: 'May', value: 600 },
      { name: 'Jun', value: 800 },
    ];
  
    return (
      <div className="h-64 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Portfolio Performance</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  function ActiveInvestments() {
    const investments = [
      {
        id : 1,
        pool: "ETH Growth Fund",
        invested: "0.5 ETH",
        currentValue: "0.65 ETH",
        return: "+30%",
      },
      {
        id: 2,
        pool: "BTC Growth Fund",
        invested: "0.2 ETH",
        currentValue: "0.25 ETH",
        return: "+25%",
      },
    ];
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-4">Pool</th>
              <th className="pb-4">Invested</th>
              <th className="pb-4">Current Value</th>
              <th className="pb-4">Return</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-gray-100 transition duration-200">
                <td className="py-4">{inv.pool}</td>
                <td className="py-4">{inv.invested}</td>
                <td className="py-4">{inv.currentValue}</td>
                <td className="py-4 text-green-600">{inv.return}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  function ActivityFeed() {
    const activities = [
      {
        id: 1,
        type: "investment",
        description: "Invested 0.5 ETH in ETH Growth Fund",
        time: "2h ago",
      },
      {
        id: 2,
        type: "investment",
        description: "Invested 0.2 ETH in BTC Growth Fund",
        time: "1h ago",
      },
    ];
  
    return (
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              {/* Activity Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }