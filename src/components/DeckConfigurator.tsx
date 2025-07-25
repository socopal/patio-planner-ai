import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { DeckConfig, DeckShape, WoodColor, WoodFinish, EdgeType } from '@/types/deck';
import { DeckVisualizer } from './DeckVisualizer';
import { MaterialsCalculator } from './MaterialsCalculator';
import { LambourdeView } from './LambourdeView';
import { Calculator, Eye, Grid } from 'lucide-react';

const WOOD_COLORS: { value: WoodColor; label: string; class: string }[] = [
  { value: 'gris', label: 'Gris', class: 'bg-wood-gris' },
  { value: 'acajou', label: 'Acajou', class: 'bg-wood-acajou' },
  { value: 'chene', label: 'Chêne', class: 'bg-wood-chene' },
  { value: 'marron', label: 'Marron', class: 'bg-wood-marron' },
];

const WOOD_FINISHES: { value: WoodFinish; label: string }[] = [
  { value: 'brossée', label: 'Brossée' },
  { value: 'structurée', label: 'Structurée' },
  { value: 'poncée', label: 'Poncée' },
];

const DECK_SHAPES: { value: DeckShape; label: string }[] = [
  { value: 'rectangulaire', label: 'Rectangulaire' },
  { value: 'L', label: 'Forme L' },
  { value: 'U', label: 'Forme U' },
];

export const DeckConfigurator = () => {
  const [config, setConfig] = useState<DeckConfig>({
    shape: 'rectangulaire',
    dimensions: {
      width: 4,
      height: 3,
    },
    color: 'chene',
    finish: 'brossée',
    edgeType: 'cornières',
    includeEdges: true,
  });

  const [activeView, setActiveView] = useState<'deck' | 'lambourdes' | 'calculator'>('deck');

  const updateConfig = (updates: Partial<DeckConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateDimensions = (updates: Partial<DeckConfig['dimensions']>) => {
    setConfig(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, ...updates }
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/lovable-uploads/b4a5f837-fa16-4db7-b1e2-7650a5b82e88.png" 
              alt="ECODECK Logo" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Configurateur de Terrasse
              </h1>
              <p className="text-muted-foreground text-lg">
                Concevez votre terrasse en bois composite avec calcul automatique des matériaux
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shape Selection */}
              <div className="space-y-2">
                <Label>Forme de la terrasse</Label>
                <Select
                  value={config.shape}
                  onValueChange={(value: DeckShape) => updateConfig({ shape: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DECK_SHAPES.map(shape => (
                      <SelectItem key={shape.value} value={shape.value}>
                        {shape.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <Label>Dimensions (en mètres)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="width" className="text-sm">Largeur</Label>
                    <Input
                      id="width"
                      type="number"
                      min="1"
                      step="0.1"
                      value={config.dimensions.width}
                      onChange={(e) => updateDimensions({ width: parseFloat(e.target.value) || 1 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm">Longueur</Label>
                    <Input
                      id="height"
                      type="number"
                      min="1"
                      step="0.1"
                      value={config.dimensions.height}
                      onChange={(e) => updateDimensions({ height: parseFloat(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                {(config.shape === 'L' || config.shape === 'U') && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <Label htmlFor="extWidth" className="text-sm">Extension largeur</Label>
                      <Input
                        id="extWidth"
                        type="number"
                        min="1"
                        step="0.1"
                        value={config.dimensions.extensionWidth || 2}
                        onChange={(e) => updateDimensions({ extensionWidth: parseFloat(e.target.value) || 2 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="extHeight" className="text-sm">Extension longueur</Label>
                      <Input
                        id="extHeight"
                        type="number"
                        min="1"
                        step="0.1"
                        value={config.dimensions.extensionHeight || 2}
                        onChange={(e) => updateDimensions({ extensionHeight: parseFloat(e.target.value) || 2 })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <Label>Couleur du bois</Label>
                <div className="grid grid-cols-2 gap-2">
                  {WOOD_COLORS.map(color => (
                    <Button
                      key={color.value}
                      variant={config.color === color.value ? "default" : "outline"}
                      onClick={() => updateConfig({ color: color.value })}
                      className="justify-start gap-3"
                    >
                      <div className={`w-4 h-4 rounded-full ${color.class} border border-border`} />
                      {color.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Finish Selection */}
              <div className="space-y-2">
                <Label>Finition</Label>
                <Select
                  value={config.finish}
                  onValueChange={(value: WoodFinish) => updateConfig({ finish: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WOOD_FINISHES.map(finish => (
                      <SelectItem key={finish.value} value={finish.value}>
                        {finish.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Edge Options */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-edges"
                    checked={config.includeEdges}
                    onCheckedChange={(checked) => updateConfig({ includeEdges: checked })}
                  />
                  <Label htmlFor="include-edges">Inclure les contours</Label>
                </div>

                {config.includeEdges && (
                  <Select
                    value={config.edgeType}
                    onValueChange={(value: EdgeType) => updateConfig({ edgeType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cornières">Cornières</SelectItem>
                      <SelectItem value="plinthes">Plinthes</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Current Selection */}
              <div className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {DECK_SHAPES.find(s => s.value === config.shape)?.label}
                  </Badge>
                  <Badge variant="secondary">
                    {config.dimensions.width}m × {config.dimensions.height}m
                  </Badge>
                  <Badge variant="secondary">
                    {WOOD_COLORS.find(c => c.value === config.color)?.label}
                  </Badge>
                  <Badge variant="secondary">
                    {WOOD_FINISHES.find(f => f.value === config.finish)?.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Controls */}
            <div className="flex gap-2">
              <Button
                variant={activeView === 'deck' ? 'default' : 'outline'}
                onClick={() => setActiveView('deck')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Vue Terrasse
              </Button>
              <Button
                variant={activeView === 'lambourdes' ? 'default' : 'outline'}
                onClick={() => setActiveView('lambourdes')}
                className="flex items-center gap-2"
              >
                <Grid className="w-4 h-4" />
                Vue Lambourdes
              </Button>
              <Button
                variant={activeView === 'calculator' ? 'default' : 'outline'}
                onClick={() => setActiveView('calculator')}
                className="flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculs
              </Button>
            </div>

            {/* Active View */}
            <Card className="shadow-deck">
              <CardContent className="p-6">
                {activeView === 'deck' && <DeckVisualizer config={config} />}
                {activeView === 'lambourdes' && <LambourdeView config={config} />}
                {activeView === 'calculator' && <MaterialsCalculator config={config} />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};