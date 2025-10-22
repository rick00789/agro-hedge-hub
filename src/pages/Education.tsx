import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, FileText, Shield, ArrowLeft } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
}

const modules: Module[] = [
  {
    id: '1',
    title: 'What is Price Risk?',
    description: 'Learn about market price fluctuations and how they affect your farming income',
    icon: <TrendingUp className="h-6 w-6" />,
    content: `Price risk is the uncertainty in the future price of your crops. Agricultural markets are affected by many factors including weather, demand, international trade, and government policies.

When prices fall unexpectedly, farmers can face significant losses even with good harvests. Understanding price risk is the first step to managing it effectively.

Key factors affecting oilseed prices:
• International demand and supply
• Weather conditions across growing regions
• Government policies and import/export regulations
• Currency exchange rates
• Substitute products and competition

By learning to recognize these factors, you can make better decisions about when to sell your crops and how to protect your income.`
  },
  {
    id: '2',
    title: 'How Does Hedging Work?',
    description: 'Understand the concept of hedging and how it protects farmers from price drops',
    icon: <Shield className="h-6 w-6" />,
    content: `Hedging is like insurance for crop prices. It allows you to lock in a price today for crops you will sell in the future, protecting you from price drops.

How it works:
1. You check the current market price
2. You "hedge" a certain quantity at this price
3. Even if prices fall later, you're protected at your hedged price
4. If prices rise, you still benefit from higher market rates

Think of it as securing a minimum price for your harvest. This gives you certainty and helps you plan your finances better.

The hedging sandbox in this app lets you practice this without any risk, so you can learn how it works before doing it with real crops.`
  },
  {
    id: '3',
    title: 'Understanding Forward Contracts',
    description: 'Learn how e-contracts work and their benefits for farmers and buyers',
    icon: <FileText className="h-6 w-6" />,
    content: `A forward contract is an agreement between you (the farmer) and a buyer to sell your crops at a fixed price on a future date.

Benefits for farmers:
• Price certainty - you know exactly what you'll get paid
• Guaranteed buyer - no need to search for buyers later
• Better planning - helps arrange finances in advance
• Transparent terms - everything is written clearly

Benefits of blockchain e-contracts:
• Cannot be changed once created (immutable)
• All parties can verify the contract
• Automatic execution when conditions are met
• Permanent record on the blockchain

The e-contracts feature in AgriHedge uses blockchain technology to ensure trust and transparency between farmers and buyers. Each contract gets a unique transaction hash that proves it's authentic and unchanged.`
  }
];

const Education = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  
  if (selectedModule) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedModule(null)}
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to modules
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/20 p-2 rounded-full">
              {selectedModule.icon}
            </div>
            <h1 className="text-2xl font-bold">{selectedModule.title}</h1>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Card className="p-6 shadow-md">
            <div className="prose prose-sm max-w-none">
              {selectedModule.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-foreground leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 p-2 rounded-full">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Education Center</h1>
            <p className="text-sm opacity-90">Learn about price risk management</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <div className="w-1 h-5 bg-primary rounded-full"></div>
          Learning Modules
        </h3>
        
        {modules.map((module) => (
          <Card
            key={module.id}
            className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedModule(module)}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {module.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{module.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                <Button variant="outline" size="sm">
                  Start Learning
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Why Learn About Price Risk?</h4>
              <p className="text-sm text-muted-foreground">
                Understanding price risk and hedging strategies helps you make better decisions, 
                protect your income, and plan for the future. Knowledge is your best tool for success.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Education;
