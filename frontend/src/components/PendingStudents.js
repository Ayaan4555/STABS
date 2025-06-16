import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import API from "../api";

const PendingStudents = () => {
  const [students, setStudents] = useState([]);
  const toast = useToast();

  const fetchStudents = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const res = await API.get("/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveStudent = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      await API.put(`/admin/students/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Student approved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchStudents(); // Refresh list
    } catch (err) {
      toast({
        title: "Failed to approve student",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (!students) return <Spinner />;

  return (
    <VStack align="start" spacing={3}>
      {students.length === 0 ? (
        <Text>No pending students.</Text>
      ) : (
        students.map((student) => (
          <Box key={student._id} p={3} borderWidth={1} borderRadius="md" w="100%">
            <Text><strong>{student.name}</strong> ({student.email})</Text>
            <Button
              colorScheme="teal"
              size="sm"
              mt={2}
              onClick={() => approveStudent(student._id)}
            >
              Approve
            </Button>
          </Box>
        ))
      )}
    </VStack>
  );
};

export default PendingStudents;
