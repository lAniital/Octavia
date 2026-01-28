import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, TrendingUp, Eye, Clock, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const reports = [
  {
    title: "Rapport mensuel - Janvier 2024",
    type: "Mensuel",
    date: "2024-01-31",
    status: "Disponible",
    size: "2.4 MB",
    preview: {
      patients: 156,
      interactions: 342,
      alerts: 23,
      predictions: 89,
    },
  },
  {
    title: "Analyse des interactions Q4 2023",
    type: "Trimestriel",
    date: "2023-12-31",
    status: "Disponible",
    size: "5.8 MB",
    preview: {
      patients: 428,
      interactions: 1247,
      alerts: 67,
      predictions: 234,
    },
  },
  {
    title: "Évaluation des prédictions ML",
    type: "Spécial",
    date: "2024-01-15",
    status: "Disponible",
    size: "1.2 MB",
    preview: {
      patients: 312,
      interactions: 856,
      alerts: 45,
      predictions: 167,
    },
  },
];

const scheduledReports = [
  {
    name: "Rapport mensuel automatique",
    frequency: "Mensuel",
    nextRun: "2024-02-28",
    template: "Surveillance thérapeutique",
  },
  {
    name: "Analyse hebdomadaire des alertes",
    frequency: "Hebdomadaire",
    nextRun: "2024-02-05",
    template: "Analyse des effets indésirables",
  },
];

export default function Reports() {
  const [previewReport, setPreviewReport] = useState<(typeof reports)[0] | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleScheduleReport = () => {
    if (!selectedFrequency || !selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une fréquence et un modèle",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rapport programmé",
      description: `Le rapport sera généré automatiquement selon la fréquence sélectionnée`,
    });
    setScheduleDialogOpen(false);
    setSelectedFrequency("");
    setSelectedTemplate("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rapports</h1>
        <p className="text-muted-foreground mt-2">Génération et consultation des rapports d'analyse</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Rapport personnalisé</p>
                <p className="text-sm text-muted-foreground mt-1">Créer un nouveau rapport</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Rapport mensuel</p>
                <p className="text-sm text-muted-foreground mt-1">Générer automatiquement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Analyse comparative</p>
                <p className="text-sm text-muted-foreground mt-1">Comparer les périodes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rapports programmés</CardTitle>
              <CardDescription>Génération automatique selon un calendrier</CardDescription>
            </div>
            <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Programmer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Programmer un rapport</DialogTitle>
                  <DialogDescription>Configurez la génération automatique d'un rapport</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Fréquence</Label>
                    <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Sélectionnez une fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="quarterly">Trimestriel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">Modèle de rapport</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger id="template">
                        <SelectValue placeholder="Sélectionnez un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="therapeutic">Surveillance thérapeutique</SelectItem>
                        <SelectItem value="adverse">Analyse des effets indésirables</SelectItem>
                        <SelectItem value="ml">Performance du modèle ML</SelectItem>
                        <SelectItem value="compliance">Conformité réglementaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleScheduleReport} className="w-full">
                    Confirmer la programmation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledReports.map((scheduled, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{scheduled.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary">{scheduled.frequency}</Badge>
                      <span className="text-sm text-muted-foreground">Prochain: {scheduled.nextRun}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Modifier
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Rapports disponibles</CardTitle>
          <CardDescription>Historique des rapports générés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{report.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline">{report.type}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                      <span className="text-sm text-muted-foreground">{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setPreviewReport(report)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Aperçu
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{report.title}</DialogTitle>
                        <DialogDescription>Prévisualisation du rapport - {report.date}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 border border-border rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Patients suivis</p>
                            <p className="text-2xl font-bold text-foreground">{report.preview.patients}</p>
                          </div>
                          <div className="p-4 border border-border rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Interactions</p>
                            <p className="text-2xl font-bold text-foreground">{report.preview.interactions}</p>
                          </div>
                          <div className="p-4 border border-border rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Alertes générées</p>
                            <p className="text-2xl font-bold text-foreground">{report.preview.alerts}</p>
                          </div>
                          <div className="p-4 border border-border rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Prédictions</p>
                            <p className="text-2xl font-bold text-foreground">{report.preview.predictions}</p>
                          </div>
                        </div>
                        <div className="p-4 border border-border rounded-lg bg-muted/50">
                          <p className="text-sm font-medium text-foreground mb-2">Résumé</p>
                          <p className="text-sm text-muted-foreground">
                            Ce rapport contient une analyse détaillée des données de surveillance thérapeutique incluant
                            le suivi des patients, les interactions médicamenteuses détectées, et les prédictions du
                            modèle ML.
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates 
      <Card>
        <CardHeader>
          <CardTitle>Modèles de rapports</CardTitle>
          <CardDescription>
            Templates prédéfinis pour une génération rapide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                name: "Surveillance thérapeutique",
                description: "Suivi des traitements et observance",
              },
              {
                name: "Analyse des effets indésirables",
                description: "Compilation des événements adverses",
              },
              {
                name: "Performance du modèle ML",
                description: "Métriques et validation des prédictions",
              },
              {
                name: "Conformité réglementaire",
                description: "Documentation pour les autorités sanitaires",
              },
            ].map((template, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <p className="font-medium text-foreground mb-1">{template.name}</p>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>*/}
    </div>
  );
}
