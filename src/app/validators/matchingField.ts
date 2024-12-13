import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function MatchFields(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const compareField = formGroup.get(matchingControlName);
    const fieldToMatch = formGroup.get(controlName);
    // console.log(compareField);


    if (!compareField?.value || !fieldToMatch?.value) {
      return null;
    }

    if (compareField.value !== fieldToMatch.value) {
      fieldToMatch.setErrors({ passwordMismatch: true });
    } else {
      fieldToMatch.setErrors(null);
    }

    return null;
  };
}