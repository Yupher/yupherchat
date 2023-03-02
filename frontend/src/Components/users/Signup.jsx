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

import { toast } from "react-toastify";
import { register } from "../../features/auth/authSlice";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const encodeImage = (image) => {
    if (!image) {
      setUserData((prev) => ({ ...prev, picture: "" }));
    } else if (image.type.split("/")[0] !== "image") {
      toast.error("File not supported");
      return;
    } else if (image.size / 1024 > 1.5 * 1024) {
      toast.error("File too large");
      return;
    } else {
      const reader = new FileReader();
      reader.onload = (e) =>
        setUserData((prev) => ({ ...prev, picture: reader.result }));
      reader.readAsDataURL(image);
    }
  };
  const onClick = () => setShowPassword(!showPassword);
  const onSubmit = (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      dispatch(register(userData));
    }
  };
  const onChange = (e) =>
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <VStack spacing={"5px"}>
      <FormControl id='name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type='text'
          placeholder='Name'
          onChange={onChange}
          name='name'
          value={userData.name}
        />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          placeholder='Email'
          onChange={onChange}
          name='email'
          value={userData.email}
        />
      </FormControl>
      <FormControl id='password' isRequired>
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
      <FormControl id='confirmPassword' isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder='Confirm password'
            onChange={onChange}
            name='confirmPassword'
            value={userData.confirmPassword}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h='1.75rem' size='sm' onClick={onClick}>
              {showPassword ? "hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='picture'>
        <FormLabel>Picture</FormLabel>
        <Input
          type='file'
          accept='image/*'
          p={1.5}
          onChange={(e) => encodeImage(e.target.files[0])}
        />
      </FormControl>
      <Button
        isLoading={isLoading}
        width='100%'
        colorScheme='blue'
        style={{ marginTop: 15 }}
        onClick={onSubmit}
      >
        {!isLoading ? "Signup" : null}
      </Button>
    </VStack>
  );
};

export default Signup;
