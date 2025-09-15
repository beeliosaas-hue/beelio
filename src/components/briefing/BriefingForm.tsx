import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  Building2, 
  Target, 
  Users, 
  Zap, 
  Package, 
  TrendingUp, 
  Palette, 
  MessageSquare, 
  History, 
  Plus,
  Upload,
  Link
} from "lucide-react";

interface BriefingFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function BriefingForm({ onSave, onCancel, initialData }: BriefingFormProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    identity: false,
    audience: false,
    competition: false,
    products: false,
    objectives: false,
    visual: false,
    communication: false,
    history: false,
    extras: false
  });

  const [formData, setFormData] = useState({
    // 1. Informações Básicas
    brandName: initialData?.brandName || "",
    website: initialData?.website || "",
    socialMedia: initialData?.socialMedia || "",
    segment: initialData?.segment || "",
    location: initialData?.location || "",
    
    // 2. Identidade da Marca
    mission: initialData?.mission || "",
    vision: initialData?.vision || "",
    values: initialData?.values || "",
    personality: initialData?.personality || "",
    toneOfVoice: initialData?.toneOfVoice || "",
    
    // 3. Público-Alvo
    targetClient: initialData?.targetClient || "",
    ageRange: initialData?.ageRange || "",
    targetLocation: initialData?.targetLocation || "",
    socioeconomic: initialData?.socioeconomic || "",
    interests: initialData?.interests || "",
    painPoints: initialData?.painPoints || "",
    solutionSeeking: initialData?.solutionSeeking || "",
    
    // 4. Diferenciais & Concorrência
    differentials: initialData?.differentials || "",
    competitors: initialData?.competitors || "",
    admiredFeatures: initialData?.admiredFeatures || "",
    avoidFeatures: initialData?.avoidFeatures || "",
    
    // 5. Produtos/Serviços
    products: initialData?.products || "",
    averageTicket: initialData?.averageTicket || "",
    currentPriority: initialData?.currentPriority || "",
    
    // 6. Objetivos de Marketing
    objectives: initialData?.objectives || [],
    specificGoal: initialData?.specificGoal || "",
    
    // 7. Diretrizes Visuais
    brandColors: initialData?.brandColors || [],
    logoUrl: initialData?.logoUrl || "",
    logoFile: initialData?.logoFile || "",
    logo: initialData?.logo || "",
    existingMaterials: initialData?.existingMaterials || "",
    existingMaterialsFiles: initialData?.existingMaterialsFiles || "",
    visualReferences: initialData?.visualReferences || [],
    
    // 8. Comunicação & Conteúdo
    currentSocialMedia: initialData?.currentSocialMedia || "",
    preferredChannels: initialData?.preferredChannels || "",
    contentTypes: initialData?.contentTypes || [],
    admiredBrands: initialData?.admiredBrands || "",
    
    // 9. Histórico & Momento Atual
    brandHistory: initialData?.brandHistory || "",
    achievements: initialData?.achievements || "",
    currentChallenges: initialData?.currentChallenges || "",
    opportunities: initialData?.opportunities || "",
    
    // 10. Extras
    additionalInfo: initialData?.additionalInfo || "",
    restrictions: initialData?.restrictions || ""
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    const currentObjectives = formData.objectives || [];
    if (checked) {
      updateFormData('objectives', [...currentObjectives, objective]);
    } else {
      updateFormData('objectives', currentObjectives.filter((obj: string) => obj !== objective));
    }
  };

  const handleContentTypeChange = (type: string, checked: boolean) => {
    const currentTypes = formData.contentTypes || [];
    if (checked) {
      updateFormData('contentTypes', [...currentTypes, type]);
    } else {
      updateFormData('contentTypes', currentTypes.filter((t: string) => t !== type));
    }
  };

  const sections = [
    {
      id: 'basic',
      title: '1. Informações Básicas',
      icon: Building2,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brandName">Nome da Marca</Label>
            <Input
              id="brandName"
              value={formData.brandName}
              onChange={(e) => updateFormData('brandName', e.target.value)}
              placeholder="Ex: Beelio"
            />
          </div>
          <div>
            <Label htmlFor="website">Site / Redes Sociais</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              placeholder="www.exemplo.com"
            />
          </div>
          <div>
            <Label htmlFor="segment">Segmento de Atuação</Label>
            <Input
              id="segment"
              value={formData.segment}
              onChange={(e) => updateFormData('segment', e.target.value)}
              placeholder="Ex: Marketing Digital, E-commerce"
            />
          </div>
          <div>
            <Label htmlFor="location">Localização / Abrangência</Label>
            <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a abrangência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="nacional">Nacional</SelectItem>
                <SelectItem value="internacional">Internacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      id: 'identity',
      title: '2. Identidade da Marca',
      icon: Target,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="mission">Missão (por que a marca existe?)</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => updateFormData('mission', e.target.value)}
              placeholder="Descreva qual é o propósito da sua marca..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="vision">Visão (onde quer chegar?)</Label>
            <Textarea
              id="vision"
              value={formData.vision}
              onChange={(e) => updateFormData('vision', e.target.value)}
              placeholder="Descreva aonde a marca quer chegar..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="values">Valores (no que acredita?)</Label>
            <Textarea
              id="values"
              value={formData.values}
              onChange={(e) => updateFormData('values', e.target.value)}
              placeholder="Liste os valores fundamentais da marca..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="personality">Personalidade da Marca (3 a 5 adjetivos)</Label>
            <Input
              id="personality"
              value={formData.personality}
              onChange={(e) => updateFormData('personality', e.target.value)}
              placeholder="Ex: Inovadora, Confiável, Acessível"
            />
          </div>
          <div>
            <Label htmlFor="toneOfVoice">Tom de Voz</Label>
            <Select value={formData.toneOfVoice} onValueChange={(value) => updateFormData('toneOfVoice', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tom de voz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="descontraido">Descontraído</SelectItem>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="divertido">Divertido</SelectItem>
                <SelectItem value="inspirador">Inspirador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      id: 'audience',
      title: '3. Público-Alvo',
      icon: Users,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="targetClient">Quem é o cliente ideal?</Label>
            <Textarea
              id="targetClient"
              value={formData.targetClient}
              onChange={(e) => updateFormData('targetClient', e.target.value)}
              placeholder="Descreva detalhadamente seu cliente ideal..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ageRange">Faixa Etária</Label>
              <Input
                id="ageRange"
                value={formData.ageRange}
                onChange={(e) => updateFormData('ageRange', e.target.value)}
                placeholder="Ex: 25-45 anos"
              />
            </div>
            <div>
              <Label htmlFor="targetLocation">Localização</Label>
              <Input
                id="targetLocation"
                value={formData.targetLocation}
                onChange={(e) => updateFormData('targetLocation', e.target.value)}
                placeholder="Ex: São Paulo, Brasil"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="socioeconomic">Nível Socioeconômico</Label>
            <Select value={formData.socioeconomic} onValueChange={(value) => updateFormData('socioeconomic', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível socioeconômico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Classe A</SelectItem>
                <SelectItem value="B">Classe B</SelectItem>
                <SelectItem value="C">Classe C</SelectItem>
                <SelectItem value="D">Classe D</SelectItem>
                <SelectItem value="E">Classe E</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="interests">Estilo de vida/interesses</Label>
            <Textarea
              id="interests"
              value={formData.interests}
              onChange={(e) => updateFormData('interests', e.target.value)}
              placeholder="Descreva interesses, hobbies, estilo de vida..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="painPoints">Principais dores ou necessidades do público</Label>
            <Textarea
              id="painPoints"
              value={formData.painPoints}
              onChange={(e) => updateFormData('painPoints', e.target.value)}
              placeholder="Quais problemas seu público enfrenta?"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="solutionSeeking">O que o público busca na sua solução?</Label>
            <Textarea
              id="solutionSeeking"
              value={formData.solutionSeeking}
              onChange={(e) => updateFormData('solutionSeeking', e.target.value)}
              placeholder="O que esperam da sua marca/produto?"
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'competition',
      title: '4. Diferenciais & Concorrência',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="differentials">Principais diferenciais da marca (o que te torna única?)</Label>
            <Textarea
              id="differentials"
              value={formData.differentials}
              onChange={(e) => updateFormData('differentials', e.target.value)}
              placeholder="Liste os principais diferenciais da sua marca..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="competitors">Concorrentes diretos (nomes + links)</Label>
            <Textarea
              id="competitors"
              value={formData.competitors}
              onChange={(e) => updateFormData('competitors', e.target.value)}
              placeholder="Liste seus concorrentes diretos e seus sites..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="admiredFeatures">O que você admira nos concorrentes?</Label>
            <Textarea
              id="admiredFeatures"
              value={formData.admiredFeatures}
              onChange={(e) => updateFormData('admiredFeatures', e.target.value)}
              placeholder="O que os concorrentes fazem bem que você gostaria de implementar?"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="avoidFeatures">O que não quer repetir deles?</Label>
            <Textarea
              id="avoidFeatures"
              value={formData.avoidFeatures}
              onChange={(e) => updateFormData('avoidFeatures', e.target.value)}
              placeholder="O que os concorrentes fazem que você não quer repetir?"
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'products',
      title: '5. Produtos/Serviços',
      icon: Package,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="products">Lista de produtos/serviços principais</Label>
            <Textarea
              id="products"
              value={formData.products}
              onChange={(e) => updateFormData('products', e.target.value)}
              placeholder="Liste todos os produtos e serviços oferecidos..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="averageTicket">Ticket médio (valor médio de venda)</Label>
            <Input
              id="averageTicket"
              value={formData.averageTicket}
              onChange={(e) => updateFormData('averageTicket', e.target.value)}
              placeholder="Ex: R$ 150,00"
            />
          </div>
          <div>
            <Label htmlFor="currentPriority">Qual produto/serviço é prioridade no momento?</Label>
            <Textarea
              id="currentPriority"
              value={formData.currentPriority}
              onChange={(e) => updateFormData('currentPriority', e.target.value)}
              placeholder="Descreva o produto/serviço que é foco atual..."
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'objectives',
      title: '6. Objetivos de Marketing',
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <div>
            <Label>Qual é o principal objetivo agora? (selecione um ou mais)</Label>
            <div className="space-y-2 mt-2">
              {[
                { value: 'reconhecimento', label: 'Aumentar reconhecimento de marca' },
                { value: 'engajamento', label: 'Aumentar engajamento' },
                { value: 'leads', label: 'Gerar leads' },
                { value: 'vendas', label: 'Vender mais online' },
                { value: 'lancamento', label: 'Lançar um novo produto' },
                { value: 'outro', label: 'Outro' }
              ].map((objective) => (
                <div key={objective.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={objective.value}
                    checked={formData.objectives.includes(objective.value)}
                    onCheckedChange={(checked) => handleObjectiveChange(objective.value, !!checked)}
                  />
                  <Label htmlFor={objective.value}>{objective.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="specificGoal">Meta específica (se houver)</Label>
            <Input
              id="specificGoal"
              value={formData.specificGoal}
              onChange={(e) => updateFormData('specificGoal', e.target.value)}
              placeholder="Ex: aumentar 30% de seguidores em 3 meses, gerar 100 leads/mês"
            />
          </div>
        </div>
      )
    },
    {
      id: 'visual',
      title: '7. Diretrizes Visuais',
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div>
            <Label>Cores principais da marca</Label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md bg-muted/30">
                {(formData.brandColors || []).map((color: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 bg-background border rounded-md px-3 py-1">
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm">{color}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newColors = [...(formData.brandColors || [])];
                        newColors.splice(index, 1);
                        updateFormData('brandColors', newColors);
                      }}
                      className="text-muted-foreground hover:text-destructive ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(!formData.brandColors || formData.brandColors.length === 0) && (
                  <span className="text-muted-foreground text-sm">Nenhuma cor adicionada</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="colorPicker"
                  className="w-12 h-10 p-1 cursor-pointer"
                  onChange={(e) => {
                    const color = e.target.value;
                    const currentColors = formData.brandColors || [];
                    if (!currentColors.includes(color)) {
                      updateFormData('brandColors', [...currentColors, color]);
                    }
                  }}
                />
                <Input
                  placeholder="Ou digite uma cor (ex: #FFD84D)"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const color = e.currentTarget.value.trim();
                      if (color && /^#[0-9A-F]{6}$/i.test(color)) {
                        const currentColors = formData.brandColors || [];
                        if (!currentColors.includes(color)) {
                          updateFormData('brandColors', [...currentColors, color]);
                          e.currentTarget.value = '';
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Logo</Label>
            <div className="flex gap-2">
              <Input
                value={formData.logoUrl || ''}
                onChange={(e) => updateFormData('logoUrl', e.target.value)}
                placeholder="Cole o link do logo aqui"
                className="flex-1"
              />
              <label className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Here you would upload the file and get URL
                      updateFormData('logoFile', file.name);
                    }
                  }}
                />
              </label>
            </div>
            {formData.logoFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Arquivo: {formData.logoFile}
              </p>
            )}
          </div>

          <div>
            <Label>Materiais já existentes</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Textarea
                  value={formData.existingMaterials}
                  onChange={(e) => updateFormData('existingMaterials', e.target.value)}
                  placeholder="Descreva os materiais que já possui..."
                  rows={3}
                  className="flex-1"
                />
                <label className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer self-start">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        const fileNames = files.map(f => f.name).join(', ');
                        updateFormData('existingMaterialsFiles', fileNames);
                      }
                    }}
                  />
                </label>
              </div>
              {formData.existingMaterialsFiles && (
                <p className="text-sm text-muted-foreground">
                  Arquivos: {formData.existingMaterialsFiles}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Referências visuais que gosta</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Cole um link de referência e pressione Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const link = e.currentTarget.value.trim();
                      if (link && link.startsWith('http')) {
                        const currentRefs = formData.visualReferences || [];
                        if (!currentRefs.includes(link)) {
                          updateFormData('visualReferences', [...currentRefs, link]);
                          e.currentTarget.value = '';
                        }
                      }
                    }
                  }}
                  className="flex-1"
                />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(formData.visualReferences || []).map((link: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-md bg-muted/30">
                    <Link className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex-1 truncate"
                    >
                      {link}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        const newRefs = [...(formData.visualReferences || [])];
                        newRefs.splice(index, 1);
                        updateFormData('visualReferences', newRefs);
                      }}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(!formData.visualReferences || formData.visualReferences.length === 0) && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Nenhuma referência adicionada
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'communication',
      title: '8. Comunicação & Conteúdo',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentSocialMedia">Redes sociais já utilizadas</Label>
            <Input
              id="currentSocialMedia"
              value={formData.currentSocialMedia}
              onChange={(e) => updateFormData('currentSocialMedia', e.target.value)}
              placeholder="Instagram, Facebook, LinkedIn, etc."
            />
          </div>
          <div>
            <Label htmlFor="preferredChannels">Canais de comunicação preferidos</Label>
            <Input
              id="preferredChannels"
              value={formData.preferredChannels}
              onChange={(e) => updateFormData('preferredChannels', e.target.value)}
              placeholder="Ex: Instagram, LinkedIn, YouTube, TikTok"
            />
          </div>
          <div>
            <Label>Que tipo de conteúdo quer priorizar? (selecione um ou mais)</Label>
            <div className="space-y-2 mt-2">
              {[
                { value: 'educativo', label: 'Educativo' },
                { value: 'inspiracional', label: 'Inspiracional' },
                { value: 'promocional', label: 'Promocional' },
                { value: 'entretenimento', label: 'Entretenimento' }
              ].map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={formData.contentTypes.includes(type.value)}
                    onCheckedChange={(checked) => handleContentTypeChange(type.value, !!checked)}
                  />
                  <Label htmlFor={type.value}>{type.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="admiredBrands">Exemplos de marcas que admira em comunicação</Label>
            <Textarea
              id="admiredBrands"
              value={formData.admiredBrands}
              onChange={(e) => updateFormData('admiredBrands', e.target.value)}
              placeholder="Marcas que você considera referência em comunicação..."
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'history',
      title: '9. Histórico & Momento Atual',
      icon: History,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="brandHistory">Resumo da história da marca</Label>
            <Textarea
              id="brandHistory"
              value={formData.brandHistory}
              onChange={(e) => updateFormData('brandHistory', e.target.value)}
              placeholder="Conte a história da marca, quando surgiu, como evoluiu..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="achievements">Principais conquistas até hoje</Label>
            <Textarea
              id="achievements"
              value={formData.achievements}
              onChange={(e) => updateFormData('achievements', e.target.value)}
              placeholder="Liste as principais conquistas e marcos da marca..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="currentChallenges">Desafios atuais</Label>
            <Textarea
              id="currentChallenges"
              value={formData.currentChallenges}
              onChange={(e) => updateFormData('currentChallenges', e.target.value)}
              placeholder="Quais são os principais desafios que a marca enfrenta hoje?"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="opportunities">Oportunidades que enxerga para os próximos meses</Label>
            <Textarea
              id="opportunities"
              value={formData.opportunities}
              onChange={(e) => updateFormData('opportunities', e.target.value)}
              placeholder="Que oportunidades você vê no mercado para sua marca?"
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      id: 'extras',
      title: '10. Extras',
      icon: Plus,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="additionalInfo">Alguma informação adicional relevante?</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => updateFormData('additionalInfo', e.target.value)}
              placeholder="Qualquer informação adicional que considera importante..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="restrictions">Existe algo que não quer que seja feito/comunicado de jeito nenhum?</Label>
            <Textarea
              id="restrictions"
              value={formData.restrictions}
              onChange={(e) => updateFormData('restrictions', e.target.value)}
              placeholder="Liste temas, abordagens ou ações que devem ser evitadas..."
              rows={4}
            />
          </div>
        </div>
      )
    }
  ];

  const getProgress = () => {
    const totalFields = 25; // Approximate total fields
    let filledFields = 0;
    
    Object.values(formData).forEach(value => {
      if (Array.isArray(value) ? value.length > 0 : value !== "") {
        filledFields++;
      }
    });
    
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {initialData ? 'Editar Briefing' : 'Novo Briefing'}
          </h2>
          <p className="text-muted-foreground">
            Preencha as informações para criar um briefing completo da marca
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {getProgress()}% completo
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id} className="shadow-soft">
            <Collapsible 
              open={openSections[section.id]} 
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-primary" />
                      {section.title}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${openSections[section.id] ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  {section.content}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          onClick={() => onSave(formData)}
          className="flex-1 bg-honey-gradient hover:bg-primary/90"
        >
          Salvar Briefing
        </Button>
      </div>
    </div>
  );
}