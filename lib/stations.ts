export interface Station {
  code: string;
  name: string;
  city: string;
}

export const STATIONS: Station[] = [
  { code: 'CSTM', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai' },
  { code: 'TNA', name: 'Thane', city: 'Thane' },
  { code: 'PNVL', name: 'Panvel', city: 'Panvel' },
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi' },
  { code: 'DLI', name: 'Old Delhi', city: 'Delhi' },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata' },
  { code: 'KOAA', name: 'Kolkata', city: 'Kolkata' },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata' },
  { code: 'SHM', name: 'Kolkata Shalimar', city: 'Kolkata' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai' },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai' },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bangalore' },
  { code: 'YPR', name: 'Yesvantpur Junction', city: 'Bangalore' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna' },
  { code: 'RJPB', name: 'Rajendra Nagar Patna', city: 'Patna' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune' },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad' },
  { code: 'ST', name: 'Surat', city: 'Surat' },
  { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur' },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra' },
  { code: 'AF', name: 'Agra Fort', city: 'Agra' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal' },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur' },
  { code: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam' },
  { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada' },
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi' },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram' },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore' },
  { code: 'MDU', name: 'Madurai Junction', city: 'Madurai' },
  { code: 'INDB', name: 'Indore Junction', city: 'Indore' },
  { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior' },
  { code: 'JHS', name: 'Jhansi Junction', city: 'Jhansi' },
  { code: 'ALD', name: 'Prayagraj Junction', city: 'Prayagraj' },
  { code: 'DDN', name: 'Dehradun', city: 'Dehradun' },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar' },
  { code: 'CDG', name: 'Chandigarh', city: 'Chandigarh' },
  { code: 'LDH', name: 'Ludhiana Junction', city: 'Ludhiana' },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu' },
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati' },
  { code: 'DBRG', name: 'Dibrugarh', city: 'Dibrugarh' },
  { code: 'RNC', name: 'Ranchi Junction', city: 'Ranchi' },
  { code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad' },
  { code: 'TATA', name: 'Tatanagar Junction', city: 'Jamshedpur' },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar' },
  { code: 'PURI', name: 'Puri', city: 'Puri' },
  { code: 'R', name: 'Raipur Junction', city: 'Raipur' },
  { code: 'BSP', name: 'Bilaspur Junction', city: 'Bilaspur' },
  { code: 'KGP', name: 'Kharagpur Junction', city: 'Kharagpur' },
  { code: 'MFP', name: 'Muzaffarpur Junction', city: 'Muzaffarpur' },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur' },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi' },
  { code: 'MGS', name: 'Mughal Sarai Junction', city: 'Pt. Deen Dayal Upadhyaya' },
  { code: 'TPTY', name: 'Tirupati', city: 'Tirupati' },
  { code: 'UBL', name: 'Hubli Junction', city: 'Hubli' },
  { code: 'GTL', name: 'Guntakal Junction', city: 'Guntakal' },
  { code: 'AWB', name: 'Aurangabad', city: 'Aurangabad' },
  { code: 'NSK', name: 'Nashik Road', city: 'Nashik' },
];

export function searchStations(query: string): Station[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q),
  ).slice(0, 8);
}
