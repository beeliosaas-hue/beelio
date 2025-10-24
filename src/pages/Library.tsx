import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Image, 
  Video, 
  FileText, 
  Download,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Asset {
  id: string;
  nome_arquivo: string;
  tipo_arquivo: string;
  url_arquivo: string;
  tamanho_arquivo: number;
  created_at: string;
  tags: string[];
  pasta: string;
}

const Library = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('biblioteca')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar biblioteca:', error);
      toast.error('Erro ao carregar biblioteca');
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('biblioteca')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Asset excluído com sucesso');
      loadAssets();
    } catch (error: any) {
      console.error('Erro ao excluir asset:', error);
      toast.error('Erro ao excluir asset');
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filter === "all" || asset.tipo_arquivo === filter;
    const matchesSearch = asset.nome_arquivo.toLowerCase().includes(search.toLowerCase()) ||
                         (asset.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return FileText;
  };

  const getTypeColor = (type: string) => {
    if (type.startsWith('image/')) return "text-blue-500";
    if (type.startsWith('video/')) return "text-purple-500";
    return "text-green-500";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Biblioteca</h1>
          <p className="text-muted-foreground">
            Todos os seus assets de marketing organizados em um só lugar
          </p>
        </div>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-3 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar assets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="image">Imagens</SelectItem>
                    <SelectItem value="video">Vídeos</SelectItem>
                    <SelectItem value="document">Documentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button className="bg-honey-gradient hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-foreground">{assets.length}</h3>
              <p className="text-sm text-muted-foreground">Total de Assets</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-500">
                {assets.filter(a => a.tipo_arquivo.startsWith('image/')).length}
              </h3>
              <p className="text-sm text-muted-foreground">Imagens</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-purple-500">
                {assets.filter(a => a.tipo_arquivo.startsWith('video/')).length}
              </h3>
              <p className="text-sm text-muted-foreground">Vídeos</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-green-500">
                {assets.filter(a => !a.tipo_arquivo.startsWith('image/') && !a.tipo_arquivo.startsWith('video/')).length}
              </h3>
              <p className="text-sm text-muted-foreground">Documentos</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum asset encontrado</h3>
                <p className="text-muted-foreground">
                  {search || filter !== 'all' ? 'Tente ajustar seus filtros' : 'Faça upload do seu primeiro asset'}
                </p>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAssets.map((asset) => {
                  const TypeIcon = getTypeIcon(asset.tipo_arquivo);
                  return (
                    <div key={asset.id} className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-soft transition-smooth">
                      <div className="aspect-video bg-accent/30 relative overflow-hidden flex items-center justify-center">
                        <TypeIcon className={`h-12 w-12 ${getTypeColor(asset.tipo_arquivo)}`} />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{asset.nome_arquivo}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatFileSize(asset.tamanho_arquivo)}</span>
                            <span>{new Date(asset.created_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {asset.pasta || 'Geral'}
                          </Badge>
                        </div>
                        <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-smooth">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => deleteAsset(asset.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 py-2 px-4 text-sm font-medium text-muted-foreground border-b">
                  <div className="col-span-1">Tipo</div>
                  <div className="col-span-4">Nome</div>
                  <div className="col-span-2">Pasta</div>
                  <div className="col-span-2">Tamanho</div>
                  <div className="col-span-2">Data</div>
                  <div className="col-span-1">Ações</div>
                </div>
                {filteredAssets.map((asset) => {
                  const TypeIcon = getTypeIcon(asset.tipo_arquivo);
                  return (
                    <div key={asset.id} className="grid grid-cols-12 gap-4 py-3 px-4 items-center hover:bg-accent/30 rounded-lg transition-smooth">
                      <div className="col-span-1">
                        <TypeIcon className={`h-5 w-5 ${getTypeColor(asset.tipo_arquivo)}`} />
                      </div>
                      <div className="col-span-4">
                        <p className="font-medium text-sm">{asset.nome_arquivo}</p>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="secondary" className="text-xs">
                          {asset.pasta || 'Geral'}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {formatFileSize(asset.tamanho_arquivo)}
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {new Date(asset.created_at).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="col-span-1">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Library;
