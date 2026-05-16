import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HealthChart = ({ data, title, dataKey, color }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm uppercase font-semibold mb-4">{title}</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="timestamp" 
                            stroke="#9ca3af" 
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            }} 
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#f3f4f6' }}
                            itemStyle={{ color: '#f3f4f6' }}
                            labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                        />
                        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HealthChart;
