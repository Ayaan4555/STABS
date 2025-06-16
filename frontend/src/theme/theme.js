import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#fdfcfb", // base background
        color: "#1a202c",
      },
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "md",
        fontWeight: "medium",
      },
    },
    Box: {
      baseStyle: {
        borderRadius: "xl",
        boxShadow: "sm",
      },
    },
  },
  colors: {
    brand: {
      sidebar: "#1c1f26",
      adminCard: "#fff6db",
      teacherCard: "#f1ecff",
      studentCard: "#eef8e7",
      alert: "#fdece5",
    },
  },
});

export default theme;