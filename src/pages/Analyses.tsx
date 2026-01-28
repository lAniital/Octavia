import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, Activity, TrendingUp, FileText, User, Calendar, Eye, EyeOff } from "lucide-react";

// Demo data - Évolution des patients inscrits
const patientsInscritData = [
  {
    mois: "Jan",
    patients: 820,
  },
  {
    mois: "Fév",
    patients: 856,
  },
  {
    mois: "Mar",
    patients: 891,
  },
  {
    mois: "Avr",
    patients: 934,
  },
  {
    mois: "Mai",
    patients: 978,
  },
  {
    mois: "Juin",
    patients: 1021,
  },
  {
    mois: "Juil",
    patients: 1058,
  },
  {
    mois: "Août",
    patients: 1102,
  },
  {
    mois: "Sept",
    patients: 1147,
  },
  {
    mois: "Oct",
    patients: 1189,
  },
  {
    mois: "Nov",
    patients: 1234,
  },
  {
    mois: "Déc",
    patients: 1287,
  },
];

// Évolution de l'adhérence au traitement
const adherenceData = [
  {
    mois: "Jan",
    adherence: 78,
  },
  {
    mois: "Fév",
    adherence: 81,
  },
  {
    mois: "Mar",
    adherence: 79,
  },
  {
    mois: "Avr",
    adherence: 84,
  },
  {
    mois: "Mai",
    adherence: 86,
  },
  {
    mois: "Juin",
    adherence: 88,
  },
  {
    mois: "Juil",
    adherence: 87,
  },
  {
    mois: "Août",
    adherence: 89,
  },
  {
    mois: "Sept",
    adherence: 91,
  },
  {
    mois: "Oct",
    adherence: 90,
  },
  {
    mois: "Nov",
    adherence: 92,
  },
  {
    mois: "Déc",
    adherence: 93,
  },
];

// Patients avec charges indétectables
const chargeIndetectableData = [
  {
    mois: "Jan",
    indetectable: 612,
    detectable: 208,
  },
  {
    mois: "Fév",
    indetectable: 658,
    detectable: 198,
  },
  {
    mois: "Mar",
    indetectable: 701,
    detectable: 190,
  },
  {
    mois: "Avr",
    indetectable: 756,
    detectable: 178,
  },
  {
    mois: "Mai",
    indetectable: 812,
    detectable: 166,
  },
  {
    mois: "Juin",
    indetectable: 867,
    detectable: 154,
  },
];

// Évolution selon le sexe
const evolutionSexeData = [
  {
    mois: "Jan",
    hommes: 492,
    femmes: 328,
  },
  {
    mois: "Fév",
    hommes: 514,
    femmes: 342,
  },
  {
    mois: "Mar",
    hommes: 535,
    femmes: 356,
  },
  {
    mois: "Avr",
    hommes: 561,
    femmes: 373,
  },
  {
    mois: "Mai",
    hommes: 587,
    femmes: 391,
  },
  {
    mois: "Juin",
    hommes: 613,
    femmes: 408,
  },
  {
    mois: "Juil",
    hommes: 635,
    femmes: 423,
  },
  {
    mois: "Août",
    hommes: 661,
    femmes: 441,
  },
  {
    mois: "Sept",
    hommes: 688,
    femmes: 459,
  },
  {
    mois: "Oct",
    hommes: 713,
    femmes: 476,
  },
  {
    mois: "Nov",
    hommes: 740,
    femmes: 494,
  },
  {
    mois: "Déc",
    hommes: 771,
    femmes: 516,
  },
];

