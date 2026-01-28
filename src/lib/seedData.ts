import { supabase } from "@/integrations/supabase/client";

// Données de démonstration pour initialiser la base de données
const mockPatients = [
  {
    patient_id: "1023",
    name: "Marie D.",
    age: 45,
    gender: "Féminin",
    status: "Suivi" as const,
    date_of_birth: "1979-03-15",
    phone: "+33 6 12 34 56 78",
    email: "marie.d@example.com",
    blood_type: "A+",
    allergies: ["Pénicilline"],
    chronic_conditions: ["VIH"],
    current_medications: ["TDF/FTC/EFV"],
    last_visit: "2024-01-15",
    next_visit: "2024-04-15",
    medication_count: 3,
    alerts_count: 2,
  },
  {
    patient_id: "2045",
    name: "Jean P.",
    age: 52,
    gender: "Masculin",
    status: "Actif" as const,
    date_of_birth: "1972-07-22",
    phone: "+33 6 98 76 54 32",
    email: "jean.p@example.com",
    blood_type: "O-",
    allergies: [],
    chronic_conditions: ["VIH", "Hypertension"],
    current_medications: ["TDF/FTC", "DTG", "Amlodipine"],
    last_visit: "2024-01-14",
    medication_count: 4,
    alerts_count: 1,
  },
  {
    patient_id: "3067",
    name: "Sophie M.",
    age: 38,
    gender: "Féminin",
    status: "Suivi" as const,
    date_of_birth: "1986-11-08",
    phone: "+33 6 11 22 33 44",
    email: "sophie.m@example.com",
    blood_type: "B+",
    allergies: ["Sulfamides"],
    chronic_conditions: ["VIH"],
    current_medications: ["ABC/3TC/DTG"],
    last_visit: "2024-01-10",
    medication_count: 2,
    alerts_count: 0,
  },
  {
    patient_id: "4089",
    name: "Ahmed K.",
    age: 41,
    gender: "Masculin",
    status: "Actif" as const,
    date_of_birth: "1983-05-20",
    phone: "+33 6 55 66 77 88",
    email: "ahmed.k@example.com",
    blood_type: "AB+",
    allergies: [],
    chronic_conditions: ["VIH", "Diabète type 2"],
    current_medications: ["TDF/FTC/EFV", "Metformine"],
    last_visit: "2024-01-12",
    medication_count: 3,
    alerts_count: 1,
  },
  {
    patient_id: "5012",
    name: "Claire L.",
    age: 35,
    gender: "Féminin",
    status: "Actif" as const,
    date_of_birth: "1989-02-14",
    phone: "+33 6 99 88 77 66",
    email: "claire.l@example.com",
    blood_type: "A-",
    allergies: ["Aspirine"],
    chronic_conditions: ["VIH"],
    current_medications: ["BIC/FTC/TAF"],
    last_visit: "2024-01-16",
    medication_count: 2,
    alerts_count: 0,
  },
  {
    patient_id: "6034",
    name: "Thomas B.",
    age: 48,
    gender: "Masculin",
    status: "Suivi" as const,
    date_of_birth: "1976-09-30",
    phone: "+33 6 44 33 22 11",
    email: "thomas.b@example.com",
    blood_type: "O+",
    allergies: [],
    chronic_conditions: ["VIH", "Hépatite C"],
    current_medications: ["TDF/FTC/DTG", "Sofosbuvir", "Velpatasvir"],
    last_visit: "2024-01-09",
    medication_count: 5,
    alerts_count: 3,
  },
  {
    patient_id: "7056",
    name: "Fatima H.",
    age: 42,
    gender: "Féminin",
    status: "Actif" as const,
    date_of_birth: "1982-04-18",
    phone: "+33 6 77 88 99 00",
    email: "fatima.h@example.com",
    blood_type: "B-",
    allergies: ["Iode"],
    chronic_conditions: ["VIH"],
    current_medications: ["DRV/c/FTC/TAF"],
    last_visit: "2024-01-13",
    medication_count: 3,
    alerts_count: 1,
  },
  {
    patient_id: "8078",
    name: "Pierre R.",
    age: 55,
    gender: "Masculin",
    status: "Actif" as const,
    date_of_birth: "1969-12-25",
    phone: "+33 6 22 33 44 55",
    email: "pierre.r@example.com",
    blood_type: "AB-",
    allergies: ["Codéine"],
    chronic_conditions: ["VIH", "Insuffisance rénale"],
    current_medications: ["ABC/3TC", "DTG", "Furosémide"],
    last_visit: "2024-01-11",
    medication_count: 4,
    alerts_count: 2,
  },
];

