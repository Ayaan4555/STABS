import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Select,
  useToast,
  Text,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      const userRole = res.data.role;
      const isApproved = res.data.isApproved;

      toast({
        title: "Registration successful",
        description:
          userRole === "student" && !isApproved
            ? "Wait for admin approval before logging in."
            : "You are now logged in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Something went wrong",
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
      >
        <Heading textAlign="center" mb={6} fontSize="2xl">
          Register
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </Select>
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              width="full"
              mt={2}
              rounded="full"
            >
              Register
            </Button>
          </VStack>
        </form>

        <Text mt={4} textAlign="center">
          Already have an account?{" "}
          <Link color="purple.500" href="/login" fontWeight="bold">
            Login
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default RegisterPage;