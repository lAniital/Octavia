import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, AlertTriangle, Info, Activity, Clock, RotateCcw, ArrowRight } from "lucide-react";
import { ResponsiveContainer, Cell, Tooltip, XAxis, YAxis, ScatterChart, Scatter } from "recharts";
const interactions = [
  {
    drug1: "Efavirenz",
    drug2: "Rifampicine",
    severity: "Élevé",
    score: 85,
    description: "Diminution significative de l'efficacité de l'Efavirenz",
    adverseEffects: ["Échec virologique", "Résistance", "Baisse CD4"],
    recommendation: "Ajuster la posologie ou envisager une alternative",
  },
  {
    drug1: "Ténofovir",
    drug2: "Adefovir",
    severity: "Modéré",
    score: 65,
    description: "Risque accru de toxicité rénale",
    adverseEffects: ["Insuffisance rénale", "Tubulopathie", "Syndrome de Fanconi"],
    recommendation: "Surveillance régulière de la fonction rénale",
  },
  {
    drug1: "Ritonavir",
    drug2: "Simvastatine",
    severity: "Élevé",
    score: 90,
    description: "Augmentation du risque de rhabdomyolyse",
    adverseEffects: ["Rhabdomyolyse", "Myopathie", "Élévation CPK"],
    recommendation: "Contre-indication - utiliser une alternative",
  },
  {
    drug1: "Atazanavir",
    drug2: "Oméprazole",
    severity: "Modéré",
    score: 70,
    description: "Réduction de l'absorption de l'Atazanavir",
    adverseEffects: ["Sous-exposition", "Échec thérapeutique"],
    recommendation: "Administrer à 12h d'intervalle ou utiliser une alternative",
  },
];

const heatmapData = [
  { drug1: "Efavirenz", drug2: "Rifampicine", score: 85, x: 0, y: 0 },
  { drug1: "Efavirenz", drug2: "Clarithromycine", score: 60, x: 0, y: 1 },
  { drug1: "Efavirenz", drug2: "Kétoconazole", score: 55, x: 0, y: 2 },
  { drug1: "Ténofovir", drug2: "Adefovir", score: 65, x: 1, y: 0 },
  { drug1: "Ténofovir", drug2: "AINS", score: 50, x: 1, y: 1 },
  { drug1: "Ténofovir", drug2: "Aminosides", score: 70, x: 1, y: 2 },
  { drug1: "Ritonavir", drug2: "Simvastatine", score: 90, x: 2, y: 0 },
  { drug1: "Ritonavir", drug2: "Midazolam", score: 85, x: 2, y: 1 },
  { drug1: "Ritonavir", drug2: "Rifampicine", score: 75, x: 2, y: 2 },
  { drug1: "Atazanavir", drug2: "Oméprazole", score: 70, x: 3, y: 0 },
  { drug1: "Atazanavir", drug2: "Ténofovir", score: 45, x: 3, y: 1 },
  { drug1: "Atazanavir", drug2: "Efavirenz", score: 65, x: 3, y: 2 },
];

const alertHistory = [
  { date: "2024-11-25", patient: "Patient P001", drug1: "Ritonavir", drug2: "Simvastatine", severity: "Élevé", action: "Médicament modifié" },
  { date: "2024-11-24", patient: "Patient P003", drug1: "Efavirenz", drug2: "Rifampicine", severity: "Élevé", action: "Posologie ajustée" },
  { date: "2024-11-23", patient: "Patient P007", drug1: "Ténofovir", drug2: "Adefovir", severity: "Modéré", action: "Surveillance renforcée" },
  { date: "2024-11-22", patient: "Patient P012", drug1: "Atazanavir", drug2: "Oméprazole", severity: "Modéré", action: "Horaire modifié" },
  { date: "2024-11-21", patient: "Patient P005", drug1: "Ritonavir", drug2: "Midazolam", severity: "Élevé", action: "Alternative prescrite" },
];

const getSeverityColor = (score: number) => {
  if (score >= 80) return "hsl(var(--destructive))";
  if (score >= 60) return "hsl(var(--chart-3))";
  return "hsl(var(--chart-4))";
};

