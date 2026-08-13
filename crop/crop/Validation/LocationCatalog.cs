// Validation/LocationCatalog.cs
// Whitelist of locations accepted by the API: the 77 districts of Nepal plus
// major cities. Keep in sync with frontend/src/constants/locations.js.

namespace crop.Validation;

public static class LocationCatalog
{
    public static readonly IReadOnlyList<string> Locations = new[]
    {
        "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke",
        "Bara", "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh",
        "Dang", "Darchula", "Dhading", "Dhankuta", "Dhanusha", "Dolakha", "Dolpa",
        "Doti", "Gorkha", "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla",
        "Kailali", "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu",
        "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung", "Mahottari", "Makwanpur",
        "Manang", "Morang", "Mugu", "Mustang", "Myagdi", "Nawalparasi", "Nuwakot",
        "Okhaldhunga", "Palpa", "Panchthar", "Parbat", "Parsa", "Pyuthan", "Ramechhap",
        "Rasuwa", "Rautahat", "Rolpa", "Rukum", "Rupandehi", "Salyan", "Sankhuwasabha",
        "Saptari", "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu",
        "Sunsari", "Surkhet", "Syangja", "Tanahun", "Taplejung", "Terhathum", "Udayapur",
        "Biratnagar", "Birgunj", "Butwal", "Dharan", "Hetauda", "Janakpur", "Nepalgunj",
        "Pokhara"
    };

    private static readonly Dictionary<string, string> Lookup =
        Locations.ToDictionary(name => name, name => name, StringComparer.OrdinalIgnoreCase);

    public static bool IsValid(string? location) => TryNormalize(location, out _);

    // Trims and collapses whitespace, then maps the value to its canonical spelling.
    public static bool TryNormalize(string? location, out string normalized)
    {
        normalized = string.Empty;
        if (string.IsNullOrWhiteSpace(location))
            return false;

        var candidate = string.Join(' ', location.Split(
            (char[]?)null, StringSplitOptions.RemoveEmptyEntries));

        if (!Lookup.TryGetValue(candidate, out var canonical))
            return false;

        normalized = canonical;
        return true;
    }
}
