import { DeckConfig, MATERIAL_CONSUMPTION, PRICES, MaterialCalculation, PriceCalculation } from '@/types/deck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, Download, Package, DollarSign } from 'lucide-react';

interface MaterialsCalculatorProps {
  config: DeckConfig;
}

export const MaterialsCalculator = ({ config }: MaterialsCalculatorProps) => {
  const calculateArea = (): number => {
    const mainArea = config.dimensions.width * config.dimensions.height;
    
    if (config.shape === 'rectangulaire') {
      return mainArea;
    }
    
    if (config.shape === 'L') {
      const extensionArea = (config.dimensions.extensionWidth || 0) * (config.dimensions.extensionHeight || 0);
      return mainArea + extensionArea;
    }
    
    if (config.shape === 'U') {
      const extensionArea = (config.dimensions.extensionWidth || 0) * (config.dimensions.extensionHeight || 0);
      return mainArea + (2 * extensionArea);
    }
    
    return mainArea;
  };

  const calculatePerimeter = (): number => {
    if (config.shape === 'rectangulaire') {
      return 2 * (config.dimensions.width + config.dimensions.height);
    }
    
    if (config.shape === 'L') {
      const extW = config.dimensions.extensionWidth || 0;
      const extH = config.dimensions.extensionHeight || 0;
      return 2 * (config.dimensions.width + config.dimensions.height) + 2 * (extW + extH) - 2 * Math.min(extW, config.dimensions.width);
    }
    
    if (config.shape === 'U') {
      const extW = config.dimensions.extensionWidth || 0;
      const extH = config.dimensions.extensionHeight || 0;
      return 2 * (config.dimensions.width + config.dimensions.height) + 4 * (extW + extH) - 4 * Math.min(extW, config.dimensions.width);
    }
    
    return 0;
  };

  const calculateMaterials = (): MaterialCalculation => {
    const area = calculateArea();
    const perimeter = config.includeEdges ? calculatePerimeter() : 0;
    
    return {
      area,
      lames: area * MATERIAL_CONSUMPTION.LAMES_PER_M2,
      lambourdes: area * MATERIAL_CONSUMPTION.LAMBOURDES_PER_M2,
      clips: area * MATERIAL_CONSUMPTION.CLIPS_PER_M2,
      edges: perimeter,
      perimeter,
    };
  };

  const calculatePrices = (materials: MaterialCalculation): PriceCalculation => {
    const lames = materials.area * PRICES.LAMES_PER_M2;
    const lambourdes = materials.lambourdes * PRICES.LAMBOURDES_PER_M;
    const clips = materials.clips * PRICES.CLIPS_PER_UNIT;
    const edges = config.includeEdges 
      ? materials.edges * (config.edgeType === 'cornières' ? PRICES.CORNIERES_PER_M : PRICES.PLINTHES_PER_M)
      : 0;
    
    return {
      lames,
      lambourdes,
      clips,
      edges,
      total: lames + lambourdes + clips + edges,
    };
  };

  const materials = calculateMaterials();
  const prices = calculatePrices(materials);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
    }).format(price);
  };

  const generateReport = () => {
    const report = `
DEVIS TERRASSE EN BOIS COMPOSITE
================================

Configuration:
- Forme: ${config.shape}
- Dimensions: ${config.dimensions.width}m × ${config.dimensions.height}m
${config.shape !== 'rectangulaire' ? `- Extension: ${config.dimensions.extensionWidth}m × ${config.dimensions.extensionHeight}m` : ''}
- Couleur: ${config.color}
- Finition: ${config.finish}
- Surface totale: ${materials.area.toFixed(2)} m²
- Périmètre: ${materials.perimeter.toFixed(2)} m

Matériaux nécessaires:
- Lames: ${materials.lames.toFixed(2)} m
- Lambourdes: ${materials.lambourdes.toFixed(2)} m
- Clips de fixation: ${Math.ceil(materials.clips)} unités
${config.includeEdges ? `- ${config.edgeType}: ${materials.edges.toFixed(2)} m` : ''}

Prix détaillé:
- Lames: ${formatPrice(prices.lames)}
- Lambourdes: ${formatPrice(prices.lambourdes)}
- Clips: ${formatPrice(prices.clips)}
${config.includeEdges ? `- ${config.edgeType}: ${formatPrice(prices.edges)}` : ''}

TOTAL: ${formatPrice(prices.total)}

Informations techniques:
- Lambourdes espacées de 50 cm
- Lames posées perpendiculairement sur les lambourdes
- Consommation par m²: ${MATERIAL_CONSUMPTION.LAMES_PER_M2}m de lames, ${MATERIAL_CONSUMPTION.LAMBOURDES_PER_M2}m de lambourdes, ${MATERIAL_CONSUMPTION.CLIPS_PER_M2} clips
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devis-terrasse-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
          <Calculator className="w-5 h-5" />
          Calcul des matériaux et prix
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Materials Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5" />
              Matériaux nécessaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Surface totale</span>
                <Badge variant="secondary">{materials.area.toFixed(2)} m²</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Lames</span>
                <span className="font-medium">{materials.lames.toFixed(2)} m</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Lambourdes</span>
                <span className="font-medium">{materials.lambourdes.toFixed(2)} m</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Clips de fixation</span>
                <span className="font-medium">{Math.ceil(materials.clips)} unités</span>
              </div>
              
              {config.includeEdges && (
                <div className="flex justify-between items-center">
                  <span className="text-sm capitalize">{config.edgeType}</span>
                  <span className="font-medium">{materials.edges.toFixed(2)} m</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Périmètre</span>
                <span className="font-medium">{materials.perimeter.toFixed(2)} m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prices Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="w-5 h-5" />
              Prix détaillé
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Lames</span>
                <span className="font-medium">{formatPrice(prices.lames)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Lambourdes</span>
                <span className="font-medium">{formatPrice(prices.lambourdes)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Clips</span>
                <span className="font-medium">{formatPrice(prices.clips)}</span>
              </div>
              
              {config.includeEdges && (
                <div className="flex justify-between items-center">
                  <span className="text-sm capitalize">{config.edgeType}</span>
                  <span className="font-medium">{formatPrice(prices.edges)}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">TOTAL</span>
                  <span className="font-bold text-lg text-primary">{formatPrice(prices.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price breakdown summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              Prix unitaires: Lames {PRICES.LAMES_PER_M2.toLocaleString()} DA/m² • 
              Lambourdes {PRICES.LAMBOURDES_PER_M} DA/m • 
              Clips {PRICES.CLIPS_PER_UNIT} DA/unité • 
              Cornières {PRICES.CORNIERES_PER_M} DA/m • 
              Plinthes {PRICES.PLINTHES_PER_M} DA/m
            </div>
            
            <Button onClick={generateReport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger le devis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};