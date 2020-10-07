/**
 * Object that defines the structure of the payload section of the authorization JWT.
 */
export interface AccessTokenPayload {

	/**
	 * The unique ID of the authenticated user.
	 */
	__id: string;

	/**
	 * The national ID of the authenticated user.
	 */
	nationalId: string;

	/**
	 * The full name of the authenticated user.
	 */
	fullName: string;

}