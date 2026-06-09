/**
 * Beneficiary record
 */

export interface Beneficiary {
  id: string;
  beneficiary_code: string;

  first_name: string;
  last_name?: string;

  gender?: string;

  phone?: string;

  region?: string;
  zone?: string;
  woreda?: string;

  address?: string;

  emergency_contact?: string;

  created_at: string;
}