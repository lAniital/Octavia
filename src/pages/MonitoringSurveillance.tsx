import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Eye, ChevronDown, X, Loader2 } from "lucide-react";
import { useMedicalCenters, usePatients, useClinicalData } from "@/hooks/usePatients";
import { seedDatabase } from "@/lib/seedData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Clinical variables for filtering
const clinicalVariables = [
  { id: "hemoglobin", label: "Hémoglobine", unit: "g/dL" },
  { id: "leucocytes", label: "Leucocytes", unit: "×10³/µL" },
  { id: "platelets", label: "Plaquettes", unit: "×10³/µL" },
  { id: "creatinine", label: "Créatinine", unit: "µmol/L" },
  { id: "potassium", label: "Potassium", unit: "mmol/L" },
  { id: "sodium", label: "Sodium", unit: "mmol/L" },
  { id: "alt", label: "ALT/ALAT", unit: "UI/L" },
  { id: "glucose", label: "Glycémie", unit: "g/L" },
  { id: "cholesterol", label: "Cholestérol", unit: "g/L" },
];

type VariableRange = { min: string; max: string };

// Hook to get all clinical data for patients
function useAllClinicalData(patientIds: string[]) {
  return useQuery({
    queryKey: ["all-clinical-data", patientIds],
    queryFn: async () => {
      if (patientIds.length === 0) return {};
      
      const { data, error } = await supabase
        .from("clinical_data")
        .select("*")
        .in("patient_id", patientIds)
        .order("recorded_at", { ascending: false });
      
      if (error) throw error;
      
      // Group by patient_id and take most recent
      const grouped: Record<string, typeof data[0]> = {};
      for (const item of data) {
        if (!grouped[item.patient_id]) {
          grouped[item.patient_id] = item;
        }
      }
      return grouped;
    },
    enabled: patientIds.length > 0,
  });
}

