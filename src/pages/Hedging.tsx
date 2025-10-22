import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { getCurrentMarketPrice, HedgePosition } from '@/data/mockData';
import { toast } from 'sonner';

const Hedging = () => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [positions, setPositions] = useState<HedgePosition[]>([]);
  const [showPositions, setShowPositions] = useState(false);
  
  useEffect(() => {
    const price = getCurrentMarketPrice();
    setCurrentPrice(price);
    
    // Load saved positions from localStorage
    const savedPositions = localStorage.getItem('hedgePositions');
    if (savedPositions) {
      setPositions(JSON.parse(savedPositions));
    }
  }, []);
  
  const handleHedge = () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    const newPosition: HedgePosition = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      quantity: parseFloat(quantity),
      hedgedPrice: currentPrice,
      currentPrice: currentPrice
    };
    
    const updatedPositions = [...positions, newPosition];
    setPositions(updatedPositions);
    localStorage.setItem('hedgePositions', JSON.stringify(updatedPositions));
    
    toast.success('Hedge position created successfully!');
    setQuantity('');
    setShowPositions(true);
  };
  
  const calculateProfitLoss = (position: HedgePosition) => {
    const priceDiff = currentPrice - position.hedgedPrice;
    const totalPL = priceDiff * position.quantity;
    return { priceDiff, totalPL };
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 p-2 rounded-full">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Hedging Sandbox</h1>
            <p className="text-sm opacity-90">Practice risk-free trading</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Current Market Price */}
        <Card className="p-6 bg-gradient-to-br from-card to-secondary">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Current Market Price</p>
            <div className="text-4xl font-bold text-primary mb-1">₹{currentPrice}</div>
            <p className="text-sm text-muted-foreground">per quintal</p>
          </div>
        </Card>
        
        {/* Hedging Form */}
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Create New Hedge Position</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="quantity" className="text-base">Quantity (Quintals)</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-2 text-lg h-12"
              />
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                You will lock in the current price of <span className="font-semibold text-foreground">₹{currentPrice}</span> per quintal
              </p>
            </div>
            
            <Button 
              onClick={handleHedge}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Hedge at Current Price
            </Button>
            
            <Button 
              onClick={() => setShowPositions(!showPositions)}
              variant="outline"
              className="w-full h-12"
              size="lg"
            >
              {showPositions ? 'Hide' : 'View'} My Positions ({positions.length})
            </Button>
          </div>
        </Card>
        
        {/* Positions List */}
        {showPositions && positions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full"></div>
              Your Hedge Positions
            </h3>
            
            {positions.map((position) => {
              const { priceDiff, totalPL } = calculateProfitLoss(position);
              const isProfit = totalPL >= 0;
              
              return (
                <Card key={position.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(position.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">{position.quantity} quintals</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Hedged Price</p>
                      <p className="font-semibold">₹{position.hedgedPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Price</p>
                      <p className="font-semibold">₹{currentPrice}</p>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg flex items-center justify-between ${
                    isProfit ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isProfit ? (
                        <TrendingUp className="h-5 w-5 text-success" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      )}
                      <span className={`font-semibold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                        {isProfit ? 'Profit' : 'Loss'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                        ₹{Math.abs(totalPL).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        (₹{Math.abs(priceDiff)}/quintal)
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        
        {showPositions && positions.length === 0 && (
          <Card className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No hedge positions yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first hedge above</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Hedging;
