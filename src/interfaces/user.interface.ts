/**
 * Entity that represents a user of the system.
 */
export interface User {

	/**
	 * The uniquer ID of the user.
	 */
	__id: string;

	/**
	 * The national ID of the user.
	 */
	nationalId: string;

	/**
	 * The password of the user.
	 */
	password: string;

	/**
	 * The full name of the user.
	 */
	fullName: string;

}