import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const bg = useColorModeValue("#f5edff", "gray.700");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    }
  }, [navigate]);

  const handleNavigate = () => {
    if (!user || !user.role) {
      console.warn("User or role missing");
      return;
    }

    const role = user.role.trim().toLowerCase();

    if (role === "admin") navigate("/admin");
    else if (role === "teacher") navigate("/teacher");
    else if (role === "student") navigate("/student");
    else navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <Box
      maxW="xl"
      mx="auto"
      mt={10}
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      bg={bg}
      textAlign="center"
    >
      <VStack spacing={5}>
        <Heading fontSize="2xl">Welcome, {user.name} 👋</Heading>
        <Text fontSize="lg">
          You are logged in as <strong>{user.role.toUpperCase()}</strong>
        </Text>

        <Button colorScheme="teal" onClick={handleNavigate}>
          Go to {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
        </Button>

        <Button variant="outline" colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default HomePage;