// Schémas ARV prédéfinis pour auto-remplissage
const arvSchemes = [
  // Schémas de 1ère ligne OMS
  { 
    id: "TDF_3TC_DTG", 
    name: "TDF + 3TC + DTG", 
    drug1: "Ténofovir", 
    drug2: "Dolutégravir",
    description: "1ère ligne OMS - Schéma préféré adulte"
  },
  { 
    id: "TAF_FTC_DTG", 
    name: "TAF + FTC + DTG", 
    drug1: "Ténofovir Alafénamide", 
    drug2: "Dolutégravir",
    description: "1ère ligne - Meilleur profil rénal"
  },
  { 
    id: "TAF_FTC_BIC", 
    name: "TAF + FTC + BIC (Biktarvy)", 
    drug1: "Ténofovir Alafénamide", 
    drug2: "Bictégravir",
    description: "1ère ligne - Comprimé unique quotidien"
  },
  { 
    id: "TDF_FTC_EFV", 
    name: "TDF + FTC + EFV", 
    drug1: "Ténofovir", 
    drug2: "Efavirenz",
    description: "1ère ligne alternative - Si INSTI indisponible"
  },
  { 
    id: "ABC_3TC_DTG", 
    name: "ABC + 3TC + DTG", 
    drug1: "Abacavir", 
    drug2: "Dolutégravir",
    description: "1ère ligne - Insuffisance rénale (HLA-B*5701 négatif)"
  },
  // Schémas de 2ème ligne
  { 
    id: "AZT_3TC_LPV", 
    name: "AZT + 3TC + LPV/r", 
    drug1: "Zidovudine", 
    drug2: "Lopinavir/Ritonavir",
    description: "2ème ligne - Après échec 1ère ligne INNTI"
  },
  { 
    id: "TDF_3TC_ATV", 
    name: "TDF + 3TC + ATV/r", 
    drug1: "Ténofovir", 
    drug2: "Atazanavir",
    description: "2ème ligne alternative - Une prise par jour"
  },
  { 
    id: "TDF_3TC_DRV", 
    name: "TDF + 3TC + DRV/r", 
    drug1: "Ténofovir", 
    drug2: "Darunavir",
    description: "2ème ligne - Haute barrière génétique"
  },
  { 
    id: "ABC_3TC_LPV", 
    name: "ABC + 3TC + LPV/r", 
    drug1: "Abacavir", 
    drug2: "Lopinavir/Ritonavir",
    description: "2ème ligne - Insuffisance rénale"
  },
  // Schémas de 3ème ligne / Sauvetage
  { 
    id: "DRV_DTG_2NRTI", 
    name: "DRV/r + DTG + 2 INTI", 
    drug1: "Darunavir", 
    drug2: "Dolutégravir",
    description: "3ème ligne - Multiéchec"
  },
  { 
    id: "DRV_RAL", 
    name: "DRV/r + RAL + ETR", 
    drug1: "Darunavir", 
    drug2: "Raltégravir",
    description: "3ème ligne - Schéma de sauvetage"
  },
  // Schémas pédiatriques
  { 
    id: "ABC_3TC_LPV_PED", 
    name: "ABC + 3TC + LPV/r (Pédiatrique)", 
    drug1: "Abacavir", 
    drug2: "Lopinavir/Ritonavir",
    description: "Pédiatrique < 3 ans - Forme sirop"
  },
  { 
    id: "ABC_3TC_DTG_PED", 
    name: "ABC + 3TC + DTG (Pédiatrique)", 
    drug1: "Abacavir", 
    drug2: "Dolutégravir",
    description: "Pédiatrique ≥ 20kg - Comprimés dispersibles"
  },
];

