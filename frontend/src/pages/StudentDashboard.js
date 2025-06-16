import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
  useToast,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
  DrawerHeader,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {  FiLogOut } from "react-icons/fi";
import API from "../api";
import SidebarLayout from "../components/SidebarLayout";

const StudentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [formData, setFormData] = useState({
    teacherId: "",
    date: "",
    time: "",
    message: "",
  });

  const toast = useToast();
  const cardBg = useColorModeValue("#e6f7ff", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchAppointments = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await API.get("/student/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await API.get("/student/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
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
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      await API.post("/student/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Appointment booked successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setFormData({ teacherId: "", date: "", time: "", message: "" });
      fetchAppointments();
      setActiveTab("appointments");
    } catch (err) {
      console.error("Booking error:", err);
      toast({
        title: "Error booking appointment",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchAppointments();
    fetchTeachers();
  }, []);

  const renderTabs = (closeAfterClick = false) => (
    <VStack align="start" spacing={3} p={4}>
      <Button variant="ghost" onClick={() => { setActiveTab("appointments"); closeAfterClick && onClose(); }}>
        My Appointments
      </Button>
      <Button variant="ghost" onClick={() => { setActiveTab("book"); closeAfterClick && onClose(); }}>
        Book Appointment
      </Button>
    </VStack>
  );

  const content = (
    <Box p={4}>
      <Heading mb={6} fontSize="2xl" textAlign="center">Student Dashboard</Heading>

      {activeTab === "appointments" && (
        <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="md">
          <Text fontSize="lg" fontWeight="semibold" mb={3}>My Appointments</Text>
          <VStack spacing={4} align="stretch">
            {appointments.length === 0 ? (
              <Text>No appointments yet.</Text>
            ) : (
              appointments.map((appt) => (
                <Box key={appt._id} p={3} borderWidth={1} borderRadius="lg" bg="white">
                  <Text><strong>Teacher:</strong> {appt.teacher.name}</Text>
                  <Text><strong>Date:</strong> {appt.date} @ {appt.time}</Text>
                  <Text><strong>Message:</strong> {appt.message}</Text>
                  <Text><strong>Status:</strong> {appt.status}</Text>
                </Box>
              ))
            )}
          </VStack>
        </Box>
      )}

      {activeTab === "book" && (
        <Flex justify="center">
          <Box bg={cardBg} p={8} borderRadius="xl" boxShadow="lg" width="100%" maxW="800px">
            <Text fontSize="xl" fontWeight="bold" mb={6}>Book Appointment</Text>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <Select
                    name="teacherId"
                    placeholder="Select Teacher"
                    value={formData.teacherId}
                    onChange={handleChange}
                    bg="white"
                  >
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name} - {teacher.subject}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <Input
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    bg="white"
                  />
                </FormControl>

                <FormControl isRequired>
                  <Textarea
                    name="message"
                    placeholder="Enter message"
                    value={formData.message}
                    onChange={handleChange}
                    bg="white"
                  />
                </FormControl>

                <Button type="submit" width="100%" colorScheme="teal" mt={4} size="lg">
                  Book Appointment
                </Button>
              </VStack>
            </form>
          </Box>
        </Flex>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <>
        {/* Top Navbar for mobile */}
        <Flex align="center" justify="space-between" px={4} py={3} boxShadow="md" bg='brand.sidebar' color='white'>
          <IconButton icon={<HamburgerIcon />} onClick={onOpen} aria-label="Open menu" background='brand.sidebar' color='white'/>
          <Text fontSize="lg" fontWeight="bold">STABS</Text>
          <IconButton icon={<FiLogOut />} onClick={handleLogout} variant="ghost" color="white" />
        </Flex>

        {/* Drawer menu */}
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
             <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>{renderTabs(true)}</DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content */}
        {content}
      </>
    );
  }

  return (
    <SidebarLayout setStudentTab={setActiveTab}>
      <Box>
        <Heading mb={6} fontSize="2xl" textAlign="center">
          Student Dashboard
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
                    p={3}
                    borderWidth={1}
                    borderRadius="lg"
                    bg="white"
                  >
                    <Text><strong>Teacher:</strong> {appt.teacher.name}</Text>
                    <Text><strong>Date:</strong> {appt.date} @ {appt.time}</Text>
                    <Text><strong>Message:</strong> {appt.message}</Text>
                    <Text><strong>Status:</strong> {appt.status}</Text>
                  </Box>
                ))
              )}
            </VStack>
          </Box>
        )}

        {activeTab === "book" && (
          <Flex justify="center">
            <Box bg={cardBg} p={8} borderRadius="xl" boxShadow="lg" width="100%" maxW="800px">
              <Text fontSize="xl" fontWeight="bold" mb={6}>Book Appointment</Text>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <Select
                      name="teacherId"
                      placeholder="Select Teacher"
                      value={formData.teacherId}
                      onChange={handleChange}
                      bg="white"
                    >
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name} - {teacher.subject}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <Input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      bg="white"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <Input
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      bg="white"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <Textarea
                      name="message"
                      placeholder="Enter message"
                      value={formData.message}
                      onChange={handleChange}
                      bg="white"
                    />
                  </FormControl>

                  <Button type="submit" width="100%" colorScheme="teal" mt={4} size="lg">
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

export default StudentDashboard;