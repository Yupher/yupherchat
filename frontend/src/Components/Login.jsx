import { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";

import { login } from "../features/auth/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const onClick = () => setShowPassword(!showPassword);
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData));
  };
  const getGuestCredentials = () => {
    setUserData((prev) => ({
      ...prev,
      email: "guest@chat-app.com",
      password: "12345",
    }));
  };

  const onChange = (e) =>
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          placeholder='Email'
          onChange={onChange}
          name='email'
          value={userData.email}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            onChange={onChange}
            name='password'
            value={userData.password}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h='1.75rem' size='sm' onClick={onClick}>
              {showPassword ? "hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        isLoading={isLoading}
        width='100%'
        colorScheme='blue'
        style={{ marginTop: 15 }}
        onClick={onSubmit}
      >
        {!isLoading ? "Login" : null}
      </Button>
      <Button
        width='100%'
        variant='solid'
        colorScheme='red'
        style={{ marginTop: 15 }}
        onClick={getGuestCredentials}
      >
        Get guest user credentials
      </Button>
    </VStack>
  );
};

export default Login;
