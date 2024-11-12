/* eslint-disable @typescript-eslint/no-explicit-any */
import TextField from "@mui/material/TextField";
import Logo from "/forums-high-resolution-logo-transparent.svg";
import Button from "@mui/material/Button";
import client from "../lib/feathersClient";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../contexts/AppContext";

const Auth = () => {
    useEffect(() => {
        reAuthenticate();
    }, []);
    const reAuthenticate = async () => {
        try {
            const token = localStorage.getItem("feathers-jwt");
            if (token) {
                // Authenticate using an existing token
                const response = await client.reAuthenticate();
                ctx?.onSetShowAuth(false);
                ctx?.onSetLoggedInUser(response.user);
            }
        } catch (err: any) {
            ctx?.onNotif(`Reauthentication failed with: ${err}`);
        }
    };
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const ctx = useContext(AppContext);
    const loginWithEmailPwd = async (e?: any) => {
        try {
            e?.preventDefault();
            const response = await client.authenticate({
                strategy: "local",
                email: formData.email,
                password: formData.password,
            });
            
            localStorage.setItem("feathers-jwt", response.accessToken);
            ctx?.onSetShowAuth(false);
            ctx?.onSetLoggedInUser(response.user);
        } catch (err: any) {
            ctx?.onNotif(`Login failed with: ${err}`);
        }
    };

    const signup = async (e: any) => {
        try {
            e.preventDefault();
            await client.service("users").create({
                email: formData.email,
                password: formData.password,
            });

            await loginWithEmailPwd();
        } catch (err: any) {
            ctx?.onNotif(`Signup failed with: ${err}`);
        }
    };

    const loginWithGithub = async (e: any) => {
        try {
            e.preventDefault();
            // Add logic to login with Github
            window.location.href = `${process.env.REACT_APP_API_BASE_URL}/oauth/github`;
        } catch (err: any) {
            ctx?.onNotif(`Login with Github failed with: ${err}`);
        }
    };

    return (
        <form className="p-8 flex flex-col gap-8 md:max-w-xl md:mx-auto">
            <img src={Logo} width={150} height={150} className="mx-auto my-8" />
            <TextField
                onChange={handleChange}
                id="email"
                name="email"
                label="email"
                variant="outlined"
                fullWidth
                autoComplete="true"
            />
            <TextField
                onChange={handleChange}
                type="password"
                name="password"
                id="password"
                label="password"
                variant="outlined"
                fullWidth
                autoComplete="true"
            />
            <Button
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                onClick={(e) => loginWithEmailPwd(e)}
            >
                LOGIN
            </Button>
            <Button
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                onClick={(e) => signup(e)}
            >
                SIGNUP
            </Button>
            <Button
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                onClick={(e) => loginWithGithub(e)}
            >
                LOGIN WITH GITHUB
            </Button>
        </form>
    );
};

export default Auth;
