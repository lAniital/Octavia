import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertTriangle, Calendar, Activity, Pill, TrendingUp, User, BarChart3, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, ReferenceLine, ReferenceArea } from "recharts";

// Mock data - à remplacer par des données réelles
const patientData = {
  id: "1023",
  name: "Marie D.",
  age: 45,
  gender: "Féminin",
  status: "Suivi",
  dateOfBirth: "1979-03-15",
  phone: "+33 6 12 34 56 78",
  email: "marie.d@example.com",
  diagnosisDate: "2020-06-10",
  cd4Count: 580,
  viralLoad: "Indétectable"
};
const timeline = [{
  date: "2024-01-15",
  type: "consultation",
  title: "Consultation de suivi",
  description: "Contrôle trimestriel - CD4: 580, CV indétectable",
  status: "completed"
}, {
  date: "2023-12-20",
  type: "prescription",
  title: "Renouvellement de traitement",
  description: "TDF/FTC/EFV - 3 mois",
  status: "completed"
}, {
  date: "2023-10-15",
  type: "alert",
  title: "Alerte interaction médicamenteuse",
  description: "Interaction détectée avec nouveau médicament",
  status: "warning"
}, {
  date: "2023-10-10",
  type: "consultation",
  title: "Consultation de suivi",
  description: "Contrôle trimestriel - CD4: 560, CV indétectable",
  status: "completed"
}];
const prescriptions = [{
  id: "1",
  date: "2024-01-15",
  medication: "TDF/FTC/EFV",
  dosage: "1 cp/jour",
  duration: "3 mois",
  status: "Actif"
}, {
  id: "2",
  date: "2023-10-15",
  medication: "TDF/FTC/EFV",
  dosage: "1 cp/jour",
  duration: "3 mois",
  status: "Terminé"
}, {
  id: "3",
  date: "2023-07-10",
  medication: "TDF/FTC/EFV",
  dosage: "1 cp/jour",
  duration: "3 mois",
  status: "Terminé"
}];
const alerts = [{
  id: "1",
  date: "2024-01-10",
  type: "medication",
  severity: "high",
  title: "Risque d'interaction",
  description: "Interaction possible entre TDF/FTC/EFV et nouveau traitement"
}, {
  id: "2",
  date: "2023-12-15",
  type: "followup",
  severity: "medium",
  title: "Rendez-vous à planifier",
  description: "Prochain contrôle prévu dans 2 semaines"
}];
const evolutionData = [{
  month: "Juil 23",
  cd4: 520,
  viralLoad: 0,
  hemoglobin: 13.5,
  creatinine: 85
}, {
  month: "Août 23",
  cd4: 540,
  viralLoad: 0,
  hemoglobin: 13.8,
  creatinine: 82
}, {
  month: "Sept 23",
  cd4: 550,
  viralLoad: 0,
  hemoglobin: 14.0,
  creatinine: 80
}, {
  month: "Oct 23",
  cd4: 560,
  viralLoad: 0,
  hemoglobin: 14.2,
  creatinine: 78
}, {
  month: "Nov 23",
  cd4: 570,
  viralLoad: 0,
  hemoglobin: 14.1,
  creatinine: 79
}, {
  month: "Déc 23",
  cd4: 575,
  viralLoad: 0,
  hemoglobin: 14.3,
  creatinine: 77
}, {
  month: "Jan 24",
  cd4: 580,
  viralLoad: 0,
  hemoglobin: 14.5,
  creatinine: 76
}];

// Historique des traitements VIH
const hivTreatmentHistory = [{
  id: "1",
  startDate: "2020-06-15",
  endDate: null,
  regimen: "Ténofovir/Emtricitabine + Dolutégravir",
  drugs: ["TDF 300mg", "FTC 200mg", "DTG 50mg"],
  reason: "Traitement de première ligne",
  changeReason: null,
  status: "Actif"
}, {
  id: "2",
  startDate: "2019-03-10",
  endDate: "2020-06-14",
  regimen: "Abacavir/Lamivudine + Éfavirenz",
  drugs: ["ABC 600mg", "3TC 300mg", "EFV 600mg"],
  reason: "Traitement de première ligne",
  changeReason: "Effets secondaires neuropsychiatriques (insomnies, cauchemars)",
  status: "Arrêté"
}, {
  id: "3",
  startDate: "2018-09-01",
  endDate: "2019-03-09",
  regimen: "Zidovudine/Lamivudine + Névirapine",
  drugs: ["AZT 300mg", "3TC 150mg", "NVP 200mg"],
  reason: "Traitement initial au diagnostic",
  changeReason: "Anémie sévère (Hb: 8.5 g/dL) due à la Zidovudine",
  status: "Arrêté"
}];

