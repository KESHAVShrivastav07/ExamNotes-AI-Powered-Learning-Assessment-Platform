import React, { useMemo } from 'react';
import {
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function RechartSetUp({ data, type }) {
    if (!data || data.length === 0) return (
        <div className="text-gray-400 text-sm text-center py-10">No chart data available</div>
    );

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: '#e2e8f0' }}
                            />
                            <YAxis
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={{ stroke: '#e2e8f0' }}
                            />
                            <YAxis
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                innerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                                paddingAngle={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            default:
                return <div className="text-gray-400 text-sm text-center py-10">Unsupported chart type: {type}</div>;
        }
    };

    return (
        <div className="w-full">
            {renderChart()}
        </div>
    );
}

export default RechartSetUp;
