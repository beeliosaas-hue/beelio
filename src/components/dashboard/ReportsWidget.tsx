import { BarChart3, TrendingUp, Eye, Heart, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const engagementData = {
  labels: ['Posts Educativos', 'Posts Promocionais', 'Entretenimento', 'Dicas'],
  datasets: [
    {
      data: [35, 25, 20, 20],
      backgroundColor: [
        'hsl(45, 100%, 75%)',
        'hsl(45, 100%, 60%)',
        'hsl(45, 100%, 85%)',
        'hsl(45, 100%, 65%)',
      ],
      borderWidth: 0,
    },
  ],
};

const monthlyData = {
  labels: ['Set', 'Out', 'Nov'],
  datasets: [
    {
      label: 'Posts Criados',
      data: [8, 15, 12],
      backgroundColor: 'hsl(45, 100%, 75%)',
      borderColor: 'hsl(45, 100%, 60%)',
      borderWidth: 2,
      borderRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: 'hsl(210, 17%, 90%)',
      },
      beginAtZero: true,
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
  },
  cutout: '60%',
};

export function ReportsWidget() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Posts por Categoria */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Posts por Categoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <Doughnut data={engagementData} options={doughnutOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Evolução Mensal */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <span>Evolução Mensal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <Bar data={monthlyData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center">
            <Badge variant="secondary" className="bg-success/10 text-success">
              +25% vs mês anterior
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Engajamento */}
      <Card className="shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Engajamento Estimado</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visualizações */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Visualizações</span>
              </div>
              <span className="text-sm font-bold">2.4K</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-muted-foreground">Meta: 3.2K</p>
          </div>

          {/* Curtidas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Curtidas</span>
              </div>
              <span className="text-sm font-bold">186</span>
            </div>
            <Progress value={62} className="h-2" />
            <p className="text-xs text-muted-foreground">Meta: 300</p>
          </div>

          {/* Comentários */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Comentários</span>
              </div>
              <span className="text-sm font-bold">23</span>
            </div>
            <Progress value={38} className="h-2" />
            <p className="text-xs text-muted-foreground">Meta: 60</p>
          </div>

          <div className="pt-4 border-t">
            <div className="text-center">
              <p className="text-lg font-bold text-success">Taxa: 7.8%</p>
              <p className="text-xs text-muted-foreground">Engajamento médio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}