export const TOKEN_KEY = '@GICAF_TOKEN';
export const USER_KEY = '@GICAF_USER';

export const isAuthenticated = () => {
	const user = getUser();
	if (user) {
		return user.acessToken !== null;
	}
	return true;
};

export const getUser = () => {
return	{
	"usuario":{
	   "nome":"Usuário Admin",
	   "email":"usuarioAdmin@gmail.com"
	}
 }
};

export const setUser = user => {
	if (user) {
		localStorage.setItem(USER_KEY, user);
	}
};

export const removeUser = () => {
	localStorage.removeItem(USER_KEY);
};
