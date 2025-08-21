import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Terminal, Database, Wrench, AlertTriangle } from 'lucide-react';
import { advancedSolutions } from '@/data/troubleshootingContent';

const AdvancedSolutions = () => {
  const [selectedSolution, setSelectedSolution] = useState(null);

  const solutionCategories = {
    registry: {
      title: 'Registry Fixes',
      icon: <Database className="h-4 w-4" />,
      solutions: advancedSolutions.filter(s => s.id.includes('registry'))
    },
    commandLine: {
      title: 'Command Line Tools',
      icon: <Terminal className="h-4 w-4" />,
      solutions: advancedSolutions.filter(s => s.id.includes('command') || s.id.includes('udev'))
    },
    hardware: {
      title: 'Hardware Diagnostics',
      icon: <Wrench className="h-4 w-4" />,
      solutions: advancedSolutions.filter(s => s.id.includes('hardware'))
    }
  };

  return (
    <section id="advanced-solutions" className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 text-red-600 rounded-full">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Advanced Technical Solutions</h2>
          <p className="text-gray-600">For IT professionals and advanced users</p>
        </div>
      </div>

      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          These solutions are for advanced users only. Incorrect modifications can cause system instability.
          Always create backups before proceeding.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          {Object.entries(solutionCategories).map(([key, category]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              {category.icon}
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(solutionCategories).map(([key, category]) => (
          <TabsContent key={key} value={key}>
            <div className="space-y-4">
              {category.solutions.map((solution) => (
                <div key={solution.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold">{solution.title}</h3>
                    <div className="flex gap-2">
                      <Badge variant={solution.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                        {solution.difficulty}
                      </Badge>
                      <Badge variant="outline">{solution.successRate}% success</Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  
                  {solution.warning && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{solution.warning}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      {solution.steps.map((step, index) => (
                        <li key={index} className="text-gray-700">{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {solution.platforms.map(platform => (
                      <Badge key={platform} variant="outline">{platform}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default AdvancedSolutions;