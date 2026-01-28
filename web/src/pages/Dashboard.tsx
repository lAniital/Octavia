import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Users, Activity, ArrowRight, UserCheck, Pill, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Données de démonstration - À remplacer par des données réelles de la base
const demographicsData = [{
  ageRange: "18-30",
  hommes: 145,
  femmes: 198
}, {
  ageRange: "31-40",
  hommes: 234,
  femmes: 267
}, {
  ageRange: "41-50",
  hommes: 189,
  femmes: 156
}, {
  ageRange: "51-60",
  hommes: 98,
  femmes: 87
}, {
  ageRange: "60+",
  hommes: 45,
  femmes: 38
}];
const adverseEffectsData = [{
  name: "Hépatotoxicité",
  value: 78,
  color: "#EF4444"
}, {
  name: "Nausées",
  value: 134,
  color: "#F59E0B"
}, {
  name: "Toxicité rénale",
  value: 45,
  color: "#EAB308"
}, {
  name: "Troubles digestifs",
  value: 89,
  color: "#84CC16"
}, {
  name: "Autres",
  value: 67,
  color: "#6B7280"
}];
const treatmentStopTrend = [{
  mois: "Janv",
  patients: 12
}, {
  mois: "Fév",
  patients: 8
}, {
  mois: "Mars",
  patients: 15
}, {
  mois: "Avr",
  patients: 11
}, {
  mois: "Mai",
  patients: 9
}, {
  mois: "Juin",
  patients: 14
}];
const topMedications = [{
  medication: "Efavirenz",
  patients: 567,
  percentage: 45.5
}, {
  medication: "Ténofovir",
  patients: 489,
  percentage: 39.2
}, {
  medication: "Lamivudine",
  patients: 445,
  percentage: 35.7
}, {
  medication: "Atazanavir",
  patients: 312,
  percentage: 25.0
}, {
  medication: "Ritonavir",
  patients: 278,
  percentage: 22.3
}];
const stats = [{
  name: "Nouveaux patients",
  value: "+47",
  subValue: "Ce mois-ci",
  icon: UserCheck,
  color: "text-green-600",
  bgColor: "bg-green-100"
}, {
  name: "Patients suivis",
  value: "1,247",
  subValue: "+8.3% vs mois dernier",
  icon: TrendingUp,
  color: "text-emerald-600",
  bgColor: "bg-emerald-100"
}, {
  name: "Âge moyen",
  value: "38.5",
  subValue: "ans (cohorte)",
  icon: Users,
  color: "text-blue-600",
  bgColor: "bg-blue-100"
}, {
  name: "Répartition H/F",
  value: "45/55",
  subValue: "% Hommes / Femmes",
  icon: Activity,
  color: "text-purple-600",
  bgColor: "bg-purple-100"
}, {
  name: "Effets indésirables",
  value: "23",
  subValue: "Déclarés ce mois",
  icon: AlertCircle,
  color: "text-red-600",
  bgColor: "bg-red-100"
}];
const criticalAlerts = [{
  patient: "Patient #1023",
  alert: "CD4 < 200 - Consultation urgente requise",
  severity: "Critique",
  time: "Il y a 15 min"
}, {
  patient: "Patient #2045",
  alert: "Interaction Efavirenz + Rifampicine détectée",
  severity: "Élevé",
  time: "Il y a 1h"
}, {
  patient: "Patient #3067",
  alert: "Charge virale en hausse (15,000 copies/ml)",
  severity: "Élevé",
  time: "Il y a 2h"
}];
export default function Dashboard() {
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de la surveillance thérapeutique VIH</p>
      </div>

      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map(stat => {
          const linkMap: Record<string, string> = {
            "Nouveaux patients": "/monitoring",
            "Patients suivis": "/monitoring",
            "Âge moyen": "/analyses",
            "Répartition H/F": "/analyses",
            "Effets indésirables": "/alerts"
          };
          return (
            <Link key={stat.name} to={linkMap[stat.name] || "/monitoring"}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Répartition démographique */}
        <Link to="/analyses">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Répartition démographique</CardTitle>
                <CardDescription>Distribution par âge et sexe</CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demographicsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="ageRange" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }} />
                  <Legend />
                  <Bar dataKey="hommes" fill="#374151" name="Hommes" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="femmes" fill="#EF4444" name="Femmes" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Link>

        {/* Effets indésirables */}
        <Link to="/alerts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Effets indésirables</CardTitle>
                <CardDescription>Répartition par type d'effet</CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={adverseEffectsData} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  percent
                }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {adverseEffectsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Link>

        {/* Évolution des patients ayant arrêté le traitement */}
        <Link to="/reports">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Évolution des patients qui ont changé leur traitement</CardTitle>
                <CardDescription>Nombre de patients par mois (6 derniers mois)</CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={treatmentStopTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mois" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px"
                }} />
                  <Line type="monotone" dataKey="patients" stroke="#374151" strokeWidth={3} dot={{
                  fill: "#374151",
                  r: 6
                }} activeDot={{
                  r: 8
                }} name="Patients" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Link>

        {/* Médicaments les plus prescrits */}
        <Link to="/interactions">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Médicaments les plus prescrits</CardTitle>
                <CardDescription>Top 5 dans la cohorte</CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMedications.map((med, index) => <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{med.medication}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{med.patients}</p>
                        <p className="text-xs text-muted-foreground">{med.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{
                    width: `${med.percentage}%`
                  }} />
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      {/* Alertes critiques */}
      <Card className="border-destructive/50">
        <CardHeader className="flex flex-row items-center justify-between bg-destructive/5">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alertes critiques
            </CardTitle>
            <CardDescription>Patients nécessitant une attention immédiate</CardDescription>
          </div>
          <Link to="/alerts">
            <Button variant="outline" size="sm">
              Voir toutes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {criticalAlerts.map((alert, index) => <div key={index} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{alert.patient}</p>
                    <Badge variant={alert.severity === "Critique" ? "destructive" : "secondary"} className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.alert}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {alert.time}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  Traiter
                </Button>
              </div>)}
          </div>
        </CardContent>
      </Card>
      {/* Statistiques de suivi */}
      {/*<Card>
        <CardHeader>
          <CardTitle>Indicateurs de suivi thérapeutique</CardTitle>
          <CardDescription>Résumé des marqueurs biologiques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">CD4 {">"} 500</p>
                <Badge variant="outline" className="bg-success/10 text-success">
                  <UserCheck className="h-3 w-3 mr-1" />
                  687 patients
                </Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: "55%" }} />
              </div>
              <p className="text-xs text-muted-foreground">55% de la cohorte</p>
            </div>
             <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Charge indétectable</p>
                <Badge variant="outline" className="bg-success/10 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  934 patients
                </Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: "75%" }} />
              </div>
              <p className="text-xs text-muted-foreground">75% de la cohorte</p>
            </div>
             <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Observance {">"} 95%</p>
                <Badge variant="outline" className="bg-success/10 text-success">
                  <Activity className="h-3 w-3 mr-1" />
                  1,122 patients
                </Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: "90%" }} />
              </div>
              <p className="text-xs text-muted-foreground">90% de la cohorte</p>
            </div>
          </div>
        </CardContent>
       </Card>*/}
    </div>;
}