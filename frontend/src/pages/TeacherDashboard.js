import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Select,
  Input,
  Textarea,
  Button,
  HStack,
  useToast,
  useColorModeValue,
  Flex,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  DrawerHeader,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {  FiLogOut } from "react-icons/fi";
import API from "../api";
import SidebarLayout from "../components/SidebarLayout";

const TeacherDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [formData, setFormData] = useState({
    studentId: "",
    date: "",
    time: "",
    message: "",
  });

  const toast = useToast();
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const cardBg = useColorModeValue("#f5edff", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/teacher/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/student/all-students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchStudents();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(
        `/teacher/appointments/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: `Appointment ${status}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchAppointments();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/teacher/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Appointment created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({ studentId: "", date: "", time: "", message: "" });
      fetchAppointments();
      setActiveTab("appointments");
    } catch (err) {
      console.error("Failed to create appointment", err);
    }
  };

  const renderContent = () => {
    if (activeTab === "appointments") {
      return (
        <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="md">
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            My Appointments
          </Text>
          <VStack spacing={4} align="stretch">
            {appointments.length === 0 ? (
              <Text>No appointments yet.</Text>
            ) : (
              appointments.map((appt) => (
                <Box key={appt._id} p={4} borderWidth={1} borderRadius="lg" bg="white">
                  <Text><strong>Student:</strong> {appt.student.name}</Text>
                  <Text><strong>Date:</strong> {appt.date} @ {appt.time}</Text>
                  <Text><strong>Message:</strong> {appt.message}</Text>
                  <Text><strong>Status:</strong> {appt.status}</Text>
                  {appt.status === "pending" && (
                    <HStack mt={2}>
                      <Button size="sm" colorScheme="green" onClick={() => handleStatusChange(appt._id, "approved")}>Approve</Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleStatusChange(appt._id, "cancelled")}>Cancel</Button>
                    </HStack>
                  )}
                </Box>
              ))
            )}
          </VStack>
        </Box>
      );
    } else if (activeTab === "schedule") {
      return (
        <Flex justify="center">
          <Box bg={cardBg} p={8} borderRadius="xl" boxShadow="lg" width="100%" maxW="700px">
            <Text fontSize="xl" fontWeight="bold" mb={6}>Schedule Appointment</Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Select
                  name="studentId"
                  placeholder="Select Student"
                  value={formData.studentId}
                  onChange={handleChange}
                  isRequired
                >
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </Select>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} isRequired />
                <Input type="time" name="time" value={formData.time} onChange={handleChange} isRequired />
                <Textarea placeholder="Enter message/purpose" name="message" value={formData.message} onChange={handleChange} isRequired />
                <Button colorScheme="teal" type="submit" width="full">Book Appointment</Button>
              </VStack>
            </form>
          </Box>
        </Flex>
      );
    }
  };

  const drawerLinks = (
    <VStack align="start" spacing={4} p={4}>
      <Button variant="ghost" onClick={() => { setActiveTab("appointments"); onClose(); }}>My Appointments</Button>
      <Button variant="ghost" onClick={() => { setActiveTab("schedule"); onClose(); }}>Schedule Appointment</Button>
    </VStack>
  );

  if (isMobile) {
    // ✅ Mobile layout with top navbar
    return (
      <Box>
        <Flex justify="space-between" align="center" p={4} bg="brand.sidebar" color="white">
          <IconButton icon={<HamburgerIcon />} onClick={onOpen} aria-label="Open menu" bg='brand.sidebar' color='white' />
          <Text fontWeight="bold" fontSize="lg">STABS</Text>
          <IconButton icon={<FiLogOut />} onClick={logout} variant="ghost" color="white" />
        </Flex>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>{drawerLinks}</DrawerBody>
          </DrawerContent>
        </Drawer>

        <Box p={4}>{renderContent()}</Box>
      </Box>
    );
  }

  // ✅ Desktop layout with sidebar
  return (
    <SidebarLayout setTeacherTab={setActiveTab}>
      <Box>
        <Heading mb={6} fontSize="2xl" textAlign="center">
          Teacher Dashboard
        </Heading>

        {activeTab === "appointments" && (
          <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="md">
            <Text fontSize="lg" fontWeight="semibold" mb={3}>
              My Appointments
            </Text>
            <VStack spacing={4} align="stretch">
              {appointments.length === 0 ? (
                <Text>No appointments yet.</Text>
              ) : (
                appointments.map((appt) => (
                  <Box
                    key={appt._id}
                    p={4}
                    borderWidth={1}
                    borderRadius="lg"
                    bg="white"
                  >
                    <Text>
                      <strong>Student:</strong> {appt.student.name}
                    </Text>
                    <Text>
                      <strong>Date:</strong> {appt.date} @ {appt.time}
                    </Text>
                    <Text>
                      <strong>Message:</strong> {appt.message}
                    </Text>
                    <Text>
                      <strong>Status:</strong> {appt.status}
                    </Text>
                    {appt.status === "pending" && (
                      <HStack mt={2}>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() =>
                            handleStatusChange(appt._id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() =>
                            handleStatusChange(appt._id, "cancelled")
                          }
                        >
                          Cancel
                        </Button>
                      </HStack>
                    )}
                  </Box>
                ))
              )}
            </VStack>
          </Box>
        )}

        {activeTab === "schedule" && (
          <Flex justify="center">
            <Box
              bg={cardBg}
              p={8}
              borderRadius="xl"
              boxShadow="lg"
              width="100%"
              maxW="700px"
            >
              <Text fontSize="xl" fontWeight="bold" mb={6}>
                Schedule Appointment
              </Text>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <Select
                    name="studentId"
                    placeholder="Select Student"
                    value={formData.studentId}
                    onChange={handleChange}
                    isRequired
                  >
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    isRequired
                  />
                  <Input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    isRequired
                  />
                  <Textarea
                    placeholder="Enter message/purpose"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    isRequired
                  />
                  <Button colorScheme="teal" type="submit" width="full">
                    Book Appointment
                  </Button>
                </VStack>
              </form>
            </Box>
          </Flex>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default TeacherDashboard;