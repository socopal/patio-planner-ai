import { DeckConfig } from '@/types/deck';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LambourdeViewProps {
  config: DeckConfig;
}

export const LambourdeView = ({ config }: LambourdeViewProps) => {
  const { shape, dimensions } = config;

  const calculateArea = () => {
    const mainArea = dimensions.width * dimensions.height;
    
    if (shape === 'rectangulaire') {
      return mainArea;
    }
    
    if (shape === 'L') {
      const extensionArea = (dimensions.extensionWidth || 0) * (dimensions.extensionHeight || 0);
      return mainArea + extensionArea;
    }
    
    if (shape === 'U') {
      const extensionArea = (dimensions.extensionWidth || 0) * (dimensions.extensionHeight || 0);
      return mainArea + (2 * extensionArea);
    }
    
    return mainArea;
  };

  const renderLambourdes = () => {
    const scale = Math.min(400 / Math.max(dimensions.width, dimensions.height), 50);
    const mainWidth = dimensions.width * scale;
    const mainHeight = dimensions.height * scale;
    
    // Lambourdes are spaced 50cm apart
    const lambourdeSpacing = 0.5 * scale; // 50cm in scaled units

    if (shape === 'rectangulaire') {
      const numberOfLambourdes = Math.ceil(dimensions.height / 0.5);
      
      return (
        <div className="flex items-center justify-center h-96">
          <div
            className="border-2 border-dashed border-primary/30 rounded-lg relative bg-deck-surface/20"
            style={{
              width: `${mainWidth}px`,
              height: `${mainHeight}px`,
            }}
          >
            {/* Lambourdes - horizontal lines */}
            {Array.from({ length: numberOfLambourdes }).map((_, i) => (
              <div
                key={i}
                className="absolute left-2 right-2 bg-deck-lambourde rounded-sm shadow-sm"
                style={{
                  top: `${i * lambourdeSpacing}px`,
                  height: '6px',
                }}
              />
            ))}
            
            {/* Direction arrows showing lame placement */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col space-y-2 opacity-60">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 h-1 bg-primary/50"></div>
                    <div className="w-2 h-2 border-t-2 border-r-2 border-primary/50 transform rotate-45 -ml-1"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dimensions labels */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-foreground">
              {dimensions.width}m
            </div>
            <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-foreground">
              {dimensions.height}m
            </div>
          </div>
        </div>
      );
    }

    if (shape === 'L') {
      const extWidth = (dimensions.extensionWidth || 2) * scale;
      const extHeight = (dimensions.extensionHeight || 2) * scale;
      const mainLambourdes = Math.ceil(dimensions.height / 0.5);
      const extLambourdes = Math.ceil((dimensions.extensionHeight || 2) / 0.5);

      return (
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            {/* Main section */}
            <div
              className="border-2 border-dashed border-primary/30 rounded-lg relative bg-deck-surface/20"
              style={{
                width: `${mainWidth}px`,
                height: `${mainHeight}px`,
              }}
            >
              {Array.from({ length: mainLambourdes }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-2 right-2 bg-deck-lambourde rounded-sm shadow-sm"
                  style={{
                    top: `${i * lambourdeSpacing}px`,
                    height: '6px',
                  }}
                />
              ))}
            </div>

            {/* Extension */}
            <div
              className="border-2 border-dashed border-primary/30 rounded-lg absolute top-0 bg-deck-surface/20"
              style={{
                width: `${extWidth}px`,
                height: `${extHeight}px`,
                left: `${mainWidth - 2}px`,
              }}
            >
              {Array.from({ length: extLambourdes }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-2 right-2 bg-deck-lambourde rounded-sm shadow-sm"
                  style={{
                    top: `${i * lambourdeSpacing}px`,
                    height: '6px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (shape === 'U') {
      const extWidth = (dimensions.extensionWidth || 2) * scale;
      const extHeight = (dimensions.extensionHeight || 2) * scale;
      const mainLambourdes = Math.ceil(dimensions.height / 0.5);
      const extLambourdes = Math.ceil((dimensions.extensionHeight || 2) / 0.5);

      return (
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            {/* Main section */}
            <div
              className="border-2 border-dashed border-primary/30 rounded-lg relative bg-deck-surface/20"
              style={{
                width: `${mainWidth}px`,
                height: `${mainHeight}px`,
              }}
            >
              {Array.from({ length: mainLambourdes }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-2 right-2 bg-deck-lambourde rounded-sm shadow-sm"
                  style={{
                    top: `${i * lambourdeSpacing}px`,
                    height: '6px',
                  }}
                />
              ))}
            </div>

            {/* Left extension */}
            <div
              className="border-2 border-dashed border-primary/30 rounded-lg absolute top-0 bg-deck-surface/20"
              style={{
                width: `${extWidth}px`,
                height: `${extHeight}px`,
                left: `-${extWidth + 2}px`,
              }}
            >
              {Array.from({ length: extLambourdes }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-2 right-2 bg-deck-lambourde rounded-sm shadow-sm"
                  style={{
                    top: `${i * lambourdeSpacing}px`,
                    height: '6px',
                  }}
                />
              ))}
            </div>

            {/* Right extension */}
            <div
              className="border-2 border-dashed border-primary/30 rounded-lg absolute top-0 bg-deck-surface/20"
              style={{
                width: `${extWidth}px`,
                height: `${extHeight}px`,
                left: `${mainWidth + 2}px`,
              }}
            >
              {Array.from({ length: extLambourdes }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-2 right-2 bg-deck-lambourde rounded-sm shadow-sm"
                  style={{
                    top: `${i * lambourdeSpacing}px`,
                    height: '6px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const calculateLambourdeLength = () => {
    return calculateArea() * 3; // 3m de lambourde par m²
  };

  const calculateNumberOfLambourdes = () => {
    if (shape === 'rectangulaire') {
      return Math.ceil(dimensions.height / 0.5);
    }
    
    if (shape === 'L') {
      const main = Math.ceil(dimensions.height / 0.5);
      const ext = Math.ceil((dimensions.extensionHeight || 2) / 0.5);
      return main + ext;
    }
    
    if (shape === 'U') {
      const main = Math.ceil(dimensions.height / 0.5);
      const ext = Math.ceil((dimensions.extensionHeight || 2) / 0.5);
      return main + (2 * ext);
    }
    
    return 0;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Vue des lambourdes</h3>
        <p className="text-muted-foreground">
          Espacement de 50 cm entre les lambourdes
        </p>
      </div>
      
      <div className="bg-deck-surface/30 rounded-lg p-8 border">
        {renderLambourdes()}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{calculateNumberOfLambourdes()}</div>
              <div className="text-sm text-muted-foreground">Lignes de lambourdes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{calculateLambourdeLength().toFixed(1)}m</div>
              <div className="text-sm text-muted-foreground">Longueur totale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50cm</div>
              <div className="text-sm text-muted-foreground">Espacement</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">⊥</div>
              <div className="text-sm text-muted-foreground">Lames perpendiculaires</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-3 h-3 bg-deck-lambourde rounded"></div>
          Lambourdes
        </Badge>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-3 h-1 bg-primary/50"></div>
          Direction des lames
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        <p>Les lames sont posées perpendiculairement aux lambourdes pour assurer une fixation optimale.</p>
        <p>L'espacement de 50 cm entre lambourdes garantit la stabilité de la structure.</p>
      </div>
    </div>
  );
};