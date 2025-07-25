import { DeckConfig } from '@/types/deck';

interface DeckVisualizerProps {
  config: DeckConfig;
}

export const DeckVisualizer = ({ config }: DeckVisualizerProps) => {
  const { shape, dimensions, color } = config;

  const getColorClass = (woodColor: string) => {
    switch (woodColor) {
      case 'gris':
        return 'bg-wood-gris';
      case 'acajou':
        return 'bg-wood-acajou';
      case 'chene':
        return 'bg-wood-chene';
      case 'marron':
        return 'bg-wood-marron';
      default:
        return 'bg-wood-chene';
    }
  };

  const calculateArea = () => {
    const mainArea = dimensions.width * dimensions.height;
    
    if (shape === 'rectangulaire') {
      return mainArea;
    }
    
    if (shape === 'L' || shape === 'U') {
      const extensionArea = (dimensions.extensionWidth || 0) * (dimensions.extensionHeight || 0);
      return shape === 'U' ? mainArea + (2 * extensionArea) : mainArea + extensionArea;
    }
    
    return mainArea;
  };

  const renderDeck = () => {
    const colorClass = getColorClass(color);
    const scale = Math.min(400 / Math.max(dimensions.width, dimensions.height), 50);
    
    const mainWidth = dimensions.width * scale;
    const mainHeight = dimensions.height * scale;

    if (shape === 'rectangulaire') {
      return (
        <div className="flex items-center justify-center h-96">
          <div
            className={`${colorClass} border-2 border-primary/20 rounded-lg shadow-deck relative`}
            style={{
              width: `${mainWidth}px`,
              height: `${mainHeight}px`,
            }}
          >
            {/* Lames pattern */}
            <div className="absolute inset-1 overflow-hidden rounded">
              {Array.from({ length: Math.ceil(mainHeight / 8) }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-b border-primary/10"
                  style={{ top: `${i * 8}px`, height: '6px' }}
                />
              ))}
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

      return (
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            {/* Main section */}
            <div
              className={`${colorClass} border-2 border-primary/20 rounded-lg shadow-deck relative`}
              style={{
                width: `${mainWidth}px`,
                height: `${mainHeight}px`,
              }}
            >
              <div className="absolute inset-1 overflow-hidden rounded">
                {Array.from({ length: Math.ceil(mainHeight / 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-b border-primary/10"
                    style={{ top: `${i * 8}px`, height: '6px' }}
                  />
                ))}
              </div>
            </div>

            {/* Extension */}
            <div
              className={`${colorClass} border-2 border-primary/20 rounded-lg shadow-deck absolute top-0 -right-2 relative`}
              style={{
                width: `${extWidth}px`,
                height: `${extHeight}px`,
                left: `${mainWidth - 2}px`,
              }}
            >
              <div className="absolute inset-1 overflow-hidden rounded">
                {Array.from({ length: Math.ceil(extHeight / 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-b border-primary/10"
                    style={{ top: `${i * 8}px`, height: '6px' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (shape === 'U') {
      const extWidth = (dimensions.extensionWidth || 2) * scale;
      const extHeight = (dimensions.extensionHeight || 2) * scale;

      return (
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            {/* Main section */}
            <div
              className={`${colorClass} border-2 border-primary/20 rounded-lg shadow-deck relative`}
              style={{
                width: `${mainWidth}px`,
                height: `${mainHeight}px`,
              }}
            >
              <div className="absolute inset-1 overflow-hidden rounded">
                {Array.from({ length: Math.ceil(mainHeight / 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-b border-primary/10"
                    style={{ top: `${i * 8}px`, height: '6px' }}
                  />
                ))}
              </div>
            </div>

            {/* Left extension */}
            <div
              className={`${colorClass} border-2 border-primary/20 rounded-lg shadow-deck absolute top-0`}
              style={{
                width: `${extWidth}px`,
                height: `${extHeight}px`,
                left: `-${extWidth + 2}px`,
              }}
            >
              <div className="absolute inset-1 overflow-hidden rounded">
                {Array.from({ length: Math.ceil(extHeight / 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-b border-primary/10"
                    style={{ top: `${i * 8}px`, height: '6px' }}
                  />
                ))}
              </div>
            </div>

            {/* Right extension */}
            <div
              className={`${colorClass} border-2 border-primary/20 rounded-lg shadow-deck absolute top-0`}
              style={{
                width: `${extWidth}px`,
                height: `${extHeight}px`,
                left: `${mainWidth + 2}px`,
              }}
            >
              <div className="absolute inset-1 overflow-hidden rounded">
                {Array.from({ length: Math.ceil(extHeight / 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 border-b border-primary/10"
                    style={{ top: `${i * 8}px`, height: '6px' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Vue de la terrasse</h3>
        <p className="text-muted-foreground">
          Surface totale: <span className="font-medium">{calculateArea().toFixed(2)} m²</span>
        </p>
      </div>
      
      <div className="bg-deck-surface/30 rounded-lg p-8 border">
        {renderDeck()}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Couleur: <span className="font-medium capitalize">{color}</span></p>
        <p>Finition: <span className="font-medium capitalize">{config.finish}</span></p>
        {config.includeEdges && (
          <p>Contours: <span className="font-medium capitalize">{config.edgeType}</span></p>
        )}
      </div>
    </div>
  );
};