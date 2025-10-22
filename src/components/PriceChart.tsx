import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PricePoint } from '@/data/mockData';

interface PriceChartProps {
  data: PricePoint[];
}

const PriceChart = ({ data }: PriceChartProps) => {
  const historicalData = data.filter(p => !p.isForecast);
  const forecastData = data.filter(p => p.isForecast);
  
  // Add connection point between historical and forecast
  const forecastWithConnection = forecastData.length > 0 && historicalData.length > 0
    ? [historicalData[historicalData.length - 1], ...forecastData]
    : forecastData;

  return (
    <div className="w-full h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={[...historicalData, ...forecastData]}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={['dataMin - 50', 'dataMax + 50']}
          />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              `₹${value}`, 
              props.payload.isForecast ? 'Forecast' : 'Price'
            ]}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('en-IN');
            }}
          />
          <Line 
            type="monotone" 
            data={historicalData}
            dataKey="price" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', r: 3 }}
            connectNulls
          />
          <Line 
            type="monotone" 
            data={forecastWithConnection}
            dataKey="price" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: 'hsl(var(--primary) / 0.6)', r: 3 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
