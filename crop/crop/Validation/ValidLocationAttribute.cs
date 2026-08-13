// Validation/ValidLocationAttribute.cs
// Rejects free-text locations that are not in LocationCatalog.

using System.ComponentModel.DataAnnotations;

namespace crop.Validation;

[AttributeUsage(AttributeTargets.Property)]
public sealed class ValidLocationAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext context)
    {
        var location = value as string;

        if (string.IsNullOrWhiteSpace(location))
            return new ValidationResult("Location is required.");

        if (!LocationCatalog.IsValid(location))
            return new ValidationResult(
                $"'{location.Trim()}' is not a recognised district or city. " +
                "Choose one from the supported location list.");

        return ValidationResult.Success;
    }
}
