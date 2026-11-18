import {IsString, Matches, MaxLength} from 'class-validator';

/** A string with at least one non-whitespace character, up to `maxLength`. */
export function NonBlank(maxLength = 200): PropertyDecorator {
  return (target, key) => {
    IsString()(target, key);
    Matches(/\S/, {message: '$property must not be blank'})(target, key);
    MaxLength(maxLength)(target, key);
  };
}

/** A reference to another record's id. */
export function RefId(): PropertyDecorator {
  return NonBlank(64);
}
