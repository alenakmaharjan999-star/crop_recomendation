// Valid locations accepted by the prediction form: the 77 districts of Nepal
// plus a few major cities users commonly type. Keep in sync with
// crop/crop/Validation/LocationCatalog.cs on the backend.
export const VALID_LOCATIONS = [
  'Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke',
  'Bara', 'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitwan', 'Dadeldhura', 'Dailekh',
  'Dang', 'Darchula', 'Dhading', 'Dhankuta', 'Dhanusha', 'Dolakha', 'Dolpa',
  'Doti', 'Gorkha', 'Gulmi', 'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla',
  'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu',
  'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur',
  'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi', 'Nuwakot',
  'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap',
  'Rasuwa', 'Rautahat', 'Rolpa', 'Rukum', 'Rupandehi', 'Salyan', 'Sankhuwasabha',
  'Saptari', 'Sarlahi', 'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu',
  'Sunsari', 'Surkhet', 'Syangja', 'Tanahun', 'Taplejung', 'Terhathum', 'Udayapur',
  // Major cities
  'Biratnagar', 'Birgunj', 'Butwal', 'Dharan', 'Hetauda', 'Janakpur', 'Nepalgunj',
  'Pokhara',
].sort((a, b) => a.localeCompare(b));

const LOOKUP = new Map(VALID_LOCATIONS.map((name) => [name.toLowerCase(), name]));

// Returns the canonical spelling of a location, or null when it is not a known place.
export function normalizeLocation(rawValue) {
  const key = String(rawValue ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
  return LOOKUP.get(key) ?? null;
}

export function validateLocation(rawValue) {
  if (String(rawValue ?? '').trim() === '') return 'Required';
  if (!normalizeLocation(rawValue)) {
    return 'Select a valid district or city from the list';
  }
  return '';
}
