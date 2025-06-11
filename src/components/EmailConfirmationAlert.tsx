import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mail, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailConfirmationAlertProps {
  email: string;
}

const EmailConfirmationAlert = ({ email }: EmailConfirmationAlertProps) => {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada novamente.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200">
        <Mail className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Verifique seu email</AlertTitle>
        <AlertDescription className="text-blue-700 space-y-2">
          <p>
            Enviamos um link de confirmação para <span className="font-medium">{email}</span>.
            Por favor, verifique:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Sua caixa de entrada principal</li>
            <li>A pasta de spam/lixo eletrônico</li>
            <li>Se estiver usando Hotmail/Outlook, verifique também a pasta "Outros" ou "Foco"</li>
          </ul>
          
          <div className="mt-4 space-y-2">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              variant="outline"
              className="w-full bg-white hover:bg-blue-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? "Reenviando..." : "Reenviar email de confirmação"}
            </Button>
            
            <p className="text-xs text-blue-600">
              Se ainda não receber o email após algumas tentativas, tente:
              <ul className="list-disc list-inside mt-1">
                <li>Usar um email alternativo (Gmail, Yahoo, etc)</li>
                <li>Verificar se o email foi digitado corretamente</li>
                <li>Adicionar o domínio @supabase.co aos seus contatos</li>
              </ul>
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmailConfirmationAlert; 