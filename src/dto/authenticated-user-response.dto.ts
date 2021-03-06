/**
 * Data transfer object that describes the body of the response for an authenticated user request.
 *
 * It contains all the information about the user excepting the password.
 */
 export interface AuthenticatedUserResponseDTO {

	/**
	 * The unique ID of the user.
	 */
	__id: string;

	/**
	 * The national ID of the user.
	 */
	nationalId: string;

	/**
	 * The full name of the user.
	 */
	fullName: string;

	/**
	 * The nationality of the user.
	 */
	nationality: string;
}