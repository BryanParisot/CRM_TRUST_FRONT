import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { DownloadIcon } from 'lucide-react';
const monthlyRevenue = [{
  name: 'Jan',
  value: 120000
}, {
  name: 'Fév',
  value: 135000
}, {
  name: 'Mar',
  value: 125000
}, {
  name: 'Avr',
  value: 140000
}, {
  name: 'Mai',
  value: 160000
}, {
  name: 'Juin',
  value: 155000
}, {
  name: 'Juil',
  value: 145000
}, {
  name: 'Août',
  value: 165000
}, {
  name: 'Sept',
  value: 150000
}];
const vehiclesByBrand = [{
  name: 'BMW',
  value: 8
}, {
  name: 'Audi',
  value: 6
}, {
  name: 'Mercedes',
  value: 4
}, {
  name: 'Volvo',
  value: 2
}];
const conversionRates = [{
  name: 'Étape 1 à 2',
  value: 75
}, {
  name: 'Étape 2 à 3',
  value: 60
}, {
  name: 'Étape 3 à 4',
  value: 85
}, {
  name: 'Global',
  value: 40
}];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const salesData = [{
  id: 1,
  vehicle: 'BMW X3',
  client: 'John Doe',
  amount: '€42,500',
  date: '15/09/2023',
  status: 'Terminé'
}, {
  id: 2,
  vehicle: 'Audi Q5',
  client: 'Jane Smith',
  amount: '€45,800',
  date: '10/09/2023',
  status: 'Terminé'
}, {
  id: 3,
  vehicle: 'Mercedes GLC',
  client: 'Mike Johnson',
  amount: '€48,200',
  date: '05/09/2023',
  status: 'Terminé'
}, {
  id: 4,
  vehicle: 'BMW X5',
  client: 'Sarah Williams',
  amount: '€58,900',
  date: '28/08/2023',
  status: 'Terminé'
}, {
  id: 5,
  vehicle: 'Audi A6',
  client: 'Robert Brown',
  amount: '€52,300',
  date: '22/08/2023',
  status: 'Terminé'
}];
const Metrics: React.FC = () => {
  const [dateRange, setDateRange] = useState('last-month');
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Métriques Commerciales</h1>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
            <option value="last-week">Dernière Semaine</option>
            <option value="last-month">Dernier Mois</option>
            <option value="last-quarter">Dernier Trimestre</option>
            <option value="last-year">Dernière Année</option>
            <option value="custom">Période Personnalisée</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Évolution du Chiffre d'Affaires
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={value => `€${value / 1000}k`} />
                <Tooltip formatter={value => [`€${value}`, 'Revenu']} />
                <Line type="monotone" dataKey="value" stroke="#007BFF" activeDot={{
                r: 8
              }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Vehicles Sold by Brand */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Véhicules Vendus par Marque
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehiclesByBrand} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#007BFF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Conversion Rates */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Taux de Conversion par Étape
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={conversionRates} cx="50%" cy="50%" labelLine={false} label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {conversionRates.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={value => [`${value}%`, 'Taux de Conversion']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Sales Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Liste des Ventes</h2>
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <DownloadIcon className="w-4 h-4 mr-1" />
              Exporter CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Véhicule
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {salesData.map(sale => <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {sale.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {sale.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {sale.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {sale.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        {sale.status}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};
export default Metrics;