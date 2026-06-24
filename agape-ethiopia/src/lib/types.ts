export type Beneficiary = {
  id: string;
  registration_number?: string;
  registration_date?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  region?: string;
  kifle_ketema?: string;
  kebele?: string;
  house_number?: string;
  photo_url?: string;
  notes?: string;
};

export type Assessment = {
  id?: string;
  beneficiary_id: string;
  hip_width?: string;
  seat_depth?: string;
  back_height?: string;
  recommended_equipment?: string;
  recommended_size?: string;
  assessor_name?: string;
  assessment_date?: string;
  notes?: string;
};

export type EquipmentDistribution = {
  id?: string;
  beneficiary_id: string;
  equipment_type: string;
  equipment_size?: string;
  distribution_date?: string;
  distribution_location?: string;
  received_by?: string;
  signature_confirmed?: boolean;
  notes?: string;
};
