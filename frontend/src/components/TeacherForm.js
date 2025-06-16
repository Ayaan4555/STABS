import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import API from "../api";

const TeacherForm = ({ onTeacherAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    subject: "",
  });

  const cardBg = useColorModeValue("#f5edff", "gray.700");

  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      await API.post("/admin/teachers", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Teacher added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
        subject: "",
      });

      // Refresh teacher list
      if (typeof onTeacherAdded === "function") {
        onTeacherAdded();
      }
    } catch (err) {
      toast({
        title: "Failed to add teacher",
        description: err.response?.data?.message || "Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg={cardBg}
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      maxW="lg"
      mx="auto"
      w="100%"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Add New Teacher
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={5}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              bg="white"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              bg="white"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              bg="white"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Department</FormLabel>
            <Input
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              bg="white"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Subject</FormLabel>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Data Structures"
              bg="white"
            />
          </FormControl>

          <Button colorScheme="teal" type="submit" size="lg" width="full" mt={4}>
            Add Teacher
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TeacherForm;