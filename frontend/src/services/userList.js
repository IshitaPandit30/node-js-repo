import axios from "axios";

const GetUserList = async (token) => {
    console.log('I am here', token);
    
    try {
        let response = await axios.get(`${process.env.REACT_APP_API_ROUTE}/getusers`,
        {
        headers: {
          "Content-Type": "application/json", // usually required for JSON body
          "Custom-Header": "MyCustomValue",   // any custom header
          "Authorization": `Bearer ${token}`, // optional auth token
        }
        },
        );
        console.log('response', response?.data);

        return response;

    } catch (err) {
        console.log("error while fetching user", err);

    }
}

export default GetUserList;