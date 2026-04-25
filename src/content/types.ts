export interface Identity {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  location: string;
  yearsShipping: number;
  status: string;
  contacts: Array<{
    label: 'email' | 'github' | 'linkedin' | 'telegram' | 'facebook';
    href: string;
  }>;
}

export interface NowData {
  building?: { label: string; sub?: string };
  researching?: { label: string; sub?: string };
  reading?: { label: string; sub?: string };
  workingFrom?: { label: string; sub?: string };
}
