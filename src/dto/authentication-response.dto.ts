/**
 * Data transfer object that describes the body of a successful authentication response.
 *
 * It contains the serialized access token the user will need to provide in subsequent requests to the server.
 */
export interface AuthenticationResponseDTO {

	/**
	 * The authorization JWT the user will need to provide to validate their identity in subsequent requests
	 * to the server.
	 */
	accessToken: string;

}