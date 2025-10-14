import { useEffect, useState } from "react"
import UserLogin from "./services/loginAPI"
import { Link } from "react-router-dom";
import GetUserList from "./services/userList";

export const Login = () => {

    // UserLogin("Ishita", "ish@Ishita.io");

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState();

    const loginHandler = async () => {
        let data = await UserLogin(username, password);

        await setResponse(data);
    }

    useEffect(()=>{
        console.log('response123', response?.data);

        GetUserList(response?.data?.token);
        
    }, [response])

    return (
        <div>
            <h2>Login</h2>
            <label>Username</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} />
            <label>password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" onClick={() => loginHandler()}>login</button>


            <br></br>

            <p>

                Don't have an account?{" "}
            </p>
            <Link to="/register">Register here</Link>
        </div>
    )
}