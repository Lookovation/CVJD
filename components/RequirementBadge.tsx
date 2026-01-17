
import React from 'react';

interface Props {
  status: 'MET' | 'UNMET' | 'PARTIAL';
  type: 'HARD' | 'SOFT';
}

const RequirementBadge: React.FC<Props> = ({ status, type }) => {
  const statusColors = {
    MET: 'bg-green-100 text-green-800 border-green-200',
    UNMET: 'bg-red-100 text-red-800 border-red-200',
    PARTIAL: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const typeColors = {
    HARD: 'bg-slate-800 text-white',
    SOFT: 'bg-slate-200 text-slate-700',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${statusColors[status]}`}>
        {status}
      </span>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${typeColors[type]}`}>
        {type}
      </span>
    </div>
  );
};

export default RequirementBadge;
