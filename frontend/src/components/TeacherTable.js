import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import API from "../api";

const TeacherTable = ({ teachers = [], refreshTeachers }) => {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    department: "",
    subject: "",
  });

  const toast = useToast();
  const token = JSON.parse(localStorage.getItem("user")).token;

  const startEdit = (teacher) => {
    setEditId(teacher._id);
    setEditForm({
      name: teacher.name || "",
      department: teacher.department || "",
      subject: teacher.subject || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: "", department: "", subject: "" });
  };

  const saveEdit = async () => {
    try {
      await API.put(`/admin/teachers/${editId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Teacher updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      cancelEdit();
      refreshTeachers();
    } catch (err) {
      toast({
        title: "Update failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteTeacher = async (id) => {
    try {
      await API.delete(`/admin/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Teacher deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      refreshTeachers();
    } catch (err) {
      toast({
        title: "Delete failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      {teachers.length === 0 ? (
        <Text>No teachers found.</Text>
      ) : (
        teachers.map((teacher) => (
          <Box key={teacher._id} p={3} borderWidth={1} borderRadius="md" w="100%">
            {editId === teacher._id ? (
              <VStack align="stretch" spacing={2}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Department</FormLabel>
                  <Input
                    name="department"
                    value={editForm.department}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, department: e.target.value }))
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Subject</FormLabel>
                  <Input
                    name="subject"
                    value={editForm.subject}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, subject: e.target.value }))
                    }
                  />
                </FormControl>
                <HStack>
                  <Button size="sm" colorScheme="teal" onClick={saveEdit}>
                    Save
                  </Button>
                  <Button size="sm" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <Stack spacing={1}>
                <Text fontWeight="bold">{teacher.name}</Text>
                <Text>Email: {teacher.email}</Text>
                <Text>Department: {teacher.department || "-"}</Text>
                <Text>Subject: {teacher.subject || "-"}</Text>
                <HStack mt={2}>
                  <Button size="sm" colorScheme="blue" onClick={() => startEdit(teacher)}>
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={() => deleteTeacher(teacher._id)}>
                    Delete
                  </Button>
                </HStack>
              </Stack>
            )}
          </Box>
        ))
      )}
    </VStack>
  );
};

export default TeacherTable;