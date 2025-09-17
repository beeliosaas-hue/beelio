import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Download, Eye, Trash2, Edit3, Save, X, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabaseSync } from '@/services/supabaseSync';

interface BrandingData {
  id?: string;
  nome_marca: string;
  // Fundamentos da Marca
  proposito_maior: string;
  por_que_existe: string;
  visao_5_anos: string;
  valores_inegociaveis: string;
  publico_idade: string;
  publico_profissao: string;
  publico_desejos_dores: string;
  como_quer_que_se_sinta: string;
  
  // Personalidade da Marca
  personalidade_3_palavras: string[];
  arquetipo: string;
  tom_voz: string;
  palavras_sempre_usa: string[];
  palavras_nunca_usa: string[];
  
  // Identidade Visual
  logo_versoes: { principal?: string; alternativa?: string };
  paleta_cores: string[];
  tipografia_principal: string;
  tipografia_secundaria: string;
  estilo_imagens: string;
  
  // Experiência e Diferenciação
  proposta_valor_central: string;
  principais_concorrentes: string[];
  como_cliente_descreveria: string;
  provas_sociais: string[];
  
  // Storytelling
  como_comecou: string;
  problema_resolve: string;
  transformacao_entrega: string;
  
  created_at?: string;
  updated_at?: string;
}

const arquetipos = [
  'Explorador', 'Criador', 'Herói', 'Cuidador', 'Inocente', 'Sábio',
  'Fora da lei', 'Mago', 'Governante', 'Amante', 'Bobo da corte', 'Todo mundo'
];

const tonsVoz = ['Formal', 'Inspirador', 'Educativo', 'Engraçado', 'Técnico', 'Outro'];
const estilosImagem = ['Minimalista', 'Vibrante', 'Sofisticado', 'Divertido', 'Realista', 'Outro'];

