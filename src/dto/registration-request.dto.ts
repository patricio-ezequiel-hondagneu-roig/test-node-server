/**
 * Data transfer object that describes the body of an registration request.
 *
 * It contains the credentials and personal information entered by the user in an registration form.
 */
 export interface RegistrationRequestDTO {

	/**
	 * The national ID of the user to register.
	 */
	nationalId: string;

	/**
	 * The password of the user to register.
	 */
	password: string;

	/**
	 * The full name of the user to register.
	 */
	fullName: string;

	/**
	 * The nationality of the user to register.
	 */
	nationality: string;

}