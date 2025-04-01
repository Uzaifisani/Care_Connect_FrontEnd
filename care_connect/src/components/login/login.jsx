import { Box, Button, Card, FormLabel, Heading, Input, Stack, Text,useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../apis";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const toast= useToast();

  const LoginMutation= useMutation({
    mutationFn:(FormData)=>loginApi(FormData),
    mutationKey:["Login"],
    onSuccess:(response,FormData)=>{
      toast({
        title: "Login Successful!",
        description: `Welcome, ${FormData.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem("accessToken",response.data.accessToken);
      //navigate("/dashboard");
    },
    onError:(error)=>{
      toast({
        title: "Login UnSuccessful!",
        description: `Invalid Credentials`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    LoginMutation.mutate(formData);

  };

  return (
    <Box
      bgImage="url('https://plus.unsplash.com/premium_photo-1682130157004-057c137d96d5?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Card p={8} borderRadius="lg" boxShadow="lg" bg="whiteAlpha.800" w={{ base: "90%", md: "400px" }}>
        <Heading size="lg" textAlign="center" mb={6} color="teal.600">
          Hospital Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Input
              name="email"
              placeholder="Email Address"
              type="email"
              variant="filled"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
            
            <Input
              name="password"
              placeholder="Password"
              type="password"
              variant="filled"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
            
            <Button type="submit" colorScheme="teal" size="lg" _hover={{ bg: "teal.500" }}>
              Login
            </Button>
            <Stack direction="row" justify="space-between" fontSize="sm">
            <Link to="/register">
             <FormLabel color="blue.500">Register</FormLabel>
             </Link>
            </Stack>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}