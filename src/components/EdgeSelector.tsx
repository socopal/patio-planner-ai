import { EdgeSelection } from '@/types/deck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface EdgeSelectorProps {
  edgeSelection: EdgeSelection;
  onEdgeSelectionChange: (edges: EdgeSelection) => void;
  edgeType: string;
}

export const EdgeSelector = ({ edgeSelection, onEdgeSelectionChange, edgeType }: EdgeSelectorProps) => {
  const updateEdge = (side: keyof EdgeSelection, value: boolean) => {
    onEdgeSelectionChange({
      ...edgeSelection,
      [side]: value
    });
  };

  const selectedCount = Object.values(edgeSelection).filter(Boolean).length;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          Côtés à couvrir
          <Badge variant="secondary" className="text-xs">
            {selectedCount}/4 côtés
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="edge-top"
              checked={edgeSelection.top}
              onCheckedChange={(checked) => updateEdge('top', checked)}
            />
            <Label htmlFor="edge-top" className="text-sm">Haut</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="edge-bottom"
              checked={edgeSelection.bottom}
              onCheckedChange={(checked) => updateEdge('bottom', checked)}
            />
            <Label htmlFor="edge-bottom" className="text-sm">Bas</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="edge-left"
              checked={edgeSelection.left}
              onCheckedChange={(checked) => updateEdge('left', checked)}
            />
            <Label htmlFor="edge-left" className="text-sm">Gauche</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="edge-right"
              checked={edgeSelection.right}
              onCheckedChange={(checked) => updateEdge('right', checked)}
            />
            <Label htmlFor="edge-right" className="text-sm">Droite</Label>
          </div>
        </div>
        
        {selectedCount > 0 && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            {edgeType === 'cornières' ? 'Cornières' : 'Plinthes'} sur {selectedCount} côté{selectedCount > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};