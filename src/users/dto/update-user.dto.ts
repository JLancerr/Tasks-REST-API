// dto/update-user.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * Payload data required to update a user's profile settings.
 */
export class UpdateUserDto {
  /** The new unique email address for the user account. (Optional) */
  @IsOptional()
  @IsEmail()
  email?: string;

  /** The display name of the user. (Optional) */
  @IsOptional()
  @IsString()
  name?: string;

  /** The user's current password. Required if changing to a new password. */
  @IsOptional()
  @IsString()
  oldPassword?: string;

  /** The new password string to hash and update. */
  @IsOptional()
  @IsString()
  newPassword?: string;
}