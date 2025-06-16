import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Force reload only once using sessionStorage
    const hasReloaded = sessionStorage.getItem("dashboardReloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("dashboardReloaded", "true");
      window.location.reload(); // This ensures a full page reload
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast({
        title: "Unauthorized",
        description: "Please log in first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.role) {
        setUser(parsedUser);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (err) {
      localStorage.removeItem("user");
      toast({
        title: "Invalid session",
        description: "Please log in again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  const handleGoToDashboard = () => {
    if (!user) return;
    const routeMap = {
      student: "/student",
      teacher: "/teacher",
      admin: "/admin",
    };
    navigate(routeMap[user.role] || "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("dashboardReloaded"); // reset for future login
    navigate("/");
  };

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="#f7fbff"
      >
        <Spinner size="xl" color="purple.500" />
      </Box>
    );
  }

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
        <Heading mb={4}>Welcome, {user.name} 👋</Heading>
        <Text fontSize="lg" mb={2}>
          Role: <strong>{user.role.toUpperCase()}</strong>
        </Text>
        <Text fontSize="md" mb={6}>
          Click below to enter your dashboard.
        </Text>

        <VStack spacing={4}>
          <Button colorScheme="purple" width="full" onClick={handleGoToDashboard}>
            Go to {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            width="full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default DashboardPage;