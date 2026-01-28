import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bell, Clock, CheckCircle, XCircle, User, Pill, AlertTriangle, Activity, FileText, Eye } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";

// Données d'évolution des alertes par mois
const monthlyAlertData = [
  { mois: "Juil", total: 45, elevees: 12, moderees: 18, faibles: 15, resolues: 38 },
  { mois: "Août", total: 52, elevees: 15, moderees: 22, faibles: 15, resolues: 45 },
  { mois: "Sept", total: 48, elevees: 10, moderees: 20, faibles: 18, resolues: 42 },
  { mois: "Oct", total: 61, elevees: 18, moderees: 25, faibles: 18, resolues: 54 },
  { mois: "Nov", total: 55, elevees: 14, moderees: 23, faibles: 18, resolues: 48 },
  { mois: "Déc", total: 23, elevees: 8, moderees: 10, faibles: 5, resolues: 15 },
];

const alerts = [
  {
    id: 1,
    type: "Interaction",
    severity: "Élevé",
    patient: "Amadou Diallo",
    patientId: "P-1023",
    age: 45,
    sexe: "M",
    message: "Interaction majeure détectée: Efavirenz + Rifampicine",
    time: "Il y a 15 min",
    status: "Actif",
    drugs: ["Efavirenz 600mg", "Rifampicine 300mg"],
    riskScore: 85,
    consequences: ["Diminution efficacité ARV", "Échec virologique", "Résistance"],
    recommendation: "Augmenter la dose d'Efavirenz à 800mg ou utiliser Dolutégravir",
    source: "Module Interactions",
    cd4: 320,
    chargeVirale: 1500,
  },
  {
    id: 2,
    type: "Prédiction",
    severity: "Modéré",
    patient: "Fatou Sow",
    patientId: "P-2045",
    age: 38,
    sexe: "F",
    message: "Risque accru de toxicité rénale identifié par le modèle ML",
    time: "Il y a 1h",
    status: "Actif",
    drugs: ["Ténofovir 300mg", "Lamivudine 150mg", "Dolutégravir 50mg"],
    riskScore: 68,
    consequences: ["Insuffisance rénale", "Tubulopathie proximale"],
    recommendation: "Surveillance créatinine tous les mois, envisager TAF si dégradation",
    source: "Modèle ML Prédictif",
    cd4: 450,
    chargeVirale: 50,
    dfg: 58,
  },
  {
    id: 3,
    type: "Suivi",
    severity: "Faible",
    patient: "Moussa Traoré",
    patientId: "P-3067",
    age: 52,
    sexe: "M",
    message: "Renouvellement de traitement requis dans 5 jours",
    time: "Il y a 2h",
    status: "Actif",
    drugs: ["TDF/3TC/DTG (Comprimé unique)"],
    riskScore: 25,
    consequences: ["Interruption de traitement", "Rebond viral"],
    recommendation: "Programmer RDV de renouvellement et bilan biologique",
    source: "Système de Suivi",
    cd4: 580,
    chargeVirale: 0,
    prochainRdv: "2024-12-08",
  },
  {
    id: 4,
    type: "Interaction",
    severity: "Élevé",
    patient: "Aïssatou Bah",
    patientId: "P-4089",
    age: 61,
    sexe: "F",
    message: "Contre-indication: Ritonavir + Simvastatine",
    time: "Hier",
    status: "Résolu",
    drugs: ["Lopinavir/Ritonavir", "Simvastatine 20mg"],
    riskScore: 92,
    consequences: ["Rhabdomyolyse", "Myopathie sévère"],
    recommendation: "Remplacer Simvastatine par Pravastatine ou Rosuvastatine",
    source: "Module Interactions",
    cd4: 410,
    chargeVirale: 80,
    resolutionNote: "Simvastatine arrêtée, remplacée par Pravastatine 40mg",
  },
];

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alertes</h1>
        <p className="text-muted-foreground mt-2">
          Notifications et alertes en temps réel
        </p>
      </div>

      {/* Alert Stats - Ce mois */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Bell className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">23</p>
                <p className="text-sm text-muted-foreground">Alertes actives ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Alertes résolues ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.2h</p>
                <p className="text-sm text-muted-foreground">Temps moyen ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique d'évolution des alertes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des alertes</CardTitle>
            <CardDescription>Nombre total d'alertes par mois (6 derniers mois)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyAlertData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolues" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    name="Total alertes"
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolues" 
                    name="Résolues"
                    stroke="hsl(var(--success))" 
                    fillOpacity={1} 
                    fill="url(#colorResolues)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par sévérité</CardTitle>
            <CardDescription>Alertes par niveau de sévérité par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyAlertData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="elevees" name="Élevées" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="moderees" name="Modérées" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="faibles" name="Faibles" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Toutes les alertes</CardTitle>
          <CardDescription>Historique complet des notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg space-y-4 ${
                  alert.status === "Résolu"
                    ? "border-border bg-muted/30"
                    : "border-border"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline">{alert.type}</Badge>
                      <Badge
                        variant={
                          alert.severity === "Élevé"
                            ? "destructive"
                            : alert.severity === "Modéré"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.source}
                      </Badge>
                      {alert.status === "Résolu" && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Résolu
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-foreground text-lg">
                      {alert.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-4">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </div>
                </div>

                {/* Patient Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Patient</p>
                      <p className="text-sm font-medium text-foreground">{alert.patient}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ID</p>
                    <p className="text-sm font-medium text-foreground">{alert.patientId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Âge / Sexe</p>
                    <p className="text-sm font-medium text-foreground">{alert.age} ans / {alert.sexe}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CD4</p>
                    <p className="text-sm font-medium text-foreground">{alert.cd4} cells/mm³</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Charge virale</p>
                    <p className="text-sm font-medium text-foreground">
                      {alert.chargeVirale === 0 ? "Indétectable" : `${alert.chargeVirale} copies/mL`}
                    </p>
                  </div>
                  {alert.dfg && (
                    <div>
                      <p className="text-xs text-muted-foreground">DFG</p>
                      <p className="text-sm font-medium text-foreground">{alert.dfg} mL/min</p>
                    </div>
                  )}
                </div>

                {/* Medications involved */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Médicaments impliqués</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.drugs.map((drug, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {drug}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Risk Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Score de risque</span>
                    </div>
                    <span 
                      className="text-lg font-bold"
                      style={{ 
                        color: alert.riskScore >= 80 
                          ? "hsl(var(--destructive))" 
                          : alert.riskScore >= 50 
                          ? "hsl(var(--chart-3))" 
                          : "hsl(var(--chart-4))" 
                      }}
                    >
                      {alert.riskScore}/100
                    </span>
                  </div>
                  <Progress 
                    value={alert.riskScore} 
                    className="h-2"
                  />
                </div>

                {/* Consequences */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-foreground">Conséquences potentielles</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alert.consequences.map((consequence, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-warning/30 text-warning">
                        {consequence}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Recommandation</p>
                      <p className="text-sm text-muted-foreground">{alert.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Resolution Note (if resolved) */}
                {alert.status === "Résolu" && alert.resolutionNote && (
                  <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Note de résolution</p>
                        <p className="text-sm text-muted-foreground">{alert.resolutionNote}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir dossier patient
                  </Button>
                  {alert.status === "Actif" && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer résolu
                      </Button>
                      <Button variant="ghost" size="sm">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
