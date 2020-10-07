import bodyParser from 'body-parser';
import express from 'express';
import bearerToken from 'express-bearer-token';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { AuthenticationRequestDTO } from './dto/authentication-request.dto';
import { AuthenticationResponseDTO } from './dto/authentication-response.dto';
import { AccessTokenPayload } from './interfaces/token-payload.interface';
import { User } from './interfaces/user.interface';
import { users } from './users';
import httpStatus from 'http-status';
import { SERVER_PORT } from './constants/server-port.constant';

const privateKey = fs.readFileSync( './private.key', 'utf-8' );
const publicKey = fs.readFileSync( './public.key', 'utf-8' );

const app = express( );

app.use( bodyParser.json( ) );
app.use( bearerToken( ) );

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

/* Endpoint to handle requests for the authenticated user's data.
 *
 * It verifies the presence and validity of the access token and returns the data of the authenticated user.
 *
 * If the verification fails, it returns an error.
 */
app.get( '/user/me', async ( req, res ) => {
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
		const authenticatedUser = users.find( ( user ) => user.__id === tokenPayload.__id );

		// Set an error response and return if the user doesn't exist.
		if ( authenticatedUser === undefined ) {
			res.status( httpStatus.NOT_FOUND ).json( 'The user does not exist.' );
		}
		// Return the data of the authenticated user in the response.
		else {
			res.status( httpStatus.OK ).json( authenticatedUser );
		}
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