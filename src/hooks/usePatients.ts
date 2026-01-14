import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, Enums } from "@/integrations/supabase/types";

export type PatientStatus = Enums<"patient_status">;
export type Patient = Tables<"patients">;
export type MedicalCenter = Tables<"medical_centers">;
export type ClinicalData = Tables<"clinical_data">;
export type PatientInsert = TablesInsert<"patients">;

export function useMedicalCenters() {
  return useQuery({
    queryKey: ["medical-centers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medical_centers")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });
}

export function usePatients(centerId?: string) {
  return useQuery({
    queryKey: ["patients", centerId],
    queryFn: async () => {
      let query = supabase
        .from("patients")
        .select("*")
        .order("name");
      
      if (centerId && centerId !== "all") {
        query = query.eq("assigned_center_id", centerId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}

export function usePatient(patientId: string) {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("patient_id", patientId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!patientId,
  });
}

export function useClinicalData(patientDbId: string) {
  return useQuery({
    queryKey: ["clinical-data", patientDbId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinical_data")
        .select("*")
        .eq("patient_id", patientDbId)
        .order("recorded_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!patientDbId,
  });
}

export function useUpdatePatientStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ patientId, status }: { patientId: string; status: PatientStatus }) => {
      const { data, error } = await supabase
        .from("patients")
        .update({ status })
        .eq("id", patientId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient"] });
    },
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patient: PatientInsert) => {
      const { data, error } = await supabase
        .from("patients")
        .insert(patient)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
