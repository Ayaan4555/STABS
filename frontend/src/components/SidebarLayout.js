import {
  Box,
  Icon,
  Text,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiUserPlus,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const SidebarLayout = ({ children, setAdminTab, setTeacherTab, setStudentTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) setRole(user.role);
  }, []);

  const basePath = {
    admin: "/admin",
    teacher: "/teacher",
    student: "/student",
  };

  const menus = {
    admin: [
    //   { label: "Home", icon: FiHome, path: "/admin" },
      { label: "Pending Approvals", icon: FiUserCheck, tab: "pending" },
      { label: "Add Teachers", icon: FiUserPlus, tab: "add" },
      { label: "Manage Teachers", icon: FiUsers, tab: "manage" },
     
    ],
    teacher: [
    //   { label: "Home", icon: FiHome, path: "/teacher" },
      { label: "My Appointments", icon: FiUsers, tab: "appointments" },
      { label: "Schedule Appointment", icon: FiCalendar, tab: "schedule" },
     
    ],
    student: [
    //   { label: "Home", icon: FiHome, path: "/student" },
      { label: "My Appointments", icon: FiUsers, tab: "appointments" },
      { label: "Book Appointment", icon: FiCalendar, tab: "book" },
      
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleMenuClick = (item) => {
    if (item.tab) {
      const targetPath = basePath[role];
      if (location.pathname !== targetPath) {
        navigate(targetPath); // navigate first
        // wait a moment before setting the tab to avoid race conditions
        setTimeout(() => {
          if (role === "admin") setAdminTab?.(item.tab);
          else if (role === "teacher") setTeacherTab?.(item.tab);
          else if (role === "student") setStudentTab?.(item.tab);
        }, 100);
      } else {
        // already on tabbed page, just set tab
        if (role === "admin") setAdminTab?.(item.tab);
        else if (role === "teacher") setTeacherTab?.(item.tab);
        else if (role === "student") setStudentTab?.(item.tab);
      }
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <Box
        w="250px"
        h="100vh"
        bg="brand.sidebar"
        color="white"
        p={5}
        position="fixed"
        left="0"
        top="0"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        zIndex="1000"
      >
        <VStack align="stretch" spacing={5}>
          <Text fontSize="2xl" fontWeight="bold">
            STABS
          </Text>

          {menus[role]?.map((item) => (
            <ChakraLink
              key={item.label}
              onClick={() => handleMenuClick(item)}
              _hover={{ textDecoration: "none", bg: "whiteAlpha.200" }}
              px={3}
              py={2}
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap={3}
              cursor="pointer"
            >
              <Icon as={item.icon} />
              <Text>{item.label}</Text>
            </ChakraLink>
          ))}
        </VStack>

        <VStack align="stretch" spacing={3}>
          <ChakraLink
            onClick={handleLogout}
            _hover={{ textDecoration: "none", bg: "whiteAlpha.200" }}
            px={3}
            py={2}
            borderRadius="md"
            display="flex"
            alignItems="center"
            gap={3}
            cursor="pointer"
          >
            <Icon as={FiLogOut} />
            <Text>Log Out</Text>
          </ChakraLink>
        </VStack>
      </Box>

      <Box ml="250px" p={6} bg="#fdfcfb" minH="100vh">
        {children}
      </Box>
    </>
  );
};

export default SidebarLayout;