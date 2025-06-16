import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const cardBg = useColorModeValue("brand.teacherCard", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <Box textAlign="center" mt={10}>
        <Heading>Please log in to view your profile.</Heading>
      </Box>
    );
  }

  return (
    <SidebarLayout>
      <Box
        maxW="md"
        mx="auto"
        mt={10}
        p={6}
        bg={cardBg}
        borderRadius="xl"
        boxShadow="md"
        textAlign="center"
      >
        <VStack spacing={4}>
          <Avatar name={user.name} size="xl" />
          <Heading fontSize="2xl" color={textColor}>
            {user.name}
          </Heading>
          <Text fontSize="md" color={textColor}>
            <strong>Role:</strong> {user.role}
          </Text>
          <Text fontSize="md" color={textColor}>
            <strong>Email:</strong> {user.email}
          </Text>
          {user.role === "student" && (
            <Text fontSize="md" color={textColor}>
              <strong>Status:</strong>{" "}
              {user.isApproved ? "✅ Approved" : "⏳ Awaiting Approval"}
            </Text>
          )}

          <Button mt={4} colorScheme="red" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </VStack>
      </Box>
    </SidebarLayout>
  );
};

export default ProfilePage;
