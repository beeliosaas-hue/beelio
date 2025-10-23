import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-subtle-gradient flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold text-primary">404</div>
        <h1 className="text-3xl font-bold text-foreground">Página não encontrada</h1>
        <p className="text-muted-foreground max-w-md">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Home className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  );
}
