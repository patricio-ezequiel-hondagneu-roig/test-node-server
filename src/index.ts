import express from 'express';
import bearerToken from 'express-bearer-token';
import fs from 'fs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { SERVER_PORT } from './constants/server-port.constant';
import { AuthenticatedUserResponseDTO, AuthenticationRequestDTO, AuthenticationResponseDTO, RegistrationRequestDTO } from './dto';
import { AccessTokenPayload, User } from './interfaces';
import { users } from './users';

const privateKey = fs.readFileSync( './private.key', 'utf-8' );
const publicKey = fs.readFileSync( './public.key', 'utf-8' );

const app = express( );

// Add middlewares to extract the body (as JSON) and JWT token from the incoming requests.
app.use( express.json( ) );
app.use( bearerToken( ) );

/* Endpoint to handle registration requests.
 *
 * It receives the registration data and returns a successful response if the user could be registered, or an error
 * otherwise.
 */
app.post( '/register', async ( req, res ) => {
	// Extract the provided registration data from the request body.
	const registrationData: RegistrationRequestDTO = req.body;

	// Verify whether or not there's an existing user with the same national ID.
	const userAlreadyExists: boolean = users.some( ( user: User ) => user.nationalId === registrationData.nationalId );

	// Set an error response and return if there is an existing user with the same national ID.
	if ( userAlreadyExists ) {
		res
			.status( httpStatus.UNPROCESSABLE_ENTITY )
			.json( `A user already exists with national ID "${ registrationData.nationalId }".`);
	}

	// The ID of the last registered user.
	const lastId = users.slice( -1 )[ 0 ].__id;

	// Store the new user and return a successful response.
	const user: User = {
		__id: lastId + 1,
		nationalId: registrationData.nationalId,
		password: registrationData.password,
		fullName: registrationData.fullName,
		nationality: registrationData.nationality,
	};
	users.push( user );
	res.status( httpStatus.CREATED ).end( );
});

/* Endpoint to handle authentication requests.
 *
 * It receives the user's credentials and returns a JWT if the credentials are valid, or an error otherwise.
 */
app.post( '/authenticate', async ( req, res ) => {
	// Extract the provided credentials from the request body.
	const credentials: AuthenticationRequestDTO = req.body;

	// Retrieve a user for which the credentials match, or undefined if none apply.
	const authenticatedUser: User | undefined = users.find( ( user: User ) => {
		return user.nationalId === credentials.nationalId && user.password === credentials.password;
	});

	// Set an error response and return if the provided credentials match no users.
	if ( authenticatedUser === undefined ) {
		res.status( httpStatus.UNAUTHORIZED ).json( 'Invalid credentials.' );
		return;
	}

	// Create an authorization token with the user's data, and return it in the body of the response.
	const tokenPayload: AccessTokenPayload = {
		__id: authenticatedUser.__id,
		nationalId: authenticatedUser.nationalId,
		fullName: authenticatedUser.fullName,
	};
	const accessToken: string = jwt.sign( tokenPayload, privateKey, {
		algorithm: 'RS256',
		noTimestamp: true,
	});
	const responseDTO: AuthenticationResponseDTO = {
		accessToken: accessToken,
	};
	res.status( httpStatus.OK ).json( responseDTO );
});

/* Endpoint to handle requests for the authenticated user's information.
 *
 * It verifies the presence and validity of the access token and returns the data of the authenticated user.
 *
 * If the verification fails, it returns an error.
 */
app.get( '/authenticated-user', async ( req, res ) => {
	// Extract the access token from the request.
	const accessToken: string | undefined = req.token;

	// Set an error response and return if no access token was provided.
	if ( accessToken === undefined ) {
		res.status( httpStatus.UNAUTHORIZED ).json( 'No access token provided.' );
		return;
	}

	try {
		// Get the authenticated user whose ID matches the one in the access token.
		const tokenPayload: AccessTokenPayload = <AccessTokenPayload> jwt.verify( accessToken, publicKey, {
			algorithms: [ 'RS256' ],
		});
		const authenticatedUser: User | undefined = users.find( ( user ) => user.__id === tokenPayload.__id );

		// Set an error response and return if the user doesn't exist.
		if ( authenticatedUser === undefined ) {
			res.status( httpStatus.NOT_FOUND ).json( 'The user does not exist.' );
			return;
		}

		// Return the authenticated user's information in the body of the response.
		const responseDTO: AuthenticatedUserResponseDTO = {
			__id: authenticatedUser.__id,
			nationalId: authenticatedUser.nationalId,
			fullName: authenticatedUser.fullName,
			nationality: authenticatedUser.nationality,
		};
		res.status( httpStatus.OK ).json( responseDTO );
	}
	// Set an error response and return if the token provided was invalid.
	catch ( error ) {
		res.status( httpStatus.UNAUTHORIZED ).json( 'Invalid token provided.' );
	}
});

/* Start the server and listen on the defined port for incoming requests.
 */
app.listen( SERVER_PORT, ( ) => {
	console.log( `The server is running at http://localhost:${ SERVER_PORT }` );
});