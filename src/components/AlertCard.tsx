import { MarketAlert } from '@/data/mockData';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface AlertCardProps {
  alert: MarketAlert;
}

const AlertCard = ({ alert }: AlertCardProps) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'positive':
        return <TrendingUp className="h-5 w-5" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const getStyles = () => {
    switch (alert.type) {
      case 'positive':
        return 'bg-success/10 border-success/30 text-success';
      case 'negative':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };
  
  return (
    <div className={`p-4 rounded-lg border ${getStyles()}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
          <p className="text-sm opacity-90">{alert.message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