export default function MonitoringSurveillance() {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState<string>("all");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [variableRanges, setVariableRanges] = useState<Record<string, VariableRange>>({});
  const [isSeeding, setIsSeeding] = useState(false);

  const { data: medicalCenters = [], isLoading: centersLoading } = useMedicalCenters();
  const { data: patients = [], isLoading: patientsLoading } = usePatients(selectedCenter);
  
  const patientIds = patients.map(p => p.id);
  const { data: clinicalDataMap = {} } = useAllClinicalData(patientIds);

  // Seed database on first load if empty
  useEffect(() => {
    const initData = async () => {
      setIsSeeding(true);
      await seedDatabase();
      setIsSeeding(false);
    };
    initData();
  }, []);

  const toggleVariable = (variableId: string) => {
    setSelectedVariables((prev) =>
      prev.includes(variableId) ? prev.filter((id) => id !== variableId) : [...prev, variableId],
    );
  };

  const updateRange = (variableId: string, field: "min" | "max", value: string) => {
    setVariableRanges((prev) => ({
      ...prev,
      [variableId]: {
        ...prev[variableId],
        [field]: value,
      },
    }));
  };

  const removeVariable = (variableId: string) => {
    setSelectedVariables((prev) => prev.filter((id) => id !== variableId));
    setVariableRanges((prev) => {
      const newRanges = { ...prev };
      delete newRanges[variableId];
      return newRanges;
    });
  };

  // Check if any variable filter has values
  const hasActiveFilters = selectedVariables.some((varId) => {
    const range = variableRanges[varId];
    return range?.min || range?.max;
  });

  // Filter patients based on clinical variables
  const filterPatientsByVariables = (patientList: typeof patients) => {
    if (!hasActiveFilters) return patientList;

    return patientList.filter((patient) => {
      const clinicalData = clinicalDataMap[patient.id];
      if (!clinicalData) return false;

      return selectedVariables.every((varId) => {
        const range = variableRanges[varId];
        if (!range?.min && !range?.max) return true;

        const value = clinicalData[varId as keyof typeof clinicalData];
        if (value === undefined || value === null) return false;

        const min = range.min ? parseFloat(range.min) : -Infinity;
        const max = range.max ? parseFloat(range.max) : Infinity;

        return Number(value) >= min && Number(value) <= max;
      });
    });
  };

  // Filter patients for the list view based on search query
  const filteredPatientsList = filterPatientsByVariables(
    patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.patient_id.includes(searchQuery);
      return matchesSearch;
    }),
  );

  const canViewProfile = selectedPatient;

  const handleViewProfile = () => {
    if (canViewProfile) {
      navigate(`/patients/${selectedPatient}`);
    }
  };

  const isLoading = centersLoading || patientsLoading || isSeeding;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suivi et surveillance</h1>
          <p className="mt-2 text-muted-foreground">Gestion des dossiers patients PVVIH et accès au suivi détaillé</p>
        </div>
      </div>

      {/* Patient Selection & List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Patients ({filteredPatientsList.length})</CardTitle>
          <CardDescription>Filtrez et sélectionnez un patient pour accéder à son dossier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Centre médical selection */}
            <Select
              value={selectedCenter}
              onValueChange={(value) => {
                setSelectedCenter(value);
                setSelectedPatient("");
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tous les centres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les centres</SelectItem>
                {medicalCenters.map((center) => (
                  <SelectItem key={center.id} value={center.id}>
                    {center.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Variables filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Filtre
                  {selectedVariables.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {selectedVariables.length}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3 bg-popover" align="end">
                <div className="space-y-2">
                  {clinicalVariables.map((variable) => {
                    const isSelected = selectedVariables.includes(variable.id);
                    return (
                      <div key={variable.id} className="space-y-2">
                        <div
                          className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => toggleVariable(variable.id)}
                        >
                          <Checkbox
                            id={variable.id}
                            checked={isSelected}
                            onCheckedChange={() => toggleVariable(variable.id)}
                          />
                          <label htmlFor={variable.id} className="text-sm cursor-pointer flex-1">
                            {variable.label}
                          </label>
                          <span className="text-xs text-muted-foreground">{variable.unit}</span>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2 pl-8 pb-2" onClick={(e) => e.stopPropagation()}>
                            <Input
                              type="number"
                              placeholder="Min"
                              className="h-7 w-20 text-xs"
                              value={variableRanges[variable.id]?.min || ""}
                              onChange={(e) => updateRange(variable.id, "min", e.target.value)}
                            />
                            <span className="text-xs text-muted-foreground">à</span>
                            <Input
                              type="number"
                              placeholder="Max"
                              className="h-7 w-20 text-xs"
                              value={variableRanges[variable.id]?.max || ""}
                              onChange={(e) => updateRange(variable.id, "max", e.target.value)}
                            />
                            <span className="text-xs text-muted-foreground">{variable.unit}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active variable filters badges */}
          {selectedVariables.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedVariables.map((variableId) => {
                const variable = clinicalVariables.find((v) => v.id === variableId);
                const range = variableRanges[variableId];
                const rangeText = range?.min || range?.max ? `: ${range?.min || "—"} - ${range?.max || "—"}` : "";
                return (
                  <Badge key={variableId} variant="secondary" className="flex items-center gap-1">
                    {variable?.label}
                    {rangeText}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeVariable(variableId)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Patient List */}
          <div className="space-y-2">
            {filteredPatientsList.length > 0 ? (
              filteredPatientsList.map((patient) => {
                const isSelected = selectedPatient === patient.patient_id;
                const clinicalData = clinicalDataMap[patient.id];
                return (
                  <div
                    key={patient.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPatient(patient.patient_id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {patient.name.split(" ")[0]?.[0] || ""}
                        {patient.name.split(" ")[1]?.[0] || ""}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span 
                            className={`h-2 w-2 rounded-full ${patient.status === "Actif" ? "bg-green-500" : "bg-amber-500"}`}
                            title={patient.status}
                          />
                          <p className="font-medium text-foreground">{patient.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ID: {patient.patient_id} • {patient.age} ans • Dernière visite: {patient.last_visit || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Show clinical values if variable filters are active */}
                      {hasActiveFilters && clinicalData && (
                        <div className="flex gap-2">
                          {selectedVariables.slice(0, 3).map((varId) => {
                            const variable = clinicalVariables.find((v) => v.id === varId);
                            const value = clinicalData[varId as keyof typeof clinicalData];
                            return (
                              <span key={varId} className="text-xs bg-muted px-2 py-1 rounded">
                                {variable?.label.slice(0, 3)}: {value ?? "N/A"}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-foreground">{patient.medication_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Médic.</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-destructive">{patient.alerts_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Alertes</p>
                        </div>
                      </div>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patients/${patient.patient_id}`);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun patient ne correspond aux critères de recherche
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
