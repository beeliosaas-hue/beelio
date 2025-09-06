import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderOpen, 
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

const Library = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const assets = [
    {
      id: 1,
      name: "Post Dia das Mães 2024",
      type: "image",
      format: "PNG",
      size: "2.5 MB",
      date: "2024-05-10",
      campaign: "Datas Comemorativas",
      tags: ["mães", "família", "amor"],
      thumbnail: "/placeholder-image.jpg"
    },
    {
      id: 2,
      name: "Vídeo Tutorial Produto",
      type: "video",
      format: "MP4",
      size: "15.8 MB",
      date: "2024-11-15",
      campaign: "Educativo",
      tags: ["tutorial", "produto", "educativo"],
      thumbnail: "/placeholder-video.jpg"
    },
    {
      id: 3,
      name: "Copy Instagram Stories",
      type: "document",
      format: "TXT",
      size: "2 KB",
      date: "2024-11-20",
      campaign: "Black Friday",
      tags: ["copy", "stories", "promocao"],
      thumbnail: "/placeholder-doc.jpg"
    },
    {
      id: 4,
      name: "Logo Marca Principal",
      type: "image",
      format: "SVG",
      size: "45 KB",
      date: "2024-10-01",
      campaign: "Branding",
      tags: ["logo", "marca", "identidade"],
      thumbnail: "/placeholder-logo.jpg"
    },
    {
      id: 5,
      name: "Carrossel Benefícios",
      type: "image",
      format: "PNG",
      size: "4.2 MB",
      date: "2024-11-12",
      campaign: "Vendas",
      tags: ["carrossel", "beneficios", "vendas"],
      thumbnail: "/placeholder-carousel.jpg"
    },
    {
      id: 6,
      name: "Vídeo Depoimento Cliente",
      type: "video",
      format: "MP4",
      size: "23.1 MB",
      date: "2024-11-08",
      campaign: "Social Proof",
      tags: ["depoimento", "cliente", "prova"],
      thumbnail: "/placeholder-testimonial.jpg"
    }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filter === "all" || asset.type === filter;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return Image;
      case "video": return Video;
      case "document": return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image": return "text-blue-500";
      case "video": return "text-purple-500";
      case "document": return "text-green-500";
      default: return "text-gray-500";
    }
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

        {/* Toolbar */}
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-foreground">{assets.length}</h3>
              <p className="text-sm text-muted-foreground">Total de Assets</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-blue-500">{assets.filter(a => a.type === "image").length}</h3>
              <p className="text-sm text-muted-foreground">Imagens</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-purple-500">{assets.filter(a => a.type === "video").length}</h3>
              <p className="text-sm text-muted-foreground">Vídeos</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <h3 className="text-2xl font-bold text-green-500">{assets.filter(a => a.type === "document").length}</h3>
              <p className="text-sm text-muted-foreground">Documentos</p>
            </CardContent>
          </Card>
        </div>

        {/* Assets Grid/List */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            {view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAssets.map((asset) => {
                  const TypeIcon = getTypeIcon(asset.type);
                  return (
                    <div key={asset.id} className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-soft transition-smooth">
                      {/* Thumbnail */}
                      <div className="aspect-video bg-accent/30 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <TypeIcon className={`h-12 w-12 ${getTypeColor(asset.type)}`} />
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
                          <Badge variant="secondary" className="text-xs">
                            {asset.format}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{asset.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{asset.size}</span>
                            <span>{new Date(asset.date).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {asset.campaign}
                          </Badge>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-smooth">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
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
                  <div className="col-span-2">Campanha</div>
                  <div className="col-span-2">Tamanho</div>
                  <div className="col-span-2">Data</div>
                  <div className="col-span-1">Ações</div>
                </div>
                {filteredAssets.map((asset) => {
                  const TypeIcon = getTypeIcon(asset.type);
                  return (
                    <div key={asset.id} className="grid grid-cols-12 gap-4 py-3 px-4 items-center hover:bg-accent/30 rounded-lg transition-smooth">
                      <div className="col-span-1">
                        <TypeIcon className={`h-5 w-5 ${getTypeColor(asset.type)}`} />
                      </div>
                      <div className="col-span-4">
                        <p className="font-medium text-sm">{asset.name}</p>
                        <div className="flex gap-1 mt-1">
                          {asset.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="secondary" className="text-xs">
                          {asset.campaign}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {asset.size}
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">
                        {new Date(asset.date).toLocaleDateString("pt-BR")}
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