const clinicalDataByPatient: Record<string, {
  hemoglobin: number;
  leucocytes: number;
  platelets: number;
  creatinine: number;
  potassium: number;
  sodium: number;
  alt: number;
  glucose: number;
  cholesterol: number;
}> = {
  "1023": { hemoglobin: 13.5, leucocytes: 6.8, platelets: 245, creatinine: 85, potassium: 4.2, sodium: 140, alt: 35, glucose: 0.95, cholesterol: 1.85 },
  "2045": { hemoglobin: 14.2, leucocytes: 7.2, platelets: 280, creatinine: 110, potassium: 4.5, sodium: 138, alt: 28, glucose: 1.1, cholesterol: 2.1 },
  "3067": { hemoglobin: 12.8, leucocytes: 5.9, platelets: 220, creatinine: 70, potassium: 4.0, sodium: 142, alt: 22, glucose: 0.88, cholesterol: 1.65 },
  "4089": { hemoglobin: 11.5, leucocytes: 8.1, platelets: 195, creatinine: 120, potassium: 4.8, sodium: 136, alt: 45, glucose: 1.25, cholesterol: 2.35 },
  "5012": { hemoglobin: 13.1, leucocytes: 6.2, platelets: 265, creatinine: 60, potassium: 3.9, sodium: 141, alt: 18, glucose: 0.92, cholesterol: 1.72 },
  "6034": { hemoglobin: 10.8, leucocytes: 9.5, platelets: 155, creatinine: 150, potassium: 5.2, sodium: 134, alt: 68, glucose: 1.45, cholesterol: 2.55 },
  "7056": { hemoglobin: 12.2, leucocytes: 6.5, platelets: 235, creatinine: 90, potassium: 4.1, sodium: 139, alt: 32, glucose: 1.02, cholesterol: 1.92 },
  "8078": { hemoglobin: 13.8, leucocytes: 7.8, platelets: 210, creatinine: 130, potassium: 4.6, sodium: 137, alt: 42, glucose: 1.18, cholesterol: 2.28 },
};

export async function seedDatabase() {
  // Check if data already exists
  const { data: existingPatients } = await supabase
    .from("patients")
    .select("id")
    .limit(1);
  
  if (existingPatients && existingPatients.length > 0) {
    console.log("Database already has data, skipping seed");
    return;
  }

  // Get medical centers
  const { data: centers } = await supabase
    .from("medical_centers")
    .select("id");
  
  if (!centers || centers.length === 0) {
    console.error("No medical centers found");
    return;
  }

  // Insert patients with assigned centers
  for (let i = 0; i < mockPatients.length; i++) {
    const patient = mockPatients[i];
    const centerId = centers[i % centers.length].id;
    
    const { data: insertedPatient, error: patientError } = await supabase
      .from("patients")
      .insert({
        ...patient,
        assigned_center_id: centerId,
      })
      .select()
      .single();
    
    if (patientError) {
      console.error("Error inserting patient:", patientError);
      continue;
    }

    // Insert clinical data for this patient
    const clinicalData = clinicalDataByPatient[patient.patient_id];
    if (clinicalData && insertedPatient) {
      const { error: clinicalError } = await supabase
        .from("clinical_data")
        .insert({
          patient_id: insertedPatient.id,
          ...clinicalData,
        });
      
      if (clinicalError) {
        console.error("Error inserting clinical data:", clinicalError);
      }
    }
  }

  console.log("Database seeded successfully");
}