export default function Interactions() {
  const [combinationDrug1, setCombinationDrug1] = useState("");
  const [combinationDrug2, setCombinationDrug2] = useState("");
  const [drugToCheck, setDrugToCheck] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [checkedInteractions, setCheckedInteractions] = useState<any[]>([]);

  // Auto-remplir avec un schéma ARV
  const handleSchemeSelect = (schemeId: string) => {
    const scheme = arvSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setCombinationDrug1(scheme.drug1);
      setCombinationDrug2(scheme.drug2);
      setSelectedScheme(schemeId);
    }
  };

  const handleCheck = () => {
    // Vérifier que les 3 médicaments sont remplis
    if (!combinationDrug1.trim() || !combinationDrug2.trim() || !drugToCheck.trim()) {
      setCheckedInteractions([]);
      return;
    }

    const foundInteractions: any[] = [];
    const medsToCheck = [combinationDrug1, combinationDrug2];
    
    // Vérifier les interactions de chaque médicament de la combinaison avec le médicament à vérifier
    medsToCheck.forEach(med => {
      const found = interactions.find(
        int => (int.drug1.toLowerCase().includes(med.toLowerCase()) && 
                int.drug2.toLowerCase().includes(drugToCheck.toLowerCase())) ||
               (int.drug1.toLowerCase().includes(drugToCheck.toLowerCase()) && 
                int.drug2.toLowerCase().includes(med.toLowerCase()))
      );
      
      if (found) {
        foundInteractions.push(found);
      } else {
        foundInteractions.push({
          drug1: med,
          drug2: drugToCheck,
          severity: "Faible",
          score: 20,
          description: "Aucune interaction majeure détectée",
          adverseEffects: ["Aucun effet indésirable connu"],
          recommendation: "Combinaison sûre - surveillance standard"
        });
      }
    });

    // Vérifier aussi l'interaction entre les 2 médicaments de la combinaison
    const combinationInteraction = interactions.find(
      int => (int.drug1.toLowerCase().includes(combinationDrug1.toLowerCase()) && 
              int.drug2.toLowerCase().includes(combinationDrug2.toLowerCase())) ||
             (int.drug1.toLowerCase().includes(combinationDrug2.toLowerCase()) && 
              int.drug2.toLowerCase().includes(combinationDrug1.toLowerCase()))
    );

    if (combinationInteraction) {
      foundInteractions.unshift({
        ...combinationInteraction,
        isWithinCombination: true
      });
    }
    
    setCheckedInteractions(foundInteractions);
  };

  const handleReset = () => {
    setCombinationDrug1("");
    setCombinationDrug2("");
    setDrugToCheck("");
    setSelectedScheme("");
    setCheckedInteractions([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Interactions médicamenteuses</h1>
        <p className="text-muted-foreground mt-2">
          Prévention des risques liés aux combinaisons thérapeutiques
        </p>
      </div>

      {/* Interaction Checker */}
      <Card>
        <CardHeader>
          <CardTitle>Vérificateur d'interactions</CardTitle>
          <CardDescription>
            Vérifiez les interactions entre une combinaison de 2 médicaments (schéma ARV) et un autre médicament
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection du schéma ARV prédéfini */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Schéma ARV prédéfini (auto-remplissage)
            </label>
            <Select value={selectedScheme} onValueChange={handleSchemeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un schéma ARV..." />
              </SelectTrigger>
              <SelectContent>
                {arvSchemes.map((scheme) => (
                  <SelectItem key={scheme.id} value={scheme.id}>
                    <div className="flex flex-col">
                      <span>{scheme.name}</span>
                      <span className="text-xs text-muted-foreground">{scheme.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4 items-end">
            {/* Combinaison de 2 médicaments */}
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Badge variant="secondary">Combinaison ARV</Badge>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Médicament 1</label>
                  <Input
                    placeholder="Ex: Ténofovir"
                    value={combinationDrug1}
                    onChange={(e) => setCombinationDrug1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Médicament 2</label>
                  <Input
                    placeholder="Ex: Efavirenz"
                    value={combinationDrug2}
                    onChange={(e) => setCombinationDrug2(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Flèche */}
            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* Médicament à vérifier */}
            <div className="space-y-4 p-4 border border-primary/30 rounded-lg bg-primary/5">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Badge>Médicament à vérifier</Badge>
              </h4>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Médicament concomitant</label>
                <Input
                  placeholder="Ex: Rifampicine, Simvastatine..."
                  value={drugToCheck}
                  onChange={(e) => setDrugToCheck(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button 
              onClick={handleCheck} 
              className="flex-1"
              disabled={!combinationDrug1.trim() || !combinationDrug2.trim() || !drugToCheck.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              Vérifier les interactions
            </Button>
          </div>

          {/* Résultats de vérification */}
          {checkedInteractions.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {checkedInteractions.length} interaction{checkedInteractions.length > 1 ? 's' : ''} détectée{checkedInteractions.length > 1 ? 's' : ''}
              </h3>
              
              {checkedInteractions.map((interaction, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg bg-card space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-foreground">
                      {interaction.drug1} + {interaction.drug2}
                    </h4>
                    <Badge
                      variant={interaction.severity === "Élevé" ? "destructive" : interaction.severity === "Modéré" ? "secondary" : "outline"}
                    >
                      {interaction.severity}
                    </Badge>
                  </div>

                  {/* Score d'interaction */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Score d'interaction</span>
                      </div>
                      <span className="text-xl font-bold" style={{ color: getSeverityColor(interaction.score) }}>
                        {interaction.score}/100
                      </span>
                    </div>
                    <Progress 
                      value={interaction.score} 
                      className="h-3"
                      style={{
                        '--progress-background': getSeverityColor(interaction.score)
                      } as any}
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Description</p>
                      <p className="text-sm text-muted-foreground">{interaction.description}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Effets indésirables potentiels</p>
                      <div className="flex flex-wrap gap-2">
                        {interaction.adverseEffects?.map((effect: string, effectIdx: number) => (
                          <Badge key={effectIdx} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Recommandation</p>
                          <p className="text-sm text-muted-foreground">{interaction.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="database">Base de données</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Interactions Database */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Base de données des interactions</CardTitle>
              <CardDescription>
                Interactions connues dans la base OCTAVIA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interactions.map((interaction, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <AlertTriangle
                          className="h-5 w-5 flex-shrink-0"
                          style={{ color: getSeverityColor(interaction.score) }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-foreground">
                              {interaction.drug1} + {interaction.drug2}
                            </p>
                            <Badge
                              variant={
                                interaction.severity === "Élevé" ? "destructive" : "secondary"
                              }
                            >
                              {interaction.severity}
                            </Badge>
                            <span className="text-sm font-medium text-muted-foreground">
                              Score: {interaction.score}/100
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {interaction.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-foreground mb-2">Effets indésirables potentiels</p>
                      <div className="flex flex-wrap gap-1.5">
                        {interaction.adverseEffects.map((effect, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-muted/50 p-3 rounded">
                      <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Recommandation
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {interaction.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heatmap */}
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Heatmap des interactions</CardTitle>
              <CardDescription>
                Visualisation matricielle des scores d'interaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 80 }}>
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      domain={[0, 3]}
                      ticks={[0, 1, 2, 3]}
                      tickFormatter={(value) => {
                        const labels = ["Efavirenz", "Ténofovir", "Ritonavir", "Atazanavir"];
                        return labels[value] || "";
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y"
                      domain={[0, 2]}
                      ticks={[0, 1, 2]}
                      tickFormatter={(value) => {
                        const labels = ["Rifampicine", "Clarithromycine", "Kétoconazole"];
                        return labels[value] || "";
                      }}
                      width={100}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                              <p className="font-semibold text-foreground text-sm">{data.drug1} + {data.drug2}</p>
                              <p className="text-sm text-muted-foreground">Score: {data.score}/100</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter data={heatmapData} shape="square">
                      {heatmapData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getSeverityColor(entry.score)}
                          style={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: getSeverityColor(90) }} />
                  <span className="text-muted-foreground">Élevé (≥80)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: getSeverityColor(70) }} />
                  <span className="text-muted-foreground">Modéré (60-79)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: getSeverityColor(50) }} />
                  <span className="text-muted-foreground">Faible (&lt;60)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique des alertes */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des alertes</CardTitle>
              <CardDescription>
                Suivi des interactions détectées et actions menées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertHistory.map((alert, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{alert.date}</span>
                          <Badge variant="outline" className="text-xs">{alert.patient}</Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <AlertTriangle 
                            className="h-4 w-4"
                            style={{ color: alert.severity === "Élevé" ? "hsl(var(--destructive))" : "hsl(var(--chart-3))" }}
                          />
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{alert.drug1}</span> + <span className="font-medium">{alert.drug2}</span>
                          </p>
                          <Badge variant={alert.severity === "Élevé" ? "destructive" : "secondary"}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Action: </span>
                            {alert.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
