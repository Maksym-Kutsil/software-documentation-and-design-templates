export interface CrimeRecord {
  id: string;
  caseNumber: string;
  date: string;
  block: string;
  primaryType: string;
  description: string;
  arrest: boolean;
  domestic: boolean;
}