// Traitements les plus utilisés
const treatmentData = [
  {
    name: "DTG + 3TC + TDF",
    value: 387,
    color: "hsl(var(--primary))",
  },
  {
    name: "EFV + 3TC + TDF",
    value: 285,
    color: "hsl(var(--chart-1))",
  },
  {
    name: "ATV/r + 3TC + TDF",
    value: 218,
    color: "hsl(var(--chart-2))",
  },
  {
    name: "DRV/r + 3TC + TDF",
    value: 182,
    color: "hsl(var(--chart-3))",
  },
  {
    name: "Autres régimes",
    value: 215,
    color: "hsl(var(--chart-4))",
  },
];
const adverseEffectsData = [
  {
    medicament: "Efavirenz",
    effet: "Troubles neuropsychiatriques",
    frequence: 156,
    or: 2.45,
    ic: "1.8-3.3",
    rr: 2.12,
  },
  {
    medicament: "Névirapine",
    effet: "Hépatotoxicité",
    frequence: 89,
    or: 1.89,
    ic: "1.4-2.6",
    rr: 1.76,
  },
  {
    medicament: "Ténofovir",
    effet: "Toxicité rénale",
    frequence: 78,
    or: 1.65,
    ic: "1.2-2.3",
    rr: 1.54,
  },
  {
    medicament: "Atazanavir",
    effet: "Hyperbilirubinémie",
    frequence: 134,
    or: 3.21,
    ic: "2.4-4.3",
    rr: 2.89,
  },
  {
    medicament: "Lopinavir/r",
    effet: "Troubles gastro-intestinaux",
    frequence: 112,
    or: 2.08,
    ic: "1.6-2.7",
    rr: 1.95,
  },
];
const individualPatients = [
  {
    id: "P001",
    nom: "Martin D.",
    age: 42,
    cd4: 485,
    cv: "<50",
    traitement: "DTG+3TC+TDF",
    risque: "Controlé",
  },
  {
    id: "P002",
    nom: "Dubois S.",
    age: 38,
    cd4: 320,
    cv: "850",
    traitement: "EFV+3TC+TDF",
    risque: "Non Controlé",
  },
  {
    id: "P003",
    nom: "Bernard L.",
    age: 55,
    cd4: 580,
    cv: "<50",
    traitement: "ATV/r+3TC+TDF",
    risque: "Controlé",
  },
  {
    id: "P004",
    nom: "Petit M.",
    age: 47,
    cd4: 245,
    cv: "2450",
    traitement: "DRV/r+3TC+TDF",
    risque: "Non Controlé",
  },
  {
    id: "P005",
    nom: "Robert C.",
    age: 33,
    cd4: 512,
    cv: "<50",
    traitement: "DTG+3TC+TDF",
    risque: "Controlé",
  },
];
const getRiskBadge = (risque: string) => {
  switch (risque) {
    case "Controlé":
      return <Badge className="bg-green-500 hover:bg-green-500">Controlé</Badge>;
    case "Non Controlé":
      return <Badge className="bg-red-500 text-white">Non Controlé</Badge>;
    default:
      return <Badge>{risque}</Badge>;
  }
};
const Analyses = () => {
  const [visibleCharts, setVisibleCharts] = useState({
    patients: true,
    adherence: true,
    chargeVirale: true,
    sexe: true,
    ageDistribution: true,
    cd4Evolution: true,
    traitements: true,
    nouveauxCas: true,
  });

  const [filterOpen, setFilterOpen] = useState(false);

  const toggleChart = (chart: keyof typeof visibleCharts) => {
    setVisibleCharts(prev => ({ ...prev, [chart]: !prev[chart] }));
  };

  const toggleAll = (value: boolean) => {
    setVisibleCharts({
      patients: value,
      adherence: value,
      chargeVirale: value,
      sexe: value,
      ageDistribution: value,
      cd4Evolution: value,
      traitements: value,
      nouveauxCas: value,
    });
  };

  const chartCategories = [
    {
      category: "Démographie",
      charts: [
        { key: "patients" as const, label: "Évolution patients inscrits", icon: Users },
        { key: "sexe" as const, label: "Répartition par sexe", icon: User },
        { key: "ageDistribution" as const, label: "Distribution par âge", icon: Calendar },
        { key: "nouveauxCas" as const, label: "Nouveaux cas mensuels", icon: TrendingUp },
      ],
    },
    {
      category: "Clinique",
      charts: [
        { key: "adherence" as const, label: "Adhérence au traitement", icon: TrendingUp },
        { key: "chargeVirale" as const, label: "Charge virale", icon: Activity },
        { key: "cd4Evolution" as const, label: "Évolution CD4", icon: Activity },
        { key: "traitements" as const, label: "Traitements utilisés", icon: FileText },
      ],
    },
  ];

  const visibleCount = Object.values(visibleCharts).filter(Boolean).length;
  const totalCount = Object.keys(visibleCharts).length;

  // Données supplémentaires pour les nouveaux graphiques
  const ageDistributionData = [
    { tranche: "0-14", count: 45 },
    { tranche: "15-24", count: 180 },
    { tranche: "25-34", count: 420 },
    { tranche: "35-44", count: 380 },
    { tranche: "45-54", count: 220 },
    { tranche: "55-64", count: 95 },
    { tranche: "65+", count: 35 },
  ];

  const cd4EvolutionData = [
    { mois: "Jan", moyenne: 380, median: 350 },
    { mois: "Fév", moyenne: 395, median: 365 },
    { mois: "Mar", moyenne: 410, median: 385 },
    { mois: "Avr", moyenne: 425, median: 400 },
    { mois: "Mai", moyenne: 440, median: 415 },
    { mois: "Juin", moyenne: 455, median: 430 },
  ];

  const nouveauxCasData = [
    { mois: "Jan", nouveaux: 36 },
    { mois: "Fév", nouveaux: 35 },
    { mois: "Mar", nouveaux: 43 },
    { mois: "Avr", nouveaux: 44 },
    { mois: "Mai", nouveaux: 43 },
    { mois: "Juin", nouveaux: 37 },
    { mois: "Juil", nouveaux: 32 },
    { mois: "Août", nouveaux: 28 },
    { mois: "Sept", nouveaux: 38 },
    { mois: "Oct", nouveaux: 42 },
    { mois: "Nov", nouveaux: 39 },
    { mois: "Déc", nouveaux: 25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analyses</h1>
        <p className="text-muted-foreground mt-2">
          Analyses descriptives, cliniques et individuelles de la cohorte VIH
        </p>
      </div>

      <Tabs defaultValue="descriptives" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="descriptives">
            <Users className="h-4 w-4 mr-2" />
            Analyses descriptives
          </TabsTrigger>
          <TabsTrigger value="cliniques">
            <Activity className="h-4 w-4 mr-2" />
            Analyses cliniques
          </TabsTrigger>
          <TabsTrigger value="individuelles">
            <User className="h-4 w-4 mr-2" />
            Analyses individuelles
          </TabsTrigger>
        </TabsList>

        {/* ANALYSES DESCRIPTIVES */}
        <TabsContent value="descriptives" className="space-y-6">
          {/* Filtre des graphiques */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Filtrer les graphiques
                  <Badge variant="secondary">{visibleCount}/{totalCount}</Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>
                    Tout afficher
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>
                    Tout masquer
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFilterOpen(!filterOpen)}
                  >
                    {filterOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {filterOpen ? "Réduire" : "Développer"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {filterOpen && (
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {chartCategories.map((cat) => (
                    <div key={cat.category} className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground">{cat.category}</h4>
                      <div className="space-y-2">
                        {cat.charts.map(({ key, label, icon: Icon }) => (
                          <label 
                            key={key} 
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={visibleCharts[key]}
                              onChange={() => toggleChart(key)}
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Évolution des patients inscrits */}
            {visibleCharts.patients && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Évolution des patients inscrits
                </CardTitle>
                <CardDescription>Nombre total de patients dans la cohorte</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={patientsInscritData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mois" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                      labelStyle={{
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="patients"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{
                        fill: "hsl(var(--primary))",
                      }}
                      name="Patients"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            )}

            {/* Évolution de l'adhérence au traitement */}
            {visibleCharts.adherence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Évolution de l'adhérence au traitement
                </CardTitle>
                <CardDescription>Pourcentage d'adhérence mensuelle</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={adherenceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mois" className="text-xs" />
                    <YAxis domain={[70, 100]} className="text-xs" unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                      formatter={(value) => [`${value}%`, "Adhérence"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="adherence"
                      stroke="hsl(0, 84%, 60%)"
                      strokeWidth={3}
                      dot={{
                        fill: "hsl(0, 84%, 60%)",
                      }}
                      name="Adhérence"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            )}

            {/* Patients avec charges indétectables */}
            {visibleCharts.chargeVirale && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Patients avec charges indétectables
                </CardTitle>
                <CardDescription>Évolution du contrôle viral</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chargeIndetectableData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mois" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="indetectable"
                      fill="hsl(142, 76%, 36%)"
                      name="Indétectable (<50 copies/mL)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar dataKey="detectable" fill="hsl(var(--destructive))" name="Détectable" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            )}

            {/* Évolution selon le sexe */}
            {visibleCharts.sexe && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-500" />
                  Évolution selon le sexe
                </CardTitle>
                <CardDescription>Répartition par genre au fil du temps</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={evolutionSexeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mois" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="hommes"
                      stroke="#374151"
                      strokeWidth={2}
                      dot={{
                        fill: "#374151",
                      }}
                      name="Hommes"
                    />
                    <Line
                      type="monotone"
                      dataKey="femmes"
                      stroke="hsl(0, 84%, 60%)"
                      strokeWidth={2}
                      dot={{
                        fill: "hsl(0, 84%, 60%)",
                      }}
                      name="Femmes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            )}

            {/* Distribution par âge */}
            {visibleCharts.ageDistribution && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  Distribution par tranche d'âge
                </CardTitle>
                <CardDescription>Répartition des patients selon l'âge</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ageDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="tranche" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Patients" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            )}

            {/* Évolution CD4 */}
            {visibleCharts.cd4Evolution && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-500" />
                  Évolution du taux CD4
                </CardTitle>
                <CardDescription>Moyenne et médiane des CD4 de la cohorte</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={cd4EvolutionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mois" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="moyenne" stroke="hsl(var(--primary))" strokeWidth={2} name="Moyenne" />
                    <Line type="monotone" dataKey="median" stroke="#22c55e" strokeWidth={2} name="Médiane" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            )}

            {/* Nouveaux cas mensuels */}
            {visibleCharts.nouveauxCas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-rose-500" />
                  Nouveaux cas mensuels
                </CardTitle>
                <CardDescription>Évolution des nouvelles inscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={nouveauxCasData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mois" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar dataKey="nouveaux" fill="#f43f5e" name="Nouveaux cas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Traitements les plus utilisés - Full width */}
          {visibleCharts.traitements && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Traitements les plus utilisés
              </CardTitle>
              <CardDescription>Répartition des schémas thérapeutiques actuels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={treatmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {treatmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                      formatter={(value) => [`${value} patients`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {treatmentData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: item.color,
                          }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <Badge variant="secondary">{item.value} patients</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          )}
        </TabsContent>

        {/* ANALYSES CLINIQUES */}
        <TabsContent value="cliniques" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Médicaments et Effets Indésirables</CardTitle>
                <CardDescription>Associations statistiques et risques relatifs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Médicament</th>
                          <th className="text-left p-2">Effet indésirable</th>
                          <th className="text-center p-2">Fréquence</th>
                          <th className="text-center p-2">OR</th>
                          <th className="text-center p-2">IC 95%</th>
                          <th className="text-center p-2">RR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adverseEffectsData.map((item, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{item.medicament}</td>
                            <td className="p-2">{item.effet}</td>
                            <td className="p-2 text-center">{item.frequence}</td>
                            <td className="p-2 text-center font-semibold">{item.or}</td>
                            <td className="p-2 text-center text-muted-foreground">{item.ic}</td>
                            <td className="p-2 text-center font-semibold">{item.rr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Classes thérapeutiques ATC</CardTitle>
                  <CardDescription>Répartition par classe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>INTI (Inhibiteurs nucléosidiques)</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>INNTI (Inhibiteurs non-nucléosidiques)</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <Progress value={28} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>IP (Inhibiteurs de protéase)</span>
                      <span className="font-semibold">18%</span>
                    </div>
                    <Progress value={18} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>INI (Inhibiteurs d'intégrase)</span>
                      <span className="font-semibold">9%</span>
                    </div>
                    <Progress value={9} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analyse polymédication</CardTitle>
                  <CardDescription>Nombre de médicaments concomitants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">1-3 médicaments</span>
                    <Badge>487 patients</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">4-6 médicaments</span>
                    <Badge className="bg-primary">356 patients</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">7+ médicaments</span>
                    <Badge className="bg-primary text-primary-foreground">178 patients</Badge>
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium">Risque accru d'interactions</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Les patients avec 7+ médicaments nécessitent une surveillance renforcée
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ANALYSES INDIVIDUELLES */}
        <TabsContent value="individuelles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profils patients individuels</CardTitle>
              <CardDescription>Explorer les données cliniques par patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {individualPatients.map((patient) => (
                  <Card key={patient.id} className="hover:bg-muted/50 transition-all cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="grid gap-4 md:grid-cols-6 items-center">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">ID Patient</p>
                          <p className="font-semibold">{patient.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Nom</p>
                          <p className="font-semibold">{patient.nom}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">CD4</p>
                          <p className="font-semibold">{patient.cd4} cell/µL</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Charge virale</p>
                          <p className="font-semibold">{patient.cv} copies/mL</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Traitement</p>
                          <p className="text-xs">{patient.traitement}</p>
                        </div>
                        <div className="flex justify-end">{getRiskBadge(patient.risque)}</div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Dernière visite: Il y a 12 jours</span>
                          <span>•</span>
                          <FileText className="h-4 w-4 ml-2" />
                          <span>3 événements indésirables signalés</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default Analyses;
