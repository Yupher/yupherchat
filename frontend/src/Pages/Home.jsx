import { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reset } from "../features/auth/authSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (user) {
      navigate("/chats");
    }
    dispatch(reset());
  }, [isError, user, isSuccess, navigate, dispatch, message]);
  return (
    <Container>
      <Box
        display='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w='100%'
        borderRadius='lg'
        borderWidth='1px'
        m='48px 0 15px 0'
      >
        <Text fontSize='4xl' color='#2c2c2c'>
          Chat App
        </Text>
      </Box>
      <Box
        p={4}
        bg='white'
        w='100%'
        borderRadius='lg'
        borderWidth='1px'
        marginBottom='5rem'
      >
        <Tabs variant='soft-rounded'>
          <TabList mb='1em'>
            <Tab w='50%'>Login</Tab>
            <Tab w='50%'>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
