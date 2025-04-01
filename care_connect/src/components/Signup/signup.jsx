import { Box, Button, Card, FormLabel, Heading, Input, Select, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png"
export default function SignupPage() {
  const [userType, setUserType] = useState("");

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="100vh" bg="gray.100">
      <Card p={8} borderRadius="lg" boxShadow="lg" bg="white" w={{ base: "90%", md: "400px" }}>
        <Box textAlign="center" mb={4}>
          <img src={logo} alt="signup icon" />
          <Heading size="lg" mt={2}>Sign Up</Heading>
        </Box>
        <Stack spacing={4}>
          <Select placeholder="User Type" onChange={(e) => setUserType(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="staff">Staff</option>
            <option value="doctor">Doctor</option>
          </Select>
          <Stack direction="row">
            <Input placeholder="First Name *" variant="filled" />
            <Input placeholder="Last Name *" variant="filled" />
          </Stack>
          <Input placeholder="Email Address *" type="email" variant="filled" />
          <Input placeholder="Password *" type="password" variant="filled" />
          {userType === "doctor" && (
            <>
              <Input placeholder="Department *" variant="filled" />
              <Input placeholder="Speciality *" variant="filled" />
            </>
          )}
          <Button colorScheme="blue" size="lg" _hover={{ bg: "blue.500" }}>
            Sign Up
          </Button>
          <Text textAlign="center" fontSize="sm">
            Already have an account?
            <Link to="/">
             <FormLabel color="blue.500">Sign In</FormLabel>
             </Link>
          </Text>
        </Stack>
      </Card>
    </Box>
  );
}