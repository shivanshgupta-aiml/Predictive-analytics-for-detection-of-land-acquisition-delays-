export type RiskLevel = 'low' | 'medium' | 'high';
export type ProjectStage = 'Notification' | 'Social Impact Assessment' | 'Award' | 'Compensation' | 'Possession';

export interface Parcel {
  id: string;
  name: string;
  state: string;
  district: string;
  village: string;
  khasraId: string;
  riskScore: number;
  predictedDelayMonths: number;
  currentStage: ProjectStage;
  causes: string[];
  recommendation: string;
  coordinates: [number, number]; // [lat, lng] mock
}

export const MOCK_PARCELS: Parcel[] = [
  {
    id: 'p1',
    name: 'NH-44 Expansion Sec A',
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Khed',
    khasraId: '142/A/2',
    riskScore: 88,
    predictedDelayMonths: 14,
    currentStage: 'Award',
    causes: ['Title Dispute', 'Multiple Heirs'],
    recommendation: 'Escalate to District Collector for immediate title resolution hearing.',
    coordinates: [18.8475, 73.8900]
  },
  {
    id: 'p2',
    name: 'Metro Line 3 Depot',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    village: 'Aarey',
    khasraId: '55/1/B',
    riskScore: 92,
    predictedDelayMonths: 24,
    currentStage: 'Notification',
    causes: ['Environmental Clearance', 'Litigation'],
    recommendation: 'Fast-track environmental impact mitigation proposal.',
    coordinates: [19.1450, 72.8750]
  },
  {
    id: 'p3',
    name: 'Delhi-Mumbai Expressway L2',
    state: 'Gujarat',
    district: 'Vadodara',
    village: 'Padra',
    khasraId: '210/4',
    riskScore: 45,
    predictedDelayMonths: 3,
    currentStage: 'Compensation',
    causes: ['Valuation Disagreement'],
    recommendation: 'Schedule mediation with local sarpanch and affected families.',
    coordinates: [22.2400, 73.0800]
  },
  {
    id: 'p4',
    name: 'Dedicated Freight Corridor',
    state: 'Gujarat',
    district: 'Surat',
    village: 'Olpad',
    khasraId: '89/2',
    riskScore: 12,
    predictedDelayMonths: 0,
    currentStage: 'Possession',
    causes: [],
    recommendation: 'Proceed with physical possession and fencing.',
    coordinates: [21.3300, 72.7400]
  },
  {
    id: 'p5',
    name: 'Bengaluru Ring Road',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    village: 'Yelahanka',
    khasraId: '34/7/C',
    riskScore: 76,
    predictedDelayMonths: 9,
    currentStage: 'Social Impact Assessment',
    causes: ['R&R Package Rejection', 'Survey Gap'],
    recommendation: 'Deploy secondary survey team to verify structural assets.',
    coordinates: [13.1000, 77.5900]
  },
  {
    id: 'p6',
    name: 'Mysuru Highway Bypass',
    state: 'Karnataka',
    district: 'Mandya',
    village: 'Srirangapatna',
    khasraId: '11/1',
    riskScore: 32,
    predictedDelayMonths: 1,
    currentStage: 'Award',
    causes: ['Document Missing'],
    recommendation: 'Request expedited record retrieval from tehsil office.',
    coordinates: [12.4200, 76.6900]
  },
  {
    id: 'p7',
    name: 'Kochi Metro Ext Phase II',
    state: 'Kerala',
    district: 'Ernakulam',
    village: 'Kakkanad',
    khasraId: '402/B',
    riskScore: 85,
    predictedDelayMonths: 11,
    currentStage: 'Compensation',
    causes: ['Litigation - High Court', 'Commercial Valuation'],
    recommendation: 'Assign specialized legal counsel for next hearing.',
    coordinates: [10.0200, 76.3400]
  },
  {
    id: 'p8',
    name: 'Vizhinjam Port Connectivity',
    state: 'Kerala',
    district: 'Thiruvananthapuram',
    village: 'Vizhinjam',
    khasraId: '77/3/A',
    riskScore: 60,
    predictedDelayMonths: 6,
    currentStage: 'Social Impact Assessment',
    causes: ['Fishermen Community Protest'],
    recommendation: 'Initiate targeted dialogue regarding alternative livelihood package.',
    coordinates: [8.3700, 76.9800]
  },
  {
    id: 'p9',
    name: 'Pune-Nashik Semi High Speed Rail',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Sinnar',
    khasraId: '190/5',
    riskScore: 20,
    predictedDelayMonths: 1,
    currentStage: 'Notification',
    causes: ['Minor Survey Error'],
    recommendation: 'Update coordinate bounds in next gazette publication.',
    coordinates: [19.8400, 73.9900]
  }
];

export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};
