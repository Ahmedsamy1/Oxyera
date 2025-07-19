import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isValidDate', async: false })
export class IsValidDate implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    // Check if the date string matches YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return false;
    }

    // Parse the date and check if it's valid
    const date = new Date(value);
    const [year, month, day] = value.split('-').map(Number);
    
    // Check if the parsed date matches the original input
    // This catches cases like "1997-02-31" which gets converted to "1997-03-03"
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid date in YYYY-MM-DD format`;
  }
} 