export default function Branding() {
  const [brandings, setBrandings] = useState<BrandingData[]>([]);
  const [currentBranding, setCurrentBranding] = useState<BrandingData>({
    nome_marca: '',
    proposito_maior: '',
    por_que_existe: '',
    visao_5_anos: '',
    valores_inegociaveis: '',
    publico_idade: '',
    publico_profissao: '',
    publico_desejos_dores: '',
    como_quer_que_se_sinta: '',
    personalidade_3_palavras: [],
    arquetipo: '',
    tom_voz: '',
    palavras_sempre_usa: [],
    palavras_nunca_usa: [],
    logo_versoes: {},
    paleta_cores: ['#FFB800', '#1A1A1A', '#FFFFFF'],
    tipografia_principal: '',
    tipografia_secundaria: '',
    estilo_imagens: '',
    proposta_valor_central: '',
    principais_concorrentes: [],
    como_cliente_descreveria: '',
    provas_sociais: [],
    como_comecou: '',
    problema_resolve: '',
    transformacao_entrega: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('fundamentos');
  const [newColor, setNewColor] = useState('#FFB800');
  const [newWord, setNewWord] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');
  const [newProof, setNewProof] = useState('');

  useEffect(() => {
    loadBrandings();
  }, []);

  const loadBrandings = async () => {
    try {
      const result = await supabaseSync.select('brandings');
      if (result.data) {
        setBrandings(result.data);
        if (result.data.length > 0) {
          setCurrentBranding(result.data[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar brandings:', error);
    }
  };

  const saveBranding = async () => {
    try {
      if (currentBranding.id) {
        await supabaseSync.syncBranding('update', currentBranding, currentBranding.id);
        toast({
          title: "Branding atualizado",
          description: "As informações foram salvas com sucesso.",
        });
      } else {
        const result = await supabaseSync.syncBranding('create', currentBranding);
        if (result.data) {
          setCurrentBranding({ ...currentBranding, id: result.data[0].id });
        }
        toast({
          title: "Branding criado",
          description: "Novo branding foi salvo com sucesso.",
        });
      }
      setIsEditing(false);
      loadBrandings();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o branding. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const deleteBranding = async (id: string) => {
    try {
      await supabaseSync.syncBranding('delete', {}, id);
      setBrandings(brandings.filter(b => b.id !== id));
      if (currentBranding.id === id) {
        setCurrentBranding({
          nome_marca: '',
          proposito_maior: '',
          por_que_existe: '',
          visao_5_anos: '',
          valores_inegociaveis: '',
          publico_idade: '',
          publico_profissao: '',
          publico_desejos_dores: '',
          como_quer_que_se_sinta: '',
          personalidade_3_palavras: [],
          arquetipo: '',
          tom_voz: '',
          palavras_sempre_usa: [],
          palavras_nunca_usa: [],
          logo_versoes: {},
          paleta_cores: ['#FFB800', '#1A1A1A', '#FFFFFF'],
          tipografia_principal: '',
          tipografia_secundaria: '',
          estilo_imagens: '',
          proposta_valor_central: '',
          principais_concorrentes: [],
          como_cliente_descreveria: '',
          provas_sociais: [],
          como_comecou: '',
          problema_resolve: '',
          transformacao_entrega: ''
        });
      }
      toast({
        title: "Branding excluído",
        description: "O branding foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o branding.",
        variant: "destructive",
      });
    }
  };

  const createNewBranding = () => {
    setCurrentBranding({
      nome_marca: '',
      proposito_maior: '',
      por_que_existe: '',
      visao_5_anos: '',
      valores_inegociaveis: '',
      publico_idade: '',
      publico_profissao: '',
      publico_desejos_dores: '',
      como_quer_que_se_sinta: '',
      personalidade_3_palavras: [],
      arquetipo: '',
      tom_voz: '',
      palavras_sempre_usa: [],
      palavras_nunca_usa: [],
      logo_versoes: {},
      paleta_cores: ['#FFB800', '#1A1A1A', '#FFFFFF'],
      tipografia_principal: '',
      tipografia_secundaria: '',
      estilo_imagens: '',
      proposta_valor_central: '',
      principais_concorrentes: [],
      como_cliente_descreveria: '',
      provas_sociais: [],
      como_comecou: '',
      problema_resolve: '',
      transformacao_entrega: ''
    });
    setIsEditing(true);
  };

  const addColor = () => {
    if (newColor && !currentBranding.paleta_cores.includes(newColor)) {
      setCurrentBranding({
        ...currentBranding,
        paleta_cores: [...currentBranding.paleta_cores, newColor]
      });
      setNewColor('#FFB800');
    }
  };

  const removeColor = (colorToRemove: string) => {
    setCurrentBranding({
      ...currentBranding,
      paleta_cores: currentBranding.paleta_cores.filter(color => color !== colorToRemove)
    });
  };

  const addToArray = (field: keyof BrandingData, value: string) => {
    if (value.trim() && Array.isArray(currentBranding[field])) {
      setCurrentBranding({
        ...currentBranding,
        [field]: [...(currentBranding[field] as string[]), value.trim()]
      });
    }
  };

  const removeFromArray = (field: keyof BrandingData, index: number) => {
    if (Array.isArray(currentBranding[field])) {
      const newArray = [...(currentBranding[field] as string[])];
      newArray.splice(index, 1);
      setCurrentBranding({
        ...currentBranding,
        [field]: newArray
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Branding</h1>
            <p className="text-muted-foreground mt-2">
              Branding não é só o que você diz. É o que seu público percebe.<br />
              Preencha essa jornada e o Beelio vai traduzir sua marca em um DNA único, pronto para ser vivido em cada detalhe.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={createNewBranding} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Branding
            </Button>
          </div>
        </div>

        {/* Lista de Brandings */}
        {brandings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Seus Brandings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandings.map((branding) => (
                  <div
                    key={branding.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      currentBranding.id === branding.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setCurrentBranding(branding)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{branding.nome_marca}</h3>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (branding.id) deleteBranding(branding.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {branding.arquetipo} • {branding.tom_voz}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Branding */}
        {(currentBranding.nome_marca || isEditing) && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{isEditing ? 'Editando Branding' : currentBranding.nome_marca}</CardTitle>
                  <CardDescription>
                    {isEditing ? 'Preencha as informações para criar o DNA da sua marca' : 'Visualizando informações da marca'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={saveBranding} className="gap-2">
                        <Save className="w-4 h-4" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Baixar Brandbook
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="fundamentos">Fundamentos</TabsTrigger>
                  <TabsTrigger value="personalidade">Personalidade</TabsTrigger>
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="experiencia">Experiência</TabsTrigger>
                  <TabsTrigger value="storytelling">Storytelling</TabsTrigger>
                </TabsList>

                {/* Fundamentos da Marca */}
                <TabsContent value="fundamentos" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome_marca">Nome da Marca *</Label>
                      <Input
                        id="nome_marca"
                        value={currentBranding.nome_marca}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, nome_marca: e.target.value })}
                        placeholder="Digite o nome da sua marca"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="proposito_maior">Qual é o propósito maior da sua marca?</Label>
                      <Input
                        id="proposito_maior"
                        value={currentBranding.proposito_maior}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, proposito_maior: e.target.value })}
                        placeholder="ex.: inspirar, simplificar, transformar, entreter"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="por_que_existe">Em uma frase curta: por que sua marca existe?</Label>
                      <Textarea
                        id="por_que_existe"
                        value={currentBranding.por_que_existe}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, por_que_existe: e.target.value })}
                        placeholder="Descreva o motivo de existir da sua marca"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="visao_5_anos">Onde sua marca quer chegar em 5 anos? (Visão)</Label>
                      <Textarea
                        id="visao_5_anos"
                        value={currentBranding.visao_5_anos}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, visao_5_anos: e.target.value })}
                        placeholder="Descreva onde sua marca estará em 5 anos"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="valores_inegociaveis">Quais são os valores inegociáveis que guiam seu negócio?</Label>
                      <Textarea
                        id="valores_inegociaveis"
                        value={currentBranding.valores_inegociaveis}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, valores_inegociaveis: e.target.value })}
                        placeholder="Liste os valores fundamentais da sua marca"
                        disabled={!isEditing}
                      />
                    </div>

                    <Separator />

                    <h3 className="text-lg font-semibold">Público-Alvo Ideal</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="publico_idade">Idade</Label>
                        <Input
                          id="publico_idade"
                          value={currentBranding.publico_idade}
                          onChange={(e) => setCurrentBranding({ ...currentBranding, publico_idade: e.target.value })}
                          placeholder="ex.: 25-35 anos"
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="publico_profissao">Profissão / Estilo de vida</Label>
                        <Input
                          id="publico_profissao"
                          value={currentBranding.publico_profissao}
                          onChange={(e) => setCurrentBranding({ ...currentBranding, publico_profissao: e.target.value })}
                          placeholder="ex.: empreendedores digitais"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="publico_desejos_dores">Desejos e dores</Label>
                      <Textarea
                        id="publico_desejos_dores"
                        value={currentBranding.publico_desejos_dores}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, publico_desejos_dores: e.target.value })}
                        placeholder="Descreva os principais desejos e dores do seu público"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="como_quer_que_se_sinta">Como sua marca quer que ele se sinta?</Label>
                      <Input
                        id="como_quer_que_se_sinta"
                        value={currentBranding.como_quer_que_se_sinta}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, como_quer_que_se_sinta: e.target.value })}
                        placeholder="ex.: confiante, inspirado, empoderado"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Personalidade da Marca */}
                <TabsContent value="personalidade" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Se sua marca fosse uma pessoa, como ela seria em 3 palavras?</Label>
                      {isEditing && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            placeholder="ex.: ousada"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addToArray('personalidade_3_palavras', newWord);
                                setNewWord('');
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              addToArray('personalidade_3_palavras', newWord);
                              setNewWord('');
                            }}
                            disabled={currentBranding.personalidade_3_palavras.length >= 3}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentBranding.personalidade_3_palavras.map((palavra, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {palavra}
                            {isEditing && (
                              <button
                                onClick={() => removeFromArray('personalidade_3_palavras', index)}
                                className="ml-1 text-xs hover:text-destructive"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="arquetipo">Qual dessas opções mais representa sua marca?</Label>
                      <Select
                        value={currentBranding.arquetipo}
                        onValueChange={(value) => setCurrentBranding({ ...currentBranding, arquetipo: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um arquétipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {arquetipos.map((arquetipo) => (
                            <SelectItem key={arquetipo} value={arquetipo}>
                              {arquetipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="tom_voz">Qual é o tom de voz da sua marca?</Label>
                      <Select
                        value={currentBranding.tom_voz}
                        onValueChange={(value) => setCurrentBranding({ ...currentBranding, tom_voz: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o tom de voz" />
                        </SelectTrigger>
                        <SelectContent>
                          {tonsVoz.map((tom) => (
                            <SelectItem key={tom} value={tom}>
                              {tom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Palavras que sua marca sempre usa</Label>
                      {isEditing && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            placeholder="Digite uma palavra"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addToArray('palavras_sempre_usa', newWord);
                                setNewWord('');
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              addToArray('palavras_sempre_usa', newWord);
                              setNewWord('');
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentBranding.palavras_sempre_usa.map((palavra, index) => (
                          <Badge key={index} variant="default" className="flex items-center gap-1">
                            {palavra}
                            {isEditing && (
                              <button
                                onClick={() => removeFromArray('palavras_sempre_usa', index)}
                                className="ml-1 text-xs hover:text-destructive"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Palavras que sua marca nunca deve usar</Label>
                      {isEditing && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            placeholder="Digite uma palavra"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addToArray('palavras_nunca_usa', newWord);
                                setNewWord('');
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              addToArray('palavras_nunca_usa', newWord);
                              setNewWord('');
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentBranding.palavras_nunca_usa.map((palavra, index) => (
                          <Badge key={index} variant="destructive" className="flex items-center gap-1">
                            {palavra}
                            {isEditing && (
                              <button
                                onClick={() => removeFromArray('palavras_nunca_usa', index)}
                                className="ml-1 text-xs hover:text-destructive"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Identidade Visual */}
                <TabsContent value="visual" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Upload do Logotipo</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Versão Principal</Label>
                          <div className="border border-dashed border-border rounded-lg p-6 text-center">
                            {currentBranding.logo_versoes.principal ? (
                              <img 
                                src={currentBranding.logo_versoes.principal} 
                                alt="Logo principal" 
                                className="max-h-20 mx-auto"
                              />
                            ) : (
                              <div className="text-muted-foreground">
                                <Upload className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">Clique para fazer upload</p>
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Upload className="w-4 h-4" />
                              Upload Principal
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Versão Alternativa</Label>
                          <div className="border border-dashed border-border rounded-lg p-6 text-center">
                            {currentBranding.logo_versoes.alternativa ? (
                              <img 
                                src={currentBranding.logo_versoes.alternativa} 
                                alt="Logo alternativa" 
                                className="max-h-20 mx-auto"
                              />
                            ) : (
                              <div className="text-muted-foreground">
                                <Upload className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">Clique para fazer upload</p>
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Upload className="w-4 h-4" />
                              Upload Alternativa
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Paleta de Cores
                      </Label>
                      {isEditing && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="color"
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            placeholder="#FFB800"
                            className="flex-1"
                          />
                          <Button onClick={addColor}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="grid grid-cols-6 md:grid-cols-8 gap-3 mt-3">
                        {currentBranding.paleta_cores.map((cor, index) => (
                          <div key={index} className="relative group">
                            <div
                              className="w-full h-16 rounded-lg border-2 border-white shadow-sm relative overflow-hidden"
                              style={{ backgroundColor: cor }}
                            >
                              {isEditing && (
                                <button
                                  onClick={() => removeColor(cor)}
                                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-center mt-1 font-mono">{cor}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tipografia_principal">Tipografia Principal</Label>
                        <Input
                          id="tipografia_principal"
                          value={currentBranding.tipografia_principal}
                          onChange={(e) => setCurrentBranding({ ...currentBranding, tipografia_principal: e.target.value })}
                          placeholder="ex.: Roboto, Arial"
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="tipografia_secundaria">Tipografia Secundária</Label>
                        <Input
                          id="tipografia_secundaria"
                          value={currentBranding.tipografia_secundaria}
                          onChange={(e) => setCurrentBranding({ ...currentBranding, tipografia_secundaria: e.target.value })}
                          placeholder="ex.: Open Sans, Helvetica"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="estilo_imagens">Estilo de imagens/fotos que melhor traduz sua marca</Label>
                      <Select
                        value={currentBranding.estilo_imagens}
                        onValueChange={(value) => setCurrentBranding({ ...currentBranding, estilo_imagens: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o estilo de imagens" />
                        </SelectTrigger>
                        <SelectContent>
                          {estilosImagem.map((estilo) => (
                            <SelectItem key={estilo} value={estilo}>
                              {estilo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Experiência e Diferenciação */}
                <TabsContent value="experiencia" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="proposta_valor_central">Qual é a proposta de valor central da sua marca?</Label>
                      <Textarea
                        id="proposta_valor_central"
                        value={currentBranding.proposta_valor_central}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, proposta_valor_central: e.target.value })}
                        placeholder="Resuma em 1 frase: 'Somos a única marca que...'"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label>Quem são seus 3 principais concorrentes?</Label>
                      {isEditing && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newCompetitor}
                            onChange={(e) => setNewCompetitor(e.target.value)}
                            placeholder="Nome do concorrente"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addToArray('principais_concorrentes', newCompetitor);
                                setNewCompetitor('');
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              addToArray('principais_concorrentes', newCompetitor);
                              setNewCompetitor('');
                            }}
                            disabled={currentBranding.principais_concorrentes.length >= 3}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentBranding.principais_concorrentes.map((concorrente, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {concorrente}
                            {isEditing && (
                              <button
                                onClick={() => removeFromArray('principais_concorrentes', index)}
                                className="ml-1 text-xs hover:text-destructive"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="como_cliente_descreveria">Como você gostaria que seu cliente descrevesse sua marca para um amigo?</Label>
                      <Textarea
                        id="como_cliente_descreveria"
                        value={currentBranding.como_cliente_descreveria}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, como_cliente_descreveria: e.target.value })}
                        placeholder="Descreva como o cliente falaria da sua marca"
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label>Quais são as provas sociais que reforçam sua marca hoje?</Label>
                      {isEditing && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newProof}
                            onChange={(e) => setNewProof(e.target.value)}
                            placeholder="ex.: Depoimentos, cases, parcerias"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addToArray('provas_sociais', newProof);
                                setNewProof('');
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              addToArray('provas_sociais', newProof);
                              setNewProof('');
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentBranding.provas_sociais.map((prova, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {prova}
                            {isEditing && (
                              <button
                                onClick={() => removeFromArray('provas_sociais', index)}
                                className="ml-1 text-xs hover:text-destructive"
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Storytelling */}
                <TabsContent value="storytelling" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="como_comecou">Como sua marca começou?</Label>
                      <Textarea
                        id="como_comecou"
                        value={currentBranding.como_comecou}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, como_comecou: e.target.value })}
                        placeholder="Conte a história de origem da sua marca"
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="problema_resolve">Qual problema do mundo ela decidiu resolver?</Label>
                      <Textarea
                        id="problema_resolve"
                        value={currentBranding.problema_resolve}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, problema_resolve: e.target.value })}
                        placeholder="Descreva o problema central que sua marca resolve"
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="transformacao_entrega">Qual transformação você entrega ao cliente?</Label>
                      <Textarea
                        id="transformacao_entrega"
                        value={currentBranding.transformacao_entrega}
                        onChange={(e) => setCurrentBranding({ ...currentBranding, transformacao_entrega: e.target.value })}
                        placeholder="Descreva a transformação que o cliente experiencia"
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Mini Brandbook Preview */}
        {currentBranding.nome_marca && !isEditing && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Mini Brandbook - {currentBranding.nome_marca}
                </CardTitle>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Propósito</h4>
                  <p className="text-sm text-muted-foreground">{currentBranding.proposito_maior || 'Não definido'}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Arquétipo</h4>
                  <p className="text-sm text-muted-foreground">{currentBranding.arquetipo || 'Não definido'}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Tom de Voz</h4>
                  <p className="text-sm text-muted-foreground">{currentBranding.tom_voz || 'Não definido'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-primary mb-3">Paleta de Cores</h4>
                <div className="flex gap-3">
                  {currentBranding.paleta_cores.map((cor, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: cor }}
                      />
                      <p className="text-xs mt-1 font-mono">{cor}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-2">Personalidade</h4>
                <div className="flex flex-wrap gap-2">
                  {currentBranding.personalidade_3_palavras.map((palavra, index) => (
                    <Badge key={index} variant="secondary">{palavra}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}