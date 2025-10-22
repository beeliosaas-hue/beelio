import React, { useState, useRef, useEffect } from 'react'
import {X, Send, Sparkles, ArrowRight, Calendar, TrendingUp, BarChart3, Palette, Paperclip, Smile, Zap, Eye, Download, Copy, Heart, ThumbsUp, Star, Camera, Play, Volume2, MessageSquare, Lightbulb, ArrowLeft} from 'lucide-react'

interface DianaChatProps {
  onClose: () => void
  isFullScreen?: boolean
}

interface Message {
  id: number
  type: 'bot' | 'user'
  message: string
  timestamp: Date
  suggestions?: Suggestion[]
  cards?: PostCard[]
  insights?: Insight[]
  analysis?: Analysis
  audioUrl?: string
  isTyping?: boolean
}

interface Suggestion {
  title: string
  description: string
  category: string
  action?: () => void
}

interface PostCard {
  id: string
  type: 'instagram' | 'facebook' | 'tiktok'
  preview: string
  caption: string
  hashtags: string[]
  engagement?: string
}

interface Insight {
  trend: string
  description: string
  opportunity: string
  urgency: 'high' | 'medium' | 'low'
}

interface Analysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  recommendations: string[]
}

const DianaChat: React.FC<DianaChatProps> = ({ onClose, isFullScreen = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      message: 'Oi! Sou a Diana, sua consultora de marketing pessoal 🐝✨\n\nEstou aqui para transformar suas ideias em conteúdo que vende! Como posso te ajudar hoje?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [dianaActive, setDianaActive] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { icon: Calendar, label: 'Planejar semana', action: () => handleQuickAction('planner') },
    { icon: Sparkles, label: 'Ideia rápida', action: () => handleQuickAction('inspiration') },
    { icon: BarChart3, label: 'Analisar concorrência', action: () => handleQuickAction('analysis') },
    { icon: TrendingUp, label: 'Tendência do dia', action: () => handleQuickAction('trends') },
    { icon: Palette, label: 'Criar post', action: () => handleQuickAction('create') }
  ]

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      planner: 'Quero planejar minha semana de conteúdo',
      inspiration: '✨ Inspiração Instantânea',
      analysis: 'Quero analisar minha concorrência',
      trends: 'Quais são as tendências do momento?',
      create: 'Quero criar um post agora'
    }

    const message = actionMessages[action as keyof typeof actionMessages]
    if (message) {
      handleSendMessage(message)
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simular upload do arquivo
      const fileMessage = `📎 Arquivo enviado: ${file.name}`
      handleSendMessage(fileMessage)
    }
  }

  const handleSendMessage = (customMessage?: string) => {
    const messageText = customMessage || inputValue
    if (!messageText.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      message: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    if (!customMessage) setInputValue('')

    // Simular Diana digitando
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        message: '',
        timestamp: new Date(),
        isTyping: true
      }])
    }, 500)

    // Resposta da Diana baseada no tipo de mensagem
    setTimeout(() => {
      let response: Message = {
        id: messages.length + 2,
        type: 'bot',
        message: '',
        timestamp: new Date()
      }

      if (messageText.toLowerCase().includes('inspiração') || messageText.toLowerCase().includes('ideia')) {
        response = {
          ...response,
          message: 'Achei mel de ouro aqui! 🐝✨ Separei 3 ideias que vão bombar:',
          suggestions: [
            {
              title: '🎯 "5 Erros que Custam Caro"',
              description: 'Post educativo que gera engajamento',
              category: 'Educativo'
            },
            {
              title: '🔥 "Transformação de Cliente"',
              description: 'Case de sucesso com antes/depois',
              category: 'Social Proof'
            },
            {
              title: '💡 "Dica Rápida de 30 Segundos"',
              description: 'Conteúdo viral para Reels',
              category: 'Viral'
            }
          ]
        }
      } else if (messageText.toLowerCase().includes('tendência')) {
        response = {
          ...response,
          message: 'Alerta de tendência! 🚨 Melhor não dormir nisso, hein?',
          insights: [
            {
              trend: 'Conteúdo "Get Ready With Me"',
              description: 'Vídeos mostrando processo/bastidores',
              opportunity: 'Mostrar seu processo de trabalho',
              urgency: 'high'
            },
            {
              trend: 'Carrosséis Educativos',
              description: 'Posts com múltiplas páginas informativas',
              opportunity: 'Educar sobre seu nicho',
              urgency: 'medium'
            }
          ]
        }
      } else if (messageText.toLowerCase().includes('semana') || messageText.toLowerCase().includes('planejar')) {
        response = {
          ...response,
          message: 'Perfeito! Vou montar um calendário estratégico para você 📅\n\nMe conta: qual é o seu nicho e quantos posts por semana você quer?'
        }
      } else if (messageText.toLowerCase().includes('criar post')) {
        response = {
          ...response,
          message: 'Vamos criar algo incrível! 🎨 Escolha um formato:',
          cards: [
            {
              id: '1',
              type: 'instagram',
              preview: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg?auto=compress&cs=tinysrgb&w=400',
              caption: 'Transforme seu negócio com essas 3 dicas simples! 💫',
              hashtags: ['#marketing', '#dicas', '#empreendedorismo'],
              engagement: '2.5k curtidas'
            },
            {
              id: '2',
              type: 'tiktok',
              preview: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
              caption: 'POV: Você descobriu o segredo do sucesso 🤫',
              hashtags: ['#fyp', '#viral', '#sucesso'],
              engagement: '15k visualizações'
            }
          ]
        }
      } else if (messageText.toLowerCase().includes('analis') || messageText.toLowerCase().includes('concorrência')) {
        response = {
          ...response,
          message: 'Ótima estratégia! 🕵️‍♀️ Cole aqui o link ou texto do concorrente que eu analiso tudo para você!',
          analysis: {
            strengths: ['Boa frequência de posts', 'Engajamento alto', 'Visual consistente'],
            weaknesses: ['Falta call-to-action', 'Pouca interação nos stories', 'Sem conteúdo educativo'],
            opportunities: ['Explorar tendências', 'Criar mais vídeos', 'Parcerias'],
            recommendations: ['Poste 3x por semana', 'Use mais carrosséis', 'Invista em Reels']
          }
        }
      } else if (messageText.includes('📎')) {
        response = {
          ...response,
          message: 'Perfeito! Recebi seu arquivo 📄\n\nVou analisar e te dar insights estratégicos sobre o conteúdo. Que tipo de análise você gostaria?\n\n• Análise de performance\n• Sugestões de melhoria\n• Ideias de conteúdo baseado no arquivo'
        }
      } else {
        response = {
          ...response,
          message: 'Interessante! 🤔 Deixa eu processar isso e te dar uma resposta estratégica...\n\nEnquanto isso, que tal darmos uma olhada nas suas métricas ou criarmos algo novo?'
        }
      }

      setMessages(prev => prev.filter(m => !m.isTyping).concat([response]))
    }, 2000)
  }

  const handleReaction = (messageId: number, reaction: string) => {
    // Implementar sistema de reações
    console.log(`Reação ${reaction} na mensagem ${messageId}`)
  }

  // Classe base para o container
  const containerClass = isFullScreen 
    ? "fixed inset-0 bg-white z-50 flex flex-col" 
    : "fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50">
        <div className="flex items-center space-x-3">
          {isFullScreen && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
          )}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl">🐝</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Diana</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Consultora ativa
            </p>
          </div>
        </div>
        {!isFullScreen && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className={`flex space-x-3 ${isFullScreen ? 'justify-center' : 'overflow-x-auto'}`}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex-shrink-0 flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all min-w-[80px]"
            >
              <action.icon size={20} className="text-amber-600 mb-2" />
              <span className="text-xs text-gray-700 text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 ${isFullScreen ? 'max-w-4xl mx-auto w-full' : ''}`}>
        {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`${isFullScreen ? 'max-w-2xl' : 'max-w-[85%]'} ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'bot' && (
                  <div className="flex items-end space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                      🐝
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Diana</span>
                  </div>
                )}

                {message.isTyping ? (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-5 rounded-2xl shadow-sm ${
                    message.type === 'user' 
                      ? 'bg-amber-500 text-white rounded-br-md' 
                      : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                  }`}>
                    <p className={`${isFullScreen ? 'text-base leading-relaxed' : 'text-sm'} whitespace-pre-wrap`}>
                      {message.message}
                    </p>
                    
                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-5 space-y-3">
                        {message.suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200 cursor-pointer hover:border-amber-300 transition-all hover:scale-[1.02]"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                                <p className="text-sm text-gray-600 mt-2">{suggestion.description}</p>
                                <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                  {suggestion.category}
                                </span>
                              </div>
                              <ArrowRight size={18} className="text-amber-600 mt-1 ml-3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Post Cards */}
                    {message.cards && (
                      <div className="mt-5 space-y-4">
                        {message.cards.map((card) => (
                          <div
                            key={card.id}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:scale-[1.02] transition-transform"
                          >
                            <div className="flex space-x-4">
                              <img 
                                src={card.preview} 
                                alt="Preview" 
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`text-sm px-3 py-1 rounded-full ${
                                    card.type === 'instagram' ? 'bg-pink-100 text-pink-700' :
                                    card.type === 'tiktok' ? 'bg-gray-100 text-gray-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {card.type}
                                  </span>
                                  {card.engagement && (
                                    <span className="text-sm text-gray-500">{card.engagement}</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-900 mb-3">{card.caption}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex space-x-2">
                                    <Eye size={16} className="text-gray-400" />
                                    <Copy size={16} className="text-gray-400" />
                                    <Download size={16} className="text-gray-400" />
                                  </div>
                                  <button className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors">
                                    Usar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Insights */}
                    {message.insights && (
                      <div className="mt-5 space-y-3">
                        {message.insights.map((insight, index) => (
                          <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium text-gray-900">{insight.trend}</h4>
                              <span className={`text-sm px-3 py-1 rounded-full ${
                                insight.urgency === 'high' ? 'bg-red-100 text-red-700' :
                                insight.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {insight.urgency === 'high' ? '🔥 Urgente' : 
                                 insight.urgency === 'medium' ? '⚡ Médio' : '📈 Baixo'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                            <p className="text-sm text-blue-700 font-medium">💡 {insight.opportunity}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Analysis */}
                    {message.analysis && (
                      <div className="mt-5 bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200">
                        <h4 className="font-bold text-gray-900 mb-4">📊 Análise Completa</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-green-700 mb-2">✅ Pontos Fortes</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {message.analysis.strengths.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-red-700 mb-2">❌ Pontos Fracos</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {message.analysis.weaknesses.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-blue-700 mb-2">🚀 Recomendações</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {message.analysis.recommendations.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message Reactions */}
                    {message.type === 'bot' && !message.isTyping && (
                      <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => handleReaction(message.id, 'like')}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-amber-600 transition-colors"
                        >
                          <ThumbsUp size={14} />
                          <span>Útil</span>
                        </button>
                        <button 
                          onClick={() => handleReaction(message.id, 'love')}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart size={14} />
                          <span>Amei</span>
                        </button>
                        <button 
                          onClick={() => handleReaction(message.id, 'star')}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-yellow-500 transition-colors"
                        >
                          <Star size={14} />
                          <span>Top</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {message.type === 'user' && (
                  <div className="text-right mt-2">
                    <span className="text-sm text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t border-gray-200 bg-white ${isFullScreen ? 'max-w-4xl mx-auto w-full' : ''}`}>
        <div className="flex items-end space-x-3">
          <div className="flex space-x-2">
            <button
              onClick={handleFileUpload}
              className="p-2 text-gray-500 hover:text-amber-600 transition-colors hover:scale-110"
            >
              <Paperclip size={20} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-amber-600 transition-colors hover:scale-110"
            >
              <Camera size={20} />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className={`w-full px-5 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all ${
                isFullScreen ? 'text-base' : 'text-sm'
              }`}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-amber-600 transition-colors">
              <Smile size={18} />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleSendMessage()}
              className="p-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors hover:scale-105"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">
            Diana está online • Anexe documentos, imagens e arquivos
          </p>
          <div className="flex items-center space-x-2">
            <Zap size={14} className="text-amber-500" />
            <span className="text-sm text-amber-600 font-medium">Modo Consultoria</span>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
        multiple
      />
    </div>
  )
}

export default DianaChat
