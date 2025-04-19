import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { RegisterNewUserFromStaff } from '../../apis/index.js';
import { useNavigate } from 'react-router-dom';

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
  });

  const toast = useToast();
  const navigate = useNavigate();

  const {
    mutate: registerPatient,
    isLoading,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (patientData) => RegisterNewUserFromStaff(patientData),
    onSuccess: (response) => {
      if (!response.data.error) {
        toast({
          title: "Patient Registered",
          description: "Patient registered successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/');
      } else {
        toast({
          title: "Registration Failed",
          description: response.data.msg || "Failed to register patient",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.msg || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerPatient(formData);
  };

  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.800')} py={10}>
      <Box
        maxW="400px"
        mx="auto"
        bg={cardBg}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
         <Button mb={4} onClick={() => navigate(-1)} colorScheme="teal" variant="outline">
        Back
      </Button>
        <Heading mb={6} textAlign="center" size="lg">
          Register New Patient
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="fname" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </FormControl>
            <FormControl id="lname" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </FormControl>
            <Button
              colorScheme="teal"
              type="submit"
              width="100%"
              isLoading={isLoading}
              loadingText="Registering..."
            >
              Register Patient
            </Button>
          </VStack>
        </form>
        {isSuccess && (
          <Box mt={4} color="green.500" textAlign="center">
            Patient registered successfully!
          </Box>
        )}
        {isError && (
          <Box mt={4} color="red.500" textAlign="center">
            There was an error registering the patient.
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RegisterPatient;