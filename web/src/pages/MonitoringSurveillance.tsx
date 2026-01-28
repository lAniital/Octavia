import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Eye, ChevronDown, X } from "lucide-react";

// Clinical variables for filtering
const clinicalVariables = [
  { id: "charge_virale", label: "Charge virale", unit: "copies/mL" },
  { id: "cd4", label: "CD4", unit: "cell/µL" },
  { id: "adherence", label: "Adhérence au traitement", unit: "%" },
  { id: "creatinine", label: "Créatinine", unit: "mg/L" },
  { id: "hemoglobine", label: "Hémoglobine", unit: "g/dL" },
  { id: "transaminases", label: "Transaminases (ALAT/ASAT)", unit: "UI/L" },
  { id: "glycemie", label: "Glycémie", unit: "g/L" },
  { id: "imc", label: "IMC", unit: "kg/m²" },
];

type VariableRange = { min: string; max: string };

// Mock data for medical centers
const medicalCenters = [
  { id: "1", name: "Centre Hospitalier Universitaire" },
  { id: "2", name: "Clinique Saint-Joseph" },
  { id: "3", name: "Hôpital Central" },
  { id: "4", name: "Centre Médical du Nord" },
];

// Mock data for patients with center information and clinical values
const patients = [
  {
    id: "1023",
    name: "Marie D.",
    age: 45,
    status: "Actif",
    lastVisit: "2024-01-15",
    medications: 3,
    alerts: 2,
    center: "1",
    clinicalData: {
      charge_virale: 150,
      cd4: 450,
      adherence: 92,
      creatinine: 8,
      hemoglobine: 13.5,
      transaminases: 35,
      glycemie: 0.95,
      imc: 24.5,
    },
  },
  {
    id: "2045",
    name: "Jean P.",
    age: 52,
    status: "Actif",
    lastVisit: "2024-01-14",
    medications: 4,
    alerts: 1,
    center: "1",
    clinicalData: {
      charge_virale: 50,
      cd4: 620,
      adherence: 88,
      creatinine: 11,
      hemoglobine: 14.2,
      transaminases: 28,
      glycemie: 1.1,
      imc: 27.8,
    },
  },
  {
    id: "3067",
    name: "Sophie M.",
    age: 38,
    status: "Suivi",
    lastVisit: "2024-01-10",
    medications: 2,
    alerts: 0,
    center: "2",
    clinicalData: {
      charge_virale: 0,
      cd4: 780,
      adherence: 98,
      creatinine: 7,
      hemoglobine: 12.8,
      transaminases: 22,
      glycemie: 0.88,
      imc: 22.1,
    },
  },
  {
    id: "4089",
    name: "Ahmed K.",
    age: 41,
    status: "Actif",
    lastVisit: "2024-01-12",
    medications: 3,
    alerts: 1,
    center: "2",
    clinicalData: {
      charge_virale: 200,
      cd4: 380,
      adherence: 75,
      creatinine: 12,
      hemoglobine: 11.5,
      transaminases: 45,
      glycemie: 1.25,
      imc: 29.3,
    },
  },
  {
    id: "5012",
    name: "Claire L.",
    age: 35,
    status: "Actif",
    lastVisit: "2024-01-16",
    medications: 2,
    alerts: 0,
    center: "3",
    clinicalData: {
      charge_virale: 0,
      cd4: 850,
      adherence: 95,
      creatinine: 6,
      hemoglobine: 13.1,
      transaminases: 18,
      glycemie: 0.92,
      imc: 21.5,
    },
  },
  {
    id: "6034",
    name: "Thomas B.",
    age: 48,
    status: "Suivi",
    lastVisit: "2024-01-09",
    medications: 5,
    alerts: 3,
    center: "3",
    clinicalData: {
      charge_virale: 500,
      cd4: 280,
      adherence: 65,
      creatinine: 15,
      hemoglobine: 10.8,
      transaminases: 68,
      glycemie: 1.45,
      imc: 31.2,
    },
  },
  {
    id: "7056",
    name: "Fatima H.",
    age: 42,
    status: "Actif",
    lastVisit: "2024-01-13",
    medications: 3,
    alerts: 1,
    center: "4",
    clinicalData: {
      charge_virale: 75,
      cd4: 520,
      adherence: 90,
      creatinine: 9,
      hemoglobine: 12.2,
      transaminases: 32,
      glycemie: 1.02,
      imc: 25.8,
    },
  },
  {
    id: "8078",
    name: "Pierre R.",
    age: 55,
    status: "Actif",
    lastVisit: "2024-01-11",
    medications: 4,
    alerts: 2,
    center: "4",
    clinicalData: {
      charge_virale: 120,
      cd4: 410,
      adherence: 82,
      creatinine: 13,
      hemoglobine: 13.8,
      transaminases: 42,
      glycemie: 1.18,
      imc: 28.1,
    },
  },
];

export default function MonitoringSurveillance() {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState<string>("all");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [variableRanges, setVariableRanges] = useState<Record<string, VariableRange>>({});

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
      return selectedVariables.every((varId) => {
        const range = variableRanges[varId];
        if (!range?.min && !range?.max) return true;

        const value = patient.clinicalData[varId as keyof typeof patient.clinicalData];
        if (value === undefined) return false;

        const min = range.min ? parseFloat(range.min) : -Infinity;
        const max = range.max ? parseFloat(range.max) : Infinity;

        return value >= min && value <= max;
      });
    });
  };

  // Filter patients based on selected center
  const filteredByCenter =
    selectedCenter && selectedCenter !== "all"
      ? patients.filter((patient) => patient.center === selectedCenter)
      : patients;

  // Apply variable filters to center-filtered patients
  const filteredByVariables = filterPatientsByVariables(filteredByCenter);

  // Filter patients for the list view based on search query and selected center
  const filteredPatientsList = filterPatientsByVariables(
    patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.id.includes(searchQuery);
      const matchesCenter = selectedCenter === "all" || patient.center === selectedCenter;
      return matchesSearch && matchesCenter;
    }),
  );

  const canViewProfile = selectedPatient;

  const handleViewProfile = () => {
    if (canViewProfile) {
      navigate(`/patients/${selectedPatient}`);
    }
  };

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
                const isSelected = selectedPatient === patient.id;
                return (
                  <div
                    key={patient.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {patient.name.split(" ")[0][0]}
                        {patient.name.split(" ")[1][0]}
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
                          ID: {patient.id} • {patient.age} ans • Dernière visite: {patient.lastVisit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Show clinical values if variable filters are active */}
                      {hasActiveFilters && (
                        <div className="flex gap-2">
                          {selectedVariables.slice(0, 3).map((varId) => {
                            const variable = clinicalVariables.find((v) => v.id === varId);
                            const value = patient.clinicalData[varId as keyof typeof patient.clinicalData];
                            return (
                              <span key={varId} className="text-xs bg-muted px-2 py-1 rounded">
                                {variable?.label.slice(0, 3)}: {value}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-foreground">{patient.medications}</p>
                          <p className="text-xs text-muted-foreground">Médic.</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-destructive">{patient.alerts}</p>
                          <p className="text-xs text-muted-foreground">Alertes</p>
                        </div>
                      </div>
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patients/${patient.id}`);
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
