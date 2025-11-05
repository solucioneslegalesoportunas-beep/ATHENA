
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700/50">
      <h4 className="text-sm font-medium text-slate-400">{title}</h4>
      <p className="text-4xl font-bold text-white mt-2">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{description}</p>
    </div>
  );
};

export default KpiCard;
