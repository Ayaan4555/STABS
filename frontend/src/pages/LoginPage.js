import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      sessionStorage.removeItem("dashboardReloaded"); // Allow reload
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      bg="#f7fbff"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        rounded="2xl"
        shadow="lg"
        maxW="md"
        w="full"
        textAlign="center"
      >
        <Heading mb={6}>Login</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              width="full"
              bg="purple.500"
              color="white"
              _hover={{ bg: "purple.600" }}
              rounded="full"
            >
              Login
            </Button>
          </VStack>
        </form>

        <Text mt={4}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#7c3aed", fontWeight: "bold" }}>
            Register
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default LoginPage;