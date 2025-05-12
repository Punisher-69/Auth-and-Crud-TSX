import { Form, Input, Button, Checkbox } from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authenticateUser, getUserDetails } from "../services/logInService";
import { AxiosRequestConfig } from "axios";
import { ILoginRequest } from "../models/Auth";
function LogIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(true);
  const [isWrong, setIsWrong] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);

    const payLoad: ILoginRequest = {
      email,
      password,
    };
    try {
      const res = await authenticateUser(payLoad);
      if (res.status === 201) {
        const token = res.data.access_token;
        localStorage.setItem("access_token", JSON.stringify(token));

        const header: AxiosRequestConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        navigate("/dashboard");
        try {
          const res1 = await getUserDetails(header);
          console.log(res1);
          localStorage.setItem("email", JSON.stringify(res1.data.email));
          localStorage.setItem("name", JSON.stringify(res1.data.name));
          if (selected) {
            localStorage.setItem(
              "password",
              JSON.stringify(res1.data.password)
            );
          } else {
            localStorage.removeItem("password");
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
      setIsWrong(true);
      console.log(isWrong);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPath = (): void => {
    if (location.pathname === "/") {
      localStorage.removeItem("access_token");
      const storedEmail = localStorage.getItem("email");
      const storedPassword = localStorage.getItem("password");
      if (storedEmail && storedPassword) {
        setEmail(JSON.parse(storedEmail));
        setPassword(JSON.parse(storedPassword));
      }
    }
  };

  useEffect((): void => {
    checkPath();
  }, [location]);

  return (
    <div className="flex justify-center mt-[15%]">
      <Form
        onSubmit={handleSubmit}
        className="w-full p-10 rounded-md bg-blue-400 max-w-xs flex flex-col gap-4"
      >
        <Input
          isRequired
          errorMessage="Please enter valid email"
          label="Email"
          labelPlacement="outside"
          name="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value), setIsWrong(false);
          }}
          placeholder="Enter (john@mail.com)"
          type="email"
        />

        <Input
          isRequired
          label="Password"
          labelPlacement="outside"
          name="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value), setIsWrong(false);
          }}
          placeholder="Enter (changeme)"
          type="password"
        />
        {isWrong && (
          <p className="text-red-500 text-sm">Email or password is incorrect</p>
        )}
        <Checkbox
          defaultSelected
          onChange={() => setSelected(false)}
          color="primary"
        >
          Remember me
        </Checkbox>
        <div className="flex  gap-2">
          <Button
            spinnerPlacement="end"
            isLoading={isLoading}
            color="primary"
            type="submit"
            spinner={
              <svg
                className="animate-spin h-4 w-4 text-current"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            Log In
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default LogIn;
