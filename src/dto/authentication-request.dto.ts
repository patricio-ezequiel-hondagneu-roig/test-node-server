/**
 * Data transfer object that describes the body of an authentication request.
 *
 * It contains the credentials entered by the user in an authentication form.
 */
export interface AuthenticationRequestDTO {

	/**
	 * The national ID entered by the user attempting to authenticate.
	 */
	nationalId: string;

	/**
	 * The password entered by the user attempting to authenticate.
	 */
	password: string;

}