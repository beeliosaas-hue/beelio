import React, { useState, useRef, useEffect } from 'react'
import {X, Send, Sparkles, ArrowRight, Calendar, TrendingUp, BarChart3, Palette, Paperclip, Smile, Zap, Eye, Download, Copy, Heart, ThumbsUp, Star, Camera, Play, Volume2, MessageSquare, Lightbulb, ArrowLeft} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

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

const Diana: React.FC = () => {
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
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { icon: Calendar, label: 'Planejar semana', action: () => handleQuickAction('planner', 'Quero planejar minha semana de conteúdo') },
    { icon: Sparkles, label: 'Ideia rápida', action: () => handleQuickAction('inspire', '✨ Me dê 3 ideias criativas de posts') },
    { icon: BarChart3, label: 'Analisar concorrência', action: () => handleQuickAction('analyze', 'Quero analisar minha concorrência') },
    { icon: TrendingUp, label: 'Tendência do dia', action: () => handleQuickAction('trend', 'Quais são as tendências do momento?') },
    { icon: Palette, label: 'Criar post', action: () => handleQuickAction('create', 'Quero criar um post agora') }
  ]

  const handleQuickAction = (action: string, message: string) => {
    handleSendMessage(message, action)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileMessage = `📎 Arquivo enviado: ${file.name}`
      handleSendMessage(fileMessage)
    }
  }

  const handleSendMessage = async (customMessage?: string, action?: string) => {
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

    // Adicionar mensagem de digitação
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'bot',
      message: '',
      timestamp: new Date(),
      isTyping: true
    }])

    try {
      setIsStreaming(true)
      
      // Obter contexto do usuário
      const { data: { user } } = await supabase.auth.getUser()
      let briefing = null
      let branding = null
      
      if (user) {
        const { data: briefingData } = await supabase
          .from('briefings')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)
          .single()
        
        const { data: brandingData } = await supabase
          .from('brandings')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)
          .single()
        
        briefing = briefingData
        branding = brandingData
      }

      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/diana-chat`
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => !m.isTyping)
            .map(m => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.message
            }))
            .concat([{ role: 'user', content: messageText }]),
          action,
          briefing,
          branding
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Falha ao iniciar stream')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let textBuffer = ''
      let streamDone = false
      let assistantMessage = ''

      // Remover mensagem de digitação
      setMessages(prev => prev.filter(m => !m.isTyping))

      while (!streamDone) {
        const { done, value } = await reader.read()
        if (done) break
        textBuffer += decoder.decode(value, { stream: true })

        let newlineIndex: number
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex)
          textBuffer = textBuffer.slice(newlineIndex + 1)

          if (line.endsWith('\r')) line = line.slice(0, -1)
          if (line.startsWith(':') || line.trim() === '') continue
          if (!line.startsWith('data: ')) continue

          const jsonStr = line.slice(6).trim()
          if (jsonStr === '[DONE]') {
            streamDone = true
            break
          }

          try {
            const parsed = JSON.parse(jsonStr)
            const content = parsed.choices?.[0]?.delta?.content as string | undefined
            if (content) {
              assistantMessage += content
              
              // Atualizar mensagem em tempo real
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1]
                if (lastMsg?.type === 'bot' && !lastMsg.isTyping) {
                  return prev.map((m, i) => 
                    i === prev.length - 1 
                      ? { ...m, message: assistantMessage }
                      : m
                  )
                }
                return [...prev, {
                  id: prev.length + 1,
                  type: 'bot',
                  message: assistantMessage,
                  timestamp: new Date()
                }]
              })
            }
          } catch {
            textBuffer = line + '\n' + textBuffer
            break
          }
        }
      }

      // Salvar conversa no Supabase
      if (user && assistantMessage) {
        await supabase.from('diana_conversations').insert({
          user_id: user.id,
          mensagem: messageText,
          resposta: assistantMessage,
          tipo_interacao: action || 'chat'
        })
      }

    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      setMessages(prev => prev.filter(m => !m.isTyping))
      toast.error(error.message || 'Erro ao processar mensagem')
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">🐝</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Diana</h3>
              <p className="text-sm text-muted-foreground flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Consultora ativa
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                disabled={isStreaming}
                className="flex-shrink-0 flex flex-col items-center p-3 bg-card rounded-xl shadow-sm hover:shadow-md transition-all min-w-[80px] disabled:opacity-50"
              >
                <action.icon size={20} className="text-primary mb-2" />
                <span className="text-xs text-foreground text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[85%]">
                {message.type === 'bot' && (
                  <div className="flex items-end space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                      🐝
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">Diana</span>
                  </div>
                )}

                {message.isTyping ? (
                  <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-5 rounded-2xl shadow-sm ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-md' 
                      : 'bg-card text-foreground rounded-bl-md border border-border'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-end space-x-3">
            <div className="flex space-x-2">
              <button
                onClick={handleFileUpload}
                disabled={isStreaming}
                className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                <Paperclip size={20} />
              </button>
              <button
                disabled={isStreaming}
                className="p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                <Camera size={20} />
              </button>
            </div>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isStreaming && handleSendMessage()}
                disabled={isStreaming}
                placeholder="Digite sua mensagem..."
                className="w-full px-4 py-3 pr-10 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors">
                <Smile size={18} />
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleSendMessage()}
                disabled={isStreaming || !inputValue.trim()}
                className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-muted-foreground">
              Diana está online • Anexe documentos, imagens e arquivos
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
          multiple
        />
      </div>
    </DashboardLayout>
  )
}

export default Diana