// Effets indésirables
const adverseEffects = [{
  id: "1",
  date: "2024-01-15",
  effect: "Nausées légères",
  severity: "Mineur",
  drug: "TDF/FTC",
  duration: "3 jours",
  action: "Symptomatique - Conseil de prise pendant les repas",
  resolved: true
}, {
  id: "2",
  date: "2023-08-22",
  effect: "Céphalées",
  severity: "Mineur",
  drug: "DTG",
  duration: "1 semaine",
  action: "Paracétamol - Résolution spontanée",
  resolved: true
}, {
  id: "3",
  date: "2020-05-10",
  effect: "Cauchemars et insomnies",
  severity: "Modéré",
  drug: "EFV",
  duration: "6 semaines",
  action: "Changement de traitement vers TDF/FTC/DTG",
  resolved: true
}, {
  id: "4",
  date: "2019-01-20",
  effect: "Anémie sévère",
  severity: "Majeur",
  drug: "AZT",
  duration: "4 mois",
  action: "Arrêt immédiat AZT, switch vers ABC/3TC/EFV, transfusion",
  resolved: true
}, {
  id: "5",
  date: "2018-11-05",
  effect: "Éruption cutanée",
  severity: "Modéré",
  drug: "NVP",
  duration: "2 semaines",
  action: "Surveillance rapprochée, antihistaminiques",
  resolved: true
}];

// Statistiques individuelles
const patientStats = {
  treatmentDuration: "5 ans 7 mois",
  treatmentStartDate: "2018-09-01",
  numberOfRegimens: 3,
  numberOfAdverseEffects: 5,
  numberOfSevereAE: 1,
  numberOfModerateAE: 2,
  numberOfMinorAE: 2,
  polypharmacy: 7,
  // nombre total de médicaments
  adherenceRate: 95,
  riskScore: 3.2,
  lastCD4: 580,
  cd4Trend: "+15%",
  // sur 12 mois
  viralSuppressionDuration: "48 mois"
};

// Données temporelles des traitements - CD4
const treatmentTimelineData = [{
  date: "2018-09",
  cd4: 280,
  regimen: "AZT/3TC/NVP",
  stoppedRegimen: null
}, {
  date: "2018-11",
  cd4: 310,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-01",
  cd4: 240,
  regimen: null,
  stoppedRegimen: null
},
// Baisse due à anémie
{
  date: "2019-03",
  cd4: 320,
  regimen: "ABC/3TC/EFV",
  stoppedRegimen: "AZT/3TC/NVP"
},
// Changement - Arrêt AZT/3TC/NVP
{
  date: "2019-05",
  cd4: 360,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-07",
  cd4: 390,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-09",
  cd4: 420,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-11",
  cd4: 450,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-01",
  cd4: 470,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-03",
  cd4: 460,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-06",
  cd4: 490,
  regimen: "TDF/FTC/DTG",
  stoppedRegimen: "ABC/3TC/EFV"
},
// Changement - Arrêt ABC/3TC/EFV
{
  date: "2020-08",
  cd4: 510,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-10",
  cd4: 525,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-12",
  cd4: 540,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2021-03",
  cd4: 550,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2021-06",
  cd4: 560,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2021-09",
  cd4: 565,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2021-12",
  cd4: 570,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2022-03",
  cd4: 575,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2022-06",
  cd4: 578,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2022-09",
  cd4: 580,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2022-12",
  cd4: 580,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2023-03",
  cd4: 582,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2023-06",
  cd4: 580,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2023-09",
  cd4: 585,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2023-12",
  cd4: 580,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2024-01",
  cd4: 580,
  regimen: null,
  stoppedRegimen: null
}];

