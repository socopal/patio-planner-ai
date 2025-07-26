import { DeckConfig, MATERIAL_CONSUMPTION, PRICES, MaterialCalculation, PriceCalculation } from '@/types/deck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, Download, Package, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';

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
    if (!config.includeEdges || !config.edgeSelection) {
      return 0;
    }
    
    const { width, height } = config.dimensions;
    let perimeter = 0;
    
    if (config.shape === 'rectangulaire') {
      if (config.edgeSelection.top) perimeter += width;
      if (config.edgeSelection.bottom) perimeter += width;
      if (config.edgeSelection.left) perimeter += height;
      if (config.edgeSelection.right) perimeter += height;
      return perimeter;
    }
    
    if (config.shape === 'L') {
      const extW = config.dimensions.extensionWidth || 0;
      const extH = config.dimensions.extensionHeight || 0;
      
      // Calcul simplifié pour forme L - approximation du périmètre
      const totalPerimeter = 2 * (width + height) + 2 * (extW + extH) - 2 * Math.min(extW, width);
      return totalPerimeter * (Object.values(config.edgeSelection).filter(Boolean).length / 4);
    }
    
    if (config.shape === 'U') {
      const extW = config.dimensions.extensionWidth || 0;
      const extH = config.dimensions.extensionHeight || 0;
      
      // Calcul simplifié pour forme U - approximation du périmètre
      const totalPerimeter = 2 * (width + height) + 4 * (extW + extH) - 4 * Math.min(extW, width);
      return totalPerimeter * (Object.values(config.edgeSelection).filter(Boolean).length / 4);
    }
    
    return 0;
  };

  const calculateMaterials = (): MaterialCalculation => {
    const area = calculateArea();
    const perimeter = calculatePerimeter();
    
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

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('DEVIS TERRASSE COMPOSITE', 20, 30);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 150, 30);
    
    // Configuration
    doc.setFontSize(14);
    doc.text('Configuration:', 20, 50);
    doc.setFontSize(10);
    doc.text(`- Forme: Rectangulaire`, 20, 60);
    doc.text(`- Dimensions: ${config.dimensions.width}m x ${config.dimensions.height}m`, 20, 70);
    doc.text(`- Surface totale: ${materials.area.toFixed(2)} m²`, 20, 80);
    doc.text(`- Couleur: ${config.color}`, 20, 90);
    doc.text(`- Finition: ${config.finish}`, 20, 100);
    
    if (config.includeEdges) {
      const selectedEdges = Object.entries(config.edgeSelection || {})
        .filter(([_, selected]) => selected)
        .map(([side]) => side)
        .join(', ');
      doc.text(`- Contours ${config.edgeType}: ${selectedEdges}`, 20, 110);
      doc.text(`- Périmètre de contours: ${materials.perimeter.toFixed(2)}m`, 20, 120);
    }
    
    // Materials
    doc.setFontSize(14);
    doc.text('Matériaux nécessaires:', 20, 140);
    doc.setFontSize(10);
    doc.text(`- Lames: ${materials.lames.toFixed(2)}m`, 30, 155);
    doc.text(`- Lambourdes: ${materials.lambourdes.toFixed(2)}m`, 30, 165);
    doc.text(`- Clips: ${materials.clips} unités`, 30, 175);
    if (config.includeEdges) {
      doc.text(`- ${config.edgeType}: ${materials.edges.toFixed(2)}m`, 30, 185);
    }
    
    // Prices
    doc.setFontSize(14);
    doc.text('Détail des prix:', 20, 205);
    doc.setFontSize(10);
    doc.text(`- Lames: ${formatPrice(prices.lames)}`, 30, 220);
    doc.text(`- Lambourdes: ${formatPrice(prices.lambourdes)}`, 30, 230);
    doc.text(`- Clips: ${formatPrice(prices.clips)}`, 30, 240);
    if (config.includeEdges) {
      doc.text(`- ${config.edgeType}: ${formatPrice(prices.edges)}`, 30, 250);
    }
    
    // Total
    doc.setFontSize(16);
    doc.text(`TOTAL: ${formatPrice(prices.total)}`, 20, 270);
    
    // Notes
    doc.setFontSize(8);
    doc.text('Notes techniques:', 20, 290);
    doc.text('- Prix exprimés en DA', 20, 298);
    doc.text('- Lambourdes espacées de 50cm', 20, 304);
    doc.text('- Lames posées perpendiculairement sur les lambourdes', 20, 310);
    doc.text(`- Consommation par m²: ${MATERIAL_CONSUMPTION.LAMES_PER_M2}m de lames, ${MATERIAL_CONSUMPTION.LAMBOURDES_PER_M2}m de lambourdes, ${MATERIAL_CONSUMPTION.CLIPS_PER_M2} clips`, 20, 316);
    
    // Save PDF
    doc.save(`devis-terrasse-${Date.now()}.pdf`);
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
            
            <Button onClick={generatePDFReport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger le devis PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};