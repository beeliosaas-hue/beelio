import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';

interface PostPreviewProps {
  caption: string;
  mediaUrl?: string;
}

export function PostPreview({ caption, mediaUrl }: PostPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mediaUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={mediaUrl}
              alt="Preview da mídia"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        )}
        
        {!mediaUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-xs">Nenhuma mídia</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Texto:</p>
          {caption ? (
            <p className="text-sm whitespace-pre-wrap break-words">{caption}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">Nenhum texto ainda...</p>
          )}
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>📏 {caption.length} caracteres</p>
        </div>
      </CardContent>
    </Card>
  );
}
