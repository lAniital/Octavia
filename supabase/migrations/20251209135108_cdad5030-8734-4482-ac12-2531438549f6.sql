-- Create enum for patient status
CREATE TYPE public.patient_status AS ENUM ('Actif', 'Suivi', 'Inactif', 'Transféré');

-- Create medical centers table
CREATE TABLE public.medical_centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  status patient_status NOT NULL DEFAULT 'Actif',
  date_of_birth DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  blood_type TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  current_medications TEXT[],
  medical_history JSONB,
  assigned_center_id UUID REFERENCES public.medical_centers(id),
  last_visit DATE,
  next_visit DATE,
  medication_count INTEGER DEFAULT 0,
  alerts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clinical data table
CREATE TABLE public.clinical_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  hemoglobin DECIMAL,
  leucocytes DECIMAL,
  platelets DECIMAL,
  creatinine DECIMAL,
  potassium DECIMAL,
  sodium DECIMAL,
  alt DECIMAL,
  glucose DECIMAL,
  cholesterol DECIMAL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visits table
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.medical_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Create public read policies (for now, can be restricted later with auth)
CREATE POLICY "Allow public read on medical_centers" ON public.medical_centers FOR SELECT USING (true);
CREATE POLICY "Allow public read on patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow public read on clinical_data" ON public.clinical_data FOR SELECT USING (true);
CREATE POLICY "Allow public read on visits" ON public.visits FOR SELECT USING (true);

-- Create public write policies (for now, can be restricted later with auth)
CREATE POLICY "Allow public insert on patients" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on patients" ON public.patients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on patients" ON public.patients FOR DELETE USING (true);

CREATE POLICY "Allow public insert on clinical_data" ON public.clinical_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on clinical_data" ON public.clinical_data FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on visits" ON public.visits FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on medical_centers" ON public.medical_centers FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default medical centers
INSERT INTO public.medical_centers (name) VALUES 
  ('Hôpital Central'),
  ('Clinique Saint-Jean'),
  ('Centre Médical Nord'),
  ('Hôpital Universitaire');