import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Activity, CheckCircle2, TrendingUp, AlertTriangle, Info, Pill, Sparkles, Brain, ThumbsUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Predictions() {
  const [activeTab, setActiveTab] = useState("ml");
  const [prediction, setPrediction] = useState<any>(null);
  const [formData, setFormData] = useState({
    patientId: "",
    age: "",
    weight: "",
    arvTreatment: "",
    comorbidities: "",
    coPrescriptions: "",
    cd4: "",
    viralLoad: "",
  });

  const [whatIfParams, setWhatIfParams] = useState({
    age: 45,
    cd4: 450,
    viralLoad: 0,
  });

  const [arvPrediction, setArvPrediction] = useState({
    selectedPatient: "",
    arvScheme: {
      nrti1: "",
      nrti2: "",
      nnrti: "",
      pi: "",
      insti: "",
    },
  });

  const [arvPredictionResults, setArvPredictionResults] = useState<any>(null);
  const [proposedSchemes, setProposedSchemes] = useState<any[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const patients = [
    { id: "P001", name: "Patient A - 45 ans, CD4: 450", age: "45", cd4: "450", viralLoad: "Indétectable", weight: "72", arvScheme: { nrti1: "tenofovir", nrti2: "emtricitabine", nnrti: "", pi: "", insti: "dolutegravir" } },
    { id: "P002", name: "Patient B - 38 ans, CD4: 320", age: "38", cd4: "320", viralLoad: "1200", weight: "68", arvScheme: { nrti1: "abacavir", nrti2: "lamivudine", nnrti: "efavirenz", pi: "", insti: "" } },
    { id: "P003", name: "Patient C - 52 ans, CD4: 580", age: "52", cd4: "580", viralLoad: "Indétectable", weight: "85", arvScheme: { nrti1: "tenofovir", nrti2: "lamivudine", nnrti: "", pi: "", insti: "dolutegravir" } },
    { id: "P004", name: "Patient D - 41 ans, CD4: 210", age: "41", cd4: "210", viralLoad: "45000", weight: "76", arvScheme: { nrti1: "zidovudine", nrti2: "lamivudine", nnrti: "", pi: "lopinavir", insti: "" } },
    { id: "P005", name: "Patient E - 29 ans, CD4: 650", age: "29", cd4: "650", viralLoad: "Indétectable", weight: "62", arvScheme: { nrti1: "tenofovir", nrti2: "emtricitabine", nnrti: "", pi: "", insti: "bictegravir" } },
  ];

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setFormData({
        ...formData,
        patientId: patientId,
        age: patient.age,
        cd4: patient.cd4,
        viralLoad: patient.viralLoad,
        weight: patient.weight,
      });
      setArvPrediction({ 
        ...arvPrediction, 
        selectedPatient: patientId,
        arvScheme: patient.arvScheme 
      });
    }
  };

  const arvMedications = {
    nrti: [
      { id: "tenofovir", name: "Ténofovir (TDF)" },
      { id: "abacavir", name: "Abacavir (ABC)" },
      { id: "zidovudine", name: "Zidovudine (AZT)" },
      { id: "emtricitabine", name: "Emtricitabine (FTC)" },
      { id: "lamivudine", name: "Lamivudine (3TC)" },
    ],
    nnrti: [
      { id: "efavirenz", name: "Éfavirenz (EFV)" },
      { id: "nevirapine", name: "Névirapine (NVP)" },
      { id: "rilpivirine", name: "Rilpivirine (RPV)" },
      { id: "doravirine", name: "Doravirine (DOR)" },
    ],
    pi: [
      { id: "lopinavir", name: "Lopinavir/ritonavir (LPV/r)" },
      { id: "atazanavir", name: "Atazanavir (ATV)" },
      { id: "darunavir", name: "Darunavir (DRV)" },
    ],
    insti: [
      { id: "dolutegravir", name: "Dolutégravir (DTG)" },
      { id: "raltegravir", name: "Raltégravir (RAL)" },
      { id: "bictegravir", name: "Bictégravir (BIC)" },
    ],
  };

  const getMedicationName = (id: string) => {
    const allMeds = [...arvMedications.nrti, ...arvMedications.nnrti, ...arvMedications.pi, ...arvMedications.insti];
    return allMeds.find(m => m.id === id)?.name || id;
  };

  const handlePredict = () => {
    setPrediction({
      riskLevel: "Modéré",
      confidence: 87.5,
      adverseEffects: [
        { name: "Hépatotoxicité", severity: "Modéré", probability: 45 },
        { name: "Troubles gastro-intestinaux", severity: "Mineur", probability: 32 },
        { name: "Néphrotoxicité", severity: "Modéré", probability: 18 },
      ],
      recommendations: [
        "Surveillance hépatique renforcée (bilan tous les 15 jours)",
        "Ajustement posologique recommandé pour le Ténofovir",
        "Surveiller la fonction rénale (clairance créatinine)",
        "Envisager une alternative thérapeutique si aggravation",
      ],
      futureComplications: {
        riskScore: 6.8,
        timeline: [
          { month: "Mois 1", risque: 3.2 },
          { month: "Mois 3", risque: 4.5 },
          { month: "Mois 6", risque: 6.8 },
          { month: "Mois 12", risque: 8.2 },
          { month: "Mois 24", risque: 9.5 },
        ],
        influentialVariables: [
          { name: "CD4 < 200", impact: 85, explanation: "Taux de CD4 faible augmente significativement le risque" },
          { name: "Charge virale élevée", impact: 72, explanation: "Une charge virale non contrôlée favorise la progression" },
          { name: "Âge > 50 ans", impact: 58, explanation: "L'âge avancé est associé à une réponse immunitaire moins efficace" },
          { name: "Comorbidités multiples", impact: 45, explanation: "Les comorbidités complexifient la gestion thérapeutique" },
        ],
        cohortComparison: {
          patient: 6.8,
          cohortAverage: 4.2,
          cohortData: [
            { category: "0-2", count: 145 },
            { category: "2-4", count: 320 },
            { category: "4-6", count: 280 },
            { category: "6-8", count: 185 },
            { category: "8-10", count: 70 },
          ],
        },
      },
    });
  };

  const handleArvPrediction = () => {
    const scheme = Object.values(arvPrediction.arvScheme).filter(Boolean);
    if (scheme.length === 0 || !formData.patientId) return;

    setArvPredictionResults({
      sideEffects: [
        { name: "Nausées", category: "Gastro-intestinaux", severity: "Modéré", probability: 42, onset: "1-2 semaines" },
        { name: "Diarrhée", category: "Gastro-intestinaux", severity: "Mineur", probability: 18, onset: "Premiers jours" },
        { name: "Céphalées", category: "Neurologiques", severity: "Mineur", probability: 35, onset: "Premiers jours" },
        { name: "Troubles du sommeil", category: "Neurologiques", severity: "Modéré", probability: 22, onset: "2-4 semaines" },
        { name: "Fatigue", category: "Généraux", severity: "Mineur", probability: 28, onset: "1 semaine" },
        { name: "Éruption cutanée", category: "Dermatologiques", severity: "Modéré", probability: 8, onset: "2-4 semaines" },
        { name: "Dyslipidémie", category: "Métaboliques", severity: "Modéré", probability: 14, onset: "3-6 mois" },
        { name: "Néphrotoxicité", category: "Hépatiques/Rénaux", severity: "Élevé", probability: 5, onset: "3-6 mois" },
      ],
      recommendations: [
        "Prendre le traitement pendant les repas pour réduire les nausées",
        "Éviter la prise d'alcool pendant les premières semaines",
        "Surveiller les signes d'hépatotoxicité",
        "Maintenir une bonne hydratation",
      ],
      efficacy: {
        viralSuppressionRate: 92,
        cd4Recovery: "Augmentation attendue de 100-150 cells/μL en 6 mois",
        adherenceImpact: "Schéma simple favorisant l'observance",
      },
    });
  };

  const handleGenerateProposals = () => {
    if (!formData.patientId) return;

    setProposedSchemes([
      {
        id: 1,
        name: "Ténofovir + Emtricitabine + Dolutégravir",
        drugs: ["TDF 300mg", "FTC 200mg", "DTG 50mg"],
        score: 95,
        efficacy: 94,
        tolerability: 88,
        sideEffects: [
          { name: "Nausées", probability: 15, severity: "Mineur" },
          { name: "Céphalées", probability: 12, severity: "Mineur" },
          { name: "Insomnie", probability: 8, severity: "Mineur" },
        ],
        advantages: ["Schéma recommandé OMS", "Une prise par jour", "Haute barrière génétique"],
        precautions: ["Surveillance fonction rénale", "Éviter si clairance < 50 mL/min"],
      },
      {
        id: 2,
        name: "Abacavir + Lamivudine + Dolutégravir",
        drugs: ["ABC 600mg", "3TC 300mg", "DTG 50mg"],
        score: 88,
        efficacy: 92,
        tolerability: 85,
        sideEffects: [
          { name: "Réaction hypersensibilité", probability: 5, severity: "Élevé" },
          { name: "Nausées", probability: 18, severity: "Mineur" },
        ],
        advantages: ["Alternative si insuffisance rénale", "Bonne tolérance rénale"],
        precautions: ["Test HLA-B*5701 obligatoire", "Contre-indiqué si HLA-B*5701 positif"],
      },
      {
        id: 3,
        name: "Ténofovir + Lamivudine + Éfavirenz",
        drugs: ["TDF 300mg", "3TC 300mg", "EFV 600mg"],
        score: 78,
        efficacy: 89,
        tolerability: 72,
        sideEffects: [
          { name: "Troubles neuropsychiatriques", probability: 35, severity: "Modéré" },
          { name: "Rash cutané", probability: 15, severity: "Modéré" },
          { name: "Vertiges", probability: 25, severity: "Mineur" },
        ],
        advantages: ["Schéma économique", "Longue expérience clinique"],
        precautions: ["Effets neuropsychiatriques fréquents", "Prise le soir recommandée"],
      },
    ]);
  };

  const handleValidateProposal = (schemeId: number) => {
    const scheme = proposedSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setSelectedProposal(schemeId);
      const drugMapping: any = {
        "TDF 300mg": "tenofovir",
        "FTC 200mg": "emtricitabine",
        "DTG 50mg": "dolutegravir",
        "ABC 600mg": "abacavir",
        "3TC 300mg": "lamivudine",
        "EFV 600mg": "efavirenz",
      };
      
      const newScheme = { nrti1: "", nrti2: "", nnrti: "", pi: "", insti: "" };
      scheme.drugs.forEach((drug: string) => {
        const medId = drugMapping[drug];
        if (medId) {
          if (["tenofovir", "abacavir", "zidovudine"].includes(medId)) newScheme.nrti1 = medId;
          else if (["emtricitabine", "lamivudine"].includes(medId)) newScheme.nrti2 = medId;
          else if (["efavirenz", "nevirapine", "rilpivirine", "doravirine"].includes(medId)) newScheme.nnrti = medId;
          else if (["lopinavir", "atazanavir", "darunavir"].includes(medId)) newScheme.pi = medId;
          else if (["dolutegravir", "raltegravir", "bictegravir"].includes(medId)) newScheme.insti = medId;
        }
      });
      setArvPrediction({ ...arvPrediction, arvScheme: newScheme });
    }
  };

  const getRiskColor = (level: string) => {
    if (level === "Élevé") return "bg-destructive";
    if (level === "Modéré") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getSeverityColor = (severity: string) => {
    if (severity === "Élevé" || severity === "Majeur") return "text-destructive";
    if (severity === "Modéré") return "text-yellow-600";
    return "text-green-600";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Prédictions ML</h1>
        <p className="text-muted-foreground mt-2">
          Analyse prédictive des effets indésirables basée sur le Machine Learning
        </p>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ml" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Modèle ML
          </TabsTrigger>
          <TabsTrigger value="effets" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Effets Indésirables
          </TabsTrigger>
          <TabsTrigger value="propositions" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Propositions IA
          </TabsTrigger>
        </TabsList>

        {/* Onglet 1: Modèle ML Original */}
        <TabsContent value="ml" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Formulaire - Données du patient */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-5 w-5 text-primary" />
                  Données du patient
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="patientId">Identifiant patient</Label>
                  <Select value={formData.patientId} onValueChange={handlePatientSelect}>
                    <SelectTrigger id="patientId">
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Âge</Label>
                    <Input id="age" type="number" placeholder="45" value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input id="weight" type="number" placeholder="70" value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="arvTreatment">Traitement ARV actuel</Label>
                  <Select value={formData.arvTreatment}
                    onValueChange={(value) => setFormData({ ...formData, arvTreatment: value })}>
                    <SelectTrigger id="arvTreatment">
                      <SelectValue placeholder="Sélectionner le traitement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tritherapie1">Ténofovir + Emtricitabine + Dolutégravir</SelectItem>
                      <SelectItem value="tritherapie2">Abacavir + Lamivudine + Dolutégravir</SelectItem>
                      <SelectItem value="tritherapie3">Ténofovir + Emtricitabine + Éfavirenz</SelectItem>
                      <SelectItem value="bitherapie1">Dolutégravir + Lamivudine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="comorbidities">Comorbidités</Label>
                  <Textarea id="comorbidities" placeholder="Ex: Diabète type 2, Hypertension" rows={2}
                    value={formData.comorbidities}
                    onChange={(e) => setFormData({ ...formData, comorbidities: e.target.value })} />
                </div>

                <div>
                  <Label htmlFor="coPrescriptions">Co-prescriptions</Label>
                  <Textarea id="coPrescriptions" placeholder="Ex: Metformine 1000mg, Amlodipine 10mg" rows={2}
                    value={formData.coPrescriptions}
                    onChange={(e) => setFormData({ ...formData, coPrescriptions: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cd4">CD4 (cells/μL)</Label>
                    <Input id="cd4" type="number" placeholder="450" value={formData.cd4}
                      onChange={(e) => setFormData({ ...formData, cd4: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="viralLoad">Charge virale</Label>
                    <Input id="viralLoad" placeholder="Indétectable" value={formData.viralLoad}
                      onChange={(e) => setFormData({ ...formData, viralLoad: e.target.value })} />
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={handlePredict}>
                  Lancer la prédiction ML
                </Button>
              </CardContent>
            </Card>

            {/* Résultats ML */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Évaluation du risque</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!prediction ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Remplissez le formulaire et lancez la prédiction</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Niveau de risque</span>
                          <Badge className={`${getRiskColor(prediction.riskLevel)} text-white`}>
                            Risque {prediction.riskLevel}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Confiance du modèle</span>
                          <span className="text-sm font-bold">{prediction.confidence}%</span>
                        </div>
                        <Progress value={prediction.confidence} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {prediction && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Effets indésirables prédits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {prediction.adverseEffects.map((effect: any, index: number) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{effect.name}</span>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-medium ${getSeverityColor(effect.severity)}`}>
                                {effect.severity}
                              </span>
                              <span className="text-sm font-bold">{effect.probability}%</span>
                            </div>
                          </div>
                          <Progress value={effect.probability} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Recommandations cliniques
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {prediction.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          {/* Anticipation des complications futures */}
          {prediction && prediction.futureComplications && (
            <div className="mt-8 grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Évolution du score de risque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Score de risque actuel</span>
                      <span className="text-3xl font-bold">{prediction.futureComplications.riskScore}/10</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={prediction.futureComplications.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="risque" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Variables influentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prediction.futureComplications.influentialVariables.map((variable: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{variable.name}</span>
                        <span className="text-sm font-bold text-primary">{variable.impact}%</span>
                      </div>
                      <Progress value={variable.impact} className="h-2" />
                      <p className="text-xs text-muted-foreground">{variable.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparaison patient ↔ cohorte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-2">Patient actuel</p>
                      <p className="text-2xl font-bold">{prediction.futureComplications.cohortComparison.patient}</p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-2">Moyenne cohorte</p>
                      <p className="text-2xl font-bold">{prediction.futureComplications.cohortComparison.cohortAverage}</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={prediction.futureComplications.cohortComparison.cohortData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Simulation "What-If"</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Âge: {whatIfParams.age} ans</Label>
                      <Slider value={[whatIfParams.age]} onValueChange={(v) => setWhatIfParams({ ...whatIfParams, age: v[0] })} min={18} max={80} />
                    </div>
                    <div>
                      <Label>CD4: {whatIfParams.cd4} cells/μL</Label>
                      <Slider value={[whatIfParams.cd4]} onValueChange={(v) => setWhatIfParams({ ...whatIfParams, cd4: v[0] })} min={0} max={1500} step={10} />
                    </div>
                    <div>
                      <Label>Charge virale: {whatIfParams.viralLoad === 0 ? "Indétectable" : `${whatIfParams.viralLoad} copies/mL`}</Label>
                      <Slider value={[whatIfParams.viralLoad]} onValueChange={(v) => setWhatIfParams({ ...whatIfParams, viralLoad: v[0] })} min={0} max={100000} step={1000} />
                    </div>
                  </div>
                  <div className="bg-primary/10 p-6 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">Score de risque simulé</p>
                    <p className="text-4xl font-bold mb-2">
                      {(prediction.futureComplications.riskScore * 
                        (whatIfParams.age > 50 ? 1.15 : 1) *
                        (whatIfParams.cd4 < 200 ? 1.35 : whatIfParams.cd4 < 350 ? 1.15 : 0.9) *
                        (whatIfParams.viralLoad > 1000 ? 1.25 : 0.85)
                      ).toFixed(1)}/10
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Onglet 2: Effets Indésirables (combiné avec modification) */}
        <TabsContent value="effets" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Configuration du schéma ARV */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Choix et modification du schéma ARV
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Le clinicien sélectionne ou modifie le schéma pour prédire les effets indésirables
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sélection du patient */}
                <div>
                  <Label>Patient</Label>
                  <Select value={formData.patientId} onValueChange={handlePatientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.patientId && (
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <span><strong>Âge:</strong> {formData.age}</span>
                      <span><strong>Poids:</strong> {formData.weight} kg</span>
                      <span><strong>CD4:</strong> {formData.cd4}</span>
                      <span><strong>CV:</strong> {formData.viralLoad}</span>
                    </div>
                  </div>
                )}

                {/* Schéma actuel */}
                {formData.patientId && Object.values(arvPrediction.arvScheme).some(v => v) && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-semibold text-sm mb-2">Schéma actuel</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(arvPrediction.arvScheme)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => (
                          <Badge key={key} variant="secondary">{getMedicationName(value)}</Badge>
                        ))}
                    </div>
                  </div>
                )}

                {/* Formulaire de sélection/modification */}
                {formData.patientId && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="font-semibold">Composer/Modifier le schéma</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>NRTI 1</Label>
                        <Select value={arvPrediction.arvScheme.nrti1}
                          onValueChange={(value) => setArvPrediction({ ...arvPrediction, arvScheme: { ...arvPrediction.arvScheme, nrti1: value }})}>
                          <SelectTrigger><SelectValue placeholder="NRTI 1" /></SelectTrigger>
                          <SelectContent>
                            {arvMedications.nrti.map((med) => (
                              <SelectItem key={med.id} value={med.id}>{med.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>NRTI 2</Label>
                        <Select value={arvPrediction.arvScheme.nrti2}
                          onValueChange={(value) => setArvPrediction({ ...arvPrediction, arvScheme: { ...arvPrediction.arvScheme, nrti2: value }})}>
                          <SelectTrigger><SelectValue placeholder="NRTI 2" /></SelectTrigger>
                          <SelectContent>
                            {arvMedications.nrti.map((med) => (
                              <SelectItem key={med.id} value={med.id}>{med.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>NNRTI</Label>
                        <Select value={arvPrediction.arvScheme.nnrti || "none"}
                          onValueChange={(value) => setArvPrediction({ ...arvPrediction, arvScheme: { ...arvPrediction.arvScheme, nnrti: value === "none" ? "" : value }})}>
                          <SelectTrigger><SelectValue placeholder="NNRTI" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucun</SelectItem>
                            {arvMedications.nnrti.map((med) => (
                              <SelectItem key={med.id} value={med.id}>{med.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>IP</Label>
                        <Select value={arvPrediction.arvScheme.pi || "none"}
                          onValueChange={(value) => setArvPrediction({ ...arvPrediction, arvScheme: { ...arvPrediction.arvScheme, pi: value === "none" ? "" : value }})}>
                          <SelectTrigger><SelectValue placeholder="IP" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucun</SelectItem>
                            {arvMedications.pi.map((med) => (
                              <SelectItem key={med.id} value={med.id}>{med.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>INSTI</Label>
                        <Select value={arvPrediction.arvScheme.insti || "none"}
                          onValueChange={(value) => setArvPrediction({ ...arvPrediction, arvScheme: { ...arvPrediction.arvScheme, insti: value === "none" ? "" : value }})}>
                          <SelectTrigger><SelectValue placeholder="INSTI" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucun</SelectItem>
                            {arvMedications.insti.map((med) => (
                              <SelectItem key={med.id} value={med.id}>{med.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleArvPrediction}
                      disabled={!arvPrediction.arvScheme.nrti1 && !arvPrediction.arvScheme.nrti2}>
                      Prédire les effets indésirables
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résultats des effets indésirables */}
            <div className="space-y-6">
              {!arvPredictionResults ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Configurez le schéma ARV et lancez la prédiction</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Effets secondaires prédits par catégorie</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Légende des couleurs */}
                      <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border">
                        <span className="text-sm font-medium text-muted-foreground">Légende gravité:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-green-500"></div>
                          <span className="text-xs">Mineur</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-yellow-500"></div>
                          <span className="text-xs">Modéré</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-red-500"></div>
                          <span className="text-xs">Élevé</span>
                        </div>
                      </div>
                      {(() => {
                        const categories = arvPredictionResults.sideEffects.reduce((acc: any, effect: any) => {
                          if (!acc[effect.category]) acc[effect.category] = [];
                          acc[effect.category].push(effect);
                          return acc;
                        }, {});

                        const categoryIcons: Record<string, string> = {
                          "Gastro-intestinaux": "🫁",
                          "Neurologiques": "🧠",
                          "Généraux": "⚡",
                          "Dermatologiques": "🩹",
                          "Métaboliques": "⚗️",
                          "Hépatiques/Rénaux": "🫘",
                        };

                        return Object.entries(categories).map(([category, effects]: [string, any]) => (
                          <div key={category} className="p-3 rounded-lg border border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <span>{categoryIcons[category]}</span>
                              <h4 className="font-semibold text-sm">{category}</h4>
                              <Badge variant="secondary" className="ml-auto">{effects.length}</Badge>
                            </div>
                            <div className="space-y-2">
                              {effects.map((effect: any, idx: number) => {
                                const severityBg = effect.severity === "Élevé" 
                                  ? "bg-red-500/10 border-l-4 border-l-red-500" 
                                  : effect.severity === "Modéré" 
                                    ? "bg-yellow-500/10 border-l-4 border-l-yellow-500" 
                                    : "bg-green-500/10 border-l-4 border-l-green-500";
                                return (
                                  <div key={idx} className={`flex items-center justify-between text-sm p-2 rounded ${severityBg}`}>
                                    <span className="font-medium">{effect.name}</span>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={getSeverityColor(effect.severity)}>
                                        {effect.severity}
                                      </Badge>
                                      <span className="font-bold">{effect.probability}%</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ));
                      })()}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Efficacité attendue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-primary/10 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Taux de suppression virale</span>
                          <span className="text-2xl font-bold">{arvPredictionResults.efficacy.viralSuppressionRate}%</span>
                        </div>
                        <Progress value={arvPredictionResults.efficacy.viralSuppressionRate} className="h-2" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                          <span>{arvPredictionResults.efficacy.cd4Recovery}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                          <span>{arvPredictionResults.efficacy.adherenceImpact}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Recommandations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {arvPredictionResults.recommendations.map((rec: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Onglet 3: Propositions IA */}
        <TabsContent value="propositions" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Propositions de schémas par l'algorithme
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                L'algorithme propose des schémas optimisés avec leurs effets indésirables prédits. Le clinicien valide la proposition.
              </p>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="flex-1">
                <Label>Patient</Label>
                <Select value={formData.patientId} onValueChange={handlePatientSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerateProposals} size="lg" disabled={!formData.patientId} className="mt-5">
                <Sparkles className="h-4 w-4 mr-2" />
                Générer les propositions
              </Button>
            </CardContent>
          </Card>

          {proposedSchemes.length > 0 && (
            <div className="grid gap-6">
              {proposedSchemes.map((scheme, index) => (
                <Card key={scheme.id} className={`transition-all ${selectedProposal === scheme.id ? 'ring-2 ring-primary border-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getScoreColor(scheme.score)} text-white`}>Score: {scheme.score}/100</Badge>
                          {index === 0 && <Badge variant="outline" className="border-primary text-primary">Recommandé</Badge>}
                          {selectedProposal === scheme.id && <Badge className="bg-green-500 text-white">✓ Validé</Badge>}
                        </div>
                        <CardTitle className="mt-2">{scheme.name}</CardTitle>
                      </div>
                      <Button variant={selectedProposal === scheme.id ? "default" : "outline"} size="sm"
                        onClick={() => handleValidateProposal(scheme.id)}>
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-sm mb-3">💊 Médicaments</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {scheme.drugs.map((drug: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{drug}</Badge>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Efficacité</span>
                            <span className="font-bold">{scheme.efficacy}%</span>
                          </div>
                          <Progress value={scheme.efficacy} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span>Tolérance</span>
                            <span className="font-bold">{scheme.tolerability}%</span>
                          </div>
                          <Progress value={scheme.tolerability} className="h-2" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-3">⚠️ Effets indésirables prédits</h4>
                        <div className="space-y-2">
                          {scheme.sideEffects.map((effect: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span>{effect.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getSeverityColor(effect.severity)}>{effect.severity}</Badge>
                                <span className="font-medium">{effect.probability}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-3">✅ Avantages</h4>
                        <ul className="text-sm space-y-1 mb-4">
                          {scheme.advantages.map((adv: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                              <span>{adv}</span>
                            </li>
                          ))}
                        </ul>
                        <h4 className="font-semibold text-sm mb-2">⚡ Précautions</h4>
                        <ul className="text-sm space-y-1">
                          {scheme.precautions.map((prec: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                              <span>{prec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
