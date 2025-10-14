import axios from "axios";


console.log('process.env.REACT_APP_API_ROUTE', process.env.REACT_APP_API_ROUTE);


const UserLogin = async (username, password) => {
    try {
        let response = await axios.post(`${process.env.REACT_APP_API_ROUTE}/login`, {
            username, password
        }
        );
        console.log('response', response?.data);

        return response;

    } catch (err) {
        console.log("error while fetching user", err);

    }
}

export default UserLogin;