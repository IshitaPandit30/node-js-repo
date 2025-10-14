import { useState } from "react"
import { Link } from "react-router-dom";
import UserRegister from "./services/registerAPI";

export const Register = () => {

    // UserLogin("Ishita", "ish@Ishita.io");

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h2>Login</h2>
            <label>Username</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} />
            <label>password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" onClick={() => UserRegister(username, password)}>register</button>


            <br></br>

             <p>

                Already have an account? Login here.{" "} 
            </p>
            <Link to="/">Login here</Link>
        </div>
    )
}