// Données de charge virale avec info de changement de traitement (patient ayant arrêté le traitement)
const viralLoadTimelineData = [{
  date: "2018-09",
  viralLoad: 85000,
  regimen: "AZT/3TC/NVP",
  stoppedRegimen: null
}, {
  date: "2018-11",
  viralLoad: 12000,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-01",
  viralLoad: 8500,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-03",
  viralLoad: 3200,
  regimen: "ABC/3TC/EFV",
  stoppedRegimen: "AZT/3TC/NVP"
}, {
  date: "2019-05",
  viralLoad: 450,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-07",
  viralLoad: 120,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-09",
  viralLoad: 40,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2019-11",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-01",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-03",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-06",
  viralLoad: 20,
  regimen: "TDF/FTC/DTG",
  stoppedRegimen: "ABC/3TC/EFV"
}, {
  date: "2020-08",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-10",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2020-12",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2021-03",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2021-06",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2021-09",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2021-12",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2022-03",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2022-06",
  viralLoad: 20,
  regimen: null,
  stoppedRegimen: "TDF/FTC/DTG"
}, {
  date: "2022-09",
  viralLoad: 850,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2022-12",
  viralLoad: 4500,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2023-03",
  viralLoad: 18000,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2023-06",
  viralLoad: 42000,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2023-09",
  viralLoad: 65000,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2023-12",
  viralLoad: 78000,
  regimen: null,
  stoppedRegimen: null
}, {
  date: "2024-01",
  viralLoad: 85000,
  regimen: null,
  stoppedRegimen: null
}];

// Efficacité comparée des schémas
const treatmentEffectivenessData = [{
  regimen: "AZT/3TC/NVP",
  avgCD4: 277,
  period: "6 mois"
}, {
  regimen: "ABC/3TC/EFV",
  avgCD4: 405,
  period: "15 mois"
}, {
  regimen: "TDF/FTC/DTG",
  avgCD4: 562,
  period: "44 mois"
}];
export default function PatientDetail() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [selectedBioMarker, setSelectedBioMarker] = useState<string>("cd4");
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };
  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <Activity className="h-4 w-4" />;
      case "prescription":
        return <Pill className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/monitoring")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour  
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Suivi Individuel</h1>
            <p className="text-muted-foreground mt-2">
              Patient #{patientData.id} - {patientData.name}
            </p>
          </div>
        </div>
        <Badge variant={patientData.status === "Actif" ? "default" : "secondary"}>{patientData.status}</Badge>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="biology">Biologie</TabsTrigger>
          <TabsTrigger value="treatments">Traitements VIH</TabsTrigger>
          <TabsTrigger value="adverse">Effets indésirables</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Profil + Statistiques */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Profil de base */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profil du patient
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nom complet</p>
                      <p className="font-medium text-foreground">{patientData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID Patient</p>
                      <p className="font-medium text-foreground">#{patientData.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Âge</p>
                      <p className="font-medium text-foreground">{patientData.age} ans</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Genre</p>
                      <p className="font-medium text-foreground">{patientData.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date de naissance</p>
                      <p className="font-medium text-foreground">{patientData.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        patientData.status === "Actif" 
                          ? "bg-green-500/20 text-green-600 dark:text-green-400" 
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      }`}>
                        <span 
                          className={`h-2 w-2 rounded-full ${patientData.status === "Actif" ? "bg-green-500" : "bg-amber-500"}`}
                        />
                        {patientData.status}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">Informations de contact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium text-foreground">{patientData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{patientData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">Diagnostic</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Date de diagnostic</p>
                        <p className="font-medium text-foreground">{patientData.diagnosisDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Durée de traitement</p>
                        <p className="font-medium text-foreground">{patientStats.treatmentDuration}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">Paramètres actuels</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">CD4</p>
                        <p className="font-medium text-foreground">{patientData.cd4Count} cells/μL</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Charge virale</p>
                        <p className="font-medium text-foreground">{patientData.viralLoad}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques clés */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Statistiques individuelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Durée et schémas */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Durée de traitement</p>
                        <p className="text-2xl font-bold text-foreground">{patientStats.treatmentDuration}</p>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Schémas utilisés</p>
                        <p className="text-2xl font-bold text-foreground">{patientStats.numberOfRegimens}</p>
                      </div>
                    </div>

                    {/* Effets indésirables */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">Effets indésirables</p>
                        <p className="text-2xl font-bold text-foreground">{patientStats.numberOfAdverseEffects}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-destructive/10 p-2 rounded">
                          <p className="font-bold text-destructive">{patientStats.numberOfSevereAE}</p>
                          <p className="text-muted-foreground">Majeur</p>
                        </div>
                        <div className="bg-yellow-500/10 p-2 rounded">
                          <p className="font-bold text-yellow-600">{patientStats.numberOfModerateAE}</p>
                          <p className="text-muted-foreground">Modéré</p>
                        </div>
                        <div className="bg-green-500/10 p-2 rounded">
                          <p className="font-bold text-green-600">{patientStats.numberOfMinorAE}</p>
                          <p className="text-muted-foreground">Mineur</p>
                        </div>
                      </div>
                    </div>

                    {/* Polymédication */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">Polymédication</p>
                        <p className="text-xl font-bold text-foreground">{patientStats.polypharmacy} médicaments</p>
                      </div>
                    </div>

                    {/* Observance */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">Observance thérapeutique</p>
                        <p className="text-lg font-bold text-foreground">{patientStats.adherenceRate}%</p>
                      </div>
                      <Progress value={patientStats.adherenceRate} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Excellente adhérence</p>
                    </div>

                    {/* Score de risque */}
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">Score de risque global</p>
                        <Badge variant="outline" className="text-green-600">
                          Faible
                        </Badge>
                      </div>
                      <p className="text-3xl font-bold text-foreground">{patientStats.riskScore}/10</p>
                      <Progress value={patientStats.riskScore * 10} className="h-2 mt-2" />
                    </div>

                    {/* CD4 et suppression virale */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Évolution CD4</p>
                        <p className="text-lg font-bold text-green-600">{patientStats.cd4Trend}</p>
                        <p className="text-xs text-muted-foreground">Sur 12 mois</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Suppression virale</p>
                        <p className="text-lg font-bold text-foreground">{patientStats.viralSuppressionDuration}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Biology Tab - Trajectoire biologique */}
        <TabsContent value="biology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trajectoire biologique
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Évolution des marqueurs biologiques au cours des 7 derniers mois
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Indicateurs actuels */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">CD4 Actuel</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{patientData.cd4Count}</p>
                    <p className="text-xs text-muted-foreground mt-1">cells/μL</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+15% (6 mois)</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Charge Virale</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{patientData.viralLoad}</p>
                    <p className="text-xs text-muted-foreground mt-1">copies/mL</p>
                    <Badge variant="outline" className="mt-2 text-green-600">
                      Contrôlée
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Hémoglobine</p>
                    <p className="text-3xl font-bold text-foreground mt-2">14.5</p>
                    <p className="text-xs text-muted-foreground mt-1">g/dL</p>
                    <Badge variant="outline" className="mt-2">
                      Normal
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Créatinine</p>
                    <p className="text-3xl font-bold text-foreground mt-2">76</p>
                    <p className="text-xs text-muted-foreground mt-1">μmol/L</p>
                    <Badge variant="outline" className="mt-2">
                      Normal
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Trajectoire biologique combinée */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">Trajectoire biologique</h4>
                  <Select value={selectedBioMarker} onValueChange={setSelectedBioMarker}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sélectionner un marqueur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cd4">CD4 (cells/μL)</SelectItem>
                      <SelectItem value="hemoglobin">Hémoglobine (g/dL)</SelectItem>
                      <SelectItem value="creatinine">Créatinine (μmol/L)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={selectedBioMarker === "cd4" ? ["auto", "auto"] : selectedBioMarker === "hemoglobin" ? [12, 15] : [70, 90]} />
                      <Tooltip contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} />
                      <Legend />
                      <Line type="monotone" dataKey={selectedBioMarker} stroke={selectedBioMarker === "cd4" ? "hsl(var(--chart-1))" : selectedBioMarker === "hemoglobin" ? "hsl(var(--chart-2))" : "hsl(var(--chart-3))"} strokeWidth={2} name={selectedBioMarker === "cd4" ? "CD4 (cells/μL)" : selectedBioMarker === "hemoglobin" ? "Hémoglobine (g/dL)" : "Créatinine (μmol/L)"} dot={{
                      r: 4
                    }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Tab - Historique des traitements VIH */}
        <TabsContent value="treatments" className="space-y-4">
          {/* Timeline chronologique des traitements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Chronologie des Traitements ARV
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Historique complet des schémas thérapeutiques du patient
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Graphe de timeline horizontal */}
                <div className="bg-muted/30 p-6 rounded-lg">
                  <div className="space-y-1 mb-6">
                    {hivTreatmentHistory.slice().reverse().map((treatment, index) => {
                    const isActive = treatment.status === "Actif";
                    const startYear = parseInt(treatment.startDate.split("-")[0]);
                    const startMonth = parseInt(treatment.startDate.split("-")[1]);
                    const endYear = treatment.endDate ? parseInt(treatment.endDate.split("-")[0]) : 2024;
                    const endMonth = treatment.endDate ? parseInt(treatment.endDate.split("-")[1]) : 1;

                    // Calcul de la position et largeur en pourcentage
                    const minDate = new Date(2018, 8); // Sept 2018
                    const maxDate = new Date(2024, 1); // Jan 2024
                    const treatmentStart = new Date(startYear, startMonth - 1);
                    const treatmentEnd = new Date(endYear, endMonth - 1);
                    const totalDuration = maxDate.getTime() - minDate.getTime();
                    const startOffset = (treatmentStart.getTime() - minDate.getTime()) / totalDuration * 100;
                    const width = (treatmentEnd.getTime() - treatmentStart.getTime()) / totalDuration * 100;
                    const colorClasses = isActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600";
                    return <div key={treatment.id} className="relative h-24 mb-4">
                            {/* Barre de traitement */}
                            <div className={`absolute top-0 h-16 ${colorClasses} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer group`} style={{
                        left: `${startOffset}%`,
                        width: `${width}%`
                      }}>
                              <div className="p-3 h-full flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-semibold text-sm truncate pr-2">
                                    {treatment.regimen}
                                  </span>
                                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30 shrink-0">
                                    {treatment.status}
                                  </Badge>
                                </div>
                                <div className="text-white/90 text-xs">
                                  {treatment.startDate} → {treatment.endDate || "Aujourd'hui"}
                                </div>
                              </div>

                              {/* Tooltip au hover */}
                              <div className="absolute top-full left-0 mt-2 w-80 bg-card border-2 border-border rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Médicaments</p>
                                    <div className="flex flex-wrap gap-1">
                                      {treatment.drugs.map((drug, idx) => <Badge key={idx} variant="outline" className="text-xs">
                                          {drug}
                                        </Badge>)}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Raison de prescription</p>
                                    <p className="text-sm text-foreground">{treatment.reason}</p>
                                  </div>

                                  {treatment.changeReason && <div className="pt-2 border-t border-border">
                                      <p className="text-xs text-muted-foreground mb-1">Raison du changement</p>
                                      <p className="text-sm text-destructive font-medium">{treatment.changeReason}</p>
                                    </div>}
                                </div>
                              </div>
                            </div>
                          </div>;
                  })}
                  </div>

                  {/* Axe temporel */}
                  <div className="relative mt-8 pt-4 border-t-2 border-border">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sept 2018</span>
                      <span>Mars 2019</span>
                      <span>Sept 2019</span>
                      <span>Mars 2020</span>
                      <span>Sept 2020</span>
                      <span>Mars 2021</span>
                      <span>Sept 2021</span>
                      <span>Mars 2022</span>
                      <span>Sept 2022</span>
                      <span>Mars 2023</span>
                      <span>Sept 2023</span>
                      <span>Jan 2024</span>
                    </div>
                  </div>
                </div>

                {/* Détails des traitements sous forme de cartes */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground text-lg">Détails des schémas thérapeutiques</h4>
                  <div className="grid gap-4">
                    {hivTreatmentHistory.slice().reverse().map((treatment, index) => {
                    const isActive = treatment.status === "Actif";
                    const colorClasses = isActive ? "border-l-red-500 bg-red-500/5" : "border-l-blue-500 bg-blue-500/5";
                    return <div key={treatment.id} className={`border-l-4 ${colorClasses} rounded-r-lg p-4 bg-card`}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-foreground text-base">{treatment.regimen}</h5>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {treatment.startDate} {treatment.endDate ? `→ ${treatment.endDate}` : "→ Aujourd'hui"}
                                </p>
                              </div>
                              <Badge className={isActive ? "bg-red-500 hover:bg-red-500 text-white" : "bg-blue-500 hover:bg-blue-500 text-white"}>{treatment.status}</Badge>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-muted-foreground mb-2 font-medium">💊 Médicaments</p>
                                <div className="flex flex-wrap gap-2">
                                  {treatment.drugs.map((drug, idx) => <Badge key={idx} variant="outline" className="text-xs">
                                      {drug}
                                    </Badge>)}
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground mb-1 font-medium">
                                  📋 Raison de prescription
                                </p>
                                <p className="text-sm text-foreground">{treatment.reason}</p>
                              </div>

                              {treatment.changeReason && <div className="mt-3 pt-3 border-t border-border">
                                  <p className="text-xs text-muted-foreground mb-1 font-medium">
                                    ⚠️ Raison du changement
                                  </p>
                                  <p className="text-sm text-destructive font-medium">{treatment.changeReason}</p>
                                </div>}
                            </div>
                          </div>;
                  })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courbes d'évolution des paramètres biologiques sous traitement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Évolution des paramètres biologiques sous traitement
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                CD4 et charge virale en fonction des changements de schéma thérapeutique
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline des traitements avec CD4 */}
                <div>
                  <h4 className="font-semibold text-foreground mb-4">CD4 et Schémas ARV</h4>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={treatmentTimelineData} margin={{
                      top: 30,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

                        {/* Zones de traitement colorées */}
                        <ReferenceArea x1="2018-09" x2="2019-03" fill="#ef4444" fillOpacity={0.15} label={{
                        value: "AZT/3TC/NVP",
                        position: "top",
                        fill: "#ef4444",
                        fontSize: 10
                      }} />
                        <ReferenceArea x1="2019-03" x2="2020-06" fill="#3b82f6" fillOpacity={0.15} label={{
                        value: "ABC/3TC/EFV",
                        position: "top",
                        fill: "#3b82f6",
                        fontSize: 10
                      }} />
                        <ReferenceArea x1="2020-06" x2="2024-01" fill="#22c55e" fillOpacity={0.15} label={{
                        value: "TDF/FTC/DTG",
                        position: "top",
                        fill: "#22c55e",
                        fontSize: 10
                      }} />

                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" label={{
                        value: "CD4 (cells/μL)",
                        angle: -90,
                        position: "insideLeft"
                      }} />
                        <Tooltip contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} content={({
                        active,
                        payload
                      }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          // Déterminer le traitement en cours
                          let currentRegimen = "TDF/FTC/DTG";
                          if (data.date < "2019-03") currentRegimen = "AZT/3TC/NVP";else if (data.date < "2020-06") currentRegimen = "ABC/3TC/EFV";
                          return <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                                  <p className="font-medium text-foreground mb-2">{data.date}</p>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    CD4: <span className="text-foreground font-semibold">{data.cd4} cells/μL</span>
                                  </p>
                                  {data.stoppedRegimen && <p className="text-xs text-red-500 font-bold mt-1">
                                      ⛔ Arrêt: {data.stoppedRegimen}
                                    </p>}
                                  {data.regimen && <p className="text-xs text-green-500 font-bold mt-1">
                                      🔄 Début: {data.regimen}
                                    </p>}
                                  <p className="text-xs text-primary font-medium mt-2 border-t border-border pt-2">
                                    💊 Schéma: {currentRegimen}
                                  </p>
                                </div>;
                        }
                        return null;
                      }} />
                        <Legend />
                        <Line type="monotone" dataKey="cd4" stroke="#000000" strokeWidth={3} name="CD4 (cells/μL)" dot={{
                        r: 4,
                        fill: "#000000"
                      }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Légende des périodes de traitement */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="text-green-500">●</span> Début traitement</span>
                      <span className="flex items-center gap-1"><span className="text-red-500">⛔</span> Arrêt traitement</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="text-xs font-medium text-red-600">2018-09 → 2019-03</p>
                          <p className="text-sm text-foreground font-medium">AZT/3TC/NVP</p>
                          <p className="text-xs text-red-500">Arrêté (anémie)</p>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-xs font-medium text-blue-600">2019-03 → 2020-06</p>
                          <p className="text-sm text-foreground font-medium">ABC/3TC/EFV</p>
                          <p className="text-xs text-red-500">Arrêté (optimisation)</p>
                        </div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-xs font-medium text-green-600">2020-06 → Actuel</p>
                          <p className="text-sm text-foreground font-medium">TDF/FTC/DTG</p>
                          <p className="text-xs text-green-500">En cours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charge virale */}
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Charge virale sous traitement</h4>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={viralLoadTimelineData} margin={{
                      top: 30,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

                        {/* Zones de traitement colorées */}
                        <ReferenceArea x1="2018-09" x2="2019-03" fill="#ef4444" fillOpacity={0.15} label={{
                        value: "AZT/3TC/NVP",
                        position: "top",
                        fill: "#ef4444",
                        fontSize: 10
                      }} />
                        <ReferenceArea x1="2019-03" x2="2020-06" fill="#3b82f6" fillOpacity={0.15} label={{
                        value: "ABC/3TC/EFV",
                        position: "top",
                        fill: "#3b82f6",
                        fontSize: 10
                      }} />
                        <ReferenceArea x1="2020-06" x2="2022-06" fill="#22c55e" fillOpacity={0.15} label={{
                        value: "TDF/FTC/DTG",
                        position: "top",
                        fill: "#22c55e",
                        fontSize: 10
                      }} />
                        <ReferenceArea x1="2022-06" x2="2024-01" fill="#f59e0b" fillOpacity={0.15} label={{
                        value: "Sans traitement",
                        position: "top",
                        fill: "#f59e0b",
                        fontSize: 10
                      }} />

                        {/* Seuil de détection */}
                        <ReferenceLine y={50} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="3 3" label={{
                        value: "Seuil indétectable (50 copies/mL)",
                        position: "right",
                        fill: "#22c55e",
                        fontSize: 10
                      }} />

                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" label={{
                        value: "Charge virale (copies/mL)",
                        angle: -90,
                        position: "insideLeft"
                      }} scale="log" domain={[10, 100000]} />
                        <Tooltip contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} content={({
                        active,
                        payload
                      }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          // Déterminer le traitement en cours
                          let currentRegimen = "TDF/FTC/DTG";
                          if (data.date < "2019-03") currentRegimen = "AZT/3TC/NVP";else if (data.date < "2020-06") currentRegimen = "ABC/3TC/EFV";
                          const isUndetectable = data.viralLoad <= 50;
                          return <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                                  <p className="font-medium text-foreground mb-2">{data.date}</p>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    Charge virale:{" "}
                                    <span className={`font-semibold ${isUndetectable ? "text-green-600" : "text-foreground"}`}>
                                      {isUndetectable ? "Indétectable (<50)" : `${data.viralLoad.toLocaleString()} copies/mL`}
                                    </span>
                                  </p>
                                  {data.stoppedRegimen && <p className="text-xs text-red-500 font-bold mt-1">
                                      ⛔ Arrêt: {data.stoppedRegimen}
                                    </p>}
                                  {data.regimen && <p className="text-xs text-green-500 font-bold mt-1">
                                      🔄 Début: {data.regimen}
                                    </p>}
                                  <p className="text-xs text-primary font-medium mt-2 border-t border-border pt-2">
                                    💊 Schéma: {currentRegimen}
                                  </p>
                                </div>;
                        }
                        return null;
                      }} />
                        <Legend />
                        <Line type="monotone" dataKey="viralLoad" stroke="#000000" strokeWidth={3} name="Charge virale (copies/mL)" dot={{
                        r: 4,
                        fill: "#000000"
                      }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Adverse Effects Tab */}
        <TabsContent value="adverse" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Effets indésirables ({adverseEffects.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Historique complet des effets secondaires avec dates et gravité
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adverseEffects.map(ae => {
                const getSeverityColor = (severity: string) => {
                  if (severity === "Majeur") return "bg-destructive/10 border-destructive text-destructive";
                  if (severity === "Modéré") return "bg-yellow-500/10 border-yellow-500 text-yellow-600";
                  return "bg-green-500/10 border-green-500 text-green-600";
                };
                return <div key={ae.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{ae.effect}</h4>
                            <Badge className={getSeverityColor(ae.severity)}>{ae.severity}</Badge>
                            {ae.resolved && <Badge variant="outline" className="text-green-600">
                                Résolu
                              </Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{ae.date}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Médicament suspecté:</p>
                          <Badge variant="outline">{ae.drug}</Badge>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Durée:</p>
                          <p className="text-sm text-foreground">{ae.duration}</p>
                        </div>
                      </div>

                      <div className="mt-3 bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Action prise:</p>
                        <p className="text-sm text-foreground">{ae.action}</p>
                      </div>
                    </div>;
              })}
              </div>

              {/* Statistiques des EI */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-4">Répartition par gravité</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{
                    severity: "Majeur",
                    count: patientStats.numberOfSevereAE
                  }, {
                    severity: "Modéré",
                    count: patientStats.numberOfModerateAE
                  }, {
                    severity: "Mineur",
                    count: patientStats.numberOfMinorAE
                  }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="severity" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes spécifiques ({alerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map(alert => <div key={alert.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.severity === "high" ? "text-destructive" : "text-primary"}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{alert.title}</p>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity === "high" ? "Élevé" : "Moyen"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{alert.date}</p>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}