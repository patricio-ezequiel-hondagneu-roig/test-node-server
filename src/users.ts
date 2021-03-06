import { User } from "./interfaces/user.interface";

/**
 * Collection of all of the users registered in the system.
 */
export const users: User[ ] = [
	{
		__id: '1',
		nationalId: '11111111',
		password: 'password',
		fullName: 'User 1',
		nationality: 'Argentina',
	},
	{
		__id: '2',
		nationalId: '22222222',
		password: 'password',
		fullName: 'User 2',
		nationality: 'Uruguay'
	},
];