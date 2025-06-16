import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  useToast,
  VStack,
  useBreakpointValue,
  useColorModeValue,
  DrawerHeader,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import {  FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import API from "../api";
import SidebarLayout from "../components/SidebarLayout";
import PendingStudents from "../components/PendingStudents";
import TeacherTable from "../components/TeacherTable";
import TeacherForm from "../components/TeacherForm";

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const cardBg = useColorModeValue("#f5edff", "gray.700");

  const fetchTeachers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await API.get("/admin/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  const renderTabs = (closeAfterClick = false) => (
    <VStack align="start" spacing={3} p={4}>
      <Button variant="ghost" onClick={() => { setActiveTab("pending"); closeAfterClick && onClose(); }}>
        Pending Approvals
      </Button>
      <Button variant="ghost" onClick={() => { setActiveTab("add"); closeAfterClick && onClose(); }}>
        Add Teachers
      </Button>
      <Button variant="ghost" onClick={() => { setActiveTab("manage"); closeAfterClick && onClose(); }}>
        Manage Teachers
      </Button>
    </VStack>
  );

  const content = (
    <Box p={4}>
      <Heading mb={6} fontSize="2xl" textAlign="center">Admin Dashboard</Heading>

      {activeTab === "pending" && (
        <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="md">
          <Text fontSize="lg" fontWeight="semibold" mb={3}>Pending Student Approvals</Text>
          <PendingStudents />
        </Box>
      )}

      {activeTab === "add" && (
        <Flex justify="center">
          <TeacherForm onTeacherAdded={fetchTeachers} />
        </Flex>
      )}

      {activeTab === "manage" && (
        <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="md">
          <Text fontSize="lg" fontWeight="semibold" mb={3}>Manage Teachers</Text>
          <TeacherTable teachers={teachers} refreshTeachers={fetchTeachers} />
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <>
        {/* Top Navbar */}
        <Flex
          align="center"
          justify="space-between"
          px={4}
          py={3}
          boxShadow="md"
          bg='brand.sidebar'
          color='white'
        >
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            aria-label="Open menu"
            background='brand.sidebar'
            color='white'
          />
          <Text fontSize="lg" fontWeight="bold">STABS</Text>
          <IconButton icon={<FiLogOut />} onClick={handleLogout} variant="ghost" color="white" />
        </Flex>

        {/* Drawer menu for mobile */}
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
    <SidebarLayout setAdminTab={setActiveTab}>
       <Box>
        <Heading mb={6} fontSize="2xl" textAlign="center">Admin Dashboard</Heading>

        {activeTab === "pending" && (
          <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="md">
            <Text fontSize="lg" fontWeight="semibold" mb={3}>Pending Student Approvals</Text>
            <PendingStudents />
          </Box>
        )}

        {activeTab === "add" && (
          <Flex justify="center">
            
                   <TeacherForm   onTeacherAdded={fetchTeachers}/>
           
          </Flex>
        )}

        {activeTab === "manage" && (
          <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="md">
            <Text fontSize="lg" fontWeight="semibold" mb={3}>Manage Teachers</Text>
            <TeacherTable teachers={teachers} refreshTeachers={fetchTeachers} />
          </Box>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default AdminDashboard;