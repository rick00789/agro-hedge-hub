import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, CheckCircle, Copy } from 'lucide-react';
import { Contract, mockBuyers, generateTransactionHash } from '@/data/mockData';
import { toast } from 'sonner';

const Contracts = () => {
  const [showForm, setShowForm] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [formData, setFormData] = useState({
    buyerName: '',
    quantity: '',
    agreedPrice: '',
    deliveryDate: ''
  });
  
  useEffect(() => {
    const savedContracts = localStorage.getItem('contracts');
    if (savedContracts) {
      setContracts(JSON.parse(savedContracts));
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyerName || !formData.quantity || !formData.agreedPrice || !formData.deliveryDate) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const newContract: Contract = {
      id: Date.now().toString(),
      buyerName: formData.buyerName,
      quantity: parseFloat(formData.quantity),
      agreedPrice: parseFloat(formData.agreedPrice),
      deliveryDate: formData.deliveryDate,
      transactionHash: generateTransactionHash(),
      status: 'Confirmed on Ledger',
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    localStorage.setItem('contracts', JSON.stringify(updatedContracts));
    
    toast.success('Contract created successfully on blockchain!', {
      description: 'Transaction hash: ' + newContract.transactionHash.substring(0, 20) + '...'
    });
    
    setFormData({ buyerName: '', quantity: '', agreedPrice: '', deliveryDate: '' });
    setShowForm(false);
  };
  
  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Transaction hash copied to clipboard');
  };
  
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-2 rounded-full">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">E-Contracts</h1>
              <p className="text-sm opacity-90">Blockchain-secured contracts</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            variant="secondary"
            size="sm"
            className="font-semibold"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Create Contract Form */}
        {showForm && (
          <Card className="p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Create New Contract</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="buyer">Buyer Name</Label>
                <Select
                  value={formData.buyerName}
                  onValueChange={(value) => setFormData({ ...formData, buyerName: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select buyer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBuyers.map((buyer) => (
                      <SelectItem key={buyer} value={buyer}>
                        {buyer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantity (Quintals)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Agreed Price (₹ per quintal)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  value={formData.agreedPrice}
                  onChange={(e) => setFormData({ ...formData, agreedPrice: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="delivery">Delivery Date</Label>
                <Input
                  id="delivery"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="mt-2"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Create Contract
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {/* Contracts List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            My Contracts ({contracts.length})
          </h3>
          
          {contracts.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No contracts yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first contract above</p>
            </Card>
          ) : (
            contracts.map((contract) => (
              <Card key={contract.id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{contract.buyerName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Contract ID: #{contract.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    {contract.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{contract.quantity} quintals</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-semibold">₹{contract.agreedPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="font-semibold text-primary">
                      ₹{(contract.quantity * contract.agreedPrice).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Date</p>
                    <p className="font-semibold">
                      {new Date(contract.deliveryDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground font-medium">Blockchain Transaction Hash</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => copyHash(contract.transactionHash)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs font-mono break-all text-foreground/80">
                    {contract.transactionHash